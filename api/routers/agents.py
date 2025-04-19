"""
Agents router for the AI Hedge Fund API.
"""

from fastapi import APIRouter, HTTPException, Query, Path, Depends
from typing import List, Optional

from api.models.agents import Agent, AgentList, AgentAnalysisRequest, AgentSignal
from api.models.base import SuccessResponse
from api.services.agent_service import AgentService

router = APIRouter()


@router.get("", response_model=AgentList, summary="Get all agents")
async def get_all_agents(
    type: Optional[str] = Query(None, description="Filter by agent type"),
    category: Optional[str] = Query(None, description="Filter by agent category"),
):
    """
    Get a list of all available investment agents.

    - **type**: Optional filter by agent type (e.g., value, growth)
    - **category**: Optional filter by agent category (e.g., value_investing)
    """
    agents_data = AgentService.get_all_agents()

    # Apply filters if specified
    if type or category:
        filtered_agents = []
        for agent in agents_data["agents"]:
            if type and agent["type"] != type:
                continue
            if category and agent["category"] != category:
                continue
            filtered_agents.append(agent)
        agents_data["agents"] = filtered_agents

    return agents_data


@router.get("/{agent_id}", response_model=Agent, summary="Get agent by ID")
async def get_agent(
    agent_id: str = Path(..., description="The ID of the agent to retrieve"),
):
    """
    Get detailed information about a specific agent by ID.

    - **agent_id**: The unique identifier of the agent
    """
    agent = AgentService.get_agent(agent_id)
    if not agent:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "AGENT_NOT_FOUND",
                "message": f"Agent with ID '{agent_id}' not found",
            },
        )
    return agent


@router.post("/{agent_id}/analyze", response_model=SuccessResponse, summary="Run analysis with a specific agent")
async def run_agent_analysis(
    agent_id: str = Path(..., description="The ID of the agent to use"),
    request: AgentAnalysisRequest = ...,
):
    """
    Run analysis on a stock using a specific agent.

    - **agent_id**: The unique identifier of the agent to use
    - **ticker**: The stock ticker symbol to analyze
    - **date**: Optional analysis date (defaults to most recent)
    - **include_reasoning**: Whether to include detailed reasoning
    """
    # Check if agent exists
    agent = AgentService.get_agent(agent_id)
    if not agent:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "AGENT_NOT_FOUND",
                "message": f"Agent with ID '{agent_id}' not found",
            },
        )

    # Run analysis
    result = AgentService.run_agent_analysis(agent_id, request.ticker, request.date)

    if not result:
        raise HTTPException(
            status_code=500,
            detail={
                "code": "ANALYSIS_FAILED",
                "message": f"Failed to run analysis with agent '{agent_id}'",
            },
        )

    # Remove reasoning if not requested
    if not request.include_reasoning:
        result["reasoning"] = None

    return {"status": "success", "data": result}
