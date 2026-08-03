import { useEffect, useMemo, useRef, useState } from 'react'
import './mobileview.css'
import rotateIcon from '../assets/rotate1.png'

function MobileView() {
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data?.type !== 'request-device-info') return

            event.source?.postMessage(
                {
                    type: 'device-info',
                    isMobile: /Android|iPhone|iPad|iPod/i.test(navigator.userAgent),
                },
                event.origin
            )
        }

        window.addEventListener('message', handleMessage)
        return () => window.removeEventListener('message', handleMessage)
    }, [])

    return (
        <div className="mobile-view">
            <div className="iframe-container">
                <iframe
                    title="Mobile View"
                    className="mobile-iframe"
                    scrolling="no"
                    src="https://scope-screen.vercel.app/"
                />
            </div>

            <div className="mobile-message">
                <img className="rotate-image" src={rotateIcon} alt="Rotate phone" />
                <p>
                    Please rotate to landscape mode to view. To see the 3D version of this site, please visit on desktop :)
                </p>
            </div>
        </div>
    )
}

export default MobileView
