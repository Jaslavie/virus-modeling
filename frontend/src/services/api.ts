// define the API service for the frontend
// import the types for the simulation data that the frontend will use
import { SimulationState } from "../types/simulation";

export const connectWebSocket = (
    onMessage: (data: SimulationState) => void,
    onError: (error: Event) => void
) => {
    const ws = new WebSocket("ws://localhost:8000/api/ws/simulation");
    
    ws.onopen = () => {
        console.log("WebSocket connected");
        // Send initial parameters when connection is established
        ws.send(JSON.stringify({
            type: 'UPDATE_PARAMS',
            population: 100,
            initial_infected: 5,
            infection_rate: 0.3,
            recovery_rate: 0.1
        }));
    };

    ws.onmessage = (event) => {
        try {
            const now = Date.now();
            const data = JSON.parse(event.data);
            const simulationState: SimulationState = {
                nodes: data.network.nodes,
                edges: data.network.edges,
                counts: data.counts
            };
            requestAnimationFrame(() => onMessage(simulationState));
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    };

    ws.onclose = () => {
        console.log("WebSocket disconnected, attempting to reconnect...");
        setTimeout(() => {
            connectWebSocket(onMessage, onError);
        }, 1000);
    };

    ws.onerror = onError;
    return ws;
}