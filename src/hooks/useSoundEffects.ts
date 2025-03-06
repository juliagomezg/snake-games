import { useRef, useEffect, useState } from 'react';
import { Direction } from '../types/game';

interface SoundEffectsOptions {
  enabled?: boolean;
}

export const useSoundEffects = (options: SoundEffectsOptions = {}) => {
  const { enabled: initialEnabled = true } = options;
  const [enabled, setEnabled] = useState(initialEnabled);
  
  // Referencias a los elementos de audio
  const eatSound = useRef<HTMLAudioElement | null>(null);
  const gameOverSound = useRef<HTMLAudioElement | null>(null);
  const moveSound = useRef<HTMLAudioElement | null>(null);
  const powerUpSound = useRef<HTMLAudioElement | null>(null);
  const directionSounds = {
    UP: useRef<HTMLAudioElement | null>(null),
    DOWN: useRef<HTMLAudioElement | null>(null),
    LEFT: useRef<HTMLAudioElement | null>(null),
    RIGHT: useRef<HTMLAudioElement | null>(null),
  };
  const collisionWarningSound = useRef<HTMLAudioElement | null>(null);
  const appleNearbySound = useRef<HTMLAudioElement | null>(null);
  const powerUpNearbySound = useRef<HTMLAudioElement | null>(null);
  
  // Inicializar los sonidos
  useEffect(() => {
    // Crear elementos de audio
    eatSound.current = new Audio();
    gameOverSound.current = new Audio();
    moveSound.current = new Audio();
    powerUpSound.current = new Audio();
    directionSounds.UP.current = new Audio();
    directionSounds.DOWN.current = new Audio();
    directionSounds.LEFT.current = new Audio();
    directionSounds.RIGHT.current = new Audio();
    collisionWarningSound.current = new Audio();
    appleNearbySound.current = new Audio();
    powerUpNearbySound.current = new Audio();
    
    // Configurar las fuentes de audio (usando URLs de sonidos gratuitos)
    eatSound.current.src = 'https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3';
    gameOverSound.current.src = 'https://assets.mixkit.co/active_storage/sfx/270/270-preview.mp3';
    moveSound.current.src = 'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3';
    powerUpSound.current.src = 'https://assets.mixkit.co/active_storage/sfx/2/2-preview.mp3';
    
    // Sonidos direccionales (diferentes tonos para cada dirección)
    directionSounds.UP.current.src = 'https://assets.mixkit.co/active_storage/sfx/403/403-preview.mp3'; // Tono alto
    directionSounds.DOWN.current.src = 'https://assets.mixkit.co/active_storage/sfx/405/405-preview.mp3'; // Tono bajo
    directionSounds.LEFT.current.src = 'https://assets.mixkit.co/active_storage/sfx/404/404-preview.mp3'; // Tono izquierdo
    directionSounds.RIGHT.current.src = 'https://assets.mixkit.co/active_storage/sfx/406/406-preview.mp3'; // Tono derecho
    
    // Sonidos de advertencia
    collisionWarningSound.current.src = 'https://assets.mixkit.co/active_storage/sfx/243/243-preview.mp3';
    appleNearbySound.current.src = 'https://assets.mixkit.co/active_storage/sfx/146/146-preview.mp3';
    powerUpNearbySound.current.src = 'https://assets.mixkit.co/active_storage/sfx/147/147-preview.mp3';
    
    // Precargar los sonidos
    eatSound.current.load();
    gameOverSound.current.load();
    moveSound.current.load();
    powerUpSound.current.load();
    directionSounds.UP.current.load();
    directionSounds.DOWN.current.load();
    directionSounds.LEFT.current.load();
    directionSounds.RIGHT.current.load();
    collisionWarningSound.current.load();
    appleNearbySound.current.load();
    powerUpNearbySound.current.load();
    
    // Configurar volumen
    if (eatSound.current) eatSound.current.volume = 0.3;
    if (moveSound.current) moveSound.current.volume = 0.1;
    if (gameOverSound.current) gameOverSound.current.volume = 0.5;
    if (powerUpSound.current) powerUpSound.current.volume = 0.4;
    if (directionSounds.UP.current) directionSounds.UP.current.volume = 0.2;
    if (directionSounds.DOWN.current) directionSounds.DOWN.current.volume = 0.2;
    if (directionSounds.LEFT.current) directionSounds.LEFT.current.volume = 0.2;
    if (directionSounds.RIGHT.current) directionSounds.RIGHT.current.volume = 0.2;
    if (collisionWarningSound.current) collisionWarningSound.current.volume = 0.4;
    if (appleNearbySound.current) appleNearbySound.current.volume = 0.3;
    if (powerUpNearbySound.current) powerUpNearbySound.current.volume = 0.3;
    
    // Limpiar al desmontar
    return () => {
      if (eatSound.current) eatSound.current = null;
      if (gameOverSound.current) gameOverSound.current = null;
      if (moveSound.current) moveSound.current = null;
      if (powerUpSound.current) powerUpSound.current = null;
      if (directionSounds.UP.current) directionSounds.UP.current = null;
      if (directionSounds.DOWN.current) directionSounds.DOWN.current = null;
      if (directionSounds.LEFT.current) directionSounds.LEFT.current = null;
      if (directionSounds.RIGHT.current) directionSounds.RIGHT.current = null;
      if (collisionWarningSound.current) collisionWarningSound.current = null;
      if (appleNearbySound.current) appleNearbySound.current = null;
      if (powerUpNearbySound.current) powerUpNearbySound.current = null;
    };
  }, []);
  
  // Función para reproducir el sonido de comer
  const playEatSound = () => {
    if (enabled && eatSound.current) {
      eatSound.current.currentTime = 0;
      eatSound.current.play().catch(e => console.error('Error playing eat sound:', e));
    }
  };
  
  // Función para reproducir el sonido de fin de juego
  const playGameOverSound = () => {
    if (enabled && gameOverSound.current) {
      gameOverSound.current.currentTime = 0;
      gameOverSound.current.play().catch(e => console.error('Error playing game over sound:', e));
    }
  };
  
  // Función para reproducir el sonido de movimiento
  const playMoveSound = () => {
    if (enabled && moveSound.current) {
      moveSound.current.currentTime = 0;
      moveSound.current.play().catch(e => console.error('Error playing move sound:', e));
    }
  };
  
  // Función para reproducir el sonido de power-up
  const playPowerUpSound = () => {
    if (enabled && powerUpSound.current) {
      powerUpSound.current.currentTime = 0;
      powerUpSound.current.play().catch(e => console.error('Error playing power-up sound:', e));
    }
  };
  
  // Función para reproducir el sonido de dirección
  const playDirectionSound = (direction: Direction) => {
    if (enabled && directionSounds[direction].current) {
      directionSounds[direction].current!.currentTime = 0;
      directionSounds[direction].current!.play().catch(e => console.error(`Error playing ${direction} sound:`, e));
    }
  };
  
  // Función para reproducir el sonido de advertencia de colisión
  const playCollisionWarningSound = () => {
    if (enabled && collisionWarningSound.current) {
      collisionWarningSound.current.currentTime = 0;
      collisionWarningSound.current.play().catch(e => console.error('Error playing collision warning sound:', e));
    }
  };
  
  // Función para reproducir el sonido de manzana cercana
  const playAppleNearbySound = () => {
    if (enabled && appleNearbySound.current) {
      appleNearbySound.current.currentTime = 0;
      appleNearbySound.current.play().catch(e => console.error('Error playing apple nearby sound:', e));
    }
  };
  
  // Función para reproducir el sonido de power-up cercano
  const playPowerUpNearbySound = () => {
    if (enabled && powerUpNearbySound.current) {
      powerUpNearbySound.current.currentTime = 0;
      powerUpNearbySound.current.play().catch(e => console.error('Error playing power-up nearby sound:', e));
    }
  };
  
  // Función para activar/desactivar los sonidos
  const toggleSounds = () => {
    setEnabled(prev => !prev);
  };
  
  return {
    playEatSound,
    playGameOverSound,
    playMoveSound,
    playPowerUpSound,
    playDirectionSound,
    playCollisionWarningSound,
    playAppleNearbySound,
    playPowerUpNearbySound,
    enabled,
    toggleSounds
  };
}; 