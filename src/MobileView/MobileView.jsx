import { useEffect, useMemo, useRef, useState } from 'react'
import './mobileview.css'
import rotateIcon from '../assets/rotate.png'

function MobileView() {
    const iframeRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    window.addEventListener('message', (event) => {
        if (event.data?.type === 'request-device-info') {
            event.source?.postMessage(
                { type: 'device-info', isMobile: /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) },
                event.origin
            )
        }
    })

    return (
        <div className="mobile-view">
            <div className="iframe-container">
                <iframe
                    title="Mobile View"
                    className="mobile-iframe"
                    scrolling="no"
                    src="http://scope-screen.vercel.app"
                />
            </div>

            <div className="mobile-message">
                <img
                    className="rotate-image"
                    src={rotateIcon}></img>
                <p>
                    Please rotate to landscape mode to view. To see 3D version of this site, please visit on desktop :&#41;
                </p>
            </div>
        </div>
    )
}

export default MobileView
