"""Profile data service — loads and provides access to profile_data.json."""

import json
from pathlib import Path
from typing import Any


_PROFILE_PATH = Path(__file__).parent.parent / "profile" / "profile_data.json"


def _load_profile() -> dict[str, Any]:
    """Load profile data from JSON file."""
    with open(_PROFILE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def get_all() -> dict[str, Any]:
    """Return the complete profile data."""
    return _load_profile()


def get_section(name: str) -> Any:
    """Return a specific top-level section from the profile."""
    return _load_profile().get(name, {})


def search_projects(keyword: str) -> list[dict]:
    """Find projects matching a keyword in title, description, or tags."""
    keyword_lower = keyword.lower()
    results = []
    for project in _load_profile().get("projects", []):
        searchable = " ".join([
            project.get("title", ""),
            project.get("description", ""),
            " ".join(project.get("tags", [])),
            " ".join(project.get("highlights", [])),
        ]).lower()
        if keyword_lower in searchable:
            results.append(project)
    return results


def get_skills_by_category(category: str) -> list[str]:
    """Return skills for a specific category."""
    skills = _load_profile().get("skills", {})
    return skills.get(category, [])


def get_all_skills_flat() -> list[str]:
    """Return all skills as a flat list."""
    skills = _load_profile().get("skills", {})
    flat = []
    for category_skills in skills.values():
        flat.extend(category_skills)
    return flat


def find_matching_skills(query: str) -> dict[str, list[str]]:
    """Find skill categories that match keywords in the query."""
    query_lower = query.lower()
    skills = _load_profile().get("skills", {})
    matches = {}
    for category, skill_list in skills.items():
        matched = [s for s in skill_list if s.lower() in query_lower]
        if matched:
            matches[category] = matched
    return matches
