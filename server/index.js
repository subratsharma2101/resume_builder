import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  }
});

// ============================================
// ATS SCORING ALGORITHM
// ============================================

const calculateATSScore = (resumeData) => {
  let score = 0;
  const feedback = [];
  const sections = {};

  // 1. Contact Information (10 points)
  let contactScore = 0;
  if (resumeData.email) contactScore += 3;
  else feedback.push({ type: 'error', message: 'Email address is missing' });

  if (resumeData.phone) contactScore += 3;
  else feedback.push({ type: 'warning', message: 'Phone number is missing' });

  if (resumeData.linkedin) contactScore += 2;
  else feedback.push({ type: 'tip', message: 'Add LinkedIn profile URL' });

  if (resumeData.location) contactScore += 2;
  else feedback.push({ type: 'tip', message: 'Add your location/city' });

  sections.contact = { score: contactScore, max: 10, percentage: (contactScore / 10) * 100 };
  score += contactScore;

  // 2. Professional Summary (15 points)
  let summaryScore = 0;
  const summary = resumeData.summary || '';

  if (summary.length >= 50) {
    summaryScore += 5;
    if (summary.length >= 150 && summary.length <= 300) {
      summaryScore += 5;
    } else if (summary.length > 300) {
      summaryScore += 3;
      feedback.push({ type: 'tip', message: 'Professional summary is too long. Keep it between 150-300 characters.' });
    } else {
      summaryScore += 2;
      feedback.push({ type: 'tip', message: 'Professional summary could be more detailed.' });
    }

    // Check for keywords
    const keywordPatterns = /years|experience|professional|skilled|expertise|developed|managed|led/gi;
    const keywordMatches = summary.match(keywordPatterns);
    if (keywordMatches && keywordMatches.length >= 3) {
      summaryScore += 5;
    } else {
      summaryScore += 2;
      feedback.push({ type: 'tip', message: 'Add more professional keywords to your summary.' });
    }
  } else {
    feedback.push({ type: 'warning', message: 'Add a professional summary section.' });
  }

  sections.summary = { score: summaryScore, max: 15, percentage: (summaryScore / 15) * 100 };
  score += summaryScore;

  // 3. Work Experience (25 points)
  let experienceScore = 0;
  const experience = resumeData.experience || [];

  if (experience.length > 0) {
    experienceScore += 5;

    // Check for action verbs
    const actionVerbs = /developed|managed|led|created|implemented|designed|achieved|increased|decreased|improved|analyzed|coordinated|supervised|trained|negotiated|launched|executed|delivered/gi;

    experience.forEach((exp, index) => {
      const description = exp.description || '';
      const actionMatches = description.match(actionVerbs);

      if (actionMatches && actionMatches.length >= 2) {
        experienceScore += 3;
      } else {
        feedback.push({ type: 'tip', message: `Use more action verbs in experience #${index + 1}` });
      }

      // Check for quantifiable results
      const quantifiablePattern = /(\d+%|\d+\+|\$\d+|\d+ (years|months|people|team|projects))/gi;
      if (quantifiablePattern.test(description)) {
        experienceScore += 4;
      } else {
        feedback.push({ type: 'warning', message: `Add quantifiable achievements to experience #${index + 1}` });
      }
    });

    // Cap at 25
    experienceScore = Math.min(experienceScore, 25);
  } else {
    feedback.push({ type: 'error', message: 'Work experience section is empty' });
  }

  sections.experience = { score: experienceScore, max: 25, percentage: (experienceScore / 25) * 100 };
  score += experienceScore;

  // 4. Education (10 points)
  let educationScore = 0;
  const education = resumeData.education || [];

  if (education.length > 0) {
    educationScore += 5;

    education.forEach(edu => {
      if (edu.degree) educationScore += 2;
      if (edu.institution) educationScore += 2;
      if (edu.year) educationScore += 1;
    });

    educationScore = Math.min(educationScore, 10);
  } else {
    feedback.push({ type: 'warning', message: 'Education section is missing' });
  }

  sections.education = { score: educationScore, max: 10, percentage: (educationScore / 10) * 100 };
  score += educationScore;

  // 5. Skills (20 points)
  let skillsScore = 0;
  const skills = resumeData.skills || [];

  if (skills.length > 0) {
    skillsScore += 5;

    if (skills.length >= 5) skillsScore += 5;
    else if (skills.length >= 3) skillsScore += 3;

    if (skills.length >= 10) skillsScore += 5;
    else if (skills.length >= 7) skillsScore += 3;

    // Check for technical/soft skills balance
    const softSkills = ['communication', 'leadership', 'teamwork', 'problem-solving', 'time management', 'critical thinking'];
    const hasSoftSkills = skills.some(skill =>
      softSkills.some(soft => skill.toLowerCase().includes(soft.toLowerCase()))
    );

    if (hasSoftSkills) {
      skillsScore += 5;
    } else {
      feedback.push({ type: 'tip', message: 'Include soft skills like communication, leadership, teamwork.' });
    }

    skillsScore = Math.min(skillsScore, 20);
  } else {
    feedback.push({ type: 'error', message: 'Skills section is missing' });
  }

  sections.skills = { score: skillsScore, max: 20, percentage: (skillsScore / 20) * 100 };
  score += skillsScore;

  // 6. Formatting (10 points)
  let formattingScore = 10;
  const fullText = resumeData.rawText || '';

  // Check for proper structure
  if (!fullText.includes('@') && !resumeData.email) {
    formattingScore -= 2;
  }

  // Check length
  if (fullText.length < 300) {
    formattingScore -= 3;
    feedback.push({ type: 'warning', message: 'Resume content is too short' });
  } else if (fullText.length > 5000) {
    formattingScore -= 2;
    feedback.push({ type: 'tip', message: 'Resume might be too long. Keep it concise.' });
  }

  formattingScore = Math.max(formattingScore, 0);
  sections.formatting = { score: formattingScore, max: 10, percentage: (formattingScore / 10) * 100 };
  score += formattingScore;

  // 7. Keywords (10 points)
  let keywordsScore = 0;
  const industryKeywords = [
    'project', 'management', 'development', 'analysis', 'strategy',
    'implementation', 'optimization', 'collaboration', 'innovation',
    'customer', 'client', 'stakeholder', 'budget', 'deadline',
    'technical', 'software', 'data', 'process', 'solution'
  ];

  const foundKeywords = industryKeywords.filter(keyword =>
    fullText.toLowerCase().includes(keyword.toLowerCase())
  );

  keywordsScore = Math.min(Math.floor(foundKeywords.length * 0.8), 10);
  sections.keywords = {
    score: keywordsScore,
    max: 10,
    percentage: (keywordsScore / 10) * 100,
    found: foundKeywords
  };
  score += keywordsScore;

  return {
    overallScore: Math.min(score, 100),
    grade: getGrade(score),
    sections,
    feedback,
    improvements: feedback.filter(f => f.type === 'error' || f.type === 'warning').length,
    tips: feedback.filter(f => f.type === 'tip').length
  };
};

const getGrade = (score) => {
  if (score >= 90) return { letter: 'A+', label: 'Excellent', color: '#10b981' };
  if (score >= 80) return { letter: 'A', label: 'Very Good', color: '#22c55e' };
  if (score >= 70) return { letter: 'B', label: 'Good', color: '#84cc16' };
  if (score >= 60) return { letter: 'C', label: 'Fair', color: '#eab308' };
  if (score >= 50) return { letter: 'D', label: 'Needs Work', color: '#f97316' };
  return { letter: 'F', label: 'Poor', color: '#ef4444' };
};

// ============================================
// RESUME PARSING
// ============================================

const parseResumeText = (text) => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  const data = {
    rawText: text,
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    location: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  };

  // Extract email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) data.email = emailMatch[0];

  // Extract phone
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) data.phone = phoneMatch[0];

  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9-]+/i);
  if (linkedinMatch) data.linkedin = `https://${linkedinMatch[0]}`;

  // Extract name (usually first line)
  if (lines.length > 0 && !lines[0].includes('@') && !lines[0].includes('http')) {
    data.name = lines[0];
  }

  // Extract skills (look for common skill keywords)
  const skillKeywords = [
    'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'html', 'css',
    'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'aws', 'docker',
    'git', 'agile', 'scrum', 'project management', 'communication', 'leadership',
    'problem solving', 'teamwork', 'excel', 'powerpoint', 'word', 'photoshop',
    'figma', 'sketch', 'adobe', 'seo', 'marketing', 'sales', 'analysis'
  ];

  const foundSkills = skillKeywords.filter(skill =>
    text.toLowerCase().includes(skill.toLowerCase())
  );
  data.skills = [...new Set(foundSkills)];

  // Look for sections
  const sectionPatterns = {
    summary: /(?:summary|objective|about|profile)[\s:]+([^]*?)(?=\n(?:experience|education|skills|projects|work|employment|certifications)|$)/i,
    experience: /(?:experience|work|employment)[\s:]+([^]*?)(?=\n(?:education|skills|projects|certifications)|$)/i,
    education: /(?:education|qualifications|academic)[\s:]+([^]*?)(?=\n(?:skills|projects|certifications)|$)/i
  };

  const summaryMatch = text.match(sectionPatterns.summary);
  if (summaryMatch) {
    data.summary = summaryMatch[1].trim().substring(0, 500);
  }

  // Parse experience section
  const expMatch = text.match(sectionPatterns.experience);
  if (expMatch) {
    const expText = expMatch[1];
    // Split by common patterns (dates, company names, etc.)
    const expEntries = expText.split(/\n(?=\d{4}|[A-Z][a-z]+\s+\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))/i);
    data.experience = expEntries.slice(0, 5).map((entry, idx) => ({
      id: idx + 1,
      title: `Position ${idx + 1}`,
      company: 'Company',
      duration: '',
      description: entry.trim().substring(0, 500)
    }));
  }

  // Parse education section
  const eduMatch = text.match(sectionPatterns.education);
  if (eduMatch) {
    const eduText = eduMatch[1];
    const eduEntries = eduText.split(/\n(?=\d{4}|Bachelor|Master|PhD|B\.|M\.|Doctor)/i);
    data.education = eduEntries.slice(0, 3).map((entry, idx) => ({
      id: idx + 1,
      degree: entry.split('\n')[0]?.trim() || `Degree ${idx + 1}`,
      institution: 'Institution',
      year: '',
      description: entry.trim().substring(0, 300)
    }));
  }

  return data;
};

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Resume Builder API is running' });
});

// Upload and parse resume
app.post('/api/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    let text = '';

    // Parse based on file type
    if (fileType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } else if (fileType.includes('wordprocessingml') || fileType === 'application/msword') {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
    }

    // Parse the resume text
    const resumeData = parseResumeText(text);

    // Calculate ATS score
    const atsResult = calculateATSScore(resumeData);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      data: resumeData,
      atsScore: atsResult
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

// Calculate ATS score from data
app.post('/api/analyze', (req, res) => {
  try {
    const resumeData = req.body;
    const atsResult = calculateATSScore(resumeData);
    res.json({ success: true, atsScore: atsResult });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// Job match score
app.post('/api/job-match', (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    if (!resume || !jobDescription) {
      return res.status(400).json({ error: 'Resume and job description are required' });
    }

    const resumeText = (resume.rawText || '').toLowerCase();
    const jobText = jobDescription.toLowerCase();

    // Extract keywords from job description
    const words = jobText.match(/\b[a-z]+\b/g) || [];
    const keywords = [...new Set(words.filter(word => word.length > 3))];

    // Calculate match
    const matchedKeywords = keywords.filter(keyword => resumeText.includes(keyword));
    const matchScore = Math.round((matchedKeywords.length / keywords.length) * 100);

    // Find missing important keywords
    const importantKeywords = keywords.filter(keyword =>
      jobText.split(keyword).length > 2 // appears more than once
    );
    const missingKeywords = importantKeywords.filter(keyword => !resumeText.includes(keyword));

    res.json({
      success: true,
      matchScore: Math.min(matchScore, 100),
      matchedKeywords: matchedKeywords.slice(0, 20),
      missingKeywords: missingKeywords.slice(0, 10),
      totalKeywords: keywords.length
    });
  } catch (error) {
    console.error('Job match error:', error);
    res.status(500).json({ error: 'Failed to calculate job match' });
  }
});

// Skills database
app.get('/api/skills/:category', (req, res) => {
  const { category } = req.params;

  const skillsDatabase = {
    'software': [
      'JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'React', 'Node.js', 'Angular', 'Vue.js',
      'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Git', 'REST APIs', 'GraphQL',
      'HTML', 'CSS', 'SASS', 'Redux', 'Next.js', 'Express.js', 'Django', 'Flask', 'Spring Boot'
    ],
    'marketing': [
      'SEO', 'SEM', 'Google Analytics', 'Social Media Marketing', 'Content Marketing',
      'Email Marketing', 'PPC', 'Facebook Ads', 'Google Ads', 'Copywriting',
      'Brand Management', 'Market Research', 'CRM', 'HubSpot', 'Mailchimp', 'A/B Testing'
    ],
    'finance': [
      'Financial Analysis', 'Excel', 'Financial Modeling', 'Budgeting', 'Forecasting',
      'Accounting', 'QuickBooks', 'SAP', 'Bloomberg Terminal', 'Risk Management',
      'Investment Analysis', 'Valuation', 'M&A', 'Portfolio Management', 'Tax Planning'
    ],
    'design': [
      'Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe XD', 'Sketch',
      'UI/UX Design', 'Wireframing', 'Prototyping', 'User Research', 'Design Systems',
      'Typography', 'Color Theory', 'Responsive Design', 'InVision', 'Canva'
    ],
    'management': [
      'Project Management', 'Agile', 'Scrum', 'JIRA', 'Team Leadership',
      'Strategic Planning', 'Budgeting', 'Stakeholder Management', 'Risk Management',
      'Change Management', 'Process Improvement', 'KPI Tracking', 'MS Project', 'Trello'
    ],
    'soft': [
      'Communication', 'Leadership', 'Problem Solving', 'Critical Thinking', 'Teamwork',
      'Time Management', 'Adaptability', 'Creativity', 'Attention to Detail', 'Negotiation',
      'Conflict Resolution', 'Emotional Intelligence', 'Decision Making', 'Presentation Skills'
    ]
  };

  const skills = skillsDatabase[category.toLowerCase()] || skillsDatabase['soft'];
  res.json({ success: true, category, skills });
});

// Cover letter templates
app.get('/api/cover-letter-templates', (req, res) => {
  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Formal and traditional approach',
      template: `Dear Hiring Manager,

I am writing to express my strong interest in the {position} position at {company}. With my background in {field} and proven track record of {achievement}, I am confident in my ability to contribute effectively to your team.

{customParagraph}

I would welcome the opportunity to discuss how my skills and experience align with your needs. Thank you for considering my application.

Sincerely,
{name}`
    },
    {
      id: 'enthusiastic',
      name: 'Enthusiastic',
      description: 'Energetic and passionate tone',
      template: `Dear {company} Team,

I was thrilled to discover the {position} opportunity at {company}! As someone who is deeply passionate about {field}, I knew immediately that this role would be a perfect match for my skills and aspirations.

{customParagraph}

I am excited about the possibility of bringing my energy and expertise to your team. I would love to discuss how I can contribute to {company}'s continued success.

Best regards,
{name}`
    },
    {
      id: 'career-change',
      name: 'Career Change',
      description: 'For transitioning to a new field',
      template: `Dear Hiring Manager,

While my background is in {previousField}, I am eager to transition into {field} and believe my transferable skills make me a strong candidate for the {position} role at {company}.

{customParagraph}

I am committed to this career change and have been actively developing relevant skills. I would appreciate the opportunity to discuss how my unique perspective could benefit your team.

Sincerely,
{name}`
    },
    {
      id: 'fresher',
      name: 'Fresh Graduate',
      description: 'For entry-level positions',
      template: `Dear Hiring Manager,

As a recent graduate with a degree in {degree}, I am excited to apply for the {position} position at {company}. My academic training and internship experience have prepared me to contribute meaningfully to your team.

{customParagraph}

I am eager to begin my professional career with a company like {company} that values growth and innovation. Thank you for considering my application.

Sincerely,
{name}`
    }
  ];

  res.json({ success: true, templates });
});

// ============================================
// AUTHENTICATION
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || 'resume-builder-secret-key-2024';

// In-memory user store (replace with database in production)
const users = [];
const userResumes = {};
const resumeAnalytics = {};

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      provider: 'email',
      createdAt: new Date().toISOString()
    };

    users.push(user);
    userResumes[user.id] = [];
    resumeAnalytics[user.id] = { views: 0, downloads: 0, shares: 0 };

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, provider: user.provider }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, provider: user.provider }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google OAuth (simulated - in production use passport.js with Google strategy)
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token: googleToken, name, email, picture } = req.body;

    // Find or create user
    let user = users.find(u => u.email === email);

    if (!user) {
      user = {
        id: uuidv4(),
        name,
        email,
        password: null,
        provider: 'google',
        picture,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      userResumes[user.id] = [];
      resumeAnalytics[user.id] = { views: 0, downloads: 0, shares: 0 };
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, provider: user.provider, picture: user.picture }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

// GitHub OAuth (simulated - in production use passport.js with GitHub strategy)
app.post('/api/auth/github', async (req, res) => {
  try {
    const { code, name, email, avatar_url } = req.body;

    // Find or create user
    let user = users.find(u => u.email === email);

    if (!user) {
      user = {
        id: uuidv4(),
        name,
        email: email || `github-${uuidv4()}@users.noreply.github.com`,
        password: null,
        provider: 'github',
        picture: avatar_url,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      userResumes[user.id] = [];
      resumeAnalytics[user.id] = { views: 0, downloads: 0, shares: 0 };
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, provider: user.provider, picture: user.picture }
    });
  } catch (error) {
    console.error('GitHub auth error:', error);
    res.status(500).json({ error: 'GitHub authentication failed' });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    success: true,
    user: { id: user.id, name: user.name, email: user.email, provider: user.provider, picture: user.picture }
  });
});

// ============================================
// RESUME MANAGEMENT
// ============================================

// Save resume
app.post('/api/resumes', authMiddleware, (req, res) => {
  try {
    const { resumeData, name } = req.body;
    const resume = {
      id: uuidv4(),
      name: name || 'Untitled Resume',
      data: resumeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      downloads: 0
    };

    if (!userResumes[req.user.id]) {
      userResumes[req.user.id] = [];
    }
    userResumes[req.user.id].push(resume);

    res.json({ success: true, resume });
  } catch (error) {
    console.error('Save resume error:', error);
    res.status(500).json({ error: 'Failed to save resume' });
  }
});

// Get user resumes
app.get('/api/resumes', authMiddleware, (req, res) => {
  const resumes = userResumes[req.user.id] || [];
  res.json({ success: true, resumes });
});

// Delete resume
app.delete('/api/resumes/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    if (!userResumes[req.user.id]) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    userResumes[req.user.id] = userResumes[req.user.id].filter(r => r.id !== id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

// ============================================
// RESUME ANALYTICS
// ============================================

// Track resume view
app.post('/api/analytics/view/:resumeId', (req, res) => {
  try {
    const { resumeId } = req.params;
    // Find resume and increment views
    for (const userId in userResumes) {
      const resume = userResumes[userId].find(r => r.id === resumeId);
      if (resume) {
        resume.views = (resume.views || 0) + 1;
        if (resumeAnalytics[userId]) {
          resumeAnalytics[userId].views++;
        }
        return res.json({ success: true, views: resume.views });
      }
    }
    res.status(404).json({ error: 'Resume not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// Track resume download
app.post('/api/analytics/download/:resumeId', (req, res) => {
  try {
    const { resumeId } = req.params;
    for (const userId in userResumes) {
      const resume = userResumes[userId].find(r => r.id === resumeId);
      if (resume) {
        resume.downloads = (resume.downloads || 0) + 1;
        if (resumeAnalytics[userId]) {
          resumeAnalytics[userId].downloads++;
        }
        return res.json({ success: true, downloads: resume.downloads });
      }
    }
    res.status(404).json({ error: 'Resume not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track download' });
  }
});

// Get analytics
app.get('/api/analytics', authMiddleware, (req, res) => {
  const analytics = resumeAnalytics[req.user.id] || { views: 0, downloads: 0, shares: 0 };
  const resumes = userResumes[req.user.id] || [];

  const totalViews = resumes.reduce((sum, r) => sum + (r.views || 0), 0);
  const totalDownloads = resumes.reduce((sum, r) => sum + (r.downloads || 0), 0);

  res.json({
    success: true,
    analytics: {
      totalViews,
      totalDownloads,
      totalResumes: resumes.length,
      resumeStats: resumes.map(r => ({
        id: r.id,
        name: r.name,
        views: r.views || 0,
        downloads: r.downloads || 0,
        createdAt: r.createdAt
      }))
    }
  });
});

// ============================================
// WORD EXPORT
// ============================================

app.post('/api/export/word', async (req, res) => {
  try {
    const { resumeData } = req.body;

    const sections = [];

    // Header - Name
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resumeData.name || 'Your Name',
            bold: true,
            size: 48,
            color: '2563eb'
          })
        ],
        alignment: AlignmentType.CENTER
      })
    );

    // Contact info
    const contactParts = [];
    if (resumeData.email) contactParts.push(resumeData.email);
    if (resumeData.phone) contactParts.push(resumeData.phone);
    if (resumeData.location) contactParts.push(resumeData.location);
    if (resumeData.linkedin) contactParts.push(resumeData.linkedin);

    if (contactParts.length > 0) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: contactParts.join(' | '),
              size: 22,
              color: '666666'
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 }
        })
      );
    }

    // Professional Summary
    if (resumeData.summary) {
      sections.push(
        new Paragraph({
          text: 'PROFESSIONAL SUMMARY',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { before: 300, after: 100 }
        })
      );
      sections.push(
        new Paragraph({
          text: resumeData.summary,
          spacing: { after: 200 }
        })
      );
    }

    // Experience
    if (resumeData.experience?.length > 0) {
      sections.push(
        new Paragraph({
          text: 'WORK EXPERIENCE',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { before: 300, after: 100 }
        })
      );

      resumeData.experience.forEach(exp => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: exp.title || 'Job Title', bold: true, size: 26 }),
              new TextRun({ text: ` | ${exp.company || 'Company'}`, size: 24 })
            ]
          })
        );
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: exp.duration || '', italics: true, size: 22, color: '666666' })
            ],
            spacing: { after: 100 }
          })
        );
        if (exp.description) {
          sections.push(
            new Paragraph({
              text: exp.description,
              spacing: { after: 200 }
            })
          );
        }
      });
    }

    // Education
    if (resumeData.education?.length > 0) {
      sections.push(
        new Paragraph({
          text: 'EDUCATION',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { before: 300, after: 100 }
        })
      );

      resumeData.education.forEach(edu => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: edu.degree || 'Degree', bold: true, size: 26 }),
              new TextRun({ text: ` | ${edu.institution || 'Institution'}`, size: 24 })
            ]
          })
        );
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: edu.year || '', italics: true, size: 22, color: '666666' })
            ],
            spacing: { after: 200 }
          })
        );
      });
    }

    // Skills
    if (resumeData.skills?.length > 0) {
      sections.push(
        new Paragraph({
          text: 'SKILLS',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { before: 300, after: 100 }
        })
      );
      sections.push(
        new Paragraph({
          text: resumeData.skills.join(' • '),
          spacing: { after: 200 }
        })
      );
    }

    // Projects
    if (resumeData.projects?.length > 0) {
      sections.push(
        new Paragraph({
          text: 'PROJECTS',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { before: 300, after: 100 }
        })
      );

      resumeData.projects.forEach(proj => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: proj.name || 'Project Name', bold: true, size: 26 })
            ]
          })
        );
        if (proj.technologies) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: `Technologies: ${proj.technologies}`, italics: true, size: 22, color: '666666' })
              ],
              spacing: { after: 50 }
            })
          );
        }
        if (proj.description) {
          sections.push(
            new Paragraph({
              text: proj.description,
              spacing: { after: 200 }
            })
          );
        }
      });
    }

    // Certifications
    if (resumeData.certifications?.length > 0) {
      sections.push(
        new Paragraph({
          text: 'CERTIFICATIONS',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { before: 300, after: 100 }
        })
      );

      resumeData.certifications.forEach(cert => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: cert.name || 'Certification', bold: true }),
              new TextRun({ text: ` - ${cert.issuer || 'Issuer'} (${cert.year || ''})`, size: 22 })
            ],
            spacing: { after: 100 }
          })
        );
      });
    }

    // Languages
    if (resumeData.languages?.length > 0) {
      sections.push(
        new Paragraph({
          text: 'LANGUAGES',
          heading: HeadingLevel.HEADING_2,
          thematicBreak: true,
          spacing: { before: 300, after: 100 }
        })
      );
      sections.push(
        new Paragraph({
          text: resumeData.languages.map(l => `${l.name} (${l.level})`).join(' • '),
          spacing: { after: 200 }
        })
      );
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${resumeData.name || 'resume'}.docx"`);
    res.send(buffer);

  } catch (error) {
    console.error('Word export error:', error);
    res.status(500).json({ error: 'Failed to export Word document' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Resume Builder API running on http://localhost:${PORT}`);
});
