import React, { useState, useEffect, useRef } from "react";
import { NetworkGraph } from "./components/NetworkGraph";
import { SimulationControls } from "./components/SimulationControls";
import { SimulationParams, SimulationState } from "./types/simulation";
import { connectWebSocket } from "./services/api";

function App() {
  // initialize the simulation parameters
  const [params, setParams] = useState<SimulationParams>({
    population: 1000,
    initial_infected: 5,
    infection_rate: 0.3,
    recovery_rate: 0.1,
  });

  // initialize the simulation state
  const [state, setState] = useState<SimulationState>({
    nodes: [],
    edges: []
  });
  // initialize the websocket reference
  const wsRef = useRef<WebSocket | null>(null); 

  // connect to the websocket server
  useEffect(() => {
    wsRef.current = connectWebSocket(
      (data) => {
        console.log("the data is", data);
        setState(data);
      },
      (error) => console.error('WebSocket error:', error)
    );

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    }
  }, []);

  // handle parameter changes
  const handleParamChange = (param: keyof SimulationParams, value: number) => {
    setParams(prev => {
      const newParams = {...prev, [param]: value};
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'UPDATE_PARAMS',
          ...newParams,
        }));
      }
      return newParams;
    })
  };

  return (
    <div className="App">
      <SimulationControls
        params = {params}
        onParamChange = {handleParamChange}
      />
      {state && state.nodes && state.nodes.length > 0 && state.edges && state.edges.length > 0 && (
        <NetworkGraph 
          nodes={state.nodes} 
          edges={state.edges} 
        />
      )}
    </div>
  );
}

export default App;
