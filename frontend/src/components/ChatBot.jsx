import React, { useState } from 'react';
import { Bot, Send } from 'lucide-react';

const ChatBot = ({ onSendMessage, chatHistory, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b border-gray-200">
        <Bot className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">AI Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <div className="bg-blue-100 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            Hi! I'm your policy assistant. Ask me anything about subrogation, policies, or claims.
          </p>
        </div>
        
        {chatHistory.map((chat, index) => (
          <div key={index} className="space-y-2">
            <div className="bg-white rounded-lg p-3 ml-8">
              <p className="text-sm text-gray-800">{chat.message}</p>
            </div>
            {chat.response && (
              <div className="bg-blue-100 rounded-lg p-3 mr-8">
                <p className="text-sm text-blue-800">{chat.response}</p>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="bg-blue-100 rounded-lg p-3 mr-8">
            <div className="animate-pulse flex space-x-2">
              <div className="rounded-full bg-blue-300 h-2 w-2"></div>
              <div className="rounded-full bg-blue-300 h-2 w-2"></div>
              <div className="rounded-full bg-blue-300 h-2 w-2"></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && message.trim() && !isLoading) {
                onSendMessage(message);
                setMessage('');
              }
            }}
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;