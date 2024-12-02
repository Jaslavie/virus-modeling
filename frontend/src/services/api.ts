// define the API service for the frontend
// import the types for the simulation data that the frontend will use
import { SimulationState, SimulationParams } from "../types/simulation";

export const connectWebSocket = (
    onMessage: (data: SimulationState) => void,
    params: SimulationParams,
    callbacks?: {
        onError?: (error: Event) => void;
        onConnectionChange?: (connected: boolean) => void;
    }
) => {
    console.log("Attempting to connect WebSocket with params:", params);
    const ws = new WebSocket("ws://localhost:8000/api/ws/simulation");
    
    ws.onopen = () => {
        console.log("WebSocket connected, sending initial params");
        callbacks?.onConnectionChange?.(true);
        const message = {
            type: 'UPDATE_PARAMS',
            ...params
        };
        console.log("Sending message:", message);
        ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
        try {
            console.log("Received raw data:", event.data);
            const data = JSON.parse(event.data);
            console.log("Parsed data:", data);
            const simulationState: SimulationState = {
                nodes: data.network.nodes,
                edges: data.network.edges,
                counts: data.counts
            };
            requestAnimationFrame(() =>  onMessage(simulationState));
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    };

    ws.onclose = (event) => {
        console.log("WebSocket closed with code:", event.code);
        callbacks?.onConnectionChange?.(false);
        setTimeout(() => {
            connectWebSocket(onMessage, params, callbacks);
        }, 1000);
    };

    ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        callbacks?.onError?.(error);
    };
    
    return ws;
}