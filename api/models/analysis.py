"""
Analysis-related Pydantic models.
"""

from typing import List, Dict, Any, Optional, Union, Literal
from pydantic import BaseModel, Field, constr


class AnalysisRequest(BaseModel):
    """Request model for running analysis on stocks."""

    tickers: List[constr(min_length=1, max_length=10)] = Field(..., description="List of stock ticker symbols")
    agents: Optional[List[str]] = Field(None, description="List of agent IDs to use (defaults to all)")
    date: Optional[str] = Field(None, description="Analysis date (YYYY-MM-DD), defaults to most recent")
    include_reasoning: bool = Field(False, description="Whether to include detailed reasoning")


class AgentAnalysisResult(BaseModel):
    """Analysis result from a single agent."""

    agent_id: str
    agent_name: str
    signal: Literal["BULLISH", "BEARISH", "NEUTRAL"]
    confidence: float = Field(..., ge=0.0, le=100.0)
    reasoning: Optional[str] = None


class StockAnalysisResult(BaseModel):
    """Analysis results for a single stock."""

    ticker: str
    date: str
    agent_analyses: List[AgentAnalysisResult]
    portfolio_decision: Optional[Dict[str, Any]] = None


class AnalysisResponse(BaseModel):
    """Response model for stock analysis."""

    analyses: List[StockAnalysisResult]
