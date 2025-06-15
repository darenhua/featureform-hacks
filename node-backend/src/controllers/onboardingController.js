const onboardingController = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const onboardingService = require('../services/onboardingService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../uploads/resumes');
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to only allow specific file types
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

onboardingController.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { linkedinUrl, interests } = req.body;
    const resumeFile = req.file;

    // Validate required fields
    if (!linkedinUrl || !linkedinUrl.trim()) {
      return res.status(400).json({ 
        error: 'LinkedIn URL is required' 
      });
    }

    if (!interests) {
      return res.status(400).json({ 
        error: 'Interests are required' 
      });
    }

    if (!resumeFile) {
      return res.status(400).json({ 
        error: 'Resume file is required' 
      });
    }

    // Parse interests from JSON string
    let parsedInterests;
    try {
      parsedInterests = JSON.parse(interests);
      if (!Array.isArray(parsedInterests) || parsedInterests.length === 0) {
        return res.status(400).json({ 
          error: 'At least one interest must be selected' 
        });
      }
    } catch (error) {
      return res.status(400).json({ 
        error: 'Invalid interests format' 
      });
    }

    // Validate LinkedIn URL format (basic validation)
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    if (!linkedinRegex.test(linkedinUrl)) {
      return res.status(400).json({ 
        error: 'Please enter a valid LinkedIn profile URL' 
      });
    }

    // Process the onboarding data
    const onboardingData = {
      linkedinUrl: linkedinUrl.trim(),
      interests: parsedInterests,
      resume: {
        originalName: resumeFile.originalname,
        filename: resumeFile.filename,
        path: resumeFile.path,
        size: resumeFile.size,
        mimeType: resumeFile.mimetype
      },
      submittedAt: new Date().toISOString()
    };

    // Save to Supabase database
    const savedData = await onboardingService.saveOnboardingData(onboardingData);
    
    console.log('Onboarding data saved successfully:', {
      id: savedData.id,
      linkedinUrl: onboardingData.linkedinUrl,
      interests: onboardingData.interests,
      resumeFile: onboardingData.resume.filename
    });

    // Return success response
    res.status(200).json({
      message: 'Onboarding data submitted successfully',
      data: {
        id: savedData.id,
        linkedinUrl: onboardingData.linkedinUrl,
        interests: onboardingData.interests,
        resumeUploaded: true,
        submittedAt: savedData.created_at
      }
    });

  } catch (error) {
    console.error('Error processing onboarding data:', error);
    
    // If file was uploaded but processing failed, clean up the file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Internal server error while processing your submission' 
    });
  }
});

module.exports = onboardingController;