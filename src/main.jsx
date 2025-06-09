import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './App.scss'
import { Hub } from "nerdy-lib";

const getFooter = () => {
  return (
    <div className="footer">
      <a href="https://github.com/nerdytoolbox/bg-play-next/issues/new?template=ISSUE_TEMPLATE.md">Report issues / Feature requests</a>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Hub footer={getFooter()}>
      <App />
    </Hub>
  </StrictMode>,
)
