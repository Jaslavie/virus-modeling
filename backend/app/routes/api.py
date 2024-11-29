from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..models.simulation import VirusSimulation
from ..services.sir_service import run_SIR_with_behavior
import asyncio

router = APIRouter()

# keep track of connections
class ConnectionManager:
    def __init__(self):
        self.active_connections = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    async def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

manager = ConnectionManager()

@router.websocket("/ws/simulation") # websocket endpoint to handle simulation updates
async def simulation_websocket(websocket: WebSocket):
    """ 
    websocket endpoint to handle simulation updates in real-time
    """
    await manager.connect(websocket)
    sim = VirusSimulation()

    try:
        while True:
            # receive message from the client to update simulation parameters (based on user input)
            data = await websocket.receive_json()
            
            # update simulation parameters if the client send a request to update parameters
            if data["type"] == "UPDATE_PARAMS":
                sim = VirusSimulation(
                    population = data["population"],
                    initial_infected = data["initial_infected"],
                    infection_rate = data["infection_rate"],
                    recovery_rate = data["recovery_rate"]
                )
            # perform one step of the simulation
            state_data = sim.step()
            await websocket.send_json(state_data)
            
            # Increase delay to reduce update frequency
            await asyncio.sleep(0.2)
    except WebSocketDisconnect:
        await manager.disconnect(websocket) 
    except Exception as e:
        print(f"Error in simulation: {e}")
        await manager.disconnect(websocket)

@router.get("/sir")
async def get_sir_data(
    population: int = 8258000,
    beta: float = 1.47,
    gamma: float = 0.1,
    days: int = 365,
    initial_p_n: float = 0.5
):
    """ 
    get SIR data for the given parameters
    """
    t, ret = run_SIR_with_behavior(
        N = population,
        beta = beta,
        gamma = gamma,
        days = days,
        initial_p_n = initial_p_n
    )
    return {
        "time": t.tolist(),
        "susceptible": ret[:, 0].tolist(), 
        "infected": ret[:, 1].tolist(),
        "recovered": ret[:, 2].tolist()
    }