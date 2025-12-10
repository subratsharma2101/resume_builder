import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  FileText, Upload, BarChart3, Palette, PenTool, Download,
  Sun, Moon, Menu, X, ChevronRight, Sparkles, Target,
  Zap, Shield, Users, Star, Github, Twitter, Linkedin,
  Mail, Phone, MapPin, Plus, Trash2, GripVertical, Eye,
  CheckCircle, AlertCircle, Info, ArrowRight, FileUp,
  Briefcase, GraduationCap, Award, Code, Heart, Coffee
} from 'lucide-react';
import './index.css';

// Context for theme
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

// Context for Resume Data
const ResumeContext = createContext();

export const useResume = () => useContext(ResumeContext);

// API URL
const API_URL = 'http://localhost:5000/api';

// Theme Provider
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Resume Provider
function ResumeProvider({ children }) {
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('resumeData');
    return saved ? JSON.parse(saved) : {
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      location: '',
      website: '',
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: []
    };
  });

  const [atsScore, setAtsScore] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }, [resumeData]);

  const updateResumeData = (data) => {
    setResumeData(prev => ({ ...prev, ...data }));
  };

  return (
    <ResumeContext.Provider value={{
      resumeData,
      setResumeData,
      updateResumeData,
      atsScore,
      setAtsScore,
      selectedTemplate,
      setSelectedTemplate
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

// Navigation Component
function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/builder', label: 'Builder' },
    { path: '/templates', label: 'Templates' },
    { path: '/analyzer', label: 'ATS Analyzer' },
    { path: '/cover-letter', label: 'Cover Letter' },
    { path: '/dashboard', label: 'Dashboard' }
  ];

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">
              <FileText size={24} />
            </div>
            <span>ResumeAI</span>
          </Link>

          <div className="navbar-nav">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            <button className="btn btn-icon btn-ghost" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/builder" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Landing Page Component
function LandingPage() {
  const features = [
    {
      icon: <Target size={28} />,
      title: 'ATS Score Checker',
      description: 'Get instant feedback on how well your resume will perform with Applicant Tracking Systems.'
    },
    {
      icon: <Palette size={28} />,
      title: '10+ Premium Templates',
      description: 'Choose from professionally designed, ATS-friendly templates for any industry.'
    },
    {
      icon: <Zap size={28} />,
      title: 'Real-time Editor',
      description: 'Edit your resume with live preview. See changes instantly as you type.'
    },
    {
      icon: <Shield size={28} />,
      title: 'ATS Optimized',
      description: 'All templates are tested and optimized to pass through any ATS system.'
    },
    {
      icon: <PenTool size={28} />,
      title: 'Cover Letter Generator',
      description: 'Create matching cover letters with our template-based generator.'
    },
    {
      icon: <Download size={28} />,
      title: 'Export to PDF',
      description: 'Download your polished resume as a high-quality PDF ready to send.'
    }
  ];

  const templates = [
    { id: 'modern', name: 'Modern Minimal', category: 'General' },
    { id: 'professional', name: 'Professional', category: 'Corporate' },
    { id: 'creative', name: 'Creative Bold', category: 'Design' },
    { id: 'tech', name: 'Tech Developer', category: 'IT' }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot"></span>
              <span>Build ATS-Friendly Resumes</span>
            </div>

            <h1 className="hero-title">
              Build Your Perfect <span className="gradient-text">Resume</span> in Minutes
            </h1>

            <p className="hero-subtitle">
              Create stunning, ATS-optimized resumes with our intelligent builder.
              Upload your old resume, get instant ATS score, and convert to professional templates.
            </p>

            <div className="hero-actions">
              <Link to="/builder" className="btn btn-primary btn-lg">
                <FileText size={20} />
                Start Building Free
              </Link>
              <Link to="/analyzer" className="btn btn-secondary btn-lg">
                <Upload size={20} />
                Check ATS Score
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">50K+</div>
                <div className="hero-stat-label">Resumes Created</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">95%</div>
                <div className="hero-stat-label">ATS Pass Rate</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">10+</div>
                <div className="hero-stat-label">Pro Templates</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">4.9★</div>
                <div className="hero-stat-label">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Everything You Need to <span className="gradient-text">Land Your Dream Job</span>
            </h2>
            <p className="section-subtitle">
              Our comprehensive toolkit helps you create, optimize, and perfect your resume for any job application.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="card feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Three simple steps to your perfect resume
            </p>
          </div>

          <div className="features-grid">
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
              <div className="feature-icon" style={{ margin: '0 auto 1.5rem' }}>
                <Upload size={28} />
              </div>
              <h3 className="feature-title">1. Upload Resume</h3>
              <p className="feature-description">
                Upload your existing resume in PDF or Word format. We'll extract all your information automatically.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
              <div className="feature-icon" style={{ margin: '0 auto 1.5rem', background: 'linear-gradient(135deg, var(--secondary-500), var(--accent-500))' }}>
                <BarChart3 size={28} />
              </div>
              <h3 className="feature-title">2. Get ATS Score</h3>
              <p className="feature-description">
                Our algorithm analyzes your resume and provides a detailed ATS score with improvement suggestions.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
              <div className="feature-icon" style={{ margin: '0 auto 1.5rem', background: 'linear-gradient(135deg, var(--accent-500), var(--success-500))' }}>
                <Download size={28} />
              </div>
              <h3 className="feature-title">3. Download PDF</h3>
              <p className="feature-description">
                Choose a professional template, make final edits, and download your polished resume as a PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Professional <span className="gradient-text">Templates</span>
            </h2>
            <p className="section-subtitle">
              All templates are ATS-optimized and designed by professionals
            </p>
          </div>

          <div className="templates-grid">
            {templates.map(template => (
              <Link to="/templates" key={template.id} className="template-card">
                <div className="template-preview" style={{
                  background: 'linear-gradient(to bottom, var(--bg-secondary), var(--surface))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <FileText size={48} style={{ color: 'var(--primary-500)', opacity: 0.5 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{template.name}</span>
                </div>
                <div className="template-overlay">
                  <div className="template-info">
                    <div className="template-name">{template.name}</div>
                    <div className="template-category">{template.category}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/templates" className="btn btn-secondary btn-lg">
              View All Templates
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--primary-600), var(--secondary-600))', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Ready to Build Your Perfect Resume?
          </h2>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Join thousands of job seekers who have already created their winning resumes with ResumeAI.
          </p>
          <Link to="/builder" className="btn btn-lg" style={{
            background: 'white',
            color: 'var(--primary-600)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <Sparkles size={20} />
            Get Started for Free
          </Link>
        </div>
      </section>
    </>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="navbar-logo-icon">
                <FileText size={24} />
              </div>
              <span>ResumeAI</span>
            </div>
            <p className="footer-description">
              Build professional, ATS-optimized resumes in minutes. Our intelligent builder helps you create
              the perfect resume for your dream job.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Product</h4>
            <div className="footer-links">
              <Link to="/builder" className="footer-link">Resume Builder</Link>
              <Link to="/templates" className="footer-link">Templates</Link>
              <Link to="/analyzer" className="footer-link">ATS Analyzer</Link>
              <Link to="/cover-letter" className="footer-link">Cover Letter</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Resources</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">Resume Tips</a>
              <a href="#" className="footer-link">Career Advice</a>
              <a href="#" className="footer-link">Blog</a>
              <a href="#" className="footer-link">FAQ</a>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Company</h4>
            <div className="footer-links">
              <a href="#" className="footer-link">About Us</a>
              <a href="#" className="footer-link">Contact</a>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 ResumeAI. All rights reserved.
          </p>
          <div className="footer-socials">
            <a href="#" className="footer-social"><Github size={20} /></a>
            <a href="#" className="footer-social"><Twitter size={20} /></a>
            <a href="#" className="footer-social"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ATS Score Circle Component
function ATSScoreCircle({ score, size = 180 }) {
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="ats-score-circle" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="ats-score-circle-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className="ats-score-circle-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getScoreColor(score)}
          strokeDasharray={`${progress} ${circumference}`}
        />
      </svg>
      <div className="ats-score-value">
        <span className="ats-score-number" style={{ color: getScoreColor(score) }}>
          {score}
        </span>
        <span className="ats-score-label">ATS Score</span>
      </div>
    </div>
  );
}

// File Upload Component
function FileUpload({ onUpload, loading }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <label
      className={`upload-zone ${dragOver ? 'dragover' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={loading}
      />
      <div className="upload-icon">
        {loading ? (
          <div className="loading-spinner" style={{ borderTopColor: 'white' }}></div>
        ) : (
          <FileUp size={40} />
        )}
      </div>
      <h3 className="upload-title">
        {loading ? 'Analyzing Resume...' : 'Drop your resume here'}
      </h3>
      <p className="upload-subtitle">
        {loading ? 'Please wait while we process your file' : 'or click to browse from your computer'}
      </p>
      <div className="upload-formats">
        <span className="badge badge-primary">PDF</span>
        <span className="badge badge-primary">DOC</span>
        <span className="badge badge-primary">DOCX</span>
      </div>
    </label>
  );
}

// ATS Analyzer Page
function AnalyzerPage() {
  const { resumeData, setResumeData, atsScore, setAtsScore } = useResume();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      setResumeData(result.data);
      setAtsScore(result.atsScore);
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sectionIcons = {
    contact: <Mail size={20} />,
    summary: <FileText size={20} />,
    experience: <Briefcase size={20} />,
    education: <GraduationCap size={20} />,
    skills: <Code size={20} />,
    formatting: <Palette size={20} />,
    keywords: <Target size={20} />
  };

  const getBarColor = (percentage) => {
    if (percentage >= 80) return 'var(--success-500)';
    if (percentage >= 60) return 'var(--warning-500)';
    return 'var(--danger-500)';
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title">
            <span className="gradient-text">ATS Score</span> Analyzer
          </h1>
          <p className="section-subtitle">
            Upload your resume to get instant ATS compatibility analysis and improvement tips
          </p>
        </div>

        {!atsScore ? (
          <>
            <FileUpload onUpload={handleUpload} loading={loading} />
            {error && (
              <div style={{
                textAlign: 'center',
                color: 'var(--danger-500)',
                marginTop: '1rem'
              }}>
                {error}
              </div>
            )}
          </>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '350px 1fr',
            gap: '2rem',
            alignItems: 'start'
          }}>
            {/* Score Card */}
            <div className="ats-score-card">
              <div className="ats-score-header">
                <ATSScoreCircle score={atsScore.overallScore} />
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: atsScore.grade.color + '20',
                  color: atsScore.grade.color,
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>{atsScore.grade.letter}</span>
                  <span>{atsScore.grade.label}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--danger-500)' }}>
                    {atsScore.improvements}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Issues</div>
                </div>
                <div style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary-500)' }}>
                    {atsScore.tips}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tips</div>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => { setAtsScore(null); setResumeData({}); }}
              >
                <Upload size={18} />
                Analyze Another Resume
              </button>
            </div>

            {/* Sections Breakdown */}
            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Section Analysis</h3>
              <div className="ats-sections">
                {Object.entries(atsScore.sections).map(([key, section]) => (
                  <div key={key} className="ats-section-item">
                    <div className="ats-section-icon">
                      {sectionIcons[key]}
                    </div>
                    <div className="ats-section-info">
                      <div className="ats-section-name" style={{ textTransform: 'capitalize' }}>
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="ats-section-bar">
                        <div
                          className="ats-section-bar-fill"
                          style={{
                            width: `${section.percentage}%`,
                            background: getBarColor(section.percentage)
                          }}
                        />
                      </div>
                    </div>
                    <div className="ats-section-score" style={{ color: getBarColor(section.percentage) }}>
                      {section.score}/{section.max}
                    </div>
                  </div>
                ))}
              </div>

              {/* Feedback */}
              <h3 style={{ margin: '2rem 0 1rem' }}>Improvement Suggestions</h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {atsScore.feedback.map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '1rem',
                    background: item.type === 'error' ? 'rgba(239, 68, 68, 0.1)' :
                      item.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' :
                        'rgba(99, 102, 241, 0.1)',
                    borderRadius: 'var(--radius-lg)',
                    borderLeft: `3px solid ${item.type === 'error' ? 'var(--danger-500)' :
                      item.type === 'warning' ? 'var(--warning-500)' :
                        'var(--primary-500)'
                      }`
                  }}>
                    {item.type === 'error' ? <AlertCircle size={20} style={{ color: 'var(--danger-500)', flexShrink: 0 }} /> :
                      item.type === 'warning' ? <AlertCircle size={20} style={{ color: 'var(--warning-500)', flexShrink: 0 }} /> :
                        <Info size={20} style={{ color: 'var(--primary-500)', flexShrink: 0 }} />}
                    <span style={{ fontSize: '0.9375rem' }}>{item.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mini Resume Preview Component for Template Cards
function MiniResumePreview({ templateId, accentColor = '#6366f1' }) {
  const templateStyles = {
    modern: {
      headerBg: '#ffffff',
      headerPadding: '12px 10px 8px',
      nameStyle: { color: accentColor, fontSize: '11px', fontWeight: '700', textAlign: 'center', letterSpacing: '1px' },
      contactStyle: { color: '#666', fontSize: '5px', textAlign: 'center' },
      sectionTitleStyle: { color: accentColor, fontSize: '6px', fontWeight: '700', borderBottom: `1px solid ${accentColor}`, paddingBottom: '2px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' },
      bodyPadding: '8px 10px'
    },
    professional: {
      headerBg: '#1e293b',
      headerPadding: '10px',
      nameStyle: { color: '#ffffff', fontSize: '10px', fontWeight: '700', textAlign: 'left' },
      contactStyle: { color: '#94a3b8', fontSize: '5px', textAlign: 'left' },
      sectionTitleStyle: { color: '#1e293b', fontSize: '6px', fontWeight: '700', borderBottom: '2px solid #1e293b', paddingBottom: '2px', marginBottom: '4px', textTransform: 'uppercase' },
      bodyPadding: '8px 10px'
    },
    creative: {
      headerBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      headerPadding: '12px 10px',
      nameStyle: { color: '#ffffff', fontSize: '11px', fontWeight: '800', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '2px' },
      contactStyle: { color: 'rgba(255,255,255,0.8)', fontSize: '5px', textAlign: 'center' },
      sectionTitleStyle: { color: '#667eea', fontSize: '6px', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' },
      bodyPadding: '8px 10px'
    },
    executive: {
      headerBg: '#ffffff',
      headerPadding: '10px',
      nameStyle: { color: '#0f172a', fontSize: '11px', fontWeight: '700', textAlign: 'left', borderTop: `3px solid ${accentColor}`, paddingTop: '6px' },
      contactStyle: { color: '#64748b', fontSize: '5px', textAlign: 'left' },
      sectionTitleStyle: { color: '#0f172a', fontSize: '6px', fontWeight: '700', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px', marginBottom: '4px' },
      bodyPadding: '8px 10px'
    },
    tech: {
      headerBg: '#0d1117',
      headerPadding: '10px',
      nameStyle: { color: '#58a6ff', fontSize: '10px', fontWeight: '600', textAlign: 'left', fontFamily: 'monospace' },
      contactStyle: { color: '#8b949e', fontSize: '5px', textAlign: 'left', fontFamily: 'monospace' },
      sectionTitleStyle: { color: '#58a6ff', fontSize: '6px', fontWeight: '600', marginBottom: '4px', fontFamily: 'monospace' },
      bodyPadding: '8px 10px'
    },
    marketing: {
      headerBg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      headerPadding: '12px 10px',
      nameStyle: { color: '#ffffff', fontSize: '11px', fontWeight: '800', textAlign: 'center' },
      contactStyle: { color: 'rgba(255,255,255,0.9)', fontSize: '5px', textAlign: 'center' },
      sectionTitleStyle: { color: '#f5576c', fontSize: '6px', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' },
      bodyPadding: '8px 10px'
    },
    finance: {
      headerBg: '#0f172a',
      headerPadding: '10px',
      nameStyle: { color: '#ffffff', fontSize: '10px', fontWeight: '600', textAlign: 'left' },
      contactStyle: { color: '#94a3b8', fontSize: '5px', textAlign: 'left' },
      sectionTitleStyle: { color: '#0f172a', fontSize: '6px', fontWeight: '700', borderBottom: '1px solid #0f172a', paddingBottom: '2px', marginBottom: '4px', textTransform: 'uppercase' },
      bodyPadding: '8px 10px'
    },
    healthcare: {
      headerBg: '#0369a1',
      headerPadding: '10px',
      nameStyle: { color: '#ffffff', fontSize: '10px', fontWeight: '700', textAlign: 'left' },
      contactStyle: { color: 'rgba(255,255,255,0.8)', fontSize: '5px', textAlign: 'left' },
      sectionTitleStyle: { color: '#0369a1', fontSize: '6px', fontWeight: '700', marginBottom: '4px' },
      bodyPadding: '8px 10px'
    },
    designer: {
      headerBg: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
      headerPadding: '12px 10px',
      nameStyle: { color: '#ffffff', fontSize: '11px', fontWeight: '800', textAlign: 'center', textTransform: 'uppercase' },
      contactStyle: { color: 'rgba(255,255,255,0.9)', fontSize: '5px', textAlign: 'center' },
      sectionTitleStyle: { color: '#ff6b6b', fontSize: '6px', fontWeight: '700', marginBottom: '4px' },
      bodyPadding: '8px 10px'
    },
    fresher: {
      headerBg: '#ffffff',
      headerPadding: '10px',
      nameStyle: { color: '#10b981', fontSize: '11px', fontWeight: '700', textAlign: 'center' },
      contactStyle: { color: '#6b7280', fontSize: '5px', textAlign: 'center' },
      sectionTitleStyle: { color: '#10b981', fontSize: '6px', fontWeight: '700', borderBottom: `1px solid #10b981`, paddingBottom: '2px', marginBottom: '4px' },
      bodyPadding: '8px 10px'
    }
  };

  const style = templateStyles[templateId] || templateStyles.modern;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#ffffff',
      borderRadius: '6px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: style.headerBg,
        padding: style.headerPadding
      }}>
        <div style={style.nameStyle}>JOHN SMITH</div>
        <div style={{ ...style.contactStyle, marginTop: '3px' }}>
          john@email.com • +1 234 567 890 • New York
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: style.bodyPadding, flex: 1, fontSize: '5px', color: '#374151', lineHeight: '1.4' }}>
        {/* Summary */}
        <div style={{ marginBottom: '6px' }}>
          <div style={style.sectionTitleStyle}>Summary</div>
          <div style={{ color: '#6b7280' }}>
            Experienced professional with 5+ years in software development...
          </div>
        </div>

        {/* Experience */}
        <div style={{ marginBottom: '6px' }}>
          <div style={style.sectionTitleStyle}>Experience</div>
          <div>
            <div style={{ fontWeight: '600', color: '#1f2937' }}>Senior Developer</div>
            <div style={{ color: '#9ca3af', fontSize: '4px' }}>Tech Corp • 2020 - Present</div>
            <div style={{ color: '#6b7280', marginTop: '2px' }}>• Led team of 5 developers...</div>
          </div>
        </div>

        {/* Education */}
        <div style={{ marginBottom: '6px' }}>
          <div style={style.sectionTitleStyle}>Education</div>
          <div>
            <div style={{ fontWeight: '600', color: '#1f2937' }}>B.S. Computer Science</div>
            <div style={{ color: '#9ca3af', fontSize: '4px' }}>MIT • 2018</div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <div style={style.sectionTitleStyle}>Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
            {['React', 'Node.js', 'Python', 'AWS'].map(skill => (
              <span key={skill} style={{
                background: '#f3f4f6',
                padding: '1px 4px',
                borderRadius: '2px',
                fontSize: '4px',
                color: '#4b5563'
              }}>{skill}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Templates Page
function TemplatesPage() {
  const { selectedTemplate, setSelectedTemplate } = useResume();
  const [filters, setFilters] = useState({
    headshot: 'all',
    graphics: 'all',
    columns: 'all'
  });
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [showCustomModal, setShowCustomModal] = useState(false);

  const colorOptions = [
    { color: '#1e293b', name: 'Dark' },
    { color: '#6366f1', name: 'Indigo' },
    { color: '#10b981', name: 'Green' },
    { color: '#0ea5e9', name: 'Blue' },
    { color: '#8b5cf6', name: 'Purple' },
    { color: '#f59e0b', name: 'Orange' },
    { color: '#ef4444', name: 'Red' }
  ];

  const allTemplates = [
    { id: 'modern', name: 'Modern Minimal', category: 'General', description: 'Clean, lots of whitespace', color: '#6366f1', hasHeadshot: false, hasGraphics: false, columns: 1 },
    { id: 'professional', name: 'Professional Classic', category: 'Corporate', description: 'Traditional, formal', color: '#1e293b', hasHeadshot: false, hasGraphics: false, columns: 1 },
    { id: 'creative', name: 'Creative Bold', category: 'Design', description: 'Color accents, modern', color: '#667eea', hasHeadshot: true, hasGraphics: true, columns: 1 },
    { id: 'executive', name: 'Executive', category: 'Senior Roles', description: 'Elegant, sophisticated', color: '#0f172a', hasHeadshot: false, hasGraphics: false, columns: 1 },
    { id: 'tech', name: 'Tech Developer', category: 'IT/Software', description: 'Code-inspired, clean', color: '#58a6ff', hasHeadshot: false, hasGraphics: true, columns: 1 },
    { id: 'marketing', name: 'Marketing Pro', category: 'Marketing/Sales', description: 'Dynamic, impactful', color: '#f5576c', hasHeadshot: true, hasGraphics: true, columns: 1 },
    { id: 'finance', name: 'Finance Formal', category: 'Banking/Finance', description: 'Conservative, trustworthy', color: '#0f172a', hasHeadshot: false, hasGraphics: false, columns: 1 },
    { id: 'healthcare', name: 'Healthcare', category: 'Medical', description: 'Clean, organized', color: '#0369a1', hasHeadshot: true, hasGraphics: false, columns: 2 },
    { id: 'designer', name: 'Designer Portfolio', category: 'Creative', description: 'Visual, unique', color: '#ff6b6b', hasHeadshot: true, hasGraphics: true, columns: 2 },
    { id: 'fresher', name: 'Fresher/Student', category: 'Entry Level', description: 'Skills-focused', color: '#10b981', hasHeadshot: false, hasGraphics: false, columns: 1 },
    { id: 'sidebar-left', name: 'Sidebar Left', category: 'Modern', description: 'Two column layout', color: '#6366f1', hasHeadshot: true, hasGraphics: false, columns: 2 },
    { id: 'sidebar-right', name: 'Sidebar Right', category: 'Modern', description: 'Right sidebar layout', color: '#8b5cf6', hasHeadshot: true, hasGraphics: false, columns: 2 }
  ];

  // Filter templates based on selections
  const filteredTemplates = allTemplates.filter(template => {
    if (filters.headshot === 'with' && !template.hasHeadshot) return false;
    if (filters.headshot === 'without' && template.hasHeadshot) return false;
    if (filters.graphics === 'with' && !template.hasGraphics) return false;
    if (filters.graphics === 'without' && template.hasGraphics) return false;
    if (filters.columns === '1' && template.columns !== 1) return false;
    if (filters.columns === '2' && template.columns !== 2) return false;
    return true;
  });

  const FilterDropdown = ({ label, value, onChange, options }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: '0.5rem 2rem 0.5rem 1rem',
          background: 'var(--surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: '0.875rem',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center'
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title">
            Choose Your <span className="gradient-text">Template</span>
          </h1>
          <p className="section-subtitle">
            You can always change your template later
          </p>
        </div>

        {/* Filters Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          padding: '1rem 1.5rem',
          background: 'var(--surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>Filter by</span>

          <FilterDropdown
            label=""
            value={filters.headshot}
            onChange={(val) => setFilters({ ...filters, headshot: val })}
            options={[
              { value: 'all', label: 'Headshot' },
              { value: 'with', label: 'With Photo' },
              { value: 'without', label: 'Without Photo' }
            ]}
          />

          <FilterDropdown
            label=""
            value={filters.graphics}
            onChange={(val) => setFilters({ ...filters, graphics: val })}
            options={[
              { value: 'all', label: 'Graphics' },
              { value: 'with', label: 'With Graphics' },
              { value: 'without', label: 'Minimal' }
            ]}
          />

          <FilterDropdown
            label=""
            value={filters.columns}
            onChange={(val) => setFilters({ ...filters, columns: val })}
            options={[
              { value: 'all', label: 'Columns' },
              { value: '1', label: 'Single Column' },
              { value: '2', label: 'Two Columns' }
            ]}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Colors</span>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {colorOptions.map(opt => (
                <button
                  key={opt.color}
                  onClick={() => setSelectedColor(opt.color)}
                  title={opt.name}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: opt.color,
                    border: selectedColor === opt.color ? '3px solid var(--primary-400)' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedColor === opt.color ? '0 0 0 2px var(--bg-primary), 0 0 0 4px var(--primary-500)' : 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="templates-grid">
          {/* Create Custom Template Card */}
          <div
            onClick={() => setShowCustomModal(true)}
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '350px',
              background: 'var(--bg-secondary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-500)';
              e.currentTarget.style.background = 'var(--surface)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.background = 'var(--bg-secondary)';
            }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'var(--primary-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Plus size={28} style={{ color: 'var(--primary-500)' }} />
            </div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Create Custom Template</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0 1rem' }}>
              Design your own unique resume template
            </p>
          </div>

          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="template-card"
              onClick={() => setSelectedTemplate(template.id)}
              style={{
                border: selectedTemplate === template.id ? '2px solid var(--primary-500)' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="template-preview" style={{
                padding: '1rem',
                background: 'var(--bg-tertiary)',
                position: 'relative'
              }}>
                <MiniResumePreview templateId={template.id} accentColor={selectedColor} />
                {selectedTemplate === template.id && (
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'var(--primary-500)',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '0.25rem',
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)'
                  }}>
                    <CheckCircle size={20} />
                  </div>
                )}
                {/* Template badges */}
                <div style={{
                  position: 'absolute',
                  bottom: '0.75rem',
                  left: '0.75rem',
                  display: 'flex',
                  gap: '0.375rem'
                }}>
                  <span style={{
                    background: selectedColor,
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.625rem',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    ATS: 98%
                  </span>
                  {template.columns === 2 && (
                    <span style={{
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.625rem',
                      fontWeight: '500'
                    }}>
                      2 Col
                    </span>
                  )}
                  {template.hasHeadshot && (
                    <span style={{
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.625rem',
                      fontWeight: '500'
                    }}>
                      Photo
                    </span>
                  )}
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--surface)' }}>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{template.name}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{template.category}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{template.description}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/builder" className="btn btn-primary btn-lg">
            <PenTool size={20} />
            Use Selected Template
          </Link>
        </div>

        {/* Custom Template Modal */}
        {showCustomModal && (
          <div className="modal-overlay" onClick={() => setShowCustomModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div className="modal-header">
                <h3 className="modal-title">Create Custom Template</h3>
                <button className="modal-close" onClick={() => setShowCustomModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">Template Name</label>
                  <input type="text" className="input" placeholder="My Custom Template" />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">Layout Style</label>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    {['Single Column', 'Two Columns', 'Sidebar Left', 'Sidebar Right'].map(layout => (
                      <button key={layout} className="btn btn-secondary btn-sm">{layout}</button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">Accent Color</label>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {colorOptions.map(opt => (
                      <button
                        key={opt.color}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-md)',
                          background: opt.color,
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label className="input-label">Options</label>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="checkbox" /> Include Photo
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="checkbox" /> Add Graphics
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="checkbox" /> Skills Bar
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowCustomModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setShowCustomModal(false)}>
                  <Sparkles size={18} />
                  Create Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Resume Preview Component  
function ResumePreview({ data, template, sectionSettings }) {
  // Default section settings if not provided
  const sections = sectionSettings || {
    summary: { visible: true, heading: 'Professional Summary' },
    experience: { visible: true, heading: 'Work Experience' },
    education: { visible: true, heading: 'Education' },
    skills: { visible: true, heading: 'Skills' }
  };

  return (
    <div className="preview-container" id="resume-preview">
      <div className="preview-header">
        <h1 className="preview-name">{data.name || 'Your Name'}</h1>
        <div className="preview-contact">
          {data.email && <span><Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />{data.email}</span>}
          {data.phone && <span><Phone size={14} style={{ display: 'inline', marginRight: '4px' }} />{data.phone}</span>}
          {data.location && <span><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />{data.location}</span>}
          {data.linkedin && <span><Linkedin size={14} style={{ display: 'inline', marginRight: '4px' }} />LinkedIn</span>}
        </div>
      </div>

      {data.summary && sections.summary?.visible && (
        <div className="preview-section">
          <h2 className="preview-section-title">{sections.summary?.heading || 'Professional Summary'}</h2>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>{data.summary}</p>
        </div>
      )}

      {data.experience?.length > 0 && sections.experience?.visible && (
        <div className="preview-section">
          <h2 className="preview-section-title">{sections.experience?.heading || 'Work Experience'}</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="preview-entry">
              <div className="preview-entry-header">
                <span className="preview-entry-title">{exp.title || 'Job Title'}</span>
                <span className="preview-entry-date">{exp.duration}</span>
              </div>
              <div className="preview-entry-subtitle">{exp.company}</div>
              <p className="preview-entry-description">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.education?.length > 0 && sections.education?.visible && (
        <div className="preview-section">
          <h2 className="preview-section-title">{sections.education?.heading || 'Education'}</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="preview-entry">
              <div className="preview-entry-header">
                <span className="preview-entry-title">{edu.degree || 'Degree'}</span>
                <span className="preview-entry-date">{edu.year}</span>
              </div>
              <div className="preview-entry-subtitle">{edu.institution}</div>
            </div>
          ))}
        </div>
      )}

      {data.skills?.length > 0 && sections.skills?.visible && (
        <div className="preview-section">
          <h2 className="preview-section-title">{sections.skills?.heading || 'Skills'}</h2>
          <div className="preview-skills-list">
            {data.skills.map((skill, index) => (
              <span key={index} className="preview-skill">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Resume Builder Page
function BuilderPage() {
  const { resumeData, updateResumeData, selectedTemplate } = useResume();
  const [newSkill, setNewSkill] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Section visibility and custom headings
  const [sectionSettings, setSectionSettings] = useState({
    summary: { visible: true, heading: 'Professional Summary' },
    experience: { visible: true, heading: 'Work Experience' },
    education: { visible: true, heading: 'Education' },
    skills: { visible: true, heading: 'Skills' },
    certifications: { visible: false, heading: 'Certifications' },
    projects: { visible: false, heading: 'Projects' },
    languages: { visible: false, heading: 'Languages' }
  });

  // Auto-generate professional summary based on resume data
  const generateSummary = () => {
    setIsGeneratingSummary(true);

    // Simulate processing
    setTimeout(() => {
      const name = resumeData.name || 'Professional';
      const skills = resumeData.skills?.slice(0, 5).join(', ') || 'various technical skills';
      const latestJob = resumeData.experience?.[0];
      const latestEdu = resumeData.education?.[0];

      let yearsExp = '';
      if (latestJob?.duration) {
        // Try to calculate years from duration
        const match = latestJob.duration.match(/(\d{4})/g);
        if (match && match.length >= 1) {
          const startYear = parseInt(match[0]);
          const currentYear = new Date().getFullYear();
          yearsExp = `${currentYear - startYear}+ years of`;
        }
      }

      let summary = '';

      if (latestJob?.title && latestJob?.company) {
        summary = `Results-driven ${latestJob.title} with ${yearsExp || 'extensive'} experience in delivering high-quality solutions. `;
      } else {
        summary = `Dedicated professional with a passion for excellence. `;
      }

      if (skills) {
        summary += `Proficient in ${skills}. `;
      }

      if (latestEdu?.degree) {
        summary += `Holds a ${latestEdu.degree} from ${latestEdu.institution || 'a reputable institution'}. `;
      }

      summary += `Known for strong problem-solving abilities, attention to detail, and commitment to continuous improvement. Seeking to leverage skills and expertise to drive success in a challenging role.`;

      updateResumeData({ summary });
      setIsGeneratingSummary(false);
    }, 1000);
  };

  const toggleSection = (section) => {
    setSectionSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], visible: !prev[section].visible }
    }));
  };

  const updateSectionHeading = (section, heading) => {
    setSectionSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], heading }
    }));
  };

  const addExperience = () => {
    updateResumeData({
      experience: [...(resumeData.experience || []), {
        id: Date.now(),
        title: '',
        company: '',
        duration: '',
        description: ''
      }]
    });
  };

  const updateExperience = (id, field, value) => {
    updateResumeData({
      experience: resumeData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id) => {
    updateResumeData({
      experience: resumeData.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    updateResumeData({
      education: [...(resumeData.education || []), {
        id: Date.now(),
        degree: '',
        institution: '',
        year: ''
      }]
    });
  };

  const updateEducation = (id, field, value) => {
    updateResumeData({
      education: resumeData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id) => {
    updateResumeData({
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills?.includes(newSkill.trim())) {
      updateResumeData({
        skills: [...(resumeData.skills || []), newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    updateResumeData({
      skills: resumeData.skills.filter(s => s !== skill)
    });
  };

  const exportToPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('resume-preview');

    html2pdf().set({
      margin: 0.5,
      filename: `${resumeData.name || 'resume'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).from(element).save();
  };

  // Section Header Component with toggle and editable heading
  const SectionHeader = ({ sectionKey, icon, defaultHeading }) => {
    const [isEditing, setIsEditing] = useState(false);
    const section = sectionSettings[sectionKey];

    return (
      <div className="editor-section-header" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          {/* Toggle visibility */}
          <button
            onClick={() => toggleSection(sectionKey)}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              border: '2px solid var(--primary-500)',
              background: section.visible ? 'var(--primary-500)' : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0
            }}
          >
            {section.visible && <CheckCircle size={12} style={{ color: 'white' }} />}
          </button>

          {icon}

          {/* Editable heading */}
          {isEditing ? (
            <input
              type="text"
              value={section.heading}
              onChange={(e) => updateSectionHeading(sectionKey, e.target.value)}
              onBlur={() => setIsEditing(false)}
              onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
              autoFocus
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--primary-500)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.25rem 0.5rem',
                fontSize: '0.9375rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          ) : (
            <h4
              className="editor-section-title"
              onClick={() => setIsEditing(true)}
              style={{ cursor: 'pointer', margin: 0 }}
              title="Click to edit heading"
            >
              {section.heading}
              <PenTool size={12} style={{ marginLeft: '0.5rem', opacity: 0.5 }} />
            </h4>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="editor-layout">
        {/* Editor Panel */}
        <div className="editor-panel">
          <div className="editor-panel-header">
            <h3 className="editor-panel-title">Resume Editor</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowSettings(!showSettings)}
                style={{ background: showSettings ? 'var(--primary-100)' : 'transparent' }}
              >
                <Target size={16} />
                Settings
              </button>
              <button className="btn btn-primary btn-sm" onClick={exportToPDF}>
                <Download size={16} />
                Export PDF
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              margin: '0 1rem 1rem'
            }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.9375rem' }}>Resume Settings</h4>

              {/* Section toggles */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                  Show/Hide Sections
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {Object.entries(sectionSettings).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => toggleSection(key)}
                      className={`btn btn-sm ${value.visible ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
                    >
                      {value.visible ? <CheckCircle size={14} /> : <Plus size={14} />}
                      {value.heading}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column layout option */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
                  Layout Style
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-secondary btn-sm">Single Column</button>
                  <button className="btn btn-secondary btn-sm">Two Columns</button>
                  <button className="btn btn-secondary btn-sm">Sidebar Left</button>
                </div>
              </div>

              {/* Custom section heading info */}
              <div style={{
                background: 'var(--surface)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                color: 'var(--text-muted)'
              }}>
                <Info size={14} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Click on any section heading to customize it (e.g., change "Work Experience" to "Career History")
              </div>
            </div>
          )}

          <div className="editor-panel-content">
            {/* Personal Information */}
            <div className="editor-section">
              <div className="editor-section-header">
                <h4 className="editor-section-title">
                  <Users size={18} />
                  Personal Information
                </h4>
              </div>
              <div className="editor-section-content">
                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="John Doe"
                    value={resumeData.name || ''}
                    onChange={(e) => updateResumeData({ name: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Email</label>
                    <input
                      type="email"
                      className="input"
                      placeholder="john@example.com"
                      value={resumeData.email || ''}
                      onChange={(e) => updateResumeData({ email: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Phone</label>
                    <input
                      type="tel"
                      className="input"
                      placeholder="+1 234 567 890"
                      value={resumeData.phone || ''}
                      onChange={(e) => updateResumeData({ phone: e.target.value })}
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Location</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="New York, NY"
                      value={resumeData.location || ''}
                      onChange={(e) => updateResumeData({ location: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">LinkedIn</label>
                    <input
                      type="url"
                      className="input"
                      placeholder="linkedin.com/in/johndoe"
                      value={resumeData.linkedin || ''}
                      onChange={(e) => updateResumeData({ linkedin: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Summary - with auto-generate */}
            {sectionSettings.summary.visible && (
              <div className="editor-section">
                <SectionHeader sectionKey="summary" icon={<FileText size={18} />} />
                <div className="editor-section-content">
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={generateSummary}
                      disabled={isGeneratingSummary}
                      style={{ flex: 1 }}
                    >
                      {isGeneratingSummary ? (
                        <>
                          <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Auto-Generate from My Info
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    className="input textarea"
                    placeholder="Write a brief summary of your professional background and key achievements... or click 'Auto-Generate' to create one based on your experience and skills."
                    value={resumeData.summary || ''}
                    onChange={(e) => updateResumeData({ summary: e.target.value })}
                    style={{ minHeight: '120px' }}
                  />
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.875rem 1rem',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary-500) 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Sparkles size={14} style={{ color: 'white' }} />
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                        marginBottom: '0.25rem'
                      }}>
                        Pro Tip
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                        Fill in your <strong>Experience</strong>, <strong>Education</strong>, and <strong>Skills</strong> first for a better auto-generated summary.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Work Experience */}
            {sectionSettings.experience.visible && (
              <div className="editor-section">
                <SectionHeader sectionKey="experience" icon={<Briefcase size={18} />} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 1rem', marginTop: '-0.5rem' }}>
                  <button className="btn btn-ghost btn-sm" onClick={addExperience}>
                    <Plus size={16} />
                    Add
                  </button>
                </div>
                <div className="editor-section-content">
                  {resumeData.experience?.map((exp) => (
                    <div key={exp.id} className="entry-card">
                      <div className="entry-header">
                        <input
                          type="text"
                          className="input"
                          placeholder="Job Title"
                          value={exp.title}
                          onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                          style={{ fontWeight: '600', border: 'none', padding: 0, background: 'transparent' }}
                        />
                        <div className="entry-actions">
                          <button
                            className="entry-action-btn danger"
                            onClick={() => removeExperience(exp.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <input
                          type="text"
                          className="input"
                          placeholder="Company Name"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        />
                        <input
                          type="text"
                          className="input"
                          placeholder="Jan 2020 - Present"
                          value={exp.duration}
                          onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                        />
                      </div>
                      <textarea
                        className="input"
                        placeholder="Describe your responsibilities and achievements..."
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        style={{ minHeight: '80px' }}
                      />
                    </div>
                  ))}
                  {(!resumeData.experience || resumeData.experience.length === 0) && (
                    <button className="btn btn-secondary" onClick={addExperience} style={{ width: '100%' }}>
                      <Plus size={18} />
                      Add Work Experience
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Education */}
            {sectionSettings.education.visible && (
              <div className="editor-section">
                <SectionHeader sectionKey="education" icon={<GraduationCap size={18} />} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 1rem', marginTop: '-0.5rem' }}>
                  <button className="btn btn-ghost btn-sm" onClick={addEducation}>
                    <Plus size={16} />
                    Add
                  </button>
                </div>
                <div className="editor-section-content">
                  {resumeData.education?.map((edu) => (
                    <div key={edu.id} className="entry-card">
                      <div className="entry-header">
                        <input
                          type="text"
                          className="input"
                          placeholder="Degree (e.g., Bachelor's in Computer Science)"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          style={{ fontWeight: '600', border: 'none', padding: 0, background: 'transparent' }}
                        />
                        <div className="entry-actions">
                          <button
                            className="entry-action-btn danger"
                            onClick={() => removeEducation(edu.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <input
                          type="text"
                          className="input"
                          placeholder="Institution Name"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                        />
                        <input
                          type="text"
                          className="input"
                          placeholder="Graduation Year"
                          value={edu.year}
                          onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  {(!resumeData.education || resumeData.education.length === 0) && (
                    <button className="btn btn-secondary" onClick={addEducation} style={{ width: '100%' }}>
                      <Plus size={18} />
                      Add Education
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {sectionSettings.skills.visible && (
              <div className="editor-section">
                <SectionHeader sectionKey="skills" icon={<Code size={18} />} />
                <div className="editor-section-content">
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      className="input"
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <button className="btn btn-primary" onClick={addSkill}>
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="skills-container">
                    {resumeData.skills?.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                        <span className="skill-tag-remove" onClick={() => removeSkill(skill)}>
                          <X size={12} />
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="editor-panel">
          <div className="editor-panel-header">
            <h3 className="editor-panel-title">Live Preview</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/templates" className="btn btn-ghost btn-sm">
                <Palette size={16} />
                Templates
              </Link>
              <button className="btn btn-ghost btn-sm">
                <Eye size={16} />
                Preview
              </button>
            </div>
          </div>
          <div className="editor-panel-content" style={{ background: 'var(--bg-tertiary)', padding: '1rem' }}>
            <div style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)',
              overflow: 'hidden'
            }}>
              <ResumePreview data={resumeData} template={selectedTemplate} sectionSettings={sectionSettings} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cover Letter Page
function CoverLetterPage() {
  const { resumeData } = useResume();
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    field: '',
    achievement: '',
    customParagraph: ''
  });

  const templates = [
    { id: 'professional', name: 'Professional', description: 'Formal and traditional approach' },
    { id: 'enthusiastic', name: 'Enthusiastic', description: 'Energetic and passionate tone' },
    { id: 'career-change', name: 'Career Change', description: 'For transitioning to a new field' },
    { id: 'fresher', name: 'Fresh Graduate', description: 'For entry-level positions' }
  ];

  const generateLetter = () => {
    const name = resumeData.name || 'Your Name';

    const templateContent = {
      professional: `Dear Hiring Manager,

I am writing to express my strong interest in the ${formData.position || '[Position]'} position at ${formData.company || '[Company]'}. With my background in ${formData.field || '[Field]'} and proven track record of ${formData.achievement || '[Achievement]'}, I am confident in my ability to contribute effectively to your team.

${formData.customParagraph || 'Throughout my career, I have consistently demonstrated my commitment to excellence and my ability to deliver results. I am excited about the opportunity to bring my skills and experience to your organization.'}

I would welcome the opportunity to discuss how my skills and experience align with your needs. Thank you for considering my application.

Sincerely,
${name}`,

      enthusiastic: `Dear ${formData.company || '[Company]'} Team,

I was thrilled to discover the ${formData.position || '[Position]'} opportunity at ${formData.company || '[Company]'}! As someone who is deeply passionate about ${formData.field || '[Field]'}, I knew immediately that this role would be a perfect match for my skills and aspirations.

${formData.customParagraph || 'My enthusiasm for this field has driven me to continuously improve and push boundaries. I believe my energy and dedication would make me a valuable addition to your team.'}

I am excited about the possibility of bringing my energy and expertise to your team. I would love to discuss how I can contribute to ${formData.company || '[Company]'}'s continued success.

Best regards,
${name}`,

      'career-change': `Dear Hiring Manager,

While my background is in ${formData.field || '[Previous Field]'}, I am eager to transition into ${formData.position || '[New Field]'} and believe my transferable skills make me a strong candidate for the role at ${formData.company || '[Company]'}.

${formData.customParagraph || 'My diverse experience has equipped me with a unique perspective and a versatile skill set that I am confident will translate well to this new challenge.'}

I am committed to this career change and have been actively developing relevant skills. I would appreciate the opportunity to discuss how my unique perspective could benefit your team.

Sincerely,
${name}`,

      fresher: `Dear Hiring Manager,

As a recent graduate with experience in ${formData.field || '[Field]'}, I am excited to apply for the ${formData.position || '[Position]'} position at ${formData.company || '[Company]'}. My academic training and project experience have prepared me to contribute meaningfully to your team.

${formData.customParagraph || 'During my studies, I developed a strong foundation in both theoretical concepts and practical applications. I am eager to apply this knowledge in a professional setting.'}

I am eager to begin my professional career with a company like ${formData.company || '[Company]'} that values growth and innovation. Thank you for considering my application.

Sincerely,
${name}`
    };

    return templateContent[selectedTemplate];
  };

  return (
    <div className="container">
      <div className="cover-letter-editor">
        {/* Sidebar */}
        <div className="cover-letter-sidebar">
          <h3 style={{ marginBottom: '1rem' }}>Choose Template</h3>
          <div className="cover-letter-templates">
            {templates.map(template => (
              <button
                key={template.id}
                className={`cover-letter-template-btn ${selectedTemplate === template.id ? 'active' : ''}`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="cover-letter-template-name">{template.name}</div>
                <div className="cover-letter-template-desc">{template.description}</div>
              </button>
            ))}
          </div>

          <h3 style={{ marginBottom: '1rem' }}>Fill Details</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label">Company Name</label>
              <input
                type="text"
                className="input"
                placeholder="Google"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Position</label>
              <input
                type="text"
                className="input"
                placeholder="Software Engineer"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Field/Industry</label>
              <input
                type="text"
                className="input"
                placeholder="Software Development"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Key Achievement</label>
              <input
                type="text"
                className="input"
                placeholder="delivering projects on time"
                value={formData.achievement}
                onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Custom Paragraph</label>
              <textarea
                className="input textarea"
                placeholder="Add a personalized paragraph..."
                value={formData.customParagraph}
                onChange={(e) => setFormData({ ...formData, customParagraph: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="editor-panel">
          <div className="editor-panel-header">
            <h3 className="editor-panel-title">Cover Letter Preview</h3>
            <button className="btn btn-primary btn-sm" onClick={() => {
              const text = generateLetter();
              navigator.clipboard.writeText(text);
              alert('Copied to clipboard!');
            }}>
              <Download size={16} />
              Copy Text
            </button>
          </div>
          <div className="editor-panel-content">
            <div className="cover-letter-preview">
              {generateLetter()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Page
function DashboardPage() {
  const { resumeData, atsScore } = useResume();

  const [savedResumes] = useState([
    { id: 1, name: 'Software Engineer Resume', date: '2024-01-15', score: 85 },
    { id: 2, name: 'Product Manager Resume', date: '2024-01-10', score: 78 },
    { id: 3, name: 'Data Analyst Resume', date: '2024-01-05', score: 92 }
  ]);

  return (
    <div className="container dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <Link to="/builder" className="btn btn-primary">
          <Plus size={18} />
          Create New Resume
        </Link>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-card-icon">
            <FileText size={24} />
          </div>
          <div className="stat-card-value">3</div>
          <div className="stat-card-label">Total Resumes</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, var(--success-500), var(--accent-500))' }}>
            <Download size={24} />
          </div>
          <div className="stat-card-value">12</div>
          <div className="stat-card-label">Downloads</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, var(--warning-500), var(--danger-500))' }}>
            <BarChart3 size={24} />
          </div>
          <div className="stat-card-value">85</div>
          <div className="stat-card-label">Average ATS Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, var(--accent-500), var(--primary-500))' }}>
            <Star size={24} />
          </div>
          <div className="stat-card-value">2</div>
          <div className="stat-card-label">Cover Letters</div>
        </div>
      </div>

      <div className="resume-list">
        <div className="resume-list-header">
          <h3 className="resume-list-title">My Resumes</h3>
          <Link to="/builder" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        {savedResumes.map(resume => (
          <div key={resume.id} className="resume-item">
            <div className="resume-item-icon">
              <FileText size={24} />
            </div>
            <div className="resume-item-info">
              <div className="resume-item-name">{resume.name}</div>
              <div className="resume-item-date">Last modified: {resume.date}</div>
            </div>
            <div className="resume-item-score" style={{
              color: resume.score >= 80 ? 'var(--success-500)' :
                resume.score >= 60 ? 'var(--warning-500)' : 'var(--danger-500)'
            }}>
              <BarChart3 size={16} />
              {resume.score}%
            </div>
            <div className="resume-item-actions">
              <button className="btn btn-icon btn-ghost">
                <Eye size={18} />
              </button>
              <button className="btn btn-icon btn-ghost">
                <Download size={18} />
              </button>
              <button className="btn btn-icon btn-ghost" style={{ color: 'var(--danger-500)' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <ThemeProvider>
      <ResumeProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/builder" element={<BuilderPage />} />
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/analyzer" element={<AnalyzerPage />} />
                <Route path="/cover-letter" element={<CoverLetterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ResumeProvider>
    </ThemeProvider>
  );
}

export default App;
