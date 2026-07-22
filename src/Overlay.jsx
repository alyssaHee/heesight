import { useState } from 'react'
import { useProgress } from '@react-three/drei'
import './overlay.css'

function Overlay({ loaded }) {
    const { progress } = useProgress()
    const [isRevealed, setIsRevealed] = useState(false)
    const [isAnimationFinished, setIsAnimationFinished] = useState(false)

    const handleReveal = () => {
        setIsRevealed(true)
    }

    const handleAnimationFinished = () => {
        setIsAnimationFinished(true)
    }

    if (isAnimationFinished) {
        return null
    }

    return (
        <div className="overlay">
            < div className={`overlay-top-half ${isRevealed ? 'revealed' : ''}`
            }
                onTransitionEnd={handleAnimationFinished} ></div >
            <div className={`overlay-bottom-half ${isRevealed ? 'revealed' : ''}`}></div>
            <div className="overlay-info-container">
                <p className={`loading-text ${isRevealed ? 'revealed' : ''} hide-on-mobile`}>Use left click and drag to navigate!</p>
                <p className="small-overlay-text hide-on-desktop">This website is still being optimized for mobile view.<br />Please use a desktop browser for now</p>
                {progress >= 100 && !isRevealed && (
                    <div className="button-outer hide-on-mobile">
                        <button
                            onClick={handleReveal}
                            className="overlay-button hide-on-mobile"
                        >
                            Enter
                        </button>
                    </div>
                )}
            </div>
        </ div >
    )
}


export default Overlay