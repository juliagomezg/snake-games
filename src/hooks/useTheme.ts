import { useState, useEffect } from 'react';
import { ThemeOption } from '../components/ThemeSelector';

const STORAGE_KEY = 'snake-game-theme';
const HIGH_CONTRAST_KEY = 'snake-game-high-contrast';

interface ThemeColors {
  snakeHead: string;
  snakeBody: string;
  apple: string;
  boardBg: string;
  boardBorder: string;
}

const themeColors: Record<ThemeOption, ThemeColors> = {
  default: {
    snakeHead: '#0d9488', // teal-600
    snakeBody: '#10b981', // green-500
    apple: '#ef4444',     // red-500
    boardBg: '#f3f4f6',   // gray-100
    boardBorder: '#e5e7eb' // gray-200
  },
  dark: {
    snakeHead: '#4f46e5', // indigo-600
    snakeBody: '#2563eb', // blue-600
    apple: '#a855f7',     // purple-500
    boardBg: '#1f2937',   // gray-800
    boardBorder: '#374151' // gray-700
  },
  neon: {
    snakeHead: '#d946ef', // fuchsia-500
    snakeBody: '#8b5cf6', // violet-500
    apple: '#facc15',     // yellow-400
    boardBg: '#18181b',   // zinc-900
    boardBorder: '#27272a' // zinc-800
  },
  retro: {
    snakeHead: '#d97706', // amber-600
    snakeBody: '#ea580c', // orange-600
    apple: '#dc2626',     // red-600
    boardBg: '#fef3c7',   // amber-100
    boardBorder: '#fde68a' // amber-200
  },
  pastel: {
    snakeHead: '#c084fc', // purple-400
    snakeBody: '#f472b6', // pink-400
    apple: '#60a5fa',     // blue-400
    boardBg: '#f5f3ff',   // violet-50
    boardBorder: '#ede9fe' // violet-100
  }
};

// Colores de alto contraste
const highContrastColors: ThemeColors = {
  snakeHead: '#000000', // Negro
  snakeBody: '#000000', // Negro
  apple: '#ff0000',     // Rojo brillante
  boardBg: '#ffffff',   // Blanco
  boardBorder: '#000000' // Negro
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeOption>('default');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  
  // Cargar tema y configuración de alto contraste guardados
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme && Object.keys(themeColors).includes(savedTheme)) {
      setTheme(savedTheme as ThemeOption);
    }
    
    const savedHighContrast = localStorage.getItem(HIGH_CONTRAST_KEY);
    if (savedHighContrast) {
      setHighContrast(savedHighContrast === 'true');
    }
    
    // Aplicar los colores según la configuración
    applyThemeColors(
      savedTheme as ThemeOption || 'default', 
      savedHighContrast === 'true'
    );
  }, []);
  
  // Aplicar colores del tema al CSS
  const applyThemeColors = (selectedTheme: ThemeOption, useHighContrast: boolean = false) => {
    const colors = useHighContrast ? highContrastColors : themeColors[selectedTheme];
    
    document.documentElement.style.setProperty('--color-snake-head', colors.snakeHead);
    document.documentElement.style.setProperty('--color-snake-body', colors.snakeBody);
    document.documentElement.style.setProperty('--color-apple', colors.apple);
    document.documentElement.style.setProperty('--color-board-bg', colors.boardBg);
    document.documentElement.style.setProperty('--color-board-border', colors.boardBorder);
    
    // Aplicar clase de alto contraste al body para estilos adicionales
    if (useHighContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };
  
  // Cambiar el tema
  const changeTheme = (newTheme: ThemeOption) => {
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyThemeColors(newTheme, highContrast);
  };
  
  // Activar/desactivar el modo de alto contraste
  const toggleHighContrast = () => {
    const newHighContrast = !highContrast;
    setHighContrast(newHighContrast);
    localStorage.setItem(HIGH_CONTRAST_KEY, String(newHighContrast));
    applyThemeColors(theme, newHighContrast);
  };
  
  return {
    theme,
    highContrast,
    changeTheme,
    toggleHighContrast
  };
}; 