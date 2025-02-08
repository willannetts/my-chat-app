import React, { useState } from 'react';
import OpenAI from 'openai';
import './ChatInterface.css';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          ...messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          { role: "user", content: inputMessage }
        ],
        model: "gpt-3.5-turbo",
      });

      const botResponse = {
        content: completion.choices[0].message.content,
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        content: "Sorry, there was an error processing your request.",
        sender: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
          {isLoading && (
            <div className="message-wrapper assistant">
              <div className="message-content">
                <div className="avatar">🤖</div>
                <div className="message-text">
                  <div className="loading-dots">Thinking...</div>
                </div>
              </div>
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 