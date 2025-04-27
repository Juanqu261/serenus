<img src="Diseño/logos/LogoSerenus.png" width="500" />

*Aplicación para la prevención y acompañamiento del estrés estudiantil*  

## 📌 Descripción  
**Serenus** es una plataforma diseñada para universidades y estudiantes de Medellín, enfocada en:  
- Identificar patrones de estrés académico mediante IA.  
- Ofrecer herramientas personalizadas (ej: meditación guiada, planificación de estudios).  
- Proporcionar acompañamiento psicológico preventivo mediante chatbots y recursos educativos.  

*"Reduce la deserción universitaria causada por el estrés con soluciones basadas en datos."*  

---

## 🛠 Stack Tecnológico  

### **Backend**  
- **Django** (Python) + **Django REST Framework** (APIs).  
- Base de datos: Caso de uso SQLite3 (adaptable a cualquier motor DBMS).
- Integración con **Google Gemini API** para análisis de texto y recomendaciones personalizadas.  

### **Frontend**  
- **React** + **Vite** (rendimiento optimizado).  
- Librerías clave:
  - `react-router` direccionamiento dentro de la app.  
  - `TailwindCSS` para componentes estilizados.  

### **IA y Servicios Externos**  
- **Google Gemini API**: Procesamiento de lenguaje natural (NLP) para:  
  - Detección de emociones en diarios estudiantiles.  
  - Generación de recomendaciones en tiempo real.  

---

## 🚀 Instalación y Configuración  

### **Requisitos**  
- Python 3.10+, Node.js 18+, SQLite3.  
- Claves de API para Google Gemini (almacenadas en variables de entorno).  

### **Pasos para Backend**  
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/serenus.git

# Entrar al directorio del backend
cd serenus/backend

# Crear entorno virtual (Python)
python -m venv .venv
source venv/bin/activate  # Linux/Mac
.venv\Scripts\activate    # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno (crear archivo .env)
echo "GOOGLE_API_KEY=tu_clave_gemini" >> .env

# Asegurar que se cumplen las migraciones
python manage.py makemigrations

# Ejecutar migraciones
python manage.py migrate

# Iniciar servidor
python manage.py runserver
```

### **Pasos para Frontend**
```bash
cd ../frontend

# Instalar dependencias
npm install

# Iniciar aplicación (modo desarrollo)
npm run dev
```
