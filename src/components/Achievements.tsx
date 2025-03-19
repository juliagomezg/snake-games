import React, { memo, useState, useEffect } from 'react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number; // Puntuación requerida para desbloquear
}

interface AchievementsProps {
  score: number;
  highestScore: number;
}

const STORAGE_KEY = 'snake-game-achievements';

const Achievements: React.FC<AchievementsProps> = ({ score, highestScore }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-bite',
      name: 'Primera Mordida',
      description: 'Come tu primera manzana',
      icon: '🍎',
      unlocked: false,
      requirement: 1
    },
    {
      id: 'hungry',
      name: 'Hambriento',
      description: 'Alcanza una puntuación de 10',
      icon: '🍽️',
      unlocked: false,
      requirement: 10
    },
    {
      id: 'snake-charmer',
      name: 'Encantador de Serpientes',
      description: 'Alcanza una puntuación de 25',
      icon: '🐍',
      unlocked: false,
      requirement: 25
    },
    {
      id: 'python-master',
      name: 'Maestro Python',
      description: 'Alcanza una puntuación de 50',
      icon: '🏆',
      unlocked: false,
      requirement: 50
    },
    {
      id: 'anaconda',
      name: 'Anaconda',
      description: 'Alcanza una puntuación de 75',
      icon: '🌟',
      unlocked: false,
      requirement: 75
    },
    {
      id: 'snake-god',
      name: 'Dios Serpiente',
      description: 'Alcanza una puntuación de 100',
      icon: '👑',
      unlocked: false,
      requirement: 100
    }
  ]);
  
  const [showNotification, setShowNotification] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  
  // Utilizar la variable score para evitar el warning
  const currentScore = Math.max(score, highestScore);
  
  // Cargar logros guardados
  useEffect(() => {
    const savedAchievements = localStorage.getItem(STORAGE_KEY);
    if (savedAchievements) {
      try {
        const parsedAchievements = JSON.parse(savedAchievements);
        setAchievements(parsedAchievements);
      } catch (error) {
        console.error('Error parsing achievements:', error);
      }
    }
  }, []);
  
  // Verificar logros desbloqueados
  useEffect(() => {
    const updatedAchievements = [...achievements];
    let newlyUnlocked = false;
    let lastUnlocked: Achievement | null = null;
    
    updatedAchievements.forEach(achievement => {
      if (!achievement.unlocked && currentScore >= achievement.requirement) {
        achievement.unlocked = true;
        newlyUnlocked = true;
        lastUnlocked = achievement;
      }
    });
    
    if (newlyUnlocked) {
      setAchievements(updatedAchievements);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAchievements));
      
      // Mostrar notificación del último logro desbloqueado
      if (lastUnlocked) {
        setNewAchievement(lastUnlocked);
        setShowNotification(true);
        
        // Ocultar la notificación después de 3 segundos
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
      }
    }
  }, [currentScore, achievements]);
  
  // Calcular el progreso total
  const calculateTotalProgress = () => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    return Math.floor((unlockedCount / achievements.length) * 100);
  };
  
  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-md border border-gray-100 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Logros</h2>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progreso total</span>
          <span>{calculateTotalProgress()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-blue-500" 
            style={{ width: `${calculateTotalProgress()}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {achievements.map(achievement => (
          <div 
            key={achievement.id}
            className={`p-3 rounded-lg border ${
              achievement.unlocked 
                ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200' 
                : 'bg-gray-100 border-gray-200 opacity-70'
            }`}
          >
            <div className="flex items-center">
              <div className="text-2xl mr-3">{achievement.icon}</div>
              <div>
                <div className="font-bold text-gray-800">{achievement.name}</div>
                <div className="text-xs text-gray-600">{achievement.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Notificación de logro desbloqueado */}
      {showNotification && newAchievement && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg p-4 shadow-xl border border-gray-200 animate-fadeIn z-50 max-w-xs">
          <div className="flex items-center">
            <div className="text-3xl mr-3">{newAchievement.icon}</div>
            <div>
              <div className="font-bold text-gray-800">¡Logro desbloqueado!</div>
              <div className="text-sm text-gray-600">{newAchievement.name}</div>
              <div className="text-xs text-gray-500">{newAchievement.description}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Achievements); 