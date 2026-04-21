## 🤖 LIT_IT AI Chat Assistant (HomeProject)

A full-stack AI chat application built as part of an AI course project.  
It uses a FastAPI backend, React frontend, and Ollama (LLaMA3) for local AI responses.

---

### 📌 Features

- 💬 Real-time AI chat with streaming responses
- 🧠 Conversation memory (context-aware replies)
- ⚡ FastAPI backend with Web streaming
- 🌐 React + Vite frontend UI
- 🔒 Rate limiting for API protection
- 🤖 Local AI model using Ollama (LLaMA3)

---

### 🧱 Tech Stack

**Backend:**
- Python
- FastAPI
- Uvicorn
- Requests
- SlowAPI

**Frontend:**
- React (Vite)
- JavaScript
- CSS

**AI Model:**
- Ollama
- LLaMA3 (local LLM)

---

### 📁 Project Structure
```
project-LIT_IT/
│
├── backend/
│ ├── main.py
│ ├── requirements.txt
│ └── venv/ (ignored)
│
├── frontend/
│ ├── src/
│ ├── package.json
│ ├── package-lock.json
│ └── node_modules/ (ignored)
│
├── .gitignore
└── README.md
```

---

### ⚙️ Setup Instructions

1. Clone the project
```bash
git clone https://github.com/YOUR_USERNAME/lit-it-ai-chat-homeproject.git
cd lit-it-ai-chat-homeproject
```

🖥️ Backend Setup (FastAPI)

2. Create virtual environment
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Run backend server
```bash
uvicorn main:app --reload
```

Backend runs at:
```bash
http://127.0.0.1:8000
```

🌐 Frontend Setup (React)

5. Install dependencies
```bash
cd frontend
npm install
```

6. Start frontend
```bash
npm run dev
```

Frontend runs at:
```bash
http://localhost:5173
```

🤖 Ollama Setup

This project uses a local AI model via Ollama.

7. Install & run model

Download and Install Ollama:
```bash
https://ollama.com/
```

8. Pull model:

```bash
ollama pull llama3
```

Run automatically (or it starts in background after install).


🔗 How It Works
1. User sends a message from React UI
2. Frontend sends request to FastAPI /chat
3. Backend sends conversation history to Ollama (LLaMA3)
4. Response is streamed token-by-token
5. Frontend displays live AI response

🔐 API Features
- Rate limit: 10 requests/minute per IP
- Streaming responses via StreamingResponse
- Conversation context memory
- CORS enabled for frontend communication


📌 Notes
- Make sure Ollama is running locally
- Backend must run before frontend
- Node modules and venv are excluded via .gitignore


📜 License

- Educational project – free to use and modify.
