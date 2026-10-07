"""LangGraph state definition and session management."""

from typing import TypedDict
import time
import uuid


class AgentState(TypedDict):
    """State that flows through the LangGraph pipeline."""
    query: str
    intent: str  # "profile" | "project" | "skill" | "recruiter" | "general"
    context: str
    response: str
    history: list[dict]  # conversation history


# ---------------------------------------------------------------------------
# Session store — simple in-memory store with TTL
# ---------------------------------------------------------------------------

_sessions: dict[str, dict] = {}
_SESSION_TTL = 3600  # 1 hour


def get_or_create_session(session_id: str | None = None) -> tuple[str, list[dict]]:
    """Get existing session history or create a new one. Returns (session_id, history)."""
    _cleanup_expired()

    if session_id and session_id in _sessions:
        session = _sessions[session_id]
        session["last_access"] = time.time()
        return session_id, session["history"]

    new_id = session_id or str(uuid.uuid4())
    _sessions[new_id] = {
        "history": [],
        "last_access": time.time(),
    }
    return new_id, []


def update_session(session_id: str, user_msg: str, ai_msg: str) -> None:
    """Append a user/AI message pair to session history."""
    if session_id not in _sessions:
        _sessions[session_id] = {"history": [], "last_access": time.time()}

    session = _sessions[session_id]
    session["history"].append({"role": "user", "content": user_msg})
    session["history"].append({"role": "assistant", "content": ai_msg})
    session["last_access"] = time.time()

    # Keep only last 20 messages to prevent unbounded growth
    if len(session["history"]) > 20:
        session["history"] = session["history"][-20:]


def _cleanup_expired() -> None:
    """Remove sessions that haven't been accessed within TTL."""
    now = time.time()
    expired = [
        sid for sid, data in _sessions.items()
        if now - data["last_access"] > _SESSION_TTL
    ]
    for sid in expired:
        del _sessions[sid]
