import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import UploadBox from './components/UploadBox';
import AnalyzePanel from './components/AnalyzePanel';
import ChatBot from './components/ChatBot';

const App = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [letterResult, setLetterResult] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // API base URL - adjust as needed
  const API_BASE = 'https://subrogation-agent-backend.onrender.com';


  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setAnalysisResult(null);
    setLetterResult(null);

    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileContent(e.target.result);
    };
    reader.readAsText(file);

    // Upload file to backend
    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleAnalyze = async (content) => {
    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const result = await response.json();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisResult({
        recoverable: false,
        confidence: 0,
        explanation: 'Analysis failed. Please try again.'
      });
    }
  };

  const handleGenerateLetter = async (content) => {
    try {
      const response = await fetch(`${API_BASE}/generate_letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claim: content,
          claimant_name: "Arya Raut"
        }),
      });

      const result = await response.json();
      const letterUrl = `${API_BASE}${result.download_url}`;

      // Fetch and display letter content
      const letterResponse = await fetch(letterUrl);
      const blob = await letterResponse.blob();
      const text = await blob.text();

      setLetterResult({
        content: text,
        downloadUrl: letterUrl,
        filename: 'demand_letter.txt'
      });

      // Auto download
      const a = document.createElement('a');
      a.href = letterUrl;
      a.download = 'demand_letter.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (error) {
      console.error('Letter generation failed:', error);
      setLetterResult({
        content: 'Letter generation failed. Please try again.',
        filename: 'error.txt'
      });
    }
  };

  const handleSendMessage = async (message) => {
    const newChat = { message, response: null };
    setChatHistory(prev => [...prev, newChat]);
    setIsChatLoading(true);

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: message }), // ✅ FIXED key
      });

      const result = await response.json();
      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].response = result.answer || result.message || 'No response received';
        return updated;
      });
    } catch (error) {
      console.error('Chat failed:', error);
      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].response = 'Sorry, I encountered an error. Please try again.';
        return updated;
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Subrogation Recovery Agent
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-160px)]">
          {/* Left Panel - Claim Workflow */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Claim Analysis
              </h2>
              <UploadBox
                onFileUpload={handleFileUpload}
                uploadedFile={uploadedFile}
                fileContent={fileContent}
              />
            </div>

            <AnalyzePanel
              fileContent={fileContent}
              onAnalyze={handleAnalyze}
              analysisResult={analysisResult}
              onGenerateLetter={handleGenerateLetter}
              letterResult={letterResult}
            />
          </div>

          {/* Right Panel - AI Chat */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
            <ChatBot
              onSendMessage={handleSendMessage}
              chatHistory={chatHistory}
              isLoading={isChatLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
