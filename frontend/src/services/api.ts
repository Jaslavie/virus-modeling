// define the API service for the frontend
// import the types for the simulation data that the frontend will use
import { SimulationState } from "../types/simulation";

export const connectWebSocket = (
    onMessage: (data: SimulationState) => void,
    onError: (error: Event) => void
) => {
    const ws = new WebSocket("ws://localhost:8000/api/ws/simulation");
    
    let lastUpdate = 0;
    const UPDATE_INTERVAL = 100; // Minimum ms between updates

    ws.onopen = () => {
        console.log("WebSocket connected");
        // Send initial parameters when connection is established
        ws.send(JSON.stringify({
            type: 'UPDATE_PARAMS',
            population: 1000,
            initial_infected: 5,
            infection_rate: 0.3,
            recovery_rate: 0.1
        }));
    };

    ws.onmessage = (event) => {
        try {
            const now = Date.now();
            if (now - lastUpdate < UPDATE_INTERVAL) {
                return; // Skip this update
            }
            lastUpdate = now;

            const data = JSON.parse(event.data);
            const simulationState: SimulationState = {
                nodes: data.network.nodes,
                edges: data.network.edges,
                counts: data.counts
            };
            onMessage(simulationState);
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    };

    ws.onerror = onError;
    return ws;
}