"""
Base Pydantic models for the AI Hedge Fund API.
"""

from typing import List, Dict, Any, Optional, Union, Literal
from pydantic import BaseModel, Field


class ErrorDetail(BaseModel):
    """Error detail model."""

    field: Optional[str] = None
    error: str


class ErrorResponse(BaseModel):
    """Standardized error response model."""

    status: Literal["error"] = "error"
    code: str
    message: str
    details: Optional[List[ErrorDetail]] = None


class SuccessResponse(BaseModel):
    """Standardized success response model."""

    status: Literal["success"] = "success"
    data: Any


class PaginatedResponse(BaseModel):
    """Paginated response model."""

    status: Literal["success"] = "success"
    data: List[Any]
    page: int
    page_size: int
    total_items: int
    total_pages: int
