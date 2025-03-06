# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.game_session import GameSession  # noqa
from app.models.ai_insight import AIInsight  # noqa
from app.models.player_profile import PlayerProfile  # noqa 