def run_simulations(years, initial_p_n):
    """Simulate vaccination behavior over time"""
    import pandas as pd
    import numpy as np
    
    # Simple simulation: Linear increase from initial rate
    days = years * 365
    vaccination_rate = np.linspace(initial_p_n * 100, min(initial_p_n * 100 + 20, 100), days)
    
    return pd.DataFrame({'vaccination_rate': vaccination_rate}) 