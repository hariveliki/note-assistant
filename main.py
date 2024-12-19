import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pathlib
import asyncio
from ollama import generate


# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Ollama Web Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory
static_dir = pathlib.Path(__file__).parent / "static"
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


class PromptRequest(BaseModel):
    prompt: str
    model: str = "llama3.2:latest"  # default model


class PromptResponse(BaseModel):
    response: str


@app.post("/generate", response_model=PromptResponse)
async def generate_response(request: PromptRequest):
    try:
        response = generate(
            model="note-assistant",
            prompt=request.prompt,
        )

        return PromptResponse(response=response["response"])

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/")
async def read_index():
    return FileResponse(static_dir / "index.html")


if __name__ == "__main__":
    uvicorn.run(
        app, host="0.0.0.0", port=8000, log_level="debug"
    )  # TODO remove debug mode
