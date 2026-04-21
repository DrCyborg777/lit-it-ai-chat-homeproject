/**
 * AI Chat Application
 * Communicates with FastAPI backend to provide streaming AI responses
 * Features: conversation memory, real-time streaming, search interface
 */

import { useState, useRef } from "react";
import { IoSearch, IoClose } from "react-icons/io5";

function App() {
  // =====================================================
  // STATE MANAGEMENT
  // =====================================================
  const [search, setSearch] = useState("");                      // Current input text
  const [aiResponse, setAiResponse] = useState("");              // Streaming AI response
  const [conversationHistory, setConversationHistory] = useState([]); // Full chat history
  const [isStreaming, setIsStreaming] = useState(false);         // Streaming status
  const inputRef = useRef(null);                                 // Reference to input field

  // =====================================================
  // FETCH AI RESPONSE
  // =====================================================
  /**
   * Sends query to backend and streams response
   * @param {string} query - User's question
   */
  const fetchAI = async (query) => {
    // Reset states
    setAiResponse("");
    setIsStreaming(true);
    
    // Build messages array with conversation history
    const messages = [
      ...conversationHistory,
      { role: "User", content: query }
    ];

    // Send POST request to backend
    const res = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages })  // Send full conversation
    });
    
    // Set up streaming reader
    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";
    
    // Read stream token by token
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;  // Stream complete
      
      const chunk = decoder.decode(value);
      fullText += chunk;
      setAiResponse(fullText);  // Update UI in real-time
    }

    // Save conversation to history
    setConversationHistory(prev => [
      ...prev,
      { role: "User", content: query },
      { role: "Assistant", content: fullText }
    ]);
    
    // Clean up
    setAiResponse("");
    setIsStreaming(false);
    setSearch("");
  };

  // =====================================================
  // RENDER UI
  // =====================================================
  return (
    <div className="app-container">
      
      {/* ========== HEADER ========== */}
      <div className="header">
        {/* Logo */}
        <a href="/">
          <img
            src="src/images/Header-pic.png"
            alt="LIT_IT"
            className="logo"
          />
        </a>

        {/* Search Input */}
        <div className="search-container">
          <input
            ref={inputRef}
            type="search"
            placeholder="Ask AI anything..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                fetchAI(inputRef.current.value);
              }
            }}
            className="search-input"
          />
          
          {/* Search Icon */}
          <IoSearch className="search-icon" size={18} />

          {/* Clear Button (shows only when there's text) */}
          {search && (
            <button 
              className="clear-btn"
              onClick={() => {
                setSearch("");
                setAiResponse("");
              }}
              aria-label="Clear search"
            >
              <IoClose/>
            </button>
          )}
        </div>
      </div>

      {/* ========== CHAT DISPLAY ========== */}
      <div className="chat-container">
        <div className="chat-card">
          <div className="chat-content">
            
            {/* Display conversation history */}
            {conversationHistory.map((msg, idx) => (
              <div key={idx} className="message">
                <strong className={msg.role === "User" ? "user-label" : "assistant-label"}>
                  {msg.role}:
                </strong>
                <p className="message-text">
                  {msg.content}
                </p>
              </div>
            ))}

            {/* Display streaming response (only while streaming) */}
            {isStreaming && (
              <div className="message">
                <strong className="assistant-label">Assistant:</strong>
                <p className="message-text">
                  {aiResponse}
                </p>
              </div>
            )}

            {/* Placeholder (shows when chat is empty) */}
            {conversationHistory.length === 0 && !isStreaming && (
              <h3 className="ai-placeholder">Start a conversation...</h3>
            )}
          </div>
        </div>
      </div>

      {/* ========== FOOTER ========== */}
      <footer className="footer">
        <div className="copyright">
          <span className="copyright-year">Copyright © 2026</span>{" "}
          <span className="copyright-name">Earl.</span>{" "}
          <span className="copyright-rights">All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;