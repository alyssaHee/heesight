import { useState } from 'react'
import './overlay.css'

function Overlay({ loaded }) {
    return (
        <div className="overlay">
            <button className="overlay-button"
                disabled={!loaded}
                onClick={handleClick}>Enter</button>
            <p>Use left click and drag to navigate!</p>
        </div>
    )
}

function handleClick() {
    const overlay = document.querySelector('.overlay')
    overlay.style.display = 'none'
}

export default Overlay