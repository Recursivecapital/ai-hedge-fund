"""
Agent-related Pydantic models.
"""

from typing import List, Dict, Any, Optional, Union, Literal
from pydantic import BaseModel, Field, constr


class Agent(BaseModel):
    """Agent model representing an investment strategy agent."""

    id: str
    name: str
    description: str
    type: str = Field(..., description="Type of agent (e.g., value, growth, risk)")
    category: Optional[str] = Field(None, description="Category of agent (e.g., value_investing)")
    icon: Optional[str] = None
    active: bool = True


class AgentList(BaseModel):
    """List of available agents."""

    agents: List[Agent]


class AgentAnalysisRequest(BaseModel):
    """Request model for agent analysis."""

    ticker: constr(min_length=1, max_length=10) = Field(..., description="Stock ticker symbol")
    date: Optional[str] = Field(None, description="Analysis date (YYYY-MM-DD), defaults to most recent")
    include_reasoning: bool = Field(False, description="Whether to include detailed reasoning")


class AgentSignal(BaseModel):
    """Trading signal from an agent."""

    signal: Literal["BULLISH", "BEARISH", "NEUTRAL"]
    confidence: float = Field(..., ge=0.0, le=100.0, description="Confidence percentage")
    reasoning: Optional[str] = None
