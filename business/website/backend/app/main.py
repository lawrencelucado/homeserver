from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from .database import init_db
from .api.routes import contact

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="DataLux Consulting API",
    description="Backend API for DataLux Consulting website",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(contact.router, prefix="/api", tags=["Contact"])


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    logger.info("Starting DataLux Consulting API...")
    init_db()
    logger.info("Database initialized successfully")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "DataLux Consulting API"}


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "DataLux Consulting API",
        "version": "1.0.0",
        "docs": "/docs",
    }
