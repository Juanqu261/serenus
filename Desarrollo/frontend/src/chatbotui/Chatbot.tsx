import React, { useState } from 'react';
import { sendMessageToBackend } from '../chat/chatbotService';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hola ¿Como estas?', sender: 'bot' } // Initial bot message
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu visibility

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const botReply = await sendMessageToBackend(input);
      const botMessage: Message = { text: botReply, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { text: 'Sorry, something went wrong.', sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto border rounded shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
        <h1 className="text-xl font-bold text-center flex-grow">Serenus Chatbot</h1>
        <div className="relative">
          <button onClick={toggleMenu} className="focus:outline-none">
            {/* Simple User Icon Placeholder */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {/* User Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
              <div className="block px-4 py-2 text-sm text-gray-700">
                {/* Placeholder for username */}
                Username: Student
              </div>
              {/* Add other menu items like Logout here if needed */}
            </div>
          )}
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-1 rounded-lg ${msg.sender === 'user' ? 'bg-blue-200' : 'bg-gray-300'}`}>
              {msg.text}
            </span>
          </div>
        ))}
        {isLoading && <div className="text-center text-gray-500">Bot is typing...</div>}
      </div>
      {/* Input Area */}
      <div className="p-4 border-t flex">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-grow border rounded px-2 py-1 mr-2"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;