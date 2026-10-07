"""Strategy for skill/technology queries."""

import json
from typing import Any


class SkillQueryStrategy:
    """Handles queries about technical skills, frameworks, tools, and tech assessments."""

    # Keywords mapped to skill categories for targeted retrieval
    _CATEGORY_KEYWORDS: dict[str, list[str]] = {
        "programming": ["java", "python", "c ", "go ", "golang", "dsa", "data structure", "algorithm", "system design", "programming"],
        "frameworks": ["spring", "springboot", "spring boot", "langchain", "langgraph", "framework"],
        "ai_and_data": ["ai", "ml", "machine learning", "agentic", "generative", "llm", "vector", "rag", "embedding", "artificial intelligence"],
        "tools_and_databases": ["postgres", "sql", "database", "git", "github", "tool", "devops", "testing", "pytest"],
        "backend": ["backend", "rest", "api", "jwt", "security", "authentication", "fastapi", "hibernate", "jpa"],
        "frontend": ["react", "frontend", "front-end", "ui", "expo"],
    }

    def get_context(self, query: str, profile: dict[str, Any]) -> str:
        query_lower = query.lower()
        skills = profile.get("skills", {})

        # Find which categories are relevant to the query
        relevant_categories = set()
        for category, keywords in self._CATEGORY_KEYWORDS.items():
            if any(kw in query_lower for kw in keywords):
                relevant_categories.add(category)

        # If no specific match, return all skills
        if not relevant_categories:
            relevant_categories = set(skills.keys())

        sections = []
        for category in relevant_categories:
            if category in skills:
                skill_list = ", ".join(skills[category])
                title = category.replace("_", " ").title()
                sections.append(f"## {title}\n{skill_list}")

        # Include relevant projects that demonstrate these skills
        projects = profile.get("projects", [])
        relevant_projects = []
        for project in projects:
            project_tags = " ".join(project.get("tags", [])).lower()
            if any(kw in project_tags for cat in relevant_categories for kw in self._CATEGORY_KEYWORDS.get(cat, [])):
                relevant_projects.append(project)

        if relevant_projects:
            sections.append("## Projects Demonstrating These Skills")
            for p in relevant_projects:
                tags = ", ".join(p.get("tags", []))
                sections.append(f"- **{p['title']}**: {tags}")

        # Include coding profiles for skill credibility
        coding = profile.get("coding_profiles", {})
        if coding:
            sections.append(f"## Coding Profiles\n{json.dumps(coding, indent=2)}")

        return "\n\n".join(sections)
