# Segment: Inteligencia Artificial para la Comunidad FACYT

¡Hola! 👋 Bienvenido al repositorio oficial de Segment. Si estás aquí, es muy probable que seas estudiante de FACYT (Universidad de Carabobo) o alguien apasionado por la tecnología que busca colaborar en un proyecto con propósito.

Mi nombre es Samuel Nelo, soy estudiante de Computación y desarrollador de este proyecto. Segment nace con una misión clara: democratizar el acceso a modelos de lenguaje avanzados (LLMs) mediante una interfaz moderna, intuitiva y optimizada para el ámbito académico.

## 🚀 Características Principales

Segment no es solo un chat, es una herramienta diseñada para el rigor científico:

Renderizado Científico Avanzado: Soporte para ecuaciones matemáticas complejas y fórmulas químicas mediante LaTeX (\ceH2O, ∫f(x)dx) aún se está perfeccionando.

Transcripción Inteligente: Integración con Groq (Whisper) para convertir voz a texto en tiempo real con una velocidad asombrosa.

Multimodelo: Acceso a la potencia de Gemini 2.5 Flash para razonamiento lógico y académico.

Enfoque en FACYT: Conocimiento contextual sobre nuestra facultad y la Universidad de Carabobo.

## 🛠️ Stack Tecnológico

Segment está construido con las tecnologías más modernas para garantizar velocidad y escalabilidad:

Tecnología Propósito
[Next.js 15](https://nextjs.org/) Framework de React para el renderizado del lado del servidor (SSR).
[TypeScript](https://www.typescriptlang.org/) Tipado estático para un código robusto y mantenible.
[Tailwind CSS](https://tailwindcss.com/) Estilizado moderno y responsivo con soporte para Modo Oscuro.
[Gemini API](https://ai.google.dev/) Cerebro principal del asistente para tareas académicas.
[Groq API](https://groq.com/) Procesamiento de audio ultra rápido y acceso a modelos openai y llama.

## 💻 Configuración del Entorno (Local)

Sigue estos pasos para tener tu propia instancia de Segment corriendo en minutos:

1. Clonar e Instalar

```bash
git clone https://github.com/Samuel1390/segment-ai.git
cd segment-ai
npm install
```

2. Variables de Entorno
   Crea un archivo .env en la raíz del proyecto y añade tus credenciales:

```.env
GEMINI_API_KEY=tu_api_key_de_gemini
GROQ_API_KEY=tu_api_key_de_groq
CO_API_KEY=tu_api_key_de_cohere
```

Nota: Puedes obtener tus llaves en [AI Studio](https://aistudio.google.com/app/apikey), [Groq Console](https://console.groq.com/keys) y [Cohere Console](https://dashboard.cohere.com/api-keys).

3. Ejecutar

```bash
npm run dev
```

Visita [localhost:3000](http://localhost:3000) y comienza a interactuar con Segment.

## 🤝 Colaboración y Comunidad

Este proyecto es de código abierto y "hecho en casa". Como desarrollador enfocado en el Frontend, estoy buscando mentes brillantes 🧠 (graduados o estudiantes) que deseen fortalecer el Backend y la infraestructura de IA 🤖.

¿Quieres sumarte al equipo?

Explora mi [Portfolio Profesional](https://samuel-nelo-portfolio.vercel.app/).

Envíame un correo pulsando el icono de Gmail.

Desarrollado con ❤️ por Samuel Nelo - Estudiante de Computación, FACYT, UC.

### Arquitectura del proyecto

- app/

```
.
├── api -> Routes que corren en el servidor
│   └── transcriptions -> Transcribe audio a texto
│       └── route.ts
├── components
│   ├── Chat.tsx -> Archivo principal con todas las interacciones del usuario con  Segment
│   ├── Header.tsx
│   ├── Logo.tsx
│   ├── Microphone.tsx
│   ├── ModelsMessagesManager.tsx
│   ├── RenderUserMessages.tsx
│   ├── ThemeButton.tsx
│   ├── context
│   │   ├── ThemeContext.ts
│   │   └── ThemeProvider.tsx
│   ├── errors
│   │   └── Errors.tsx
│   └── output
│       ├── CopyButton.tsx
│       ├── Output.tsx
│       └── output.css
├── constants.ts
├── globals.css
├── hooks
│   ├── useCopyClipboard.ts
│   ├── useRecorder.ts
│   └── useTheme.ts
├── icon.png
├── layout.tsx
├── page.tsx
├── server-actions -> funciones de servidor
│   ├── ModelInstructions.md
│   ├── chatFormAction.ts
│   ├── gemini.ts
│   ├── getTranscription.ts
│   └── groq.ts
└── types.d.ts
```
