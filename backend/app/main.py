"""FastAPI application entry point."""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .api.chat import router as chat_router

load_dotenv()

app = FastAPI(
    title="Prafull AI — Portfolio Agent",
    description="AI Recruiter Agent for Prafull Shukla's developer portfolio",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url=None,
)

# CORS configuration
_allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

# Add production origin if configured
prod_origin = os.getenv("FRONTEND_ORIGIN")
if prod_origin:
    _allowed_origins.append(prod_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(chat_router, prefix="/api")


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "prafull-ai"}
