import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import { Hub } from "nerdy-lib";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Hub title="Boardgames: What to play next?">
      <App />
    </Hub>
  </StrictMode>,
)
