import os
from langchain_google_genai import ChatGoogleGenerativeAI # type: ignore
from langchain.chains import ConversationChain # type: ignore
from langchain.memory import ConversationBufferMemory # type: ignore
from langchain.prompts import ( # type: ignore
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
)
from dotenv import load_dotenv # type: ignore

# Cargar variables de entorno desde el archivo .env
load_dotenv()

class PsychologyAI:
    """
    IA experta en psicología implementada con LangChain y Google Gemini.
    Mantiene memoria de la conversación para proporcionar respuestas
    contextualizadas.
    """
    
    def __init__(self):
        """Inicializa la IA con el modelo, la memoria y el prompt personalizado."""
        # Inicializar el modelo de lenguaje Gemini
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",  # Usar el modelo Gemini Pro
            temperature=0.7,
            verbose=True
        )
        
        # Inicializar la memoria de conversacion
        self.memory = ConversationBufferMemory(
            return_messages=True,
            memory_key="chat_history"
        )
        
        # Crear un prompt especializado en psicologia
        prompt = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(
                """Eres un experto en psicología con amplio conocimiento en terapia, 
                salud mental, desarrollo personal y bienestar emocional. Tu objetivo es 
                proporcionar apoyo, información y orientación basada en principios 
                psicológicos establecidos y te llamas Serenito. Recuerda que:
                \n\n1. No puedes diagnosticar condiciones médicas o psicológicas.
                \n2. Debes recomendar buscar ayuda profesional cuando sea apropiado.
                \n3. Tus respuestas deben ser empáticas, respetuosas y basadas en evidencia.
                \n4. Tu enfoque debe ser educativo y de apoyo, nunca prescriptivo.
                \n5. Debes adaptar tus respuestas al contexto de la conversación completa.
                \n6. Basándote en la respuesta del estudiante, formula una nueva pregunta que lo ayude a reflexionar más sobre el tema.
                Además, debes dar recomendaciones prácticas y accesibles para el usuario luego de la quinta pregunta y debes comenzar diciendo, 'aqui van las recomendaciones de tu amigo Serenito'.
                \n7. El limite de palabras es de 50.
                """
            ),
            MessagesPlaceholder(variable_name="chat_history"),
            HumanMessagePromptTemplate.from_template("{input}")
        ])
        
        # Crear la cadena de conversacion
        self.conversation = ConversationChain(
            llm=self.llm,
            memory=self.memory,
            prompt=prompt,
            verbose=True
        )
    
    def process_message(self, message):
        """
        Procesa un mensaje del usuario y devuelve la respuesta de la IA.
        
        Args:
            message (str): El mensaje del usuario
            
        Returns:
            str: La respuesta de la IA
        """
        return self.conversation.predict(input=message)
    
    def reset_memory(self):
        """Reinicia la memoria de la conversación."""
        self.memory.clear()

# Instancia singleton para usar en toda la aplicacion
psychology_ai = PsychologyAI()