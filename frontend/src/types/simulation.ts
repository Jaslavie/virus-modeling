// translate the simulation data from the backend to the frontend by turning them into modules

// export as an interface to define the shape of the simulation parameters
export interface SimulationParams {
    population: number;
    initial_infected: number;
    infection_rate: number;
    recovery_rate: number;
}

export interface SimulationState {
    susceptible: number[];
    infected: number[];
    recovered: number[];
}
export interface NetworkNode {
    id: number;
    state: number;
    x: number;
    y: number;
}

export interface NetworkEdge {
    source: number;
    target: number;
}