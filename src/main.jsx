import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
)

// background: 'radial-gradient(circle at center, #362519 0%, #1c1009 70%)', width: '100vw', height: '100vh'