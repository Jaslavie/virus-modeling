import networkx as nx
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import random
from tqdm import tqdm

class VirusSimulation:
    def __init__(self, population=100, initial_infected=5, infection_rate=0.3, recovery_rate=0.1):
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
        self.initial_infected = initial_infected

        # randomly infect some nodes
        initial_infected_nodes = random.sample(range(population), initial_infected)
        self.states[initial_infected_nodes] = 1

        # store positions for consistent visualization
        self.pos = nx.spring_layout(self.G)
        self.time_step = 0

    def step(self):
        """ 
        Perform one step of the simulation
        """
        new_states = self.states.copy() # copy current state of nodes

        for node in range(self.population):
            if self.states[node] == 1:  # infected
                if random.random() < self.recovery_rate:
                    new_states[node] = 2  # recovered
                else:
                    # try to infect neighbors
                    for neighbor in self.G.neighbors(node):
                        if self.states[neighbor] == 0 and random.random() < self.infection_rate:
                            new_states[neighbor] = 1  # infected

        self.states = new_states
        self.time_step += 1
        
        # Calculate current counts
        counts = {
            'susceptible': int(np.sum(self.states == 0)),
            'infected': int(np.sum(self.states == 1)),
            'recovered': int(np.sum(self.states == 2))
        }
        
        return {
            'counts': counts,
            'network': {
                'nodes': self.get_network_data()['nodes'],
                'edges': self.get_network_data()['edges']
            }
        }

    def get_network_data(self):
        """ 
        get network visualization data from networkx graph
        """
        # get node data
        nodes = []
        for i in range(self.population):
            nodes.append({
                'id': i,
                'state': int(self.states[i]),
                'x': self.pos[i][0],
                'y': self.pos[i][1]
            })
        
        # get edge data
        edges = []
        for e in self.G.edges():
            edges.append({'source': int(e[0]), 'target': int(e[1])})
        
        return {
            'nodes': nodes,
            'edges': edges
        }
    