from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Dummy summarizer — replace with real model logic
def summarize(text):
    return text[:200] + "..."

class TextInput(BaseModel):
    text: str

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/summarize")
async def summarize_text(data: TextInput):
    summary = summarize(data.text)
    return {"summary": summary}
