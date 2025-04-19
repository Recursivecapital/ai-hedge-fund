"""
Portfolio-related Pydantic models.
"""

from typing import List, Dict, Any, Optional, Union, Literal
from pydantic import BaseModel, Field, constr
from datetime import datetime


class Position(BaseModel):
    """Model representing a portfolio position."""

    ticker: str
    quantity: float
    entry_price: float
    current_price: float
    market_value: float
    unrealized_pnl: float
    unrealized_pnl_percent: float
    weight: float  # Percentage of portfolio


class Portfolio(BaseModel):
    """Model representing the entire portfolio."""

    positions: List[Position]
    cash: float
    total_value: float
    daily_pnl: float
    daily_pnl_percent: float
    total_pnl: float
    total_pnl_percent: float
    last_updated: datetime


class Order(BaseModel):
    """Model representing a trade order."""

    id: str
    ticker: str
    action: Literal["BUY", "SELL", "SHORT", "COVER"]
    quantity: float
    price: Optional[float] = None  # None for market orders
    status: Literal["PENDING", "FILLED", "CANCELLED", "REJECTED"]
    created_at: datetime
    filled_at: Optional[datetime] = None
    filled_price: Optional[float] = None
    reason: Optional[str] = None


class OrderHistory(BaseModel):
    """Model representing order history."""

    orders: List[Order]


class PortfolioAnalytics(BaseModel):
    """Model for portfolio analytics."""

    sharpe_ratio: float
    sortino_ratio: float
    max_drawdown: float
    volatility: float
    beta: float
    alpha: float
    r_squared: float
    win_rate: float
    profit_factor: float
    average_win: float
    average_loss: float
