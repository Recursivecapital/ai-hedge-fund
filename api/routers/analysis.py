"""
Analysis router for the AI Hedge Fund API.
"""

from fastapi import APIRouter, HTTPException, Query, Path, Body
from typing import List, Optional, Dict, Any

from api.models.analysis import AnalysisRequest, AnalysisResponse
from api.models.base import SuccessResponse
from api.services.analysis_service import AnalysisService

router = APIRouter()


@router.post("", response_model=AnalysisResponse, summary="Run stock analysis")
async def run_analysis(request: AnalysisRequest = Body(...)):
    """
    Run analysis on multiple stocks using multiple agents.

    - **tickers**: List of stock ticker symbols to analyze
    - **agents**: Optional list of agent IDs to use (defaults to all)
    - **date**: Optional analysis date (defaults to most recent)
    - **include_reasoning**: Whether to include detailed reasoning
    """
    if not request.tickers:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_REQUEST",
                "message": "At least one ticker must be specified",
            },
        )

    # Check if all tickers are valid
    # In a real implementation, we would validate the tickers here

    # Run analysis
    result = AnalysisService.run_analysis(
        request.tickers,
        request.agents,
        request.date,
        request.include_reasoning,
    )

    if not result["analyses"]:
        raise HTTPException(
            status_code=500,
            detail={
                "code": "ANALYSIS_FAILED",
                "message": "Failed to run analysis on any of the specified tickers",
            },
        )

    return result


@router.get("/stocks/{ticker}", response_model=SuccessResponse, summary="Get analysis for a specific stock")
async def get_stock_analysis(
    ticker: str = Path(..., description="Stock ticker symbol"),
    agents: Optional[List[str]] = Query(None, description="List of agent IDs to use"),
    date: Optional[str] = Query(None, description="Analysis date (YYYY-MM-DD)"),
    include_reasoning: bool = Query(False, description="Include detailed reasoning"),
):
    """
    Get analysis for a specific stock.

    - **ticker**: Stock ticker symbol
    - **agents**: Optional list of agent IDs to use (defaults to all)
    - **date**: Optional analysis date (defaults to most recent)
    - **include_reasoning**: Whether to include detailed reasoning
    """
    # Run analysis
    result = AnalysisService.run_analysis(
        [ticker],
        agents,
        date,
        include_reasoning,
    )

    if not result["analyses"]:
        raise HTTPException(
            status_code=500,
            detail={
                "code": "ANALYSIS_FAILED",
                "message": f"Failed to run analysis for ticker '{ticker}'",
            },
        )

    # Return the first (and only) analysis result
    return {"status": "success", "data": result["analyses"][0]}
