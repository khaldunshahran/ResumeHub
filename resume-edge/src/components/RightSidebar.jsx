// Right sidebar tools component
import { useState, useEffect } from 'react'
import '../styles/RightSidebar.css'

const RightSidebar = ({ resumeData, onAddContent }) => {
  // Tool states
  const [jobDescription, setJobDescription] = useState('')
  const [matchScore, setMatchScore] = useState(0)
  const [suggestions, setSuggestions] = useState([])
  const [selectedIndustry, setSelectedIndustry] = useState('tech')
  const [selectedFont, setSelectedFont] = useState('helvetica')
  const [selectedColor, setSelectedColor] = useState('#1DA1F2')
  const [layoutColumns, setLayoutColumns] = useState(1)
  
  // AI content generation states
  const [generatedContent, setGeneratedContent] = useState('')
  const [targetSection, setTargetSection] = useState('skills')

  // Configuration options
  const industries = ['Tech', 'Marketing', 'Finance', 'Healthcare']
  const fonts = ['Helvetica', 'Arial', 'Roboto', 'Inter']
  const colors = ['#1DA1F2', '#FFFFFF', '#17BF63', '#F45D22']
  
  // Resume sections for AI content
  const resumeSections = ['Skills', 'Experience']

  // Calculate ATS score when job description or resume data changes
  useEffect(() => {
    if (jobDescription.trim() === '') {
      setMatchScore(0)
      setSuggestions([])
      return
    }
    
    // Calculate match score and suggestions
    calculateATSScore()
  }, [jobDescription, resumeData])

  // ATS scoring calculation
  const calculateATSScore = () => {
    // Extract all text from resume
    const resumeText = getResumeText()
    
    // Simple keyword matching algorithm
    const jobKeywords = extractKeywords(jobDescription.toLowerCase())
    const resumeKeywords = extractKeywords(resumeText.toLowerCase())
    
    // Calculate match percentage
    const matchedKeywords = jobKeywords.filter(keyword => 
      resumeKeywords.includes(keyword)
    )
    
    const matchPercentage = jobKeywords.length > 0 
      ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
      : 0
    
    setMatchScore(matchPercentage)
    
    // Generate suggestions (missing keywords)
    const missingSuggestions = generateSuggestions(jobKeywords, resumeKeywords)
    setSuggestions(missingSuggestions)
  }
  
  // Extract text from all resume sections
  const getResumeText = () => {
    const { contact, skills } = resumeData
    
    // Extract text from experience items
    const experienceText = resumeData.experience
      .map(item => `${item.title} ${item.company} ${item.description}`)
      .join(' ')
    
    // Extract text from education items
    const educationText = resumeData.education
      .map(item => `${item.degree} ${item.institution} ${item.description}`)
      .join(' ')
    
    return `${contact} ${skills} ${experienceText} ${educationText}`
  }
  
  // Extract keywords from text
  const extractKeywords = (text) => {
    // Remove common words and punctuation
    const commonWords = ['and', 'the', 'to', 'of', 'for', 'in', 'on', 'with', 'a', 'an']
    
    return text
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .filter(word => 
        word.length > 2 && // Only words longer than 2 characters
        !commonWords.includes(word) // Exclude common words
      )
  }
  
  // Generate suggestions based on missing keywords
  const generateSuggestions = (jobKeywords, resumeKeywords) => {
    // Find important keywords that are missing from resume
    const missingKeywords = jobKeywords.filter(keyword => 
      !resumeKeywords.includes(keyword) && 
      keyword.length > 3 // Only suggest significant keywords
    )
    
    // Create suggestion messages (limit to 3)
    const suggestions = missingKeywords
      .slice(0, 3)
      .map(keyword => `Add "${keyword}" to your resume`)
    
    return suggestions
  }

  // AI content generation
  const handleGenerate = () => {
    // Generate industry-specific content based on selected industry
    const content = generateIndustryContent(selectedIndustry)
    setGeneratedContent(content)
  }
  
  // Generate industry-specific content
  const generateIndustryContent = (industry) => {
    // Mock AI content generation with industry-specific bullet points
    const industryContent = {
      tech: [
        "Increased API performance by 20% through code optimization and caching strategies",
        "Developed scalable microservices architecture supporting 1M+ daily users",
        "Implemented CI/CD pipeline reducing deployment time by 40%",
        "Optimized database queries resulting in 30% faster page load times"
      ],
      marketing: [
        "Boosted social media engagement by 30% through targeted content strategy",
        "Designed and executed email campaigns with 25% higher open rates than industry average",
        "Increased conversion rates by 15% through A/B testing and UX improvements",
        "Managed $50K monthly ad budget achieving 3.5x ROI across platforms"
      ],
      finance: [
        "Analyzed market trends to develop investment strategies yielding 12% annual returns",
        "Reduced operational costs by 18% through process optimization and automation",
        "Managed $5M portfolio with diversified asset allocation strategy",
        "Developed financial models for accurate revenue forecasting within 5% margin of error"
      ],
      healthcare: [
        "Implemented patient management system reducing wait times by 35%",
        "Coordinated cross-functional teams to improve patient satisfaction scores by 28%",
        "Developed training protocols resulting in 40% reduction in procedural errors",
        "Managed clinical trials with 98% compliance rate to regulatory standards"
      ]
    }
    
    // Select a random bullet point from the industry
    const bullets = industryContent[industry] || industryContent.tech
    const randomIndex = Math.floor(Math.random() * bullets.length)
    return bullets[randomIndex]
  }
  
  // Add generated content to resume section
  const addContentToResume = () => {
    // Call the parent component's function to add content to the resume
    onAddContent(targetSection, generatedContent)
    
    // Clear generated content after adding
    setGeneratedContent('')
  }

  return (
    <aside className="right-sidebar">
      {/* ATS scoring section */}
      <div className="tool-section">
        <h3 className="tool-header">ATS Scoring</h3>
        <textarea
          className="ats-textarea"
          placeholder="Paste Job Description Here"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <div className={`match-score ${matchScore > 70 ? 'high-match' : matchScore > 40 ? 'medium-match' : 'low-match'}`}>
          Match: {matchScore}%
        </div>
        <div className="suggestions">
          {suggestions.length > 0 ? (
            <ul className="suggestion-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="suggestion-item">{suggestion}</li>
              ))}
            </ul>
          ) : (
            <p>Paste a job description to see your match score and get suggestions.</p>
          )}
        </div>
      </div>

      {/* AI content section */}
      <div className="tool-section">
        <h3 className="tool-header">AI Content</h3>
        <select
          className="dropdown-select"
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
        >
          {industries.map(industry => (
            <option key={industry.toLowerCase()} value={industry.toLowerCase()}>
              {industry}
            </option>
          ))}
        </select>
        <button className="generate-button" onClick={handleGenerate}>
          Generate
        </button>
        
        {/* Generated content display */}
        {generatedContent && (
          <div className="generated-content">
            <p className="content-text">{generatedContent}</p>
            
            <div className="content-actions">
              <select
                className="section-select"
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
              >
                {resumeSections.map(section => (
                  <option key={section.toLowerCase()} value={section.toLowerCase()}>
                    {section}
                  </option>
                ))}
              </select>
              
              <button 
                className="add-content-button"
                onClick={addContentToResume}
              >
                Add to Resume
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customize section */}
      <div className="tool-section">
        <h3 className="tool-header">Customize</h3>
        <div className="customize-grid">
          <select
            className="dropdown-select"
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
          >
            {fonts.map(font => (
              <option key={font.toLowerCase()} value={font.toLowerCase()}>
                {font}
              </option>
            ))}
          </select>
          
          <div className="color-swatches">
            {colors.map(color => (
              <button
                key={color}
                className={`color-swatch ${selectedColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>

          <div className="layout-toggles">
            <button
              className={`layout-button ${layoutColumns === 1 ? 'active' : ''}`}
              onClick={() => setLayoutColumns(1)}
              aria-label="Single column layout"
            >
              📑
            </button>
            <button
              className={`layout-button ${layoutColumns === 2 ? 'active' : ''}`}
              onClick={() => setLayoutColumns(2)}
              aria-label="Two column layout"
            >
              ⫼
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default RightSidebar 