
export async function sendMessageToBackend(message: string): Promise<string> {
  try {
    const response = await fetch('http://localhost:8000/api/chat', { // Assuming the endpoint is /api/chat
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Assuming the backend response has a 'reply' field with the bot's message
    return data.reply || 'No reply received.'; 
  } catch (error) {
    console.error('Error sending message to backend:', error);
    return 'Error communicating with the chatbot service.';
  }
}
