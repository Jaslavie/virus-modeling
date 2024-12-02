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
    print("New WebSocket connection attempt")
    await manager.connect(websocket)
    print("WebSocket connected successfully")
    
    # Create initial simulation
    sim = None
    running = True
    
    async def receive_message():
        nonlocal sim  # Allow modification of sim variable
        try:
            while running:
                # Check for any pending messages without blocking
                data = await websocket.receive_json()
                print(f"Received message from client: {data}")
                
                if data["type"] == "UPDATE_PARAMS":
                    print("Creating new simulation with params:", data)
                    sim = VirusSimulation(
                        population=data["population"],
                        initial_infected=data["initial_infected"],
                        infection_rate=data["infection_rate"],
                        recovery_rate=data["recovery_rate"]
                    )
                    print("New simulation created successfully")
        except WebSocketDisconnect:
            print("WebSocket disconnected in receive_message")
            return
        except Exception as e:
            print(f"Error in receive_message: {e}")
            return
            
    try:
        # start message receiving in the background
        receive_task = asyncio.create_task(receive_message())
        print("Started receive_message task")

        # simulation loop
        while running:
            try:
                await asyncio.sleep(0.1)  # sleep at the start of the loop to avoid blocking
                
                if not sim:  # Skip if simulation hasn't been initialized
                    print("Waiting for simulation initialization...")
                    continue
                    
                state_data = sim.step()
                print("Step completed, sending data")
                await websocket.send_json(state_data)
                
            except WebSocketDisconnect:
                print("WebSocket disconnected in main loop")
                break
            except Exception as e:
                print(f"Error in simulation loop: {e}")
                print(f"Error details: {str(e)}")
                break
                
    finally:
        running = False
        receive_task.cancel()
        try:
            await manager.disconnect(websocket)
        except Exception as e:
            print(f"Error during disconnect: {e}")
        print("WebSocket disconnected cleanly")


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