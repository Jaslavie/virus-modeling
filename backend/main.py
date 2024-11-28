# set up the FastAPI app for all API routes
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.api import router
from fastapi.responses import HTMLResponse
import os

app = FastAPI(title="Virus Simulation API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# add API routes
app.include_router(router, prefix="/api")

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <html>
        <head>
            <script>
                window.location.href = 'http://localhost:3000';
            </script>
        </head>
        <body>
            <p>Redirecting to frontend...</p>
        </body>
    </html>
    """