import { StrictMode, useCallback, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { inject } from '@vercel/analytics';
import Scope from './Scope/Scope.jsx'
import Overlay from './Overlay/Overlay.jsx'
import HomeSection from './HomeSection/HomeSection.jsx'
import MobileView from './MobileView/MobileView.jsx'
import './index.css'

function App() {
  const [isLockedView, setIsLockedView] = useState(false)
  const [deviceContext, setDeviceContext] = useState('desktop')

  useEffect(() => {
    inject();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const initialDevice = params.get('device')

    if (initialDevice === 'mobile' || initialDevice === 'desktop') {
      setDeviceContext(initialDevice)
    }

    const handleMessage = (event) => {
      if (event.data?.type === 'device-info') {
        setDeviceContext(event.data.isMobile ? 'mobile' : 'desktop')
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const isMobileContext = deviceContext === 'mobile'

  return (
    <>
      <div className="desktop-only">
        <HomeSection isHidden={isLockedView} />
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
          <Scope onLockedChange={setIsLockedView} />
        </Canvas>
      </div>

      <div className="mobile-only">
        <MobileView />
      </div>
    </>
  )
}

export default App