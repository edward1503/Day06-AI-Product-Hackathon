from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse, Response
from pydantic import BaseModel
from sqlalchemy.orm import Session
from src.models.store import get_db, Lecture, Chapter, TranscriptLine, QAHistory
from src.services.llm_service import get_context_and_stream_gemini
import os
import glob
import re

app = FastAPI(title="Lecture Q&A Platform API")

# Mount data to serve videos
data_dir = os.path.realpath("data")
cs231n_dir = os.path.realpath("data/cs231n")

# Mount cs231n resolved path explicitly so Starlette doesn't block symlinks
app.mount("/data/cs231n", StaticFiles(directory=cs231n_dir), name="data_cs231n")
# Mount the rest of data as fallback
app.mount("/data", StaticFiles(directory=data_dir), name="data")

@app.get("/api/lectures/{lecture_id}/slides")
def get_slides(lecture_id: str):
    base = lecture_id.replace("-", "_")
    
    files = glob.glob(f"data/cs231n/slides/{base}_*.pdf") + glob.glob(f"data/cs231n/slides/{base}.pdf")
    # sort to keep order robust
    files.sort()
    return [{"name": os.path.basename(f), "url": f"/{f}"} for f in files]

@app.get("/api/lectures/{lecture_id}/subtitles.vtt")
def get_subtitles(lecture_id: str):
    num = lecture_id.split("-")[1]
    files = glob.glob(f"data/cs231n/transcripts/*Lecture_{num}_*transcript.txt")
    if not files:
        return Response("WEBVTT\n\n", media_type="text/vtt")
        
    with open(files[0], "r") as f:
        content = f.read()
        
    blocks = content.split("\n\n")
    parsed = []
    for block in blocks:
        lines = block.strip().split("\n")
        if len(lines) >= 2 and re.match(r"\d{2}:\d{2}:\d{2}", lines[0]):
            parsed.append({"time": lines[0], "text": "\n".join(lines[1:])})
            
    vtt_lines = ["WEBVTT", ""]
    for i in range(len(parsed)):
        start = parsed[i]["time"] + ".000"
        if i + 1 < len(parsed):
            end = parsed[i+1]["time"] + ".000"
        else:
            h, m, s = map(int, parsed[i]["time"].split(":"))
            s += 5
            if s >= 60:
                s -= 60
                m += 1
            end = f"{h:02d}:{m:02d}:{s:02d}.000"
            
        vtt_lines.append(f"{start} --> {end}")
        vtt_lines.append(parsed[i]["text"])
        vtt_lines.append("")
        
    return Response("\n".join(vtt_lines), media_type="text/vtt")

# Only mount frontend static files if dist exists (so local dev doesn't crash before build)
if os.path.exists("frontend/dist/assets"):
    app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

class AskRequest(BaseModel):
    lecture_id: str
    current_timestamp: float
    question: str
    image_base64: str = None

@app.get("/api/lectures")
def list_lectures(db: Session = Depends(get_db)):
    return db.query(Lecture).all()

@app.get("/api/lectures/{lecture_id}/toc")
def get_toc(lecture_id: str, db: Session = Depends(get_db)):
    chapters = db.query(Chapter).filter(Chapter.lecture_id == lecture_id).order_by(Chapter.start_time).all()
    if not chapters:
        raise HTTPException(status_code=404, detail="ToC not found")
    return chapters

@app.post("/api/lectures/ask")
def ask_question(req: AskRequest, db: Session = Depends(get_db)):
    try:
        # Check if lecture exists
        lecture = db.query(Lecture).filter(Lecture.id == req.lecture_id).first()
        if not lecture:
            raise HTTPException(status_code=404, detail="Lecture not found")
            
        generator = get_context_and_stream_gemini(
            req.lecture_id, 
            req.current_timestamp, 
            req.question,
            image_base64=req.image_base64
        )
        return StreamingResponse(generator, media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
def get_history(db: Session = Depends(get_db)):
    return db.query(QAHistory).order_by(QAHistory.created_at.desc()).limit(50).all()

# Catch-all route for SPA (React)
@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    if os.path.exists("frontend/dist/index.html"):
        return FileResponse("frontend/dist/index.html")
    return {"message": "Frontend not built yet. Run `npm run build` in frontend directory."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
