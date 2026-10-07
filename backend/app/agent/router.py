"""Query router — classifies user intent to select the appropriate strategy."""

from .strategies import (
    ProfileQueryStrategy,
    ProjectQueryStrategy,
    SkillQueryStrategy,
    RecruiterQueryStrategy,
)
from .strategies.base import QueryStrategy


# Intent keywords for rule-based classification
_INTENT_KEYWORDS: dict[str, list[str]] = {
    "project": [
        "project", "built", "build", "created", "developed", "demo", "app",
        "application", "aureza", "ecommerce", "e-commerce", "store",
        "intellirag", "rag", "research agent", "researchagent", "mypet",
        "marketplace", "portfolio project", "github repo", "repository",
        "architecture", "stripe", "payment",
    ],
    "skill": [
        "skill", "technology", "technologies", "tech stack", "know", "proficient",
        "experience with", "familiar with", "worked with", "framework", "language",
        "java", "java 21", "python", "spring", "spring boot", "springboot",
        "langchain", "langgraph", "react", "go ", "golang", "c programming",
        "database", "sql", "postgres", "postgresql", "chroma", "chromadb",
        "fastapi", "dsa", "data structure", "algorithm", "system design",
        "docker", "tailwind", "jwt",
    ],
    "recruiter": [
        "suitable", "fit", "hire", "hiring", "candidate", "role", "position",
        "recruiter", "summary", "recommend", "should i", "why should",
        "backend role", "frontend role", "ai role", "engineer role",
        "developer role", "looking for", "career", "job", "internship",
        "30-second", "quick summary", "overview", "assessment",
    ],
    "profile": [
        "who is", "who's", "tell me about him", "about prafull", "background",
        "education", "degree", "college", "university", "contact", "email",
        "phone", "location", "achievement", "hackerrank", "codechef", "700",
        "linkedin", "github profile", "social", "hobby", "hobbies", "cricket",
        "books", "reading", "debate", "debates", "quality", "qualities",
        "strength", "strengths", "leadership", "explainer", "communicator",
        "publication", "article", "blog", "medium", "written",
    ],
}

# Strategy instances (stateless, so we can reuse them)
_STRATEGIES: dict[str, QueryStrategy] = {
    "profile": ProfileQueryStrategy(),
    "project": ProjectQueryStrategy(),
    "skill": SkillQueryStrategy(),
    "recruiter": RecruiterQueryStrategy(),
}


def classify_intent(query: str) -> str:
    """Classify the user's query into an intent category.

    Uses keyword matching with scoring. Returns the best-matching intent,
    or 'recruiter' as default (most comprehensive context).
    """
    query_lower = query.lower()
    scores: dict[str, int] = {intent: 0 for intent in _INTENT_KEYWORDS}

    for intent, keywords in _INTENT_KEYWORDS.items():
        for keyword in keywords:
            if keyword in query_lower:
                # Longer keyword matches score higher (more specific)
                scores[intent] += len(keyword.split())

    best_intent = max(scores, key=scores.get)

    # If no keywords matched at all, default to recruiter (broadest context)
    if scores[best_intent] == 0:
        return "recruiter"

    return best_intent


def get_strategy(intent: str) -> QueryStrategy:
    """Return the strategy instance for a given intent."""
    return _STRATEGIES.get(intent, _STRATEGIES["recruiter"])
