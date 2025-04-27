/**
 * Resetea la memoria de la IA
 * @returns Booleano indicando si el reseteo fue exitoso
 */
export async function resetIAMemory(): Promise<boolean> {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/ia/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reset_memory: true }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Error al resetear la memoria de la IA:', error);
    return false;
  }
}

/**
 * Envía un mensaje a la API de IA y devuelve la respuesta
 * @param message El mensaje a enviar a la IA
 * @param resetMemory Si es true, resetea la memoria de la IA antes de enviar el mensaje
 * @returns La respuesta procesada de la IA
 */
export async function sendMessageToIA(message: string, resetMemory: boolean = false): Promise<string> {
  try {
    // Si se solicita resetear la memoria, hacerlo antes de enviar el mensaje
    if (resetMemory) {
      console.log('Reseteando memoria de IA...');
      await resetIAMemory();
    }

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
