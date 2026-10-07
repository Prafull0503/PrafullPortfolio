# Prafull AI — Backend

AI Recruiter Agent backend for Prafull Shukla's developer portfolio.

## Tech Stack

- **Python** + **FastAPI** — API server
- **LangGraph** — Agent orchestration
- **Cerebras** — LLM provider (Llama 4 Scout)
- **Strategy Pattern** — Query-specific context selection

## Architecture

```
User Query → Query Router → Strategy Selection → Context Assembly → Cerebras LLM → Streamed Response
```

### Strategies
| Intent | Strategy | Context Selected |
|--------|----------|-----------------|
| Profile | `ProfileQueryStrategy` | Personal info, education, achievements |
| Project | `ProjectQueryStrategy` | Matching projects, tech stacks, highlights |
| Skill | `SkillQueryStrategy` | Relevant skill categories, supporting projects |
| Recruiter | `RecruiterQueryStrategy` | Comprehensive: all skills + experience + projects + career |

## Setup

```bash
# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
copy .env.example .env
# Edit .env and add your CEREBRAS_API_KEY

# 4. Run the server
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/chat` | Chat with SSE streaming |
| `POST` | `/api/chat/sync` | Chat without streaming |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/docs` | Swagger UI |

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app
│   ├── api/
│   │   └── chat.py             # Chat endpoint + rate limiting
│   ├── agent/
│   │   ├── graph.py            # LangGraph StateGraph
│   │   ├── state.py            # State definition + session store
│   │   ├── router.py           # Query intent classifier
│   │   └── strategies/         # Strategy Pattern implementations
│   ├── llm/
│   │   └── cerebras_client.py  # Cerebras API client
│   ├── profile/
│   │   └── profile_data.json   # Centralized profile data
│   └── services/
│       └── profile_service.py  # Data access layer
├── requirements.txt
├── .env.example
└── README.md
```
