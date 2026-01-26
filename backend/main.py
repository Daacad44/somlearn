from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import presentation

app = FastAPI(title="Somlearn API", version="0.1.0")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(presentation.router, prefix="/api/v1", tags=["presentation"])

@app.get("/")
async def root():
    return {"message": "Welcome to Somlearn API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
