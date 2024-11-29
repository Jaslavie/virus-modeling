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
            population: 1000,
            initial_infected: 5,
            infection_rate: 0.3,
            recovery_rate: 0.1
        }));
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log("Received data:", data);
            onMessage(data);
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    };

    ws.onerror = onError;
    return ws;
}