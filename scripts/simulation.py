import networkx as nx
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import random

class VirusSimulation:
    def __init__(self, population=1000, initial_infected=5, infection_rate=0.3, recovery_rate=0.1):
        """ 
        Initialize a network simulation 
        """
        self.population = population
        self.infection_rate = infection_rate
        self.recovery_rate = recovery_rate

        # create network
        self.G = nx.barabasi_albert_graph(population, 3) 

        # initialize node states (0: susceptible, 1: infected, 2: recovered)
        self.states = np.zeros(population)

        # randomly infect some nodes
        initial_infected_nodes = random.sample(range(population), initial_infected)
        self.states[initial_infected_nodes] = 1

        # store positions for consistent visualization
        self.pos = nx.spring_layout(self.G)