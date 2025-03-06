import React, { memo, useEffect, useRef } from 'react';
import { DIFFICULTY_CONFIGS, DifficultyLevel } from '../types/game';

interface HeatmapPosition {
  x: number;
  y: number;
  frequency: number;
}

interface HeatmapVisualizerProps {
  positions: HeatmapPosition[];
  difficulty: DifficultyLevel;
  width?: number;
  height?: number;
}

const HeatmapVisualizer: React.FC<HeatmapVisualizerProps> = ({
  positions,
  difficulty,
  width = 300,
  height = 300
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridSize = DIFFICULTY_CONFIGS[difficulty].gridSize;
  
  // Renderizar el mapa de calor en el canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, width, height);
    
    // Tamaño de cada celda
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;
    
    // Dibujar el fondo del tablero (cuadrícula)
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isEvenCell = (x + y) % 2 === 0;
        ctx.fillStyle = isEvenCell ? '#f3f4f6' : '#e5e7eb';
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
    
    // Dibujar el mapa de calor
    positions.forEach(pos => {
      // Convertir la frecuencia a un valor de color (rojo más intenso para mayor frecuencia)
      const alpha = Math.min(0.8, pos.frequency);
      ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
      
      // Dibujar un círculo en la posición
      ctx.beginPath();
      ctx.arc(
        (pos.x + 0.5) * cellWidth,
        (pos.y + 0.5) * cellHeight,
        Math.max(cellWidth, cellHeight) * 0.4 * pos.frequency,
        0,
        2 * Math.PI
      );
      ctx.fill();
    });
    
    // Dibujar la leyenda
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText('Frecuencia de movimientos:', 10, height - 30);
    
    // Dibujar la escala de colores
    const gradientWidth = 100;
    const gradientHeight = 10;
    const gradient = ctx.createLinearGradient(10, height - 15, 10 + gradientWidth, height - 15);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0.8)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(10, height - 15, gradientWidth, gradientHeight);
    
    // Añadir etiquetas a la escala
    ctx.fillStyle = '#000000';
    ctx.fillText('Baja', 10, height - 20);
    ctx.fillText('Alta', 10 + gradientWidth - 20, height - 20);
    
  }, [positions, difficulty, width, height, gridSize]);
  
  return (
    <div className="w-full flex flex-col items-center">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Mapa de Calor de Movimientos</h3>
      <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-md">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="rounded"
        />
      </div>
      <p className="text-sm text-gray-600 mt-2 text-center">
        Este mapa muestra las áreas donde te mueves con más frecuencia.
        <br />
        Las zonas más rojas indican mayor actividad.
      </p>
    </div>
  );
};

export default memo(HeatmapVisualizer); 