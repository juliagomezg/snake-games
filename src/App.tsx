import React from 'react';
import SnakeGame from './components/SnakeGame';

function App() {
  return (
    <div className="flex justify-center items-center min-h-screen p-5 bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="w-full max-w-4xl">
        <SnakeGame />
      </div>
    </div>
  );
}

export default App;
