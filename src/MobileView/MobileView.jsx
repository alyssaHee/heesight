import './mobileview.css'

function MobileView() {
    return (
        <div className="mobile-view">
            <div className="iframe-container">
                <iframe
                    title="Mobile View"
                    className="mobile-iframe"
                    scrolling="no"
                    src="https://scope-screen.vercel.app/"
                //src="http://localhost:5174/"
                />
            </div>

            <div className="mobile-message">
                <p>
                    Please rotate to landscape mode to view.
                </p>
            </div>
        </div>
    )
}

export default MobileView
