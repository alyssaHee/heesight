import { StrictMode, useCallback, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { inject } from '@vercel/analytics';
import Scope from './Scope.jsx'
import Overlay from './Overlay.jsx'
import './index.css'

function App() {
  useEffect(() => {
    inject();
  }, []);

  return (
    <div className="app">
      <Overlay />
      <Canvas
        style={{
          background:
            'radial-gradient(circle at center, #cab3a1 0%, #ab9b91 70%)',
          width: '100vw',
          height: '100vh',
        }}
        gl={{ alpha: true }}
        camera={{
          fov: 15,
          near: 0.1,
          far: 2000,
          position: [3, 1.5, 4],
        }}
      >
        <Scope />
      </Canvas>
    </div>
  )
}

export default App