"""LLM client — supports Groq and Cerebras with auto-failover and streaming."""

import os
from dotenv import load_dotenv

load_dotenv()

GROQ_KEY = os.getenv("GROQ_API_KEY")
CEREBRAS_KEY = os.getenv("CEREBRAS_API_KEY")

GROQ_MODEL = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")
CEREBRAS_MODEL = os.getenv("CEREBRAS_MODEL", "gpt-oss-120b")

SYSTEM_PROMPT = """You ARE Prafull Shukla — speaking directly as Prafull (the AI representation of myself).
Always speak in the FIRST PERSON ("I", "my", "my projects", "my experience", "my skills").

GREETINGS:
- If the user says "Hello", "Hi", "Hey", "Namaste":
  Answer warmly: "Hello! I'm Prafull Shukla. Great to connect with you! Feel free to ask me anything about my projects, skills, or experience."

FIRST-PERSON VOICE & PERSONA:
- Speak as Prafull directly: "I am a Computer Science engineer...", "My key projects and skills focus on full stack development and backend architectures."
- Be polite, articulate, confident, humble, and recruiter-friendly.

GUIDELINES FOR DYNAMIC & TAILORED ANSWERS:

1. FOR SIMPLE / SPECIFIC QUESTIONS (Phone, Email, Location, Education, Hobbies):
   - Answer directly in 1-2 lines in the first person.
   - Example: "My phone number is +91-6306597320." or "My hobbies are playing cricket, reading books, and participating in debates."

2. FOR RECRUITER / ROLE-FIT / SKILLS OVERVIEW QUESTIONS:
   - When asked about role suitability or skills overview, present my Candidate Fit Card in the first person:

   **Candidate Fit:** Strong / High Match

   **My Skill Proficiency:**
   • **Java & Spring Boot**: `█████████░` 95%
   • **Agentic AI & LangChain/LangGraph**: `█████████░` 90%
   • **Backend Development (FastAPI/Spring)**: `█████████░` 85%
   • **LLM & Multi-Agent Systems**: `█████████░` 85%
   • **Problem-Solving (HackerRank 5★ / CodeChef)**: `█████████░` 90%
   • **React / React Native**: `███████░░░` 75%

   **My Relevant Projects:**
   ✓ **ResearchAgent** (LangChain, LangGraph, Multi-Agent reflection loop)
   ✓ **Single Agentic AI** (LangChain, Autonomous Agentic AI)
   ✓ **MyPet Marketplace** (Spring Boot, JWT, Razorpay)

   **Recommendation / Role Fit:**
   I am a strong fit for **Java Backend Engineer**, **AI/Agentic AI Engineer**, and **Full Stack Developer** roles. Open to Remote, Hybrid, and Onsite positions.

3. FOR MISSING SKILLS / RECRUITER OBJECTIONS (e.g. Azure, AWS, etc.):
   - Answer politely and diplomatically in the first person:
     "While I don't currently have active experience with Azure listed in my portfolio, I possess strong core backend fundamentals in Java, Spring Boot, FastAPI, and PostgreSQL. With my 5-Star rating on HackerRank and 500+ solved CodeChef problems, I have a proven track record of picking up new technologies rapidly, and I would be eager to adapt to Azure or any cloud stack required."

4. STRICT TRUTHFULNESS & GROUNDING:
   - Base every fact 100% on the provided profile context. Never invent fake companies or experience."""


def _get_groq_client():
    from groq import Groq
    key = os.getenv("GROQ_API_KEY")
    if not key or "gsk_" not in key:
        raise ValueError("Valid GROQ_API_KEY not set in backend/.env")
    return Groq(api_key=key)


def _get_cerebras_client():
    from cerebras.cloud.sdk import Cerebras
    key = os.getenv("CEREBRAS_API_KEY")
    if not key or key == "your_cerebras_api_key_here":
        raise ValueError("Valid CEREBRAS_API_KEY not set in backend/.env")
    return Cerebras(api_key=key)


def generate_response(context: str, query: str, history: list[dict]) -> str:
    """Generate a complete response from Groq or Cerebras with fallback."""
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    for msg in history[-6:]:
        messages.append({"role": msg["role"], "content": msg["content"]})

    user_message = f"""Profile Context:
{context}

User Query: {query}

Answer the user query as Prafull Shukla (in the first person "I/my") based on the context above."""

    messages.append({"role": "user", "content": user_message})

    # Try Groq first if key present
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key and groq_key.strip().startswith("gsk_"):
        try:
            client = _get_groq_client()
            response = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=messages,
                temperature=0.3,
                max_tokens=1024,
            )
            return response.choices[0].message.content
        except Exception:
            pass

    # Try Cerebras
    try:
        client = _get_cerebras_client()
        response = client.chat.completions.create(
            model=CEREBRAS_MODEL,
            messages=messages,
            temperature=0.3,
            max_tokens=1024,
        )
        return response.choices[0].message.content
    except Exception as e:
        err_str = str(e)
        if "402" in err_str or "payment_required" in err_str:
            return "Cerebras API Quota Exceeded (Error 402). Please add a GROQ_API_KEY to backend/.env for fast free tier access!"
        return f"LLM Error: {e}"


def generate_response_stream(context: str, query: str, history: list[dict]):
    """Stream response tokens from Groq or Cerebras LLM."""
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    for msg in history[-6:]:
        messages.append({"role": msg["role"], "content": msg["content"]})

    user_message = f"""Profile Context:
{context}

User Query: {query}

Answer the user query as Prafull Shukla (in the first person "I/my") based on the context above."""

    messages.append({"role": "user", "content": user_message})

    # 1. Check for Groq API Key
    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key and groq_key.strip().startswith("gsk_"):
        try:
            client = _get_groq_client()
            stream = client.chat.completions.create(
                model=GROQ_MODEL,
                messages=messages,
                temperature=0.3,
                max_tokens=1024,
                stream=True,
            )
            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
            return
        except Exception as e:
            yield f"⚠️ **Groq API Error**: {e}"
            return

    # 2. Try Cerebras
    cerebras_key = os.getenv("CEREBRAS_API_KEY")
    if cerebras_key and not cerebras_key.startswith("your_"):
        try:
            client = _get_cerebras_client()
            stream = client.chat.completions.create(
                model=CEREBRAS_MODEL,
                messages=messages,
                temperature=0.3,
                max_tokens=1024,
                stream=True,
            )
            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
            return
        except Exception as e:
            err_str = str(e)
            if "402" in err_str or "payment_required" in err_str:
                yield "⚠️ **Cerebras Quota Exceeded (Error 402)**: Please add `GROQ_API_KEY=gsk_...` to `backend/.env`!"
            else:
                yield f"⚠️ **Cerebras Error**: {e}"
            return

    yield "⚠️ **No API Key Configured**: Please add `GROQ_API_KEY=gsk_...` or `CEREBRAS_API_KEY=csk_...` to `backend/.env`!"
