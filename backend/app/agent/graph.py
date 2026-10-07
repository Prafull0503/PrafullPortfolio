"""LangGraph StateGraph — the core agent orchestration pipeline."""

from langgraph.graph import StateGraph, START, END

from .state import AgentState
from .router import classify_intent, get_strategy
from ..services import profile_service
from ..llm import cerebras_client


# ---------------------------------------------------------------------------
# Graph Nodes
# ---------------------------------------------------------------------------

def route_query(state: AgentState) -> AgentState:
    """Node 1: Classify the user's query intent."""
    intent = classify_intent(state["query"])
    return {**state, "intent": intent}


def gather_context(state: AgentState) -> AgentState:
    """Node 2: Use the selected strategy to gather relevant profile context."""
    strategy = get_strategy(state["intent"])
    profile = profile_service.get_all()
    context = strategy.get_context(state["query"], profile)
    return {**state, "context": context}


def generate_response(state: AgentState) -> AgentState:
    """Node 3: Generate a response using Cerebras LLM."""
    response = cerebras_client.generate_response(
        context=state["context"],
        query=state["query"],
        history=state.get("history", []),
    )
    return {**state, "response": response}


# ---------------------------------------------------------------------------
# Graph Construction
# ---------------------------------------------------------------------------

def build_graph() -> StateGraph:
    """Build and compile the LangGraph agent pipeline.

    Pipeline: START → route_query → gather_context → generate_response → END
    """
    graph = StateGraph(AgentState)

    graph.add_node("route_query", route_query)
    graph.add_node("gather_context", gather_context)
    graph.add_node("generate_response", generate_response)

    graph.add_edge(START, "route_query")
    graph.add_edge("route_query", "gather_context")
    graph.add_edge("gather_context", "generate_response")
    graph.add_edge("generate_response", END)

    return graph.compile()


# Compiled graph singleton
agent_graph = build_graph()


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def run_agent(query: str, history: list[dict] | None = None) -> str:
    """Run the full agent pipeline and return the response."""
    initial_state: AgentState = {
        "query": query,
        "intent": "",
        "context": "",
        "response": "",
        "history": history or [],
    }
    result = agent_graph.invoke(initial_state)
    return result["response"]


def run_agent_stream(query: str, history: list[dict] | None = None):
    """Run the agent pipeline with streaming LLM output. Yields text chunks."""
    # Run routing and context gathering synchronously
    intent = classify_intent(query)
    strategy = get_strategy(intent)
    profile = profile_service.get_all()
    context = strategy.get_context(query, profile)

    # Stream the LLM response
    yield from cerebras_client.generate_response_stream(
        context=context,
        query=query,
        history=history or [],
    )
