"""Base protocol for query strategies."""

from typing import Protocol, Any


class QueryStrategy(Protocol):
    """Interface for query-handling strategies.

    Each strategy knows how to extract relevant context
    from the profile data for a specific type of query.
    """

    def get_context(self, query: str, profile: dict[str, Any]) -> str:
        """Extract relevant profile context for the given query.

        Args:
            query: The user's question.
            profile: The complete profile data dictionary.

        Returns:
            A formatted string of relevant profile context.
        """
        ...
