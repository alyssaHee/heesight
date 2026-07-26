import { useState } from 'react'
import { useProgress } from '@react-three/drei'
import './homeSection.css'
import linkedin from './assets/linkedin.png'
import github from './assets/github.png'
import email from './assets/mail.png'

function HomeSection() {

    return (
        <div className="home-section">
            <h1>Alyssa Hee</h1>
            <h2>ECE @ UofT</h2>
            <div className="button-box">
                <a href="https://www.linkedin.com/in/alyssa-hee" target="_blank" rel="noopener noreferrer">
                    <img className="link-btn" src={linkedin} alt="LinkedIn" />
                </a>
                <a href="https://github.com/alyssaHee" target="_blank" rel="noopener noreferrer">
                    <img className="link-btn" src={github} alt="GitHub" />
                </a>
                <a href="mailto:alyssa.hee@mail.utoronto.ca" target="_blank" rel="noopener noreferrer">
                    <img className="link-btn" src={email} alt="Email" />
                </a>
            </div>
        </div>
    )
}

export default HomeSection