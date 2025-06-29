## SUBROGATION RECOVERY AGENT AND ASSISTANT

## Problem statement 
Manual subrogation processes are often time-consuming and error-prone, leading to delays and missed recovery opportunities. Drafting legal demand letters typically requires legal expertise and consumes valuable resources. Additionally, poor communication between parties can hinder the success of claim recoveries. Policyholders and insurance agents also struggle to interpret complex policy terms, leading to confusion and inefficient claim handling.

## What the Agent Does

- Upload a `.txt` claim file, which the agent extracts and displays on screen.  
- Analyze the claim’s recoverability using AI, providing a confidence score in percentage.  
- If not recoverable, offer a clear, simple explanation of why.  
- Generate a legally formatted demand letter based on stored templates upon request.  
- Provide the demand letter as a downloadable `.txt` file.  
- Include an AI chat agent that answers questions from insurers, customers, or third parties with accurate, context-aware information related to subrogation and insurance.

## Technologies Used

- **Flask**: Lightweight and flexible Python web framework used to build the backend API. It handles file uploads, claim analysis, demand letter generation, and serves the React frontend.

- **Gemini 1.5 Flash (GenAI model)**: Advanced generative AI model powering claim recoverability analysis, demand letter creation, and the intelligent chat agent. Chosen for its strong natural language understanding and ability to provide accurate, context-aware legal insights.

- **React**: Modern JavaScript library used to build a responsive, interactive frontend user interface. React manages file uploads, displays analysis results, demand letters, and provides a smooth chat experience.

## Run the Code

1. Clone git- git clone https://github.com/aryaraut-2/subrogation-agent.git
2.  INSTALL ALL THE REQUIREMENTS.TXT
   For Backend
- cd backend
- pip install flask flask-cors requests gemini-sdk
- python app.py

  For Frontend
- cd frontend
- npm install
- npm run dev
3. Open the frontend file in brower 
upload the documents, analyze , generate and ask questions to assistant

## Why It’s Better and Its Impact

This agent automates complex subrogation claim analysis, saving time and reducing human error. By providing clear recoverability predictions with confidence scores and simple explanations, it helps insurers make faster, informed decisions. Generating legally formatted demand letters instantly streamlines legal workflows. The integrated AI chat supports stakeholders with quick, accurate answers, improving customer service and transparency. Overall, it boosts efficiency, accuracy, and trust in insurance claim handling.

## Future Scope

Multi-format document support: Extend file uploads to PDFs, Word documents, and images with OCR.
Advanced NLP models: Integrate latest GenAI models for deeper legal understanding and better explanations.
Multilingual support: Enable claim analysis and chat in multiple languages to serve wider markets.
Real-time collaboration: Allow multiple users (adjusters, lawyers) to review and comment on claims simultaneously.
Dashboard & analytics: Add visual insights on claim trends, success rates, and risk factors.
Mobile app: Develop a mobile interface for on-the-go claim management and AI assistance.


