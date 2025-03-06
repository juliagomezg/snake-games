import React, { memo } from 'react';

interface ControlsProps {
  isPaused: boolean;
  onPauseToggle: () => void;
  onRestart: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  isPaused, 
  onPauseToggle, 
  onRestart,
  soundEnabled,
  onSoundToggle
}) => {
  return (
    <div className="w-full" role="group" aria-label="Controles del juego">
      <div className="flex justify-center gap-4 mb-4">
        <div className="tooltip">
          <button 
            className={`px-5 py-3 rounded-full font-semibold text-white transition-all transform hover:scale-110 shadow-md ${
              isPaused 
                ? 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600' 
                : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600'
            }`}
            onClick={onPauseToggle}
            aria-label={isPaused ? "Reanudar el juego" : "Pausar el juego"}
          >
            {isPaused ? 'Reanudar (P)' : 'Pausar (P)'}
          </button>
          <span className="tooltip-text" role="tooltip">{isPaused ? "Reanudar el juego" : "Pausar el juego"}</span>
        </div>
        
        <div className="tooltip">
          <button 
            className="px-5 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-full font-semibold hover:from-red-500 hover:to-red-600 transition-all transform hover:scale-110 shadow-md"
            onClick={onRestart}
            aria-label="Reiniciar el juego desde el principio"
          >
            Reiniciar (R)
          </button>
          <span className="tooltip-text" role="tooltip">Reiniciar el juego desde el principio</span>
        </div>
        
        <div className="tooltip">
          <button 
            className={`p-2 rounded-full transition-all transform hover:scale-110 shadow-md ${
              soundEnabled 
                ? 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600' 
                : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
            }`}
            onClick={onSoundToggle}
            aria-label={soundEnabled ? "Desactivar los efectos de sonido" : "Activar los efectos de sonido"}
            aria-pressed={soundEnabled}
          >
            {soundEnabled ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m-4.5-9.5L3 12l4.5 4.5m0-9L12 12l-4.5 4.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15.414a8 8 0 1112.828 0M12 6v6m0 0v6m0-6h.01" />
              </svg>
            )}
          </button>
          <span className="tooltip-text" role="tooltip">{soundEnabled ? "Desactivar los efectos de sonido" : "Activar los efectos de sonido"}</span>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">Controles</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-semibold text-gray-700 mb-1">Movimiento</div>
            <div className="text-xs text-gray-600">Usa las flechas del teclado para mover la serpiente</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-semibold text-gray-700 mb-1">Atajos</div>
            <div className="text-xs text-gray-600">
              <span className="font-medium">P</span>: Pausar/Reanudar, 
              <span className="font-medium"> R</span>: Reiniciar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoizar el componente para evitar re-renders innecesarios
export default memo(Controls); 