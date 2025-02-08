import React, { useState } from 'react';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const newMessage = {
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    const botResponse = {
      content: 'This is a simulated response.',
      sender: 'assistant',
      timestamp: new Date().toISOString(),
    };

    setTimeout(() => {
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <button className="new-chat">+ New chat</button>
        <div className="history-list">
          {/* Chat history items would go here */}
        </div>
      </div>
      <div className="main-content">
        <div className="chat-history">
          {messages.length === 0 ? (
            <div className="empty-state">
              <h1>ChatGPT Clone</h1>
              <div className="examples">
                <div className="example-group">
                  <h3>Examples</h3>
                  <button>"Explain quantum computing in simple terms"</button>
                  <button>"Got any creative ideas for a 10 year old's birthday?"</button>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`message-wrapper ${message.sender}`}>
                <div className="message-content">
                  <div className="avatar">
                    {message.sender === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="message-text">
                    {message.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="input-container">
          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Send a message..."
              className="message-input"
            />
            <button type="submit" className="send-button" disabled={!inputMessage.trim()}>
              <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M6 12L3 3l18 9-18 9 3-9z" />
              </svg>
            </button>
          </form>
          <div className="input-footer">
            Free Research Preview. ChatGPT may produce inaccurate information.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 