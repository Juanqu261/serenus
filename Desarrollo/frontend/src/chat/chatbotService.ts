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

/**
 * Envía un mensaje a la API de IA y devuelve la respuesta
 * @param message El mensaje a enviar a la IA
 * @returns La respuesta procesada de la IA
 */
export async function sendMessageToIA(message: string): Promise<string> {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/ia/', {
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
    // La respuesta contiene un campo 'response' con el mensaje de la IA
    return data.response || 'No se recibió respuesta.'; 
  } catch (error) {
    console.error('Error al comunicarse con la IA:', error);
    return 'Error al comunicarse con el servicio de IA.';
  }
}
