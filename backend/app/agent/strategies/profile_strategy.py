"""Strategy for profile/personal information queries."""

import json
from typing import Any


class ProfileQueryStrategy:
    """Handles queries about personal info, education, background, contact, achievements, qualities, and hobbies."""

    def get_context(self, query: str, profile: dict[str, Any]) -> str:
        sections = []

        # Personal information
        personal = profile.get("personal", {})
        if personal:
            sections.append(f"## Personal Information\n{json.dumps(personal, indent=2)}")

        # Education
        education = profile.get("education", {})
        if education:
            sections.append(f"## Education\n{json.dumps(education, indent=2)}")

        # Qualities & Strengths
        qualities = profile.get("qualities_and_strengths", [])
        if qualities:
            q_text = "\n".join(f"- {q}" for q in qualities)
            sections.append(f"## Personal Qualities & Key Strengths\n{q_text}")

        # Hobbies & Interests
        hobbies = profile.get("hobbies", [])
        if hobbies:
            h_text = "\n".join(f"- {h}" for h in hobbies)
            sections.append(f"## Hobbies & Personal Interests\n{h_text}")

        # Summary of Skills & Projects for completeness
        skills = profile.get("skills", {})
        if skills:
            skills_text = ", ".join([f"{k}: {', '.join(v)}" for k, v in skills.items()])
            sections.append(f"## Key Skills Overview\n{skills_text}")

        projects = profile.get("projects", [])
        if projects:
            proj_text = ", ".join([f"{p['title']} ({', '.join(p.get('tags', []))})" for p in projects])
            sections.append(f"## Projects Overview\n{proj_text}")

        # Achievements
        achievements = profile.get("achievements", [])
        if achievements:
            achievements_text = "\n".join(f"- {a}" for a in achievements)
            sections.append(f"## Achievements\n{achievements_text}")

        # Coding profiles
        coding = profile.get("coding_profiles", {})
        if coding:
            sections.append(f"## Coding Profiles\n{json.dumps(coding, indent=2)}")

        # Extracurricular
        extra = profile.get("extracurricular", [])
        if extra:
            extra_text = "\n".join(f"- {e}" for e in extra)
            sections.append(f"## Extracurricular Activities\n{extra_text}")

        # Publications & Technical Writing
        pubs = profile.get("publications", [])
        if pubs:
            pub_lines = [
                f"- **{p.get('title', '')}** ({p.get('platform', '')}, {p.get('date', '')}): {p.get('description', '')}"
                for p in pubs
            ]
            sections.append(f"## Publications & Technical Articles\n" + "\n".join(pub_lines))

        return "\n\n".join(sections)

