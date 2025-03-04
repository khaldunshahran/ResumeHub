// Left sidebar navigation component
import { useState } from 'react'
import '../styles/LeftSidebar.css'

const LeftSidebar = ({ currentTemplate, onTemplateChange }) => {
  // Navigation items configuration
  const navItems = [
    { icon: '🏠', label: 'Home', id: 'home' },
    { icon: '✍️', label: 'Resume', id: 'resume' },
    { icon: '🌐', label: 'Branding', id: 'branding' },
    { icon: '👥', label: 'Collaborate', id: 'collab' },
    { icon: '⬇️', label: 'Export', id: 'export' }
  ]

  // Template options
  const templates = [
    { id: 'classic', name: 'Classic', icon: '📄' },
    { id: 'modern-tech', name: 'Modern Tech', icon: '💻' },
    { id: 'creative', name: 'Creative', icon: '🎨' }
  ]

  // Active navigation state
  const [activeNav, setActiveNav] = useState('home')
  
  // Template dropdown state
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false)

  // Handle navigation click
  const handleNavClick = (id) => {
    setActiveNav(id)
    // TODO: Implement navigation logic
  }
  
  // Toggle template dropdown
  const toggleTemplateDropdown = () => {
    setIsTemplateDropdownOpen(!isTemplateDropdownOpen)
  }
  
  // Handle template selection
  const handleTemplateSelect = (templateId) => {
    onTemplateChange(templateId)
    setIsTemplateDropdownOpen(false)
  }

  return (
    <nav className="left-sidebar">
      {/* Navigation list */}
      <ul className="nav-list">
        {navItems.map(({ icon, label, id }) => (
          <li key={id} className="nav-item">
            <button
              className={`nav-button ${activeNav === id ? 'active' : ''}`}
              onClick={() => handleNavClick(id)}
              aria-label={label}
              title={label}
            >
              {icon}
            </button>
          </li>
        ))}
      </ul>
      
      {/* Template selector */}
      <div className="template-section">
        <button 
          className="template-button"
          onClick={toggleTemplateDropdown}
          aria-label="Select template"
          title="Select template"
        >
          ➕
        </button>
        
        {/* Template dropdown */}
        <div className={`template-dropdown ${isTemplateDropdownOpen ? '' : 'hidden'}`}>
          <div className="template-dropdown-header">
            Select Template
          </div>
          <ul className="template-list">
            {templates.map(template => (
              <li 
                key={template.id}
                className={`template-item ${currentTemplate === template.id ? 'active' : ''}`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <span className="template-icon">{template.icon}</span>
                {template.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default LeftSidebar 