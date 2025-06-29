import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const AnalyzePanel = ({ fileContent, onAnalyze, analysisResult }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [letterResult, setLetterResult] = useState(null);

  const API_BASE = 'http://localhost:5000';

  const handleAnalyze = async () => {
    if (!fileContent) return;
    setIsAnalyzing(true);
    try {
      await onAnalyze(fileContent);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateLetter = async () => {
    if (!fileContent) return;
    setIsGenerating(true);

    try {
      const response = await fetch(`${API_BASE}/generate_letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claim: fileContent,
          claimant_name: "Arya Raut",
        }),
      });

      const data = await response.json();

      setLetterResult({
        content: data.content,
        filename: data.filename || 'demand_letter.txt',
        downloadUrl: `${API_BASE}${data.download_url}`,
      });

      // Trigger download
      const blob = new Blob([data.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename || 'demand_letter.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating letter:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleAnalyze}
        disabled={!fileContent || isAnalyzing}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Analyzing...
          </>
        ) : (
          'Analyze Claim'
        )}
      </button>

      {analysisResult && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center">
            {analysisResult.recoverable ? (
              <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-6 w-6 text-red-500 mr-2" />
            )}
            <span className={`font-medium ${analysisResult.recoverable ? 'text-green-700' : 'text-red-700'}`}>
              {analysisResult.recoverable ? '✅ Recoverable' : '❌ Not Recoverable'}
            </span>
          </div>

          {analysisResult.confidence && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Confidence Score:</span> {analysisResult.confidence}%
            </div>
          )}

          {analysisResult.explanation && (
            <div className="text-sm text-gray-700">
              <span className="font-medium">Explanation:</span>
              <p className="mt-1">{analysisResult.explanation}</p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleGenerateLetter}
        disabled={!fileContent || isGenerating}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Generating...
          </>
        ) : (
          'Generate Demand Letter'
        )}
      </button>

      {letterResult?.content && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Generated Demand Letter:</h3>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
            {letterResult.content}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AnalyzePanel;
