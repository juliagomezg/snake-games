import React, { memo } from 'react';
import { AIInsights as AIInsightsType } from '../services/apiService';
import HeatmapVisualizer from './HeatmapVisualizer';
import { DifficultyLevel } from '../types/game';

interface AIInsightsProps {
  insights: AIInsightsType;
  loading: boolean;
  error: string | null;
  difficulty: DifficultyLevel;
}

const AIInsights: React.FC<AIInsightsProps> = ({ insights, loading, error, difficulty }) => {
  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg p-4 shadow-md border border-gray-100 mb-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-snake-head mb-4"></div>
          <p className="text-gray-600">Analizando tu estilo de juego con IA...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full bg-white rounded-lg p-4 shadow-md border border-red-200 mb-6">
        <div className="bg-red-50 p-3 rounded-lg">
          <h3 className="text-lg font-bold text-red-700 mb-2">Error al obtener insights</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!insights) {
    return null;
  }
  
  // Función para renderizar el nivel de habilidad con un indicador visual
  const renderSkillLevel = () => {
    const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
    const currentIndex = levels.indexOf(insights.skillLevel);
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Nivel de Habilidad</h3>
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-blue-500"
            style={{ width: `${((currentIndex + 1) / levels.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>Principiante</span>
          <span>Intermedio</span>
          <span>Avanzado</span>
          <span>Experto</span>
        </div>
        <div className="mt-2 text-center">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
            {insights.skillLevel === 'beginner' && 'Principiante'}
            {insights.skillLevel === 'intermediate' && 'Intermedio'}
            {insights.skillLevel === 'advanced' && 'Avanzado'}
            {insights.skillLevel === 'expert' && 'Experto'}
          </span>
        </div>
      </div>
    );
  };
  
  // Función para renderizar fortalezas y debilidades
  const renderStrengthsWeaknesses = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="text-lg font-bold text-green-800 mb-2">Fortalezas</h3>
          <ul className="list-disc pl-5 text-green-700">
            {insights.strengths.map((strength, index) => (
              <li key={`strength-${index}`} className="mb-1">{strength}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-lg font-bold text-red-800 mb-2">Áreas de Mejora</h3>
          <ul className="list-disc pl-5 text-red-700">
            {insights.weaknesses.map((weakness, index) => (
              <li key={`weakness-${index}`} className="mb-1">{weakness}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  // Función para renderizar recomendaciones
  const renderRecommendations = () => {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Recomendaciones Personalizadas</h3>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <ul className="list-decimal pl-5 text-blue-700">
            {insights.recommendations.map((recommendation, index) => (
              <li key={`recommendation-${index}`} className="mb-2">{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  // Función para renderizar patrones detectados
  const renderPatterns = () => {
    if (!insights.patterns || insights.patterns.length === 0) {
      return null;
    }
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Patrones de Juego Detectados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {insights.patterns.map((pattern, index) => (
            <div 
              key={`pattern-${index}`} 
              className="bg-purple-50 p-3 rounded-lg border border-purple-100"
            >
              <div className="font-bold text-purple-800">{pattern.name}</div>
              <div className="text-sm text-purple-700 mb-1">{pattern.description}</div>
              <div className="w-full bg-purple-200 rounded-full h-1.5">
                <div 
                  className="bg-purple-600 h-1.5 rounded-full" 
                  style={{ width: `${pattern.frequency * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-right mt-1 text-purple-600">
                {Math.round(pattern.frequency * 100)}% de tus movimientos
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Función para renderizar comparación con el promedio
  const renderComparison = () => {
    if (!insights.comparisonToAverage) {
      return null;
    }
    
    const { score, time, efficiency } = insights.comparisonToAverage;
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Comparación con Otros Jugadores</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Puntuación</div>
            <div className={`text-xl font-bold ${score >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {score >= 0 ? '+' : ''}{score.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">
              {score >= 0 ? 'Por encima del promedio' : 'Por debajo del promedio'}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Tiempo de Juego</div>
            <div className={`text-xl font-bold ${time >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {time >= 0 ? '+' : ''}{time.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">
              {time >= 0 ? 'Por encima del promedio' : 'Por debajo del promedio'}
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Eficiencia</div>
            <div className={`text-xl font-bold ${efficiency >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {efficiency >= 0 ? '+' : ''}{efficiency.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">
              {efficiency >= 0 ? 'Más eficiente que el promedio' : 'Menos eficiente que el promedio'}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Función para renderizar el mapa de calor
  const renderHeatmap = () => {
    if (!insights.heatmap || !insights.heatmap.positions || insights.heatmap.positions.length === 0) {
      return null;
    }
    
    return (
      <div className="mb-6">
        <HeatmapVisualizer 
          positions={insights.heatmap.positions}
          difficulty={difficulty}
          width={300}
          height={300}
        />
      </div>
    );
  };
  
  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-md border border-gray-100 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Análisis de IA de tu Estilo de Juego</h2>
      
      {renderSkillLevel()}
      {renderStrengthsWeaknesses()}
      {renderRecommendations()}
      {renderPatterns()}
      {renderComparison()}
      {renderHeatmap()}
      
      <div className="text-xs text-gray-500 text-center mt-4">
        Análisis generado el {new Date(insights.timestamp).toLocaleDateString()} a las {new Date(insights.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default memo(AIInsights); 