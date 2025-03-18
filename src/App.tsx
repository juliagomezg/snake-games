import SnakeGame from './components/SnakeGame'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8 game-container overflow-auto">
      <SnakeGame />
    </div>
  )
}

export default App
