import React, { memo, useState, useEffect } from 'react';
import { DifficultyLevel } from '../types/game';

interface PersonalizedRecommendationsProps {
  onGetRecommendations: () => Promise<{
    difficulty?: DifficultyLevel;
    practiceAreas: string[];
    suggestedTechniques: string[];
  } | null>;
  onChangeDifficulty?: (difficulty: DifficultyLevel) => void;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  onGetRecommendations,
  onChangeDifficulty
}) => {
  const [recommendations, setRecommendations] = useState<{
    difficulty?: DifficultyLevel;
    practiceAreas: string[];
    suggestedTechniques: string[];
  } | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar recomendaciones al montar el componente
  useEffect(() => {
    fetchRecommendations();
  }, []);
  
  // Función para obtener recomendaciones
  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await onGetRecommendations();
      setRecommendations(data);
    } catch (err) {
      setError('Error al obtener recomendaciones personalizadas');
      console.error('Error al obtener recomendaciones:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Función para aplicar la dificultad recomendada
  const applyRecommendedDifficulty = () => {
    if (recommendations?.difficulty && onChangeDifficulty) {
      onChangeDifficulty(recommendations.difficulty);
    }
  };
  
  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg p-4 shadow-md border border-gray-100 mb-6">
        <div className="flex flex-col items-center justify-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Generando recomendaciones personalizadas...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full bg-white rounded-lg p-4 shadow-md border border-red-200 mb-6">
        <div className="bg-red-50 p-3 rounded-lg">
          <h3 className="text-lg font-bold text-red-700 mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
          <button
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            onClick={fetchRecommendations}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  
  if (!recommendations) {
    return (
      <div className="w-full bg-white rounded-lg p-4 shadow-md border border-gray-100 mb-6">
        <div className="flex flex-col items-center justify-center py-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={fetchRecommendations}
          >
            Obtener Recomendaciones Personalizadas
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-white rounded-lg p-4 shadow-md border border-gray-100 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Recomendaciones Personalizadas</h2>
      
      {recommendations.difficulty && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Dificultad Recomendada</h3>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex flex-col sm:flex-row justify-between items-center">
            <div>
              <p className="text-blue-800 mb-2">
                Basado en tu estilo de juego, te recomendamos jugar en dificultad:
              </p>
              <div className="text-xl font-bold text-blue-700">
                {recommendations.difficulty === 'EASY' && 'Fácil'}
                {recommendations.difficulty === 'MEDIUM' && 'Media'}
                {recommendations.difficulty === 'HARD' && 'Difícil'}
              </div>
            </div>
            
            {onChangeDifficulty && (
              <button
                className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={applyRecommendedDifficulty}
              >
                Aplicar Dificultad
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Áreas de Práctica Recomendadas</h3>
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <ul className="list-disc pl-5 text-green-700">
            {recommendations.practiceAreas.map((area, index) => (
              <li key={`area-${index}`} className="mb-2">{area}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Técnicas Sugeridas</h3>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <ul className="list-decimal pl-5 text-purple-700">
            {recommendations.suggestedTechniques.map((technique, index) => (
              <li key={`technique-${index}`} className="mb-2">{technique}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          onClick={fetchRecommendations}
        >
          Actualizar Recomendaciones
        </button>
      </div>
    </div>
  );
};

export default memo(PersonalizedRecommendations); 