import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Response, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from typing import Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from src.models.store import get_db, init_db, Lecture, Chapter, QAHistory, User
from src.services.llm_service import get_context_and_stream_gemini
from src.api.auth import (
    hash_password, verify_password, create_access_token,
    get_current_user, get_optional_user
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs("data", exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    init_db()
    yield

app = FastAPI(title="Lecture Q&A Platform API", lifespan=lifespan)

# Mount data to serve videos
app.mount("/data", StaticFiles(directory="data"), name="data")
# Mount static files for UI
app.mount("/static", StaticFiles(directory="src/api/static"), name="static")


# ── Pages ────────────────────────────────────────────────────────
@app.get("/")
def read_root():
    return FileResponse("src/api/static/index.html")

@app.get("/login")
def login_page():
    return FileResponse("src/api/static/login.html")


# ── Auth API ─────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: str
    name: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/auth/register")
def register(req: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    # Check duplicate email
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email đã được đăng ký")
    
    user = User(
        email=req.email,
        name=req.name,
        password_hash=hash_password(req.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Auto-login after register
    token = create_access_token(user.id, user.email)
    response.set_cookie(
        key="access_token", value=token,
        httponly=True, samesite="lax", max_age=86400
    )
    return {"id": user.id, "email": user.email, "name": user.name}

@app.post("/api/auth/login")
def login(req: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email hoặc mật khẩu không đúng")
    
    token = create_access_token(user.id, user.email)
    response.set_cookie(
        key="access_token", value=token,
        httponly=True, samesite="lax", max_age=86400
    )
    return {"id": user.id, "email": user.email, "name": user.name}

@app.post("/api/auth/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"ok": True}

@app.get("/api/auth/me")
def get_me(user: User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email, "name": user.name}


# ── Lecture API ──────────────────────────────────────────────────
class AskRequest(BaseModel):
    lecture_id: str
    current_timestamp: float
    question: str
    image_base64: Optional[str] = None

@app.get("/api/lectures")
def list_lectures(db: Session = Depends(get_db)):
    lectures = db.query(Lecture).all()
    return [
        {
            "id": lec.id,
            "title": lec.title,
            "video_url": lec.video_url,
        }
        for lec in lectures
    ]

@app.get("/api/lectures/{lecture_id}/toc")
def get_toc(lecture_id: str, db: Session = Depends(get_db)):
    chapters = db.query(Chapter).filter(Chapter.lecture_id == lecture_id).order_by(Chapter.start_time).all()
    if not chapters:
        raise HTTPException(status_code=404, detail="ToC not found")
    return chapters

@app.post("/api/lectures/ask")
def ask_question(
    req: AskRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    try:
        lecture = db.query(Lecture).filter(Lecture.id == req.lecture_id).first()
        if not lecture:
            raise HTTPException(status_code=404, detail="Lecture not found")
            
        generator = get_context_and_stream_gemini(
            req.lecture_id, 
            req.current_timestamp, 
            req.question,
            image_base64=req.image_base64,
            user_id=user.id
        )
        return StreamingResponse(generator, media_type="text/event-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
def get_history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(QAHistory).filter(
        QAHistory.user_id == user.id
    ).order_by(QAHistory.created_at.desc()).limit(50).all()

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
