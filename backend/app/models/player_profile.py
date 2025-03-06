from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.base_class import Base
from app.models.game_session import DifficultyLevel

class PlayerStyle(enum.Enum):
    AGGRESSIVE = "aggressive"
    CAUTIOUS = "cautious"
    STRATEGIC = "strategic"
    BALANCED = "balanced"
    UNPREDICTABLE = "unpredictable"

class PlayerProfile(Base):
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("user.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Player statistics
    games_played = Column(Integer, default=0)
    total_score = Column(Integer, default=0)
    highest_score = Column(Integer, default=0)
    total_time = Column(Integer, default=0)  # in seconds
    apples_eaten = Column(Integer, default=0)
    
    # Death statistics
    wall_collisions = Column(Integer, default=0)
    self_collisions = Column(Integer, default=0)
    
    # Player style analysis
    player_style = Column(Enum(PlayerStyle), nullable=True)
    style_confidence = Column(Float, default=0.0)  # 0.0 to 1.0
    
    # Preferred settings
    preferred_difficulty = Column(Enum(DifficultyLevel), nullable=True)
    
    # Skill progression
    skill_progression = Column(JSON, nullable=True)  # Array of {timestamp, skill_level}
    
    # Practice recommendations
    practice_areas = Column(JSON, nullable=True)  # Array of strings
    suggested_techniques = Column(JSON, nullable=True)  # Array of strings
    
    # Relationships
    user = relationship("User", back_populates="player_profile") 