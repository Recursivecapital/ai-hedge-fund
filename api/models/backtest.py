"""
Backtest-related Pydantic models.
"""

from typing import List, Dict, Any, Optional, Union, Literal
from pydantic import BaseModel, Field, constr
from datetime import datetime


class BacktestRequest(BaseModel):
    """Request model for running a backtest."""

    tickers: List[constr(min_length=1, max_length=10)] = Field(..., description="List of stock ticker symbols")
    agents: Optional[List[str]] = Field(None, description="List of agent IDs to use (defaults to all)")
    start_date: str = Field(..., description="Start date (YYYY-MM-DD)")
    end_date: str = Field(..., description="End date (YYYY-MM-DD)")
    initial_capital: float = Field(100000.0, description="Initial capital")
    include_trades: bool = Field(True, description="Include detailed trade history")


class BacktestTrade(BaseModel):
    """Model representing a trade in a backtest."""

    date: str
    ticker: str
    action: Literal["BUY", "SELL", "SHORT", "COVER"]
    quantity: float
    price: float
    value: float
    commission: float
    agent_id: Optional[str] = None
    confidence: Optional[float] = None
    reasoning: Optional[str] = None


class BacktestDailyPerformance(BaseModel):
    """Model representing daily performance in a backtest."""

    date: str
    portfolio_value: float
    cash: float
    positions_value: float
    daily_pnl: float
    daily_pnl_percent: float
    cumulative_pnl: float
    cumulative_pnl_percent: float
    benchmark_value: float
    benchmark_daily_pnl_percent: float
    benchmark_cumulative_pnl_percent: float


class BacktestResult(BaseModel):
    """Model representing backtest results."""

    start_date: str
    end_date: str
    initial_capital: float
    final_portfolio_value: float
    total_return: float
    total_return_percent: float
    annualized_return: float
    sharpe_ratio: float
    sortino_ratio: float
    max_drawdown: float
    max_drawdown_percent: float
    volatility: float
    benchmark_return_percent: float
    benchmark_sharpe_ratio: float
    trades: Optional[List[BacktestTrade]] = None
    daily_performance: List[BacktestDailyPerformance]
    agent_performance: Dict[str, Dict[str, Any]]
