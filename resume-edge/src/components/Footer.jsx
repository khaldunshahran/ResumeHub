// Footer component with collaboration and export options
import { useState, useRef } from 'react'
import html2pdf from 'html2pdf.js'
import '../styles/Footer.css'

const Footer = () => {
  // Collaboration state
  const [inviteEmail, setInviteEmail] = useState('')
  
  // Premium status state
  const [isPremium, setIsPremium] = useState(false)
  
  // Tooltip state
  const [showTooltip, setShowTooltip] = useState({
    word: false,
    png: false
  })

  // Handle collaboration
  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Sharing resume...')
  }

  const handleInvite = (e) => {
    if (e.key === 'Enter') {
      // TODO: Implement invite functionality
      console.log('Inviting:', inviteEmail)
      setInviteEmail('')
    }
  }

  // PDF export handler
  const handleExportPDF = () => {
    // Get the main canvas element
    const element = document.querySelector('.main-canvas')
    
    if (!element) {
      console.error('Resume content not found')
      return
    }
    
    // Configure PDF options
    const options = {
      margin: 10,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }
    
    // Generate and download PDF
    html2pdf().from(element).set(options).save()
    
    console.log('Exporting as PDF...')
  }
  
  // Word export handler (premium feature)
  const handleExportWord = () => {
    if (!isPremium) {
      return
    }
    
    // TODO: Implement Word export functionality
    console.log('Exporting as Word...')
  }
  
  // PNG export handler (premium feature)
  const handleExportPNG = () => {
    if (!isPremium) {
      return
    }
    
    // TODO: Implement PNG export functionality
    console.log('Exporting as PNG...')
  }
  
  // Toggle premium status (for demo purposes)
  const togglePremium = () => {
    setIsPremium(!isPremium)
  }
  
  // Show tooltip for premium features
  const handleShowTooltip = (type, show) => {
    setShowTooltip(prev => ({
      ...prev,
      [type]: show
    }))
  }

  return (
    <footer className="footer">
      {/* Collaboration section */}
      <div className="collab-section">
        <button 
          className="share-button"
          onClick={handleShare}
          aria-label="Share resume"
        >
          <span className="icon">🔗</span>
          Share
        </button>
        <input
          type="email"
          className="invite-input"
          placeholder="Invite via email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          onKeyPress={handleInvite}
          aria-label="Invite collaborator email"
        />
      </div>

      {/* Export section */}
      <div className="export-section">
        <button 
          className="export-button primary"
          onClick={handleExportPDF}
          aria-label="Export as PDF"
        >
          <span className="icon">📄</span>
          PDF
        </button>
        
        <div className="tooltip-container">
          <button 
            className={`export-button ${isPremium ? 'primary' : 'secondary'}`}
            onClick={handleExportWord}
            disabled={!isPremium}
            onMouseEnter={() => !isPremium && handleShowTooltip('word', true)}
            onMouseLeave={() => !isPremium && handleShowTooltip('word', false)}
            aria-label="Export as Word document"
          >
            <span className="icon">📝</span>
            Word
          </button>
          {showTooltip.word && !isPremium && (
            <div className="tooltip">Upgrade for Word export</div>
          )}
        </div>
        
        <div className="tooltip-container">
          <button 
            className={`export-button ${isPremium ? 'primary' : 'secondary'}`}
            onClick={handleExportPNG}
            disabled={!isPremium}
            onMouseEnter={() => !isPremium && handleShowTooltip('png', true)}
            onMouseLeave={() => !isPremium && handleShowTooltip('png', false)}
            aria-label="Export as PNG image"
          >
            <span className="icon">🖼️</span>
            PNG
          </button>
          {showTooltip.png && !isPremium && (
            <div className="tooltip">Upgrade for PNG export</div>
          )}
        </div>
        
        {/* Premium toggle (for demo purposes) */}
        <button 
          className={`premium-toggle ${isPremium ? 'active' : ''}`}
          onClick={togglePremium}
          aria-label={isPremium ? "Disable premium" : "Enable premium"}
        >
          <span className="icon">⭐</span>
          {isPremium ? 'Premium' : 'Free'}
        </button>
      </div>
    </footer>
  )
}

export default Footer 