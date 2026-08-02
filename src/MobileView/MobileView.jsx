import { useEffect, useMemo, useRef, useState } from 'react'
import './mobileview.css'
import rotateIcon from '../assets/rotate.png'

function MobileView() {
    const iframeRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    // Track iframe DOM is loaded and ready to receive messages
    const [isIframeLoaded, setIsIframeLoaded] = useState(false);

    useEffect(() => {
        const updateMobileState = () => {
            const mobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
            setIsMobile(mobile);
        };

        updateMobileState();
        window.addEventListener('resize', updateMobileState);

        return () => {
            window.removeEventListener('resize', updateMobileState);
        };
    }, []);

    const iframeSrc = "http://scope-screen.vercel.app/";

    useEffect(() => {
        // Stop if iframe DOM not ready
        if (!iframeRef.current?.contentWindow || !isIframeLoaded) return;

        iframeRef.current.contentWindow.postMessage(
            {
                type: 'device-info',
                isMobile,
            },
            'http://scope-screen.vercel.app'
        );
    }, [isMobile, isIframeLoaded]);

    return (
        <div className="mobile-view">
            <div className="iframe-container">
                <iframe
                    ref={iframeRef}
                    title="Mobile View"
                    className="mobile-iframe"
                    scrolling="no"
                    src={iframeSrc}
                    onLoad={() => setIsIframeLoaded(true)}
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
