import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './GameBoard';
import Score from './Score';
import Controls from './Controls';
import GameOver from './GameOver';
import HighScores from './HighScores';
import DifficultySelector from './DifficultySelector';
import LevelSystem from './LevelSystem';
import Achievements from './Achievements';
import ThemeSelector from './ThemeSelector';
import Statistics from './Statistics';
import AccessibilityControls from './AccessibilityControls';
import { useGameState } from '../hooks/useGameState';
import { useSnakeLogic, CollisionType } from '../hooks/useSnakeLogic';
import { useGameControls } from '../hooks/useGameControls';
import { useHighScores } from '../hooks/useHighScores';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useTheme } from '../hooks/useTheme';
import { useStats } from '../hooks/useStats';
import { useAudioDescriptive } from '../hooks/useAudioDescriptive';
import { DifficultyLevel, PowerUpType, POWER_UP_CONFIGS, DIFFICULTY_CONFIGS } from '../types/game';
import { ThemeOption } from './ThemeSelector';
import AIInsights from './AIInsights';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import { useGameTracking } from '../hooks/useGameTracking';
import TouchControls from './TouchControls';

const SnakeGame: React.FC = () => {
  const [showHighScores, setShowHighScores] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { highScores, highestScore, saveScore, isHighScore } = useHighScores();
  const [highScoreData, setHighScoreData] = useState({ isHighScore: false, rank: -1 });
  const { enabled: soundEnabled, toggleSounds } = useSoundEffects();
  const { theme, highContrast, changeTheme, toggleHighContrast } = useTheme();
  const { stats, recordGame, getAverageScore, getAverageTime, resetStats } = useStats();
  const [lastCollisionType, setLastCollisionType] = useState<CollisionType>(null);
  const [activePowerUpNotification, setActivePowerUpNotification] = useState<{
    type: PowerUpType;
    expiresAt: number;
  } | null>(null);
  
  // Obtener el estado del juego
  const { 
    gameState, 
    updateGameState, 
    resetGame, 
    togglePause, 
    endGame,
    incrementGameTime,
    changeDifficulty,
    generatePowerUp,
    activatePowerUp
  } = useGameState();
  
  // Configurar el modo de audio descriptivo
  const { audioDescriptiveEnabled, toggleAudioDescriptive } = useAudioDescriptive({
    snake: gameState.snake,
    apple: gameState.apple,
    powerUp: gameState.powerUp,
    gridSize: DIFFICULTY_CONFIGS[gameState.difficulty].gridSize,
    direction: gameState.direction,
    isGameOver: gameState.isGameOver,
    isPaused: gameState.isPaused
  });
  
  // Configurar el seguimiento del juego para análisis con IA
  const { 
    aiInsights, 
    loadingInsights, 
    error: aiError, 
    getPersonalizedRecommendations 
  } = useGameTracking({
    snake: gameState.snake,
    apple: gameState.apple,
    score: gameState.score,
    gameTime: gameState.gameTime,
    difficulty: gameState.difficulty,
    isGameOver: gameState.isGameOver,
    isPaused: gameState.isPaused,
    collisionType: lastCollisionType
  });
  
  // Manejar colisiones
  const handleCollision = useCallback((type: CollisionType) => {
    setLastCollisionType(type);
  }, []);
  
  // Manejar la activación de power-ups
  const handleActivatePowerUp = useCallback((type: PowerUpType) => {
    activatePowerUp(type);
    
    // Mostrar notificación si el power-up tiene duración
    const config = POWER_UP_CONFIGS[type];
    if (config.duration > 0) {
      setActivePowerUpNotification({
        type,
        expiresAt: gameState.gameTime + config.duration
      });
      
      // Ocultar la notificación después de la duración del power-up
      setTimeout(() => {
        setActivePowerUpNotification(null);
      }, config.duration * 1000);
    }
  }, [activatePowerUp, gameState.gameTime]);
  
  // Obtener la lógica del juego
  const { changeDirection } = useSnakeLogic({
    gameState,
    updateGameState,
    endGame,
    incrementGameTime,
    generatePowerUp,
    activatePowerUp: handleActivatePowerUp,
    onCollision: handleCollision,
    soundEnabled
  });
  
  // Configurar los controles del juego
  useGameControls({
    direction: gameState.direction,
    isGameOver: gameState.isGameOver,
    isPaused: gameState.isPaused,
    onDirectionChange: changeDirection,
    onPauseToggle: togglePause,
    onRestart: resetGame
  });

  // Verificar puntuación alta cuando termina el juego
  useEffect(() => {
    if (gameState.isGameOver) {
      // Registrar estadísticas del juego
      recordGame(
        gameState.score, 
        gameState.gameTime, 
        lastCollisionType || 'wall'
      );
      
      // Verificar si es una puntuación alta
      const scoreQualifies = isHighScore(gameState.score);
      
      if (scoreQualifies) {
        // Guardar la puntuación y obtener su posición
        const rank = saveScore(gameState.score, gameState.gameTime);
        setHighScoreData({ isHighScore: true, rank });
      } else {
        setHighScoreData({ isHighScore: false, rank: -1 });
      }
    }
  }, [gameState.isGameOver, gameState.score, gameState.gameTime, isHighScore, saveScore, recordGame, lastCollisionType]);

  // Reiniciar el juego y resetear el estado de puntuación alta
  const handleRestart = () => {
    resetGame();
    setHighScoreData({ isHighScore: false, rank: -1 });
    setLastCollisionType(null);
    setActivePowerUpNotification(null);
  };

  // Alternar entre el juego y las puntuaciones altas
  const toggleHighScores = () => {
    setShowHighScores(!showHighScores);
    setShowSettings(false);
    setShowStats(false);
    setShowAIInsights(false);
    setShowRecommendations(false);
  };

  // Alternar la visualización de estadísticas
  const toggleStats = () => {
    setShowStats(!showStats);
    setShowHighScores(false);
    setShowSettings(false);
    setShowAIInsights(false);
    setShowRecommendations(false);
  };
  
  // Alternar la visualización de configuración
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setShowHighScores(false);
    setShowStats(false);
    setShowAIInsights(false);
    setShowRecommendations(false);
  };
  
  // Manejar el cambio de dificultad
  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    changeDifficulty(difficulty);
  };
  
  // Manejar el cambio de tema
  const handleThemeChange = (newTheme: ThemeOption) => {
    changeTheme(newTheme);
  };
  
  // Renderizar la notificación de power-up activo
  const renderPowerUpNotification = () => {
    if (!activePowerUpNotification) return null;
    
    const config = POWER_UP_CONFIGS[activePowerUpNotification.type];
    const timeLeft = activePowerUpNotification.expiresAt - gameState.gameTime;
    
    if (timeLeft <= 0) return null;
    
    return (
      <div className="fixed top-4 right-4 bg-white rounded-lg p-3 shadow-xl border border-gray-200 animate-fadeIn z-50 max-w-xs">
        <div className="flex items-center">
          <div className="text-2xl mr-3">{config.icon}</div>
          <div>
            <div className="font-bold text-gray-800">{config.description}</div>
            <div className="text-xs text-gray-500">Tiempo restante: {timeLeft}s</div>
          </div>
        </div>
      </div>
    );
  };
  
  // Alternar la visualización de insights de IA
  const toggleAIInsights = () => {
    setShowAIInsights(!showAIInsights);
    setShowHighScores(false);
    setShowSettings(false);
    setShowStats(false);
    setShowRecommendations(false);
  };
  
  // Alternar la visualización de recomendaciones personalizadas
  const toggleRecommendations = () => {
    setShowRecommendations(!showRecommendations);
    setShowHighScores(false);
    setShowSettings(false);
    setShowStats(false);
    setShowAIInsights(false);
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-3 sm:p-5 relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl shadow-lg game-container">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-snake-head text-center bg-clip-text text-transparent bg-gradient-to-r from-snake-head to-snake-body">
        Juego de la Serpiente
      </h1>
      
      {renderPowerUpNotification()}
      
      {!showHighScores && !showSettings && !showStats && !showAIInsights && !showRecommendations ? (
        <>
          <Score 
            score={gameState.score} 
            gameTime={gameState.gameTime} 
          />
          
          <div className="relative my-2 sm:my-4 rounded-lg overflow-hidden shadow-xl w-full flex justify-center">
            <GameBoard 
              snake={gameState.snake} 
              apple={gameState.apple}
              powerUp={gameState.powerUp}
              difficulty={gameState.difficulty}
            />
            
            {gameState.isGameOver && (
              <GameOver 
                score={gameState.score} 
                gameTime={gameState.gameTime} 
                onRestart={handleRestart}
                isHighScore={highScoreData.isHighScore}
                highScoreRank={highScoreData.rank}
              />
            )}
          </div>
          
          <Controls 
            isPaused={gameState.isPaused} 
            onPauseToggle={togglePause} 
            onRestart={resetGame}
            soundEnabled={soundEnabled}
            onSoundToggle={toggleSounds}
          />
          
          {/* Controles táctiles para dispositivos móviles */}
          <TouchControls 
            onDirectionChange={changeDirection}
            isDisabled={gameState.isGameOver || gameState.isPaused}
          />
          
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 justify-center w-full">
            <button 
              className="flex-1 min-w-[120px] px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-md text-sm sm:text-base"
              onClick={toggleHighScores}
              title="Ver la tabla de las mejores puntuaciones"
            >
              Puntuaciones
            </button>
            
            <button 
              className="flex-1 min-w-[120px] px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-400 to-indigo-500 text-white rounded-lg hover:from-indigo-500 hover:to-indigo-600 transition-all transform hover:scale-105 shadow-md text-sm sm:text-base"
              onClick={toggleSettings}
              title="Ajustar la dificultad, tema y sonido del juego"
            >
              Configuración
            </button>
            
            <button 
              className="flex-1 min-w-[120px] px-3 sm:px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-105 shadow-md text-sm sm:text-base"
              onClick={toggleStats}
              title="Ver estadísticas detalladas de tu rendimiento en el juego"
            >
              Estadísticas
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3 justify-center w-full">
            <button 
              className="flex-1 min-w-[120px] px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-500 text-white rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all transform hover:scale-105 shadow-md text-sm sm:text-base"
              onClick={toggleAIInsights}
              title="Ver análisis de IA de tu estilo de juego"
            >
              Análisis IA
            </button>
            
            <button 
              className="flex-1 min-w-[120px] px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all transform hover:scale-105 shadow-md text-sm sm:text-base"
              onClick={toggleRecommendations}
              title="Ver recomendaciones personalizadas basadas en tu estilo de juego"
            >
              Recomendaciones
            </button>
          </div>
        </>
      ) : showHighScores ? (
        <>
          <HighScores scores={highScores} />
          
          <div className="tooltip">
            <button 
              className="mt-6 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-md"
              onClick={toggleHighScores}
            >
              Volver al Juego
            </button>
            <span className="tooltip-text">Volver a la pantalla principal del juego</span>
          </div>
        </>
      ) : showStats ? (
        <>
          <Statistics 
            stats={stats}
            averageScore={getAverageScore()}
            averageTime={getAverageTime()}
            onReset={resetStats}
          />
          
          <div className="tooltip">
            <button 
              className="mt-6 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-md"
              onClick={toggleStats}
            >
              Volver al Juego
            </button>
            <span className="tooltip-text">Volver a la pantalla principal del juego</span>
          </div>
        </>
      ) : showSettings ? (
        <>
          <AccessibilityControls
            highContrast={highContrast}
            onToggleHighContrast={toggleHighContrast}
            audioDescriptive={audioDescriptiveEnabled}
            onToggleAudioDescriptive={toggleAudioDescriptive}
          />
          
          <LevelSystem 
            score={gameState.score} 
            highestScore={highestScore} 
          />
          
          <Achievements 
            score={gameState.score}
            highestScore={highestScore}
          />
          
          <ThemeSelector 
            currentTheme={theme}
            onThemeChange={handleThemeChange}
          />
          
          <DifficultySelector 
            currentDifficulty={gameState.difficulty} 
            onDifficultyChange={handleDifficultyChange} 
          />
          
          <div className="w-full bg-white rounded-lg p-4 shadow-md border border-gray-100 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Configuración de Sonido</h2>
            
            <div className="flex justify-center">
              <div className="tooltip">
                <button 
                  className={`p-3 rounded-full transition-all transform hover:scale-105 shadow-md ${
                    soundEnabled 
                      ? 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600' 
                      : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
                  }`}
                  onClick={toggleSounds}
                  aria-pressed={soundEnabled}
                >
                  {soundEnabled ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m-4.5-9.5L3 12l4.5 4.5m0-9L12 12l-4.5 4.5" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15.414a8 8 0 1112.828 0M12 6v6m0 0v6m0-6h.01" />
                    </svg>
                  )}
                </button>
                <span className="tooltip-text" role="tooltip">{soundEnabled ? "Desactivar los efectos de sonido" : "Activar los efectos de sonido"}</span>
              </div>
            </div>
          </div>
          
          <div className="tooltip">
            <button 
              className="mt-6 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-md"
              onClick={toggleSettings}
            >
              Volver al Juego
            </button>
            <span className="tooltip-text" role="tooltip">Volver a la pantalla principal del juego</span>
          </div>
        </>
      ) : showAIInsights ? (
        <>
          <AIInsights 
            insights={aiInsights} 
            loading={loadingInsights} 
            error={aiError} 
            difficulty={gameState.difficulty}
          />
          
          <button 
            className="mt-6 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-md"
            onClick={toggleAIInsights}
          >
            Volver al Juego
          </button>
        </>
      ) : showRecommendations ? (
        <>
          <PersonalizedRecommendations 
            onGetRecommendations={getPersonalizedRecommendations}
            onChangeDifficulty={handleDifficultyChange}
          />
          
          <button 
            className="mt-6 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all transform hover:scale-105 shadow-md"
            onClick={toggleRecommendations}
          >
            Volver al Juego
          </button>
        </>
      ) : null}
    </div>
  );
};

export default SnakeGame; 