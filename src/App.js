import React, { useState, useRef, useEffect } from 'react';
import './App.css'; 

let currentUtterance = null; 

const App = () => {
  const [queryInput, setQueryInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [micActive, setMicActive] = useState(false); 

  const sampleQuestions = [
    "What is the total GMV for yesterday?",
    "How is GMV of August 2024 compared to September 2024?",
    "What are the top 5 products by sales?",
    "Show me the revenue for the last 7 days.",
    "How many users signed up yesterday?"
  ];

  const getApiResponse = async (inputData) => {
    const apiUrl = `https://jsonplaceholder.typicode.com/comments/${inputData}`;
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json(); 
        return data.body; 
      } else {
        return `Error: ${response.status} - ${response.statusText}`;
      }
    } catch (error) {
      return `Exception occurred: ${error.message}`;
    }
  };

  const handleInputChange = async () => {
    if (queryInput.trim()) { 
      const apiResponse = await getApiResponse(queryInput);
      const botResponseText = JSON.stringify(apiResponse);

      setMessages([
        // ...messages,
        { type: 'user', text: queryInput },
        { type: 'bot', text: botResponseText },
      ]);
      setQueryInput(''); 
    }
  };

  const speak = (text) => {
    if (currentUtterance) {
      window.speechSynthesis.cancel();
    }
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang = 'en-US'; 
    window.speechSynthesis.speak(currentUtterance);
  };

  const stopSpeech = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel(); 
      currentUtterance = null; 
    }
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container">
      <h1>DataTeam LLM Chatbot</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.type}`}
          >
            {msg.text}
            {msg.type === 'bot' && (
              <span
                className="speaker-icon"
                onClick={() => speak(msg.text)} // Single-click to start reading
                onDoubleClick={stopSpeech} // Double-click to stop reading
                style={{ cursor: 'pointer', marginLeft: '10px' }}
              >
                🔊
              </span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <input
          list="sample-questions"
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleInputChange();
            }
          }}
          placeholder="Enter your query:"
        />
        <datalist id="sample-questions">
          {sampleQuestions.map((question, index) => (
            <option key={index} value={question} />
          ))}
        </datalist>
        <button 
          onClick={handleInputChange}
          disabled={!queryInput.trim()} 
          style={{ marginLeft: '10px' }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default App;
