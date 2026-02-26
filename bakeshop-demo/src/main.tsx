import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
import { tinyHighlightStyles, tableGridStyles, accentSwatchStyles } from '@pinkpixel/marzipan'

// Inject plugin companion CSS globally
const hlStyle = document.createElement('style')
hlStyle.textContent = tinyHighlightStyles + tableGridStyles + accentSwatchStyles
document.head.appendChild(hlStyle)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
