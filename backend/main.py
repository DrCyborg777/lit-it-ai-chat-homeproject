"""
AI Chat Backend using FastAPI and Ollama
Provides streaming chat responses with conversation memory and rate limiting
"""

from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel
from typing import List
import requests
import json

# Initialize FastAPI application
app = FastAPI()

# =====================================================
# RATE LIMITING SETUP
# =====================================================
# Prevents abuse by limiting requests per IP address
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# =====================================================
# CORS MIDDLEWARE
# =====================================================
# Allows frontend (React) to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (POST, GET, etc.)
    allow_headers=["*"],  # Allow all headers
)

# =====================================================
# OLLAMA CONFIGURATION
# =====================================================
# Local Ollama API endpoint for LLaMA3 model
OLLAMA_URL = "http://localhost:11434/api/chat"

# =====================================================
# DATA MODELS
# =====================================================
class Message(BaseModel):
    """Single message in conversation"""
    role: str      # "User" or "Assistant"
    content: str   # Message text

class ChatRequest(BaseModel):
    """Request containing full conversation history"""
    messages: List[Message]

# =====================================================
# CHAT ENDPOINT
# =====================================================
@limiter.limit("10/minute")  # Rate limit: 10 requests per minute per IP
@app.post("/chat")
def chat(request: Request, chat_request: ChatRequest):
    """
    Streaming chat endpoint
    - Receives conversation history
    - Sends context to Ollama
    - Streams response back token by token
    """
    
    def generate():
        """Generator function for streaming response"""
        
        # Build messages array with system prompt
        messages = [
            {
                "role": "system", 
                "content": "You are a helpful AI assistant. Be conversational and natural. Don't repeat the user's name in every response - only use it occasionally when it feels natural."
            }
        ]
        
        # Add conversation history
        for msg in chat_request.messages:
            messages.append({
                "role": "user" if msg.role == "User" else "assistant",
                "content": msg.content
            })
        
        # Send request to Ollama API
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": "llama3",
                "messages": messages,
                "stream": True  # Enable streaming
            },
            stream=True
        )
        
        # Stream tokens back to frontend
        for line in response.iter_lines():
            if not line:
                continue
            
            try:
                # Parse JSON response
                data = json.loads(line.decode("utf-8"))
                # Extract token from Ollama's response format
                token = data.get("message", {}).get("content", "")
                if token:
                    yield token  # Send token to frontend
            except Exception:
                # Skip malformed lines
                continue
    
    # Return streaming response
    return StreamingResponse(
        generate(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",      # Prevent caching
            "Connection": "keep-alive",       # Keep connection open for streaming
        }
    )