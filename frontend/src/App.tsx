import React, { useState, useEffect } from "react";
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
  const [state, setState] = useState<SimulationState | null>(null);

  // connect to the websocket server
  useEffect(() => {
    const ws = connectWebSocket(
      (data) => setState(data),
      (error) => console.error('WebSocket error:', error)
    );

    // close the websocket connection when the component unmounts
    return () => ws.close();
  }, []);

  return (
    <div className="App">
      <SimulationControls
        params = {params}
        onParamChange={(param, value) =>
          setParams((prev) => ({...prev, [param]: value }))
        }
      />
      {/* render the network graph only if the state is available */}
      {state && <NetworkGraph nodes = {state.nodes} edges = {state.edges} />}
    </div>
  );
}

export default App;
