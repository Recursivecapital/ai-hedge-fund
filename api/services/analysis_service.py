"""
Analysis service that coordinates running analysis with multiple agents.
"""

import sys
import os
from typing import List, Dict, Any, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
import datetime

# Import services
from api.services.agent_service import AgentService


class AnalysisService:
    """Service for running stock analysis."""

    @staticmethod
    def run_analysis(tickers: List[str], agents: Optional[List[str]] = None, date: Optional[str] = None, include_reasoning: bool = False):
        """
        Run analysis on multiple stocks using multiple agents.

        Args:
            tickers: List of stock tickers to analyze
            agents: List of agent IDs to use (defaults to all)
            date: Analysis date (defaults to most recent)
            include_reasoning: Whether to include detailed reasoning

        Returns:
            List of analysis results
        """
        # If no agents specified, use all agents except risk and portfolio managers
        if not agents:
            agents = [agent_id for agent_id in AgentService.get_all_agents()["agents"] if agent_id not in ["risk_manager", "portfolio_manager"]]

        # If no date specified, use today's date
        if not date:
            date = datetime.datetime.now().strftime("%Y-%m-%d")

        results = []
        for ticker in tickers:
            # Run analysis for each ticker
            agent_analyses = AnalysisService._run_ticker_analysis(ticker, agents, date, include_reasoning)

            # Skip if no analyses were successful
            if not agent_analyses:
                continue

            # Add portfolio decision (if available)
            portfolio_decision = None
            if "portfolio_manager" in agents:
                portfolio_decision = AnalysisService._get_portfolio_decision(ticker, agent_analyses, date)

            # Create stock analysis result
            stock_result = {
                "ticker": ticker,
                "date": date,
                "agent_analyses": agent_analyses,
                "portfolio_decision": portfolio_decision,
            }
            results.append(stock_result)

        return {"analyses": results}

    @staticmethod
    def _run_ticker_analysis(ticker: str, agents: List[str], date: str, include_reasoning: bool) -> List[Dict[str, Any]]:
        """Run analysis for a single ticker using multiple agents in parallel."""
        agent_results = []

        # Use ThreadPoolExecutor to run analyses in parallel
        with ThreadPoolExecutor(max_workers=min(10, len(agents))) as executor:
            # Submit all analysis tasks
            future_to_agent = {executor.submit(AgentService.run_agent_analysis, agent_id, ticker, date): agent_id for agent_id in agents if agent_id not in ["portfolio_manager"]}  # Skip portfolio manager for now

            # Process results as they complete
            for future in as_completed(future_to_agent):
                agent_id = future_to_agent[future]
                try:
                    result = future.result()
                    if result:
                        # Remove reasoning if not requested
                        if not include_reasoning and "reasoning" in result:
                            result["reasoning"] = None
                        agent_results.append(result)
                except Exception as e:
                    print(f"Error analyzing {ticker} with agent {agent_id}: {e}")

        return agent_results

    @staticmethod
    def _get_portfolio_decision(ticker: str, agent_analyses: List[Dict[str, Any]], date: str) -> Optional[Dict[str, Any]]:
        """
        Get portfolio decision for a stock based on agent analyses.
        In a real implementation, this would call the portfolio manager agent.
        """
        # This is a placeholder implementation
        try:
            portfolio_manager = AgentService.instantiate_agent("portfolio_manager")
            if portfolio_manager:
                # In a real implementation, we would pass the agent analyses to the portfolio manager
                # and get back a decision. This is a simplified placeholder.
                return {
                    "action": "HOLD",
                    "quantity": 0,
                    "confidence": 50.0,
                    "reasoning": "Portfolio decision placeholder",
                }
        except Exception as e:
            print(f"Error getting portfolio decision for {ticker}: {e}")

        return None
