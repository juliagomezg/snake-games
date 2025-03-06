from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.base_class import Base

class CollisionType(enum.Enum):
    WALL = "wall"
    COLLISION = "collision"
    NONE = "none"

class DifficultyLevel(enum.Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"

class GameSession(Base):
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("user.id"), nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    score = Column(Integer, nullable=False)
    game_time = Column(Integer, nullable=False)  # in seconds
    difficulty = Column(Enum(DifficultyLevel), nullable=False)
    snake_length = Column(Integer, nullable=False)
    movement_pattern = Column(JSON, nullable=False)  # Array of positions
    collision_type = Column(Enum(CollisionType), nullable=True)
    power_ups_collected = Column(Integer, nullable=False, default=0)
    board_size = Column(Integer, nullable=False)
    
    # Metadata
    client_ip = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="game_sessions")
    ai_insight = relationship("AIInsight", back_populates="game_session", uselist=False) 