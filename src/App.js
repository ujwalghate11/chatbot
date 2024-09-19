import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

const App = () => {
  const [queryInput, setQueryInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const getApiResponse = async (inputData) => {
    const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
    const headers = { 'Content-Type': 'application/json' };
    const payload = { title: inputData, body: 'Sample body', userId: 1 };

    try {
      const response = await axios.post(apiUrl, payload, { headers });
      if (response.status === 201) {
        return response.data;
      } else {
        return `Error: ${response.status} - ${response.statusText}`;
      }
    } catch (error) {
      return `Exception occurred: ${error.message}`;
    }
  };

  const handleInputChange = async () => {
    if (queryInput.trim()) { // Ensure input is not just whitespace
      const apiResponse = await getApiResponse(queryInput);
      const botResponseText = JSON.stringify(apiResponse);

      setMessages([
        ...messages,
        { type: 'user', text: queryInput },
        { type: 'bot', text: botResponseText },
      ]);
      setQueryInput(''); // Clear the input field after submission
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set the language of the speech
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Scroll to the end of the messages list whenever messages change
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
                onClick={() => speak(msg.text)}
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
        <button 
          onClick={handleInputChange}
          disabled={!queryInput.trim()} // Disable button if input is empty or whitespace
          style={{ marginLeft: '10px' }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default App;