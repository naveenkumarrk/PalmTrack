import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatbotInterface = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!question.trim()) return;

    // Add user message to chat
    const userMessage = { type: 'user', content: question };
    setMessages([...messages, userMessage]);
    
    // Clear input
    setQuestion('');
    setLoading(true);
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/dashboard/chat-summary`, {
        question: question.trim()
      });
      
      // Add assistant response to chat
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: res.data.response 
      }]);
    } catch (err) {
      console.error('Error sending question:', err);
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: 'Something went wrong. Please try again.',
        error: true
      }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="py-4 px-6 bg-white border-b border-gray-200">
        <h1 className="text-xl font-serif text-gray-800">Neera Plant Assistant</h1>
        <p className="text-sm text-gray-500">Ask questions about the Neera plant</p>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center p-8 border border-gray-200 rounded-lg shadow-sm">
              <p className="mb-2 font-serif">👋 How can I help you with the Neera plant today?</p>
              <p className="text-sm italic">Ask a question to get started</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3/4 p-3 rounded-lg shadow-sm ${
                  msg.type === 'user' 
                    ? 'bg-green-50 text-gray-800 border border-green-200 rounded-br-none' 
                    : msg.error 
                      ? 'bg-red-50 text-gray-800 border border-red-200 rounded-bl-none' 
                      : 'bg-gray-50 text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 p-3 border border-gray-200 rounded-lg rounded-bl-none flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex space-x-2">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about the Neera plant..."
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 placeholder-gray-400"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={loading || !question.trim()}
            className={`px-4 py-2 rounded-lg flex items-center justify-center ${
              loading || !question.trim() 
                ? 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed' 
                : 'bg-white text-green-600 border border-green-500 hover:bg-green-50'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default ChatbotInterface;