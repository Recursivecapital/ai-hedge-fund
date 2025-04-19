"""
Agent service that interfaces with the existing Python codebase.
"""

import sys
import os
import importlib
from typing import List, Dict, Any, Optional

# Import agents from src without modifying the source
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
# We're using dynamic imports to avoid modifying the source code

# Map of agent IDs to their module and class names
AGENT_MAPPING = {
    "ben_graham": {"module": "src.agents.ben_graham", "class": "BenGrahamAgent"},
    "bill_ackman": {"module": "src.agents.bill_ackman", "class": "BillAckmanAgent"},
    "cathie_wood": {"module": "src.agents.cathie_wood", "class": "CathieWoodAgent"},
    "charlie_munger": {"module": "src.agents.charlie_munger", "class": "CharlieMungerAgent"},
    "michael_burry": {"module": "src.agents.michael_burry", "class": "MichaelBurryAgent"},
    "peter_lynch": {"module": "src.agents.peter_lynch", "class": "PeterLynchAgent"},
    "phil_fisher": {"module": "src.agents.phil_fisher", "class": "PhilFisherAgent"},
    "stanley_druckenmiller": {"module": "src.agents.stanley_druckenmiller", "class": "StanleyDruckenmillerAgent"},
    "warren_buffett": {"module": "src.agents.warren_buffett", "class": "WarrenBuffettAgent"},
    "valuation": {"module": "src.agents.valuation", "class": "ValuationAgent"},
    "sentiment": {"module": "src.agents.sentiment", "class": "SentimentAgent"},
    "fundamentals": {"module": "src.agents.fundamentals", "class": "FundamentalsAgent"},
    "technicals": {"module": "src.agents.technicals", "class": "TechnicalsAgent"},
    "risk_manager": {"module": "src.agents.risk_manager", "class": "RiskManager"},
    "portfolio_manager": {"module": "src.agents.portfolio_manager", "class": "PortfolioManager"},
}

# Agent metadata for API responses
AGENT_METADATA = {
    "ben_graham": {
        "name": "Ben Graham",
        "description": "The godfather of value investing, only buys hidden gems with a margin of safety",
        "type": "value",
        "category": "value_investing",
        "icon": "💰",
    },
    "bill_ackman": {
        "name": "Bill Ackman",
        "description": "An activist investor, takes bold positions and pushes for change",
        "type": "activist",
        "category": "activist_investing",
        "icon": "📢",
    },
    "cathie_wood": {
        "name": "Cathie Wood",
        "description": "The queen of growth investing, believes in the power of innovation and disruption",
        "type": "growth",
        "category": "growth_investing",
        "icon": "🚀",
    },
    "charlie_munger": {
        "name": "Charlie Munger",
        "description": "Warren Buffett's partner, only buys wonderful businesses at fair prices",
        "type": "value",
        "category": "value_investing",
        "icon": "🔍",
    },
    "michael_burry": {
        "name": "Michael Burry",
        "description": "The Big Short contrarian who hunts for deep value",
        "type": "contrarian",
        "category": "contrarian_investing",
        "icon": "🔄",
    },
    "peter_lynch": {
        "name": "Peter Lynch",
        "description": 'Practical investor who seeks "ten-baggers" in everyday businesses',
        "type": "growth",
        "category": "growth_investing",
        "icon": "🏆",
    },
    "phil_fisher": {
        "name": "Phil Fisher",
        "description": 'Meticulous growth investor who uses deep "scuttlebutt" research',
        "type": "growth",
        "category": "growth_investing",
        "icon": "📊",
    },
    "stanley_druckenmiller": {
        "name": "Stanley Druckenmiller",
        "description": "Macro legend who hunts for asymmetric opportunities with growth potential",
        "type": "macro",
        "category": "macro_investing",
        "icon": "🌎",
    },
    "warren_buffett": {
        "name": "Warren Buffett",
        "description": "The oracle of Omaha, seeks wonderful companies at a fair price",
        "type": "value",
        "category": "value_investing",
        "icon": "🧠",
    },
    "valuation": {
        "name": "Valuation Agent",
        "description": "Calculates the intrinsic value of a stock and generates trading signals",
        "type": "quantitative",
        "category": "quantitative_analysis",
        "icon": "💹",
    },
    "sentiment": {
        "name": "Sentiment Agent",
        "description": "Analyzes market sentiment and generates trading signals",
        "type": "quantitative",
        "category": "sentiment_analysis",
        "icon": "😀",
    },
    "fundamentals": {
        "name": "Fundamentals Agent",
        "description": "Analyzes fundamental data and generates trading signals",
        "type": "quantitative",
        "category": "fundamental_analysis",
        "icon": "📝",
    },
    "technicals": {
        "name": "Technicals Agent",
        "description": "Analyzes technical indicators and generates trading signals",
        "type": "quantitative",
        "category": "technical_analysis",
        "icon": "📈",
    },
    "risk_manager": {
        "name": "Risk Manager",
        "description": "Calculates risk metrics and sets position limits",
        "type": "risk",
        "category": "risk_management",
        "icon": "⚠️",
    },
    "portfolio_manager": {
        "name": "Portfolio Manager",
        "description": "Makes final trading decisions and generates orders",
        "type": "portfolio",
        "category": "portfolio_management",
        "icon": "📂",
    },
}


class AgentService:
    """Service for interacting with the agents."""

    @staticmethod
    def get_all_agents():
        """Get metadata for all available agents."""
        agents = []
        for agent_id, metadata in AGENT_METADATA.items():
            agents.append(
                {
                    "id": agent_id,
                    **metadata,
                    "active": True,  # Assume all agents are active
                }
            )
        return {"agents": agents}

    @staticmethod
    def get_agent(agent_id: str):
        """Get metadata for a specific agent."""
        if agent_id not in AGENT_METADATA:
            return None

        return {
            "id": agent_id,
            **AGENT_METADATA[agent_id],
            "active": True,  # Assume all agents are active
        }

    @staticmethod
    def instantiate_agent(agent_id: str):
        """Dynamically instantiate an agent from the src code without modifying it."""
        if agent_id not in AGENT_MAPPING:
            return None

        agent_info = AGENT_MAPPING[agent_id]
        try:
            module = importlib.import_module(agent_info["module"])
            agent_class = getattr(module, agent_info["class"])
            return agent_class()
        except (ImportError, AttributeError) as e:
            print(f"Error instantiating agent {agent_id}: {e}")
            return None

    @staticmethod
    def run_agent_analysis(agent_id: str, ticker: str, date: Optional[str] = None):
        """Run analysis using a specific agent."""
        agent = AgentService.instantiate_agent(agent_id)
        if not agent:
            return None

        # The actual implementation will depend on the agent interface
        # This is a placeholder that will need to be adapted to the actual code
        try:
            result = agent.analyze(ticker, date=date)

            # Convert the agent-specific result to our API format
            signal = "NEUTRAL"
            if hasattr(result, "signal"):
                signal = result.signal
            elif isinstance(result, dict) and "signal" in result:
                signal = result["signal"]

            confidence = 50.0
            if hasattr(result, "confidence"):
                confidence = result.confidence
            elif isinstance(result, dict) and "confidence" in result:
                confidence = result["confidence"]

            reasoning = None
            if hasattr(result, "reasoning"):
                reasoning = result.reasoning
            elif isinstance(result, dict) and "reasoning" in result:
                reasoning = result["reasoning"]

            return {
                "agent_id": agent_id,
                "agent_name": AGENT_METADATA[agent_id]["name"],
                "signal": signal,
                "confidence": confidence,
                "reasoning": reasoning,
            }
        except Exception as e:
            print(f"Error running analysis with agent {agent_id}: {e}")
            return None
