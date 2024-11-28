from fastapi import APIRouter, WebSocket
from ..models.simulation import VisualizationData
from ..services.sir_service import run_SIR_with_behavior

router = APIRouter()

@router.websocket("/ws/simulation") # websocket endpoint to handle simulation updates
async def simulation_websocket(websocket: WebSocket):
    """ 
    websocket endpoint to handle simulation updates in real-time
    """
    await websocket.accept()
    sim = VirusSimulation()