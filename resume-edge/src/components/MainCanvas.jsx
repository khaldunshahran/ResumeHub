// Main canvas component for resume preview
import { useState, useEffect } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import '../styles/MainCanvas.css'

const MainCanvas = ({ template = 'classic', resumeData, onUpdateResumeData }) => {
  // Speech recognition hook
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()
  
  // Check if browser supports speech recognition
  const speechRecognitionSupported = browserSupportsSpeechRecognition !== false
  
  // State for resume sections (local state that syncs with parent)
  const [contact, setContact] = useState(resumeData.contact || '')
  const [skills, setSkills] = useState(resumeData.skills || '')
  
  // State for multi-item sections
  const [experience, setExperience] = useState(resumeData.experience || [
    { id: 1, title: '', company: '', period: '', description: '' }
  ])
  
  const [education, setEducation] = useState(resumeData.education || [
    { id: 1, degree: '', institution: '', year: '', description: '' }
  ])

  // State for section collapse
  const [collapsedSections, setCollapsedSections] = useState({
    contact: false,
    experience: false,
    skills: false,
    education: false
  })
  
  // Voice input states
  const [isRecording, setIsRecording] = useState(false)
  const [activeSection, setActiveSection] = useState(null)
  const [activeSectionField, setActiveSectionField] = useState(null)
  const [activeItemId, setActiveItemId] = useState(null)
  
  // Sync local state with parent component when props change
  useEffect(() => {
    setContact(resumeData.contact || '')
    setSkills(resumeData.skills || '')
    setExperience(resumeData.experience || [{ id: 1, title: '', company: '', period: '', description: '' }])
    setEducation(resumeData.education || [{ id: 1, degree: '', institution: '', year: '', description: '' }])
  }, [resumeData])
  
  // Update parent component with local state changes
  useEffect(() => {
    onUpdateResumeData({
      contact,
      skills,
      experience,
      education
    })
  }, [contact, skills, experience, education, onUpdateResumeData])
  
  // Handle transcript changes when voice input is active
  useEffect(() => {
    if (!listening && isRecording && transcript) {
      // Apply transcribed text to the active section
      applyTranscribedText(transcript)
      
      // Reset recording state
      setIsRecording(false)
      setActiveSection(null)
      setActiveSectionField(null)
      setActiveItemId(null)
      resetTranscript()
    }
  }, [listening, transcript, isRecording])

  // Toggle section collapse
  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Handle experience updates
  const updateExperience = (id, field, value) => {
    setExperience(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  // Handle education updates
  const updateEducation = (id, field, value) => {
    setEducation(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  // Add new experience item
  const addExperience = () => {
    const newId = experience.length > 0 
      ? Math.max(...experience.map(item => item.id)) + 1 
      : 1
    
    setExperience(prev => [
      ...prev, 
      { id: newId, title: '', company: '', period: '', description: '' }
    ])
  }

  // Add new education item
  const addEducation = () => {
    const newId = education.length > 0 
      ? Math.max(...education.map(item => item.id)) + 1 
      : 1
    
    setEducation(prev => [
      ...prev, 
      { id: newId, degree: '', institution: '', year: '', description: '' }
    ])
  }

  // Remove experience item
  const removeExperience = (id) => {
    setExperience(prev => prev.filter(item => item.id !== id))
  }

  // Remove education item
  const removeEducation = (id) => {
    setEducation(prev => prev.filter(item => item.id !== id))
  }

  // Voice input handler
  const handleVoiceInput = () => {
    if (!speechRecognitionSupported) {
      alert('Your browser does not support speech recognition.')
      return
    }
    
    // Find the first non-collapsed section to use as active section
    let section = null
    let field = null
    let itemId = null
    
    if (!collapsedSections.contact) {
      section = 'contact'
    } else if (!collapsedSections.skills) {
      section = 'skills'
    } else if (!collapsedSections.experience) {
      section = 'experience'
      field = 'description'
      itemId = experience[0]?.id
    } else if (!collapsedSections.education) {
      section = 'education'
      field = 'description'
      itemId = education[0]?.id
    } else {
      // If all sections are collapsed, open contact
      toggleSection('contact')
      section = 'contact'
    }
    
    // Set active section for voice input
    setActiveSection(section)
    setActiveSectionField(field)
    setActiveItemId(itemId)
    
    // Start recording
    setIsRecording(true)
    resetTranscript()
    SpeechRecognition.startListening({ continuous: true })
  }
  
  // Stop voice recording
  const stopVoiceRecording = () => {
    SpeechRecognition.stopListening()
  }
  
  // Apply transcribed text to the active section
  const applyTranscribedText = (text) => {
    if (!activeSection) return
    
    switch (activeSection) {
      case 'contact':
        setContact(prev => prev ? `${prev}\n${text}` : text)
        break
      case 'skills':
        setSkills(prev => prev ? `${prev}\n${text}` : text)
        break
      case 'experience':
        if (activeSectionField && activeItemId) {
          updateExperience(activeItemId, activeSectionField, text)
        }
        break
      case 'education':
        if (activeSectionField && activeItemId) {
          updateEducation(activeItemId, activeSectionField, text)
        }
        break
      default:
        break
    }
  }
  
  // Set active field for voice input
  const setActiveFieldForVoice = (section, field = null, itemId = null) => {
    if (isRecording) return
    
    setActiveSection(section)
    setActiveSectionField(field)
    setActiveItemId(itemId)
  }

  // Get template class name
  const getTemplateClass = () => {
    switch(template) {
      case 'modern-tech':
        return 'template-modern-tech'
      case 'creative':
        return 'template-creative'
      case 'classic':
      default:
        return 'template-classic'
    }
  }

  // Render sections based on template
  const renderSections = () => {
    const sections = (
      <>
        {/* Contact Section */}
        <div className="resume-section">
          <div 
            className="section-header"
            onClick={() => toggleSection('contact')}
          >
            <div className="section-title">
              <span className="section-icon">👤</span>
              Contact
            </div>
            <button className="action-button">
              {collapsedSections.contact ? '➕' : '➖'}
            </button>
          </div>
          
          <div className={`section-content ${collapsedSections.contact ? 'collapsed' : ''}`}>
            <textarea
              className={`section-input ${activeSection === 'contact' && isRecording ? 'recording' : ''}`}
              placeholder="Enter your contact information..."
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onClick={() => setActiveFieldForVoice('contact')}
              aria-label="Contact information"
            />
          </div>
        </div>

        {/* Experience Section */}
        <div className="resume-section">
          <div 
            className="section-header"
            onClick={() => toggleSection('experience')}
          >
            <div className="section-title">
              <span className="section-icon">💼</span>
              Experience
            </div>
            <button className="action-button">
              {collapsedSections.experience ? '➕' : '➖'}
            </button>
          </div>
          
          <div className={`section-content ${collapsedSections.experience ? 'collapsed' : ''}`}>
            {experience.map(item => (
              <div key={item.id} className="section-item">
                <button 
                  className="remove-button"
                  onClick={() => removeExperience(item.id)}
                  aria-label="Remove experience"
                >
                  ✕
                </button>
                
                <input
                  type="text"
                  className={`item-input ${activeSection === 'experience' && activeSectionField === 'title' && activeItemId === item.id && isRecording ? 'recording' : ''}`}
                  placeholder="Job Title"
                  value={item.title}
                  onChange={(e) => updateExperience(item.id, 'title', e.target.value)}
                  onClick={() => setActiveFieldForVoice('experience', 'title', item.id)}
                />
                
                <input
                  type="text"
                  className={`item-input ${activeSection === 'experience' && activeSectionField === 'company' && activeItemId === item.id && isRecording ? 'recording' : ''}`}
                  placeholder="Company"
                  value={item.company}
                  onChange={(e) => updateExperience(item.id, 'company', e.target.value)}
                  onClick={() => setActiveFieldForVoice('experience', 'company', item.id)}
                />
                
                <input
                  type="text"
                  className={`item-input ${activeSection === 'experience' && activeSectionField === 'period' && activeItemId === item.id && isRecording ? 'recording' : ''}`}
                  placeholder="Period (e.g., 2020-2023)"
                  value={item.period}
                  onChange={(e) => updateExperience(item.id, 'period', e.target.value)}
                  onClick={() => setActiveFieldForVoice('experience', 'period', item.id)}
                />
                
                <textarea
                  className={`section-input ${activeSection === 'experience' && activeSectionField === 'description' && activeItemId === item.id && isRecording ? 'recording' : ''}`}
                  placeholder="Job Description"
                  value={item.description}
                  onChange={(e) => updateExperience(item.id, 'description', e.target.value)}
                  onClick={() => setActiveFieldForVoice('experience', 'description', item.id)}
                />
              </div>
            ))}
            
            <button 
              className="add-button"
              onClick={addExperience}
            >
              + Add Experience
            </button>
          </div>
        </div>

        {/* Skills Section */}
        <div className="resume-section">
          <div 
            className="section-header"
            onClick={() => toggleSection('skills')}
          >
            <div className="section-title">
              <span className="section-icon">🎯</span>
              Skills
            </div>
            <button className="action-button">
              {collapsedSections.skills ? '➕' : '➖'}
            </button>
          </div>
          
          <div className={`section-content ${collapsedSections.skills ? 'collapsed' : ''}`}>
            <textarea
              className={`section-input ${activeSection === 'skills' && isRecording ? 'recording' : ''}`}
              placeholder="List your skills (e.g., JavaScript, React, UI Design)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              onClick={() => setActiveFieldForVoice('skills')}
              aria-label="Skills"
            />
          </div>
        </div>

        {/* Education Section */}
        <div className="resume-section">
          <div 
            className="section-header"
            onClick={() => toggleSection('education')}
          >
            <div className="section-title">
              <span className="section-icon">🎓</span>
              Education
            </div>
            <button className="action-button">
              {collapsedSections.education ? '➕' : '➖'}
            </button>
          </div>
          
          <div className={`section-content ${collapsedSections.education ? 'collapsed' : ''}`}>
            {education.map(item => (
              <div key={item.id} className="section-item">
                <button 
                  className="remove-button"
                  onClick={() => removeEducation(item.id)}
                  aria-label="Remove education"
                >
                  ✕
                </button>
                
                <input
                  type="text"
                  className={`item-input ${activeSection === 'education' && activeSectionField === 'degree' && activeItemId === item.id && isRecording ? 'recording' : ''}`}
                  placeholder="Degree"
                  value={item.degree}
                  onChange={(e) => updateEducation(item.id, 'degree', e.target.value)}
                  onClick={() => setActiveFieldForVoice('education', 'degree', item.id)}
                />
                
                <input
                  type="text"
                  className={`item-input ${activeSection === 'education' && activeSectionField === 'institution' && activeItemId === item.id && isRecording ? 'recording' : ''}`}
                  placeholder="Institution"
                  value={item.institution}
                  onChange={(e) => updateEducation(item.id, 'institution', e.target.value)}
                  onClick={() => setActiveFieldForVoice('education', 'institution', item.id)}
                />
                
                <input
                  type="text"
                  className={`item-input ${activeSection === 'education' && activeSectionField === 'year' && activeItemId === item.id && isRecording ? 'recording' : ''}`}
                  placeholder="Year"
                  value={item.year}
                  onChange={(e) => updateEducation(item.id, 'year', e.target.value)}
                  onClick={() => setActiveFieldForVoice('education', 'year', item.id)}
                />
                
                <textarea
                  className={`section-input ${activeSection === 'education' && activeSectionField === 'description' && activeItemId === item.id && isRecording ? 'recording' : ''}`}
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateEducation(item.id, 'description', e.target.value)}
                  onClick={() => setActiveFieldForVoice('education', 'description', item.id)}
                />
              </div>
            ))}
            
            <button 
              className="add-button"
              onClick={addEducation}
            >
              + Add Education
            </button>
          </div>
        </div>
      </>
    )

    // For Modern Tech template, wrap sections in a grid container
    if (template === 'modern-tech') {
      return <div className="main-canvas-content">{sections}</div>
    }

    return sections
  }

  return (
    <main className={`main-canvas ${getTemplateClass()}`}>
      {renderSections()}

      {/* Voice input button */}
      <button
        className={`voice-input-button ${isRecording ? 'recording' : ''} ${!speechRecognitionSupported ? 'disabled' : ''}`}
        onClick={isRecording ? stopVoiceRecording : handleVoiceInput}
        aria-label={isRecording ? "Stop recording" : "Activate voice input"}
        disabled={!speechRecognitionSupported}
      >
        {isRecording ? "Stop" : "Speak"}
      </button>
      
      {/* Recording overlay */}
      {isRecording && (
        <div className="recording-overlay">
          <div className="recording-content">
            <div className="recording-indicator">
              <span className="recording-pulse"></span>
              Recording...
            </div>
            <p className="recording-transcript">{transcript}</p>
            <p className="recording-target">
              Target: {activeSection} 
              {activeSectionField ? ` - ${activeSectionField}` : ''}
            </p>
          </div>
        </div>
      )}
    </main>
  )
}

export default MainCanvas 