from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

class CollisionType(str, Enum):
    WALL = "wall"
    COLLISION = "collision"
    NONE = "none"

class DifficultyLevel(str, Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"

class Position(BaseModel):
    x: int
    y: int

class GameSessionBase(BaseModel):
    timestamp: int = Field(..., description="Timestamp in milliseconds")
    score: int = Field(..., description="Final score")
    game_time: int = Field(..., description="Game duration in seconds")
    difficulty: DifficultyLevel = Field(..., description="Difficulty level")
    snake_length: int = Field(..., description="Final length of the snake")
    movement_pattern: List[Position] = Field(..., description="Array of snake head positions")
    collision_type: Optional[CollisionType] = Field(None, description="Type of collision that ended the game")
    power_ups_collected: int = Field(..., description="Number of power-ups collected")
    board_size: int = Field(..., description="Size of the game board")

class GameSessionCreate(GameSessionBase):
    user_id: Optional[str] = Field(None, description="User ID if authenticated")

class GameSessionInDB(GameSessionBase):
    id: str
    user_id: Optional[str] = None
    timestamp: datetime
    client_ip: Optional[str] = None
    user_agent: Optional[str] = None

    class Config:
        from_attributes = True

class GameSessionResponse(BaseModel):
    success: bool
    session_id: Optional[str] = None
    error: Optional[str] = None 