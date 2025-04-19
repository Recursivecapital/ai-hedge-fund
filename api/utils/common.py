"""
Common utility functions for the AI Hedge Fund API.
"""

import datetime
from typing import List, Dict, Any, Optional, Union


def validate_date_format(date_str: str) -> bool:
    """
    Validate that a string is in YYYY-MM-DD format.

    Args:
        date_str: Date string to validate

    Returns:
        True if valid, False otherwise
    """
    if not date_str:
        return False

    try:
        datetime.datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False


def get_current_date() -> str:
    """
    Get today's date in YYYY-MM-DD format.

    Returns:
        Today's date as a string
    """
    return datetime.datetime.now().strftime("%Y-%m-%d")


def convert_signal_format(signal: str) -> str:
    """
    Convert various signal formats to standardized format.

    Args:
        signal: Signal string (e.g., "buy", "BULLISH", "short")

    Returns:
        Standardized signal string (BULLISH, BEARISH, NEUTRAL)
    """
    signal = signal.upper()

    if signal in ["BUY", "BULLISH", "LONG"]:
        return "BULLISH"
    elif signal in ["SELL", "BEARISH", "SHORT"]:
        return "BEARISH"
    else:
        return "NEUTRAL"


def calculate_confidence_score(confidence: Union[float, str, None]) -> float:
    """
    Convert various confidence formats to a standardized percentage.

    Args:
        confidence: Confidence value (e.g., 0.75, "75%", "high")

    Returns:
        Confidence as a percentage (0-100)
    """
    if confidence is None:
        return 50.0

    if isinstance(confidence, float):
        # If already a float, ensure it's in 0-100 range
        if 0 <= confidence <= 1:
            return confidence * 100
        elif 0 <= confidence <= 100:
            return confidence
        else:
            return 50.0

    if isinstance(confidence, str):
        # Handle percentage strings
        if confidence.endswith("%"):
            try:
                return float(confidence.strip("%"))
            except ValueError:
                pass

        # Handle numeric strings
        try:
            value = float(confidence)
            if 0 <= value <= 1:
                return value * 100
            elif 0 <= value <= 100:
                return value
            else:
                return 50.0
        except ValueError:
            pass

        # Handle text-based confidence
        confidence = confidence.lower()
        if confidence in ["very high", "very_high"]:
            return 90.0
        elif confidence in ["high"]:
            return 75.0
        elif confidence in ["medium", "moderate"]:
            return 50.0
        elif confidence in ["low"]:
            return 25.0
        elif confidence in ["very low", "very_low"]:
            return 10.0

    # Default value if nothing else matches
    return 50.0
