import React, { useState, useEffect, useRef } from "react";
import { NetworkGraph } from "./components/NetworkGraph";
import { SimulationControls } from "./components/SimulationControls";
import { SimulationParams, SimulationState } from "./types/simulation";
import { connectWebSocket } from "./services/api";
import { Counter } from "./components/Counter";

function App() {
  // initialize the simulation parameters
  const [params, setParams] = useState<SimulationParams>({
    population: 100,
    initial_infected: 5,
    infection_rate: 0.3,
    recovery_rate: 0.1,
  });

  // initialize the simulation state
  const [state, setState] = useState<SimulationState>({
    nodes: [],
    edges: []
  });

  // Add loading state
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null); 

  // initialize the counts
  const [counts, setCounts] = useState({
    susceptible: params.population - params.initial_infected,
    infected: params.initial_infected,
    recovered: 0
  });

  // connect to the websocket server
  useEffect(() => {
    wsRef.current = connectWebSocket(
      (data: SimulationState) => {
        console.log("Received simulation data:", data);
        setState(data);
        // update the counts
        if (data.counts) {
          setCounts(prevCounts => ({
            ...prevCounts,
            susceptible: data.counts!.susceptible,
            infected: data.counts!.infected,
            recovered: data.counts!.recovered
          }));
        }
      },
      (error: Event) => console.error('WebSocket error:', error)
    );

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
        setIsConnected(false);
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
      <Counter
        susceptible={counts.susceptible}
        infected={counts.infected}
        recovered={counts.recovered}
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
