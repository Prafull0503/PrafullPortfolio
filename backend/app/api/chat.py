"""Chat API endpoint — handles chat requests with streaming support."""

import time
import json
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from ..agent.graph import run_agent_stream
from ..agent.state import get_or_create_session, update_session


router = APIRouter()


# ---------------------------------------------------------------------------
# Rate limiting (simple in-memory token bucket)
# ---------------------------------------------------------------------------

_rate_store: dict[str, dict] = {}
_RATE_LIMIT = 20  # requests per minute
_RATE_WINDOW = 60  # seconds


def _check_rate_limit(client_ip: str) -> bool:
    """Return True if request is allowed, False if rate limited."""
    now = time.time()

    if client_ip not in _rate_store:
        _rate_store[client_ip] = {"tokens": _RATE_LIMIT - 1, "last_reset": now}
        return True

    bucket = _rate_store[client_ip]

    # Reset tokens if window has elapsed
    if now - bucket["last_reset"] >= _RATE_WINDOW:
        bucket["tokens"] = _RATE_LIMIT - 1
        bucket["last_reset"] = now
        return True

    if bucket["tokens"] > 0:
        bucket["tokens"] -= 1
        return True

    return False


# ---------------------------------------------------------------------------
# Request/Response models
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    session_id: str | None = None


class ChatResponse(BaseModel):
    response: str
    session_id: str


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/chat")
async def chat(request: ChatRequest, req: Request):
    """Chat endpoint with SSE streaming response."""
    # Rate limiting
    client_ip = req.client.host if req.client else "unknown"
    if not _check_rate_limit(client_ip):
        return StreamingResponse(
            _error_stream("I'm receiving too many requests right now. Please wait a moment and try again."),
            media_type="text/event-stream",
        )

    # Sanitize input
    message = request.message.strip()
    if not message:
        return StreamingResponse(
            _error_stream("Please provide a message."),
            media_type="text/event-stream",
        )

    # Get or create session
    session_id, history = get_or_create_session(request.session_id)

    # Stream response
    return StreamingResponse(
        _stream_response(message, session_id, history),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Session-Id": session_id,
        },
    )


async def _stream_response(message: str, session_id: str, history: list[dict]):
    """Generate SSE stream from the agent pipeline."""
    full_response = ""

    try:
        # Send session ID first
        yield f"data: {json.dumps({'type': 'session', 'session_id': session_id})}\n\n"

        # Stream LLM response
        for chunk in run_agent_stream(message, history):
            full_response += chunk
            yield f"data: {json.dumps({'type': 'chunk', 'content': chunk})}\n\n"

        # Signal completion
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

        # Update session with the complete exchange
        update_session(session_id, message, full_response)

    except Exception:
        error_msg = "I'm having trouble connecting right now. Please try again in a moment."
        yield f"data: {json.dumps({'type': 'error', 'content': error_msg})}\n\n"


async def _error_stream(message: str):
    """Generate an error SSE stream."""
    yield f"data: {json.dumps({'type': 'error', 'content': message})}\n\n"


# ---------------------------------------------------------------------------
# Non-streaming fallback
# ---------------------------------------------------------------------------

@router.post("/chat/sync")
async def chat_sync(request: ChatRequest, req: Request):
    """Non-streaming chat endpoint (fallback)."""
    client_ip = req.client.host if req.client else "unknown"
    if not _check_rate_limit(client_ip):
        return ChatResponse(
            response="I'm receiving too many requests right now. Please wait a moment.",
            session_id=request.session_id or "",
        )

    message = request.message.strip()
    if not message:
        return ChatResponse(response="Please provide a message.", session_id="")

    session_id, history = get_or_create_session(request.session_id)

    try:
        full_response = ""
        for chunk in run_agent_stream(message, history):
            full_response += chunk

        update_session(session_id, message, full_response)

        return ChatResponse(response=full_response, session_id=session_id)
    except Exception:
        return ChatResponse(
            response="I'm having trouble connecting right now. Please try again in a moment.",
            session_id=session_id,
        )
