import { useState, useEffect, useCallback } from 'react';
import { Position, PowerUp } from '../types/game';
import { useSoundEffects } from './useSoundEffects';

const STORAGE_KEY = 'snake-game-audio-descriptive';

interface UseAudioDescriptiveProps {
  enabled?: boolean;
  snake: Position[];
  apple: Position;
  powerUp: PowerUp | null;
  gridSize: number;
  direction: string;
  isGameOver: boolean;
  isPaused: boolean;
}

export const useAudioDescriptive = ({
  enabled: initialEnabled = false,
  snake,
  apple,
  powerUp,
  gridSize,
  direction,
  isGameOver,
  isPaused
}: UseAudioDescriptiveProps) => {
  const [enabled, setEnabled] = useState(initialEnabled);
  const { 
    playDirectionSound, 
    playAppleNearbySound, 
    playPowerUpNearbySound, 
    playCollisionWarningSound 
  } = useSoundEffects({ enabled: true });
  
  // Cargar configuración guardada
  useEffect(() => {
    const savedEnabled = localStorage.getItem(STORAGE_KEY);
    if (savedEnabled) {
      setEnabled(savedEnabled === 'true');
    }
  }, []);
  
  // Activar/desactivar el modo de audio descriptivo
  const toggleAudioDescriptive = useCallback(() => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    localStorage.setItem(STORAGE_KEY, String(newEnabled));
  }, [enabled]);
  
  // Reproducir sonidos direccionales
  useEffect(() => {
    if (enabled && !isGameOver && !isPaused) {
      playDirectionSound(direction as any);
    }
  }, [enabled, direction, isGameOver, isPaused, playDirectionSound]);
  
  // Detectar proximidad a la manzana
  useEffect(() => {
    if (!enabled || isGameOver || isPaused || !snake.length) return;
    
    const head = snake[0];
    const distance = Math.abs(head.x - apple.x) + Math.abs(head.y - apple.y);
    
    // Si la manzana está a 2 o menos celdas de distancia
    if (distance <= 2) {
      playAppleNearbySound();
    }
  }, [enabled, snake, apple, isGameOver, isPaused, playAppleNearbySound]);
  
  // Detectar proximidad a power-ups
  useEffect(() => {
    if (!enabled || isGameOver || isPaused || !snake.length || !powerUp) return;
    
    const head = snake[0];
    const distance = Math.abs(head.x - powerUp.position.x) + Math.abs(head.y - powerUp.position.y);
    
    // Si el power-up está a 2 o menos celdas de distancia
    if (distance <= 2) {
      playPowerUpNearbySound();
    }
  }, [enabled, snake, powerUp, isGameOver, isPaused, playPowerUpNearbySound]);
  
  // Detectar proximidad a colisiones
  useEffect(() => {
    if (!enabled || isGameOver || isPaused || !snake.length) return;
    
    const head = snake[0];
    
    // Verificar proximidad a los bordes
    const distanceToBorder = Math.min(
      head.x,
      head.y,
      gridSize - 1 - head.x,
      gridSize - 1 - head.y
    );
    
    // Verificar proximidad a la propia serpiente
    let distanceToSelf = Infinity;
    for (let i = 4; i < snake.length; i++) {
      const segment = snake[i];
      const distance = Math.abs(head.x - segment.x) + Math.abs(head.y - segment.y);
      if (distance < distanceToSelf) {
        distanceToSelf = distance;
      }
    }
    
    // Si está a 1 celda de distancia de una colisión
    if (distanceToBorder <= 1 || distanceToSelf <= 2) {
      playCollisionWarningSound();
    }
  }, [enabled, snake, gridSize, isGameOver, isPaused, playCollisionWarningSound]);
  
  return {
    audioDescriptiveEnabled: enabled,
    toggleAudioDescriptive
  };
}; 