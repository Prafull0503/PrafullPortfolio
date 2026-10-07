"""Strategy for project-specific queries."""

import json
from typing import Any


class ProjectQueryStrategy:
    """Handles queries about specific projects, their tech stacks, and architecture."""

    def get_context(self, query: str, profile: dict[str, Any]) -> str:
        projects = profile.get("projects", [])
        query_lower = query.lower()

        # Try to find specific project(s) matching the query
        matched = []
        for project in projects:
            searchable = " ".join([
                project.get("title", ""),
                project.get("description", ""),
                " ".join(project.get("tags", [])),
            ]).lower()

            # Check if project name or key terms appear in the query
            title_lower = project.get("title", "").lower()
            if title_lower in query_lower or any(
                word in query_lower
                for word in title_lower.split()
                if len(word) > 3
            ):
                matched.append(project)

        # If no specific match, return all projects
        if not matched:
            matched = projects

        sections = []
        for project in matched:
            highlights_text = "\n".join(
                f"  - {h}" for h in project.get("highlights", [])
            )
            tags_text = ", ".join(project.get("tags", []))

            sections.append(
                f"## Project: {project.get('title', 'Untitled')}\n"
                f"Description: {project.get('description', '')}\n"
                f"Technologies: {tags_text}\n"
                f"Key Highlights:\n{highlights_text}\n"
                f"GitHub: {project.get('github', 'N/A')}\n"
                f"Live: {project.get('live', 'N/A')}"
            )

        # Also include relevant experience if projects relate to work
        experience = profile.get("experience", [])
        for exp in experience:
            desc_text = "\n".join(f"  - {d}" for d in exp.get("description", []))
            sections.append(
                f"## Related Experience: {exp.get('title', '')}\n"
                f"Company: {exp.get('company', '')}\n"
                f"Period: {exp.get('period', '')}\n"
                f"Responsibilities:\n{desc_text}"
            )

        return "\n\n".join(sections)
