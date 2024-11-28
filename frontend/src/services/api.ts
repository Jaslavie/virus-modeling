// define the API service for the frontend
// import the types for the simulation data that the frontend will use
import { SimulationPrams, SimulationState } from "../types/simulation";

export const connectWebSocket = (
    onMessage: (data: SimulationState) => void,
    onError: (error: Event) => void
) => {
    const ws = new WebSocket("ws://localhost:8000/api/ws/simulation");

    // handle message event by parsing the data as JSON and passing it to the onMessage callback
    ws.onmessage = (event) => {
        onMessage(JSON.parse(event.data));
    };

    ws.onerror = onError;

    return ws;
}