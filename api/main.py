"""
AI Hedge Fund API

This is the main API entry point for the AI Hedge Fund application.
It provides a FastAPI interface to the existing Python hedge fund backend.
"""

import sys
import os
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi

# Add the project root to the Python path to import from src without modifying it
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import API routers
from api.routers import agents, analysis, portfolio, backtest

# Create FastAPI app
app = FastAPI(
    title="AI Hedge Fund API",
    description="API for the AI Hedge Fund application",
    version="0.1.0",
    docs_url=None,  # We'll customize the docs
    redoc_url=None,  # We'll customize the docs
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js development server
        "https://recursivecapital.github.io",  # Production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handler for custom exceptions
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "code": exc.detail.get("code", "ERROR"),
            "message": exc.detail.get("message", str(exc.detail)),
            "details": exc.detail.get("details", []),
        },
    )


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred.",
            "details": str(exc) if app.debug else None,
        },
    )


# Include routers
app.include_router(agents.router, prefix="/api/v1/agents", tags=["Agents"])
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["Analysis"])
app.include_router(portfolio.router, prefix="/api/v1/portfolio", tags=["Portfolio"])
app.include_router(backtest.router, prefix="/api/v1/backtest", tags=["Backtest"])


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    return {
        "name": "AI Hedge Fund API",
        "version": "0.1.0",
        "description": "API for the AI Hedge Fund application",
        "documentation": "/docs",
    }


# Custom docs
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="AI Hedge Fund API",
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css",
    )


@app.get("/openapi.json", include_in_schema=False)
async def get_open_api_endpoint():
    return get_openapi(
        title="AI Hedge Fund API",
        version="0.1.0",
        description="API for the AI Hedge Fund application",
        routes=app.routes,
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
