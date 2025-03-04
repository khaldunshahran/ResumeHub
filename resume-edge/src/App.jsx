// Root component for ResumeEdge application
import { useState } from 'react'
import './styles/App.css'

// Import components
import Header from './components/Header'
import LeftSidebar from './components/LeftSidebar'
import MainCanvas from './components/MainCanvas'
import RightSidebar from './components/RightSidebar'
import Footer from './components/Footer'

function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true)
  
  // Template state
  const [template, setTemplate] = useState('classic')
  
  // Resume data state (shared between MainCanvas and RightSidebar)
  const [resumeData, setResumeData] = useState({
    contact: '',
    skills: '',
    experience: [{ id: 1, title: '', company: '', period: '', description: '' }],
    education: [{ id: 1, degree: '', institution: '', year: '', description: '' }]
  })

  // Theme toggle handler
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // TODO: Implement theme switching logic
  }
  
  // Update resume data handler
  const updateResumeData = (newData) => {
    setResumeData(newData)
  }
  
  // Add AI-generated content to resume
  const addContentToResume = (section, content) => {
    if (section === 'skills') {
      // Add to skills section
      const updatedSkills = resumeData.skills 
        ? `${resumeData.skills}\n• ${content}`
        : `• ${content}`
      
      setResumeData({
        ...resumeData,
        skills: updatedSkills
      })
    } else if (section === 'experience') {
      // Add as a new experience item
      const newId = resumeData.experience.length > 0 
        ? Math.max(...resumeData.experience.map(item => item.id)) + 1 
        : 1
      
      const newExperience = {
        id: newId,
        title: 'New Position',
        company: 'Company Name',
        period: 'Present',
        description: content
      }
      
      setResumeData({
        ...resumeData,
        experience: [...resumeData.experience, newExperience]
      })
    }
  }

  return (
    <div className="app">
      {/* Header with theme toggle */}
      <Header isDarkMode={isDarkMode} onThemeToggle={toggleTheme} />

      {/* Main content area */}
      <main className="main-container">
        {/* Navigation sidebar */}
        <LeftSidebar 
          currentTemplate={template} 
          onTemplateChange={setTemplate} 
        />

        {/* Resume canvas */}
        <div className="content-area">
          <MainCanvas 
            template={template} 
            resumeData={resumeData}
            onUpdateResumeData={updateResumeData}
          />
        </div>

        {/* Tools sidebar */}
        <RightSidebar 
          resumeData={resumeData} 
          onAddContent={addContentToResume}
        />
      </main>

      {/* Footer with actions */}
      <Footer />
    </div>
  )
}

export default App
