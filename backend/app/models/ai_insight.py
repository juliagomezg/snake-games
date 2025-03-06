from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.base_class import Base

class SkillLevel(enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class AIInsight(Base):
    id = Column(String, primary_key=True, index=True)
    game_session_id = Column(String, ForeignKey("gamesession.id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    skill_level = Column(Enum(SkillLevel), nullable=False)
    strengths = Column(JSON, nullable=False)  # Array of strings
    weaknesses = Column(JSON, nullable=False)  # Array of strings
    recommendations = Column(JSON, nullable=False)  # Array of strings
    
    # Heatmap data
    heatmap = Column(JSON, nullable=True)  # Array of {x, y, frequency}
    
    # Pattern analysis
    patterns = Column(JSON, nullable=True)  # Array of {name, description, frequency}
    
    # Comparison to average
    score_comparison = Column(Float, nullable=True)  # Percentage above/below average
    time_comparison = Column(Float, nullable=True)  # Percentage above/below average
    efficiency_comparison = Column(Float, nullable=True)  # Points per second compared to average
    
    # Relationships
    game_session = relationship("GameSession", back_populates="ai_insight") 