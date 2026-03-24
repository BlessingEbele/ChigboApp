You are an expert full-stack AI engineer. Build a production-ready AI-powered language learning web application that teaches a Chinese citizen how to speak the Igbo language from beginner (Level 0) to fluency, and also teaches an Igbo speaker how to learn Chinese.

### 🧠 CORE OBJECTIVE
Create an intelligent, interactive language learning platform with:
- Personalized learning paths
- AI conversation practice
- Speech recognition and pronunciation feedback
- Gamified lessons
- Cultural context integration

---

## 🏗️ TECH STACK REQUIREMENTS

### Backend:
- Python
- Django (with Django REST Framework)
- PostgreSQL database

### Frontend:
- React.js (or Django templates if needed)

### AI Integration:
- Use Google Gemini API (via Google AI Studio)
- Speech-to-Text (STT)
- Text-to-Speech (TTS)
- Natural Language Processing for conversation simulation

---

## 🌍 TARGET USERS

1. Chinese speakers learning Igbo
2. Igbo speakers learning Chinese

The app must support:
- Mandarin Chinese (Simplified)
- Igbo language
- English (as optional bridge language)

---

## 📚 CORE FEATURES

### 1. User Authentication
- Register/Login (JWT authentication)
- User profile (language preference, learning goals, level tracking)

---

### 2. AI Language Tutor
- AI chatbot that:
  - Teaches vocabulary, grammar, and pronunciation
  - Engages users in real-life conversations
  - Corrects mistakes with explanations
- Prompt design for AI tutor:
  - Adjust difficulty based on user level
  - Use simple explanations for beginners
  - Provide examples in both languages

---

### 3. Structured Learning Path
- Levels:
  - Beginner (Level 0–2)
  - Intermediate (Level 3–5)
  - Advanced (Level 6–8)

Each lesson includes:
- Vocabulary
- Sentence structure
- Pronunciation guide
- Practice exercises
- Quiz

---

### 4. Speech Features
- Speech-to-text:
  - Allow users to speak Igbo or Chinese
  - Convert speech to text
- Pronunciation feedback:
  - Compare user speech with correct pronunciation
  - Highlight errors

---

### 5. Translation Engine
- Igbo ↔ Chinese translation
- Include:
  - Word-by-word translation
  - Sentence meaning
  - Contextual usage

---

### 6. Gamification
- Points and badges
- Daily streaks
- Leaderboard

---

### 7. Admin Panel (VERY IMPORTANT)

Build a full Django Admin Dashboard with:
- User management
- Lesson creation/editing
- Content upload (audio, text, quizzes)
- AI prompt customization
- Analytics dashboard (user progress, engagement)

Custom admin features:
- Add/edit lessons dynamically
- Upload pronunciation audio
- Monitor AI responses
- Manage translations database

---

## 🧩 DATABASE MODELS (Django)

Design models for:
- User
- LanguageProfile
- Lesson
- Module
- Vocabulary
- Quiz
- Progress
- AIConversationLog

---

## 🔌 API ENDPOINTS

Create REST APIs for:
- Authentication
- Lessons
- Progress tracking
- AI chat interaction
- Speech processing
- Translation

---

## 🤖 AI PROMPT ENGINE (IMPORTANT)

Design dynamic prompts like:

"Act as a professional Igbo language teacher teaching a Chinese beginner. Use simple words, give pronunciation hints, and provide examples. Correct mistakes gently and explain clearly."

Also:
- Reverse mode (Chinese teacher for Igbo learners)

---

## 🎨 UI/UX REQUIREMENTS

- Clean, mobile-friendly interface
- Language toggle switch
- Voice interaction button
- Chat-style learning interface

---

## 🔐 SECURITY

- JWT authentication
- Input validation
- Rate limiting for AI API

---

## 🚀 DEPLOYMENT

- Backend: Deploy with Docker
- Use Gunicorn + Nginx
- Cloud: AWS / GCP
- Database: PostgreSQL

---

## 📦 DELIVERABLES

1. Full Django backend code
2. API documentation
3. AI prompt configurations
4. Admin dashboard setup
5. Sample lessons (Igbo ↔ Chinese)
6. Instructions for deployment

---

## 🎯 BONUS FEATURES

- Offline lesson download
- Cultural tips (Igbo traditions & Chinese etiquette)
- Voice-based quizzes
- AI-powered pronunciation scoring

---

Build this as a scalable, modular, and production-ready application with clean code, comments, and documentation.

