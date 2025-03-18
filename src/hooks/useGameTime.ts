import { useRef, useCallback, useEffect } from 'react';

interface UseGameTimeProps {
  isActive: boolean; // Si el contador está activo (juego en marcha)
  isPaused: boolean; // Si el juego está pausado
  onSecondElapsed: () => void; // Función a llamar cuando pasa un segundo
}

/**
 * Hook para manejar el tiempo de juego con mayor precisión
 * Utiliza requestAnimationFrame para un seguimiento más preciso
 */
export const useGameTime = ({
  isActive,
  isPaused,
  onSecondElapsed
}: UseGameTimeProps) => {
  // Referencias para manejar el tiempo con precisión
  const requestIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const pauseTimestampRef = useRef<number>(0);
  const visibilityPausedRef = useRef<boolean>(false);

  // Función del bucle de animación
  const animationLoop = useCallback((timestamp: number) => {
    // Si es el primer frame, inicializar el tiempo
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp;
      requestIdRef.current = requestAnimationFrame(animationLoop);
      return;
    }

    // Calcular tiempo transcurrido desde el último frame
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    // Acumular tiempo si el juego está activo y no pausado
    if (isActive && !isPaused && !visibilityPausedRef.current) {
      accumulatedTimeRef.current += deltaTime;

      // Cuando se acumula 1 segundo (1000ms), llamar al callback
      if (accumulatedTimeRef.current >= 1000) {
        onSecondElapsed();
        // Restar los 1000ms pero conservar el excedente para mayor precisión
        accumulatedTimeRef.current -= 1000;
      }
    }

    // Continuar el bucle
    requestIdRef.current = requestAnimationFrame(animationLoop);
  }, [isActive, isPaused, onSecondElapsed]);

  // Manejar cambios en el estado de pausa
  useEffect(() => {
    if (isPaused) {
      // Al pausar, guardar el timestamp actual
      pauseTimestampRef.current = performance.now();
    } else if (pauseTimestampRef.current > 0) {
      // Al reanudar, ajustar el tiempo de referencia
      const pauseDuration = performance.now() - pauseTimestampRef.current;
      lastTimeRef.current += pauseDuration;
      pauseTimestampRef.current = 0;
    }
  }, [isPaused]);

  // Iniciar/detener el bucle de animación
  useEffect(() => {
    // Iniciar el bucle solo si el juego está activo
    if (isActive && !requestIdRef.current) {
      requestIdRef.current = requestAnimationFrame(animationLoop);
    }

    // Limpiar el bucle al desmontar o cuando el juego termina
    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
    };
  }, [isActive, animationLoop]);

  // Detectar cambios de visibilidad de pestaña
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Marcar como pausado por cambio de visibilidad
        visibilityPausedRef.current = true;
        // Guardar el timestamp actual
        pauseTimestampRef.current = performance.now();
      } else {
        // Restaurar y ajustar el tiempo
        if (visibilityPausedRef.current) {
          const pauseDuration = performance.now() - pauseTimestampRef.current;
          lastTimeRef.current += pauseDuration;
          pauseTimestampRef.current = 0;
          visibilityPausedRef.current = false;
        }
      }
    };

    // Añadir listener para cambios de visibilidad
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Limpiar el listener al desmontar
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Reiniciar el contador
  const resetTime = useCallback(() => {
    lastTimeRef.current = 0;
    accumulatedTimeRef.current = 0;
    pauseTimestampRef.current = 0;
    visibilityPausedRef.current = false;
  }, []);

  return {
    resetTime
  };
}; 