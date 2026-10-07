"""Strategy for recruiter/hiring-focused queries."""

import json
from typing import Any


class RecruiterQueryStrategy:
    """Handles recruiter-specific queries: role fit, summaries, career interests, recommendations."""

    def get_context(self, query: str, profile: dict[str, Any]) -> str:
        """Assembles a comprehensive view for recruiter assessment."""
        sections = []

        # Personal summary
        personal = profile.get("personal", {})
        sections.append(
            f"## Candidate Summary\n"
            f"Name: {personal.get('name', 'N/A')}\n"
            f"Title: {personal.get('title', 'N/A')}\n"
            f"Location: {personal.get('location', 'N/A')}\n"
            f"About: {personal.get('about', 'N/A')}"
        )

        # Education
        education = profile.get("education", {})
        if education:
            sections.append(
                f"## Education\n"
                f"Degree: {education.get('degree', '')} in {education.get('field', '')}\n"
                f"Status: {education.get('status', '')}"
            )

        # Qualities & Strengths
        qualities = profile.get("qualities_and_strengths", [])
        if qualities:
            q_text = "\n".join(f"- {q}" for q in qualities)
            sections.append(f"## Key Qualities & Strengths\n{q_text}")

        # Hobbies
        hobbies = profile.get("hobbies", [])
        if hobbies:
            h_text = "\n".join(f"- {h}" for h in hobbies)
            sections.append(f"## Hobbies & Interests\n{h_text}")

        # All skills (comprehensive for role matching)
        skills = profile.get("skills", {})
        if skills:
            skills_section = "## Technical Skills"
            for category, skill_list in skills.items():
                title = category.replace("_", " ").title()
                skills_section += f"\n{title}: {', '.join(skill_list)}"
            sections.append(skills_section)

        # Experience
        experience = profile.get("experience", [])
        if experience:
            sections.append("## Professional Experience")
            for exp in experience:
                desc = "\n".join(f"  - {d}" for d in exp.get("description", []))
                sections.append(
                    f"### {exp.get('title', '')}\n"
                    f"Company: {exp.get('company', '')} | Period: {exp.get('period', '')}\n"
                    f"Responsibilities:\n{desc}"
                )

        # Projects (brief overview)
        projects = profile.get("projects", [])
        if projects:
            sections.append("## Projects")
            for p in projects:
                tags = ", ".join(p.get("tags", []))
                sections.append(f"- **{p['title']}** ({tags}): {p.get('description', '')}")

        # Achievements
        achievements = profile.get("achievements", [])
        if achievements:
            ach_text = "\n".join(f"- {a}" for a in achievements)
            sections.append(f"## Achievements\n{ach_text}")

        # Career interests
        career = profile.get("career_interests", {})
        if career:
            roles = ", ".join(career.get("roles", []))
            sections.append(
                f"## Career Interests\n"
                f"Target Roles: {roles}\n"
                f"Preferences: {career.get('preferences', '')}\n"
                f"Looking For: {career.get('looking_for', '')}"
            )

        # Coding profiles
        coding = profile.get("coding_profiles", {})
        if coding:
            sections.append(f"## Coding Profiles\n{json.dumps(coding, indent=2)}")

        return "\n\n".join(sections)
