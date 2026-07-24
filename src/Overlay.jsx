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
                <p className={`loading-text ${isRevealed ? 'revealed' : ''} small-overlay-text hide-on-desktop`}>This website is not optimized for mobile view. Please rotate to landscape mode for the best experience. Use tap and drag to navigate!</p>
                {progress >= 100 && !isRevealed && (
                    <div className="button-outer">
                        <button
                            onClick={handleReveal}
                            className="overlay-button"
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