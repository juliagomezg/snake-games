import React, { useState, useEffect } from 'react';

interface TutorialProps {
  onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const steps = [
    {
      title: "Bienvenido al Juego de la Serpiente",
      content: "Controla la serpiente para comer manzanas y crecer sin chocar con los bordes o contigo mismo.",
      image: "🐍"
    },
    {
      title: "Controles",
      content: "Usa las flechas del teclado para mover la serpiente. Presiona P para pausar y R para reiniciar.",
      image: "⌨️"
    },
    {
      title: "Objetivo",
      content: "Come tantas manzanas como puedas para aumentar tu puntuación. La serpiente se moverá más rápido a medida que crezca.",
      image: "🍎"
    },
    {
      title: "Puntuaciones",
      content: "Tus mejores puntuaciones se guardarán automáticamente. ¡Intenta superar tu récord!",
      image: "🏆"
    }
  ];
  
  // Comprobar si es la primera vez que el usuario juega
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('snake-game-tutorial-seen');
    if (hasSeenTutorial) {
      onClose();
    }
  }, [onClose]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Marcar el tutorial como visto
      localStorage.setItem('snake-game-tutorial-seen', 'true');
      // Animar la salida
      setIsVisible(false);
      // Cerrar después de la animación
      setTimeout(onClose, 300);
    }
  };
  
  const handleSkip = () => {
    // Marcar el tutorial como visto
    localStorage.setItem('snake-game-tutorial-seen', 'true');
    // Animar la salida
    setIsVisible(false);
    // Cerrar después de la animación
    setTimeout(onClose, 300);
  };
  
  return (
    <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 animate-fadeIn">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{steps[currentStep].image}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{steps[currentStep].title}</h2>
          <p className="text-gray-600">{steps[currentStep].content}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <button 
            className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={handleSkip}
          >
            Saltar
          </button>
          
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full ${currentStep === index ? 'bg-snake-head' : 'bg-gray-300'}`}
              />
            ))}
          </div>
          
          <button 
            className="px-4 py-2 bg-gradient-to-r from-snake-head to-snake-body text-white rounded-lg hover:shadow-md transition-all"
            onClick={handleNext}
          >
            {currentStep < steps.length - 1 ? 'Siguiente' : 'Empezar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial; 