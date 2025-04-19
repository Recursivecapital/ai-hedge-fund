# AI Hedge Fund API

This is the FastAPI backend for the AI Hedge Fund application. It provides a RESTful API interface to the existing Python codebase without modifying it.

## Quick Start

```bash
# Navigate to the api directory
cd api

# Install the required dependencies
pip install -r requirements.txt

# Start the API server
uvicorn main:app --reload
```

Then visit http://localhost:8000/docs to view the API documentation.

## API Endpoints

### Agents

- `GET /api/v1/agents` - Get a list of all available agents
- `GET /api/v1/agents/{agent_id}` - Get details about a specific agent
- `POST /api/v1/agents/{agent_id}/analyze` - Run analysis with a specific agent

### Analysis

- `POST /api/v1/analysis` - Run analysis on multiple stocks using multiple agents
- `GET /api/v1/analysis/stocks/{ticker}` - Get analysis for a specific stock

### Portfolio

- `GET /api/v1/portfolio` - Get the current portfolio summary
- `GET /api/v1/portfolio/analytics` - Get portfolio performance analytics
- `GET /api/v1/portfolio/orders` - Get order history

### Backtest

- `POST /api/v1/backtest` - Run a backtest simulation
- `GET /api/v1/backtest/results/{backtest_id}` - Get backtest results

## Architecture

The API is built with FastAPI and follows these principles:

1. **Zero Modification**: We never modify the original Python code in the `/src` directory. Instead, we import it as a library and use it through a well-defined interface.

2. **Type Safety**: All API inputs and outputs are validated using Pydantic models.

3. **Clean API Design**: The API follows RESTful principles and uses standard HTTP methods.

4. **Performance**: The API includes features like parallel processing and caching to ensure good performance.

## Project Structure

```
api/
├── main.py            # API entry point
├── models/            # Pydantic models
│   ├── base.py        # Base models
│   ├── agents.py      # Agent-related models
│   ├── analysis.py    # Analysis-related models
│   ├── portfolio.py   # Portfolio-related models
│   └── backtest.py    # Backtest-related models
├── routers/           # API route handlers
│   ├── agents.py      # Agent routes
│   ├── analysis.py    # Analysis routes
│   ├── portfolio.py   # Portfolio routes
│   └── backtest.py    # Backtest routes
├── services/          # Business logic
│   ├── agent_service.py   # Agent-related logic
│   └── analysis_service.py # Analysis-related logic
└── utils/             # Utility functions
    └── common.py      # Common utility functions
```

## Development

### Adding New Endpoints

1. Define the Pydantic models in the appropriate `models/` file
2. Add the business logic in the appropriate `services/` file
3. Create the route handler in the appropriate `routers/` file
4. Include the router in `main.py`

### Testing

Run the tests using pytest:

```bash
pytest
```

## Deployment

The API can be deployed as a Docker container using the provided Dockerfile:

```bash
# Build the Docker image
docker build -t ai-hedge-fund-api .

# Run the container
docker run -p 8000:8000 ai-hedge-fund-api
``` 