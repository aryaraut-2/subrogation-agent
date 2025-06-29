import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

const UploadBox = ({ onFileUpload, uploadedFile, fileContent }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files[0] && files[0].name.endsWith('.txt')) {
      onFileUpload(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.txt')) {
      onFileUpload(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop your claim file here
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Only .txt files are accepted
        </p>
        <input
          type="file"
          accept=".txt"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Choose File
        </label>
      </div>
      
      {uploadedFile && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              {uploadedFile.name}
            </span>
          </div>
        </div>
      )}

      {fileContent && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">File Content:</h3>
          <div className="bg-white border border-gray-200 rounded p-3 max-h-64 overflow-y-auto text-sm text-gray-600">
            <pre className="whitespace-pre-wrap">{fileContent}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadBox;