import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useGameStore } from './store/gameStore'

// Dev helper — expose store on window for testing
if (import.meta.env.DEV) {
  window.__store = useGameStore
}

createRoot(document.getElementById('root')).render(<App />)
