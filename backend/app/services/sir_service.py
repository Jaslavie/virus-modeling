# use a service to handle the simulation logic
import numpy as np
from scipy.integrate import odeint

# copy same code form simulation.py
def deriv(y, t, N, beta, gamma, t_array, p_n_array):
    """
    Differential equations for the SIR model with vaccination
    """
    S, I, R = y
    
    # Get current vaccination rate
    p_n = np.interp(t, t_array, p_n_array)
    
    # Adjust susceptible population based on vaccination
    S_effective = S * (1 - p_n)
    
    dSdt = -beta * S_effective * I / N
    dIdt = beta * S_effective * I / N - gamma * I
    dRdt = gamma * I
    
    return dSdt, dIdt, dRdt

def run_SIR_with_behavior(N, beta, gamma, days, initial_p_n):
    """
    Run SIR model with vaccination behavior
    """
    # Initial conditions
    I0 = 1
    R0 = 0
    S0 = N - I0 - R0
    
    # Time vector
    t = np.linspace(0, days, days)
    
    # Create vaccination rate array (linear increase)
    p_n_array = np.linspace(initial_p_n, min(initial_p_n + 0.2, 1.0), len(t))
    
    # Solve ODE
    ret = odeint(deriv, (S0, I0, R0), t, args=(N, beta, gamma, t, p_n_array))
    
    return t, ret