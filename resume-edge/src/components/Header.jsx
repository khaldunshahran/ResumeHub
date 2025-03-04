// Header component for ResumeEdge
import { useState } from 'react'
import '../styles/Header.css'

const Header = () => {
  // State for dark/light mode
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Toggle dark/light mode
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode)
    // TODO: Implement theme switching logic
  }

  return (
    <header className="header">
      {/* Logo */}
      <a href="/" className="header-logo">
        ResumeEdge
      </a>

      {/* Right-side controls */}
      <div className="header-controls">
        {/* Mode toggle button */}
        <button 
          className="mode-toggle"
          onClick={toggleMode}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>

        {/* User profile circle */}
        <div className="user-profile" title="User profile">
          U
        </div>
      </div>
    </header>
  )
}

export default Header 