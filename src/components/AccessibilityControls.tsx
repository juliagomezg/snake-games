import React, { memo } from 'react';

interface AccessibilityControlsProps {
  highContrast: boolean;
  onToggleHighContrast: () => void;
  audioDescriptive: boolean;
  onToggleAudioDescriptive: () => void;
}

const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  highContrast,
  onToggleHighContrast,
  audioDescriptive,
  onToggleAudioDescriptive
}) => {
  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-md border border-gray-100 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Accesibilidad</h2>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="tooltip">
          <button
            className={`w-full p-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-md ${
              highContrast
                ? 'bg-gradient-to-r from-black to-gray-800'
                : 'bg-gradient-to-r from-gray-400 to-gray-500'
            }`}
            onClick={onToggleHighContrast}
            aria-pressed={highContrast}
            aria-label={highContrast ? "Desactivar modo de alto contraste" : "Activar modo de alto contraste"}
          >
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{highContrast ? 'Alto Contraste: ON' : 'Alto Contraste: OFF'}</span>
            </div>
          </button>
          <span className="tooltip-text" role="tooltip">
            {highContrast 
              ? "Desactivar el modo de alto contraste para personas con discapacidad visual" 
              : "Activar el modo de alto contraste para personas con discapacidad visual"}
          </span>
        </div>
        
        <div className="tooltip">
          <button
            className={`w-full p-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-md ${
              audioDescriptive
                ? 'bg-gradient-to-r from-blue-600 to-blue-700'
                : 'bg-gradient-to-r from-gray-400 to-gray-500'
            }`}
            onClick={onToggleAudioDescriptive}
            aria-pressed={audioDescriptive}
            aria-label={audioDescriptive ? "Desactivar modo de audio descriptivo" : "Activar modo de audio descriptivo"}
          >
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a9 9 0 010 12m-4.5-9.5L3 12l4.5 4.5m0-9L12 12l-4.5 4.5" />
              </svg>
              <span>{audioDescriptive ? 'Audio Descriptivo: ON' : 'Audio Descriptivo: OFF'}</span>
            </div>
          </button>
          <span className="tooltip-text" role="tooltip">
            {audioDescriptive 
              ? "Desactivar el modo de audio descriptivo para personas con discapacidad visual" 
              : "Activar el modo de audio descriptivo para personas con discapacidad visual"}
          </span>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-800">
          <strong>Modo de alto contraste:</strong> Mejora la visibilidad con colores de alto contraste.
        </p>
        <p className="text-sm text-blue-800 mt-2">
          <strong>Modo de audio descriptivo:</strong> Proporciona retroalimentación auditiva sobre la posición de la serpiente, la manzana y los obstáculos.
        </p>
      </div>
    </div>
  );
};

export default memo(AccessibilityControls); 