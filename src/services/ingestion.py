import json
import os
import re
from sqlalchemy.orm import Session
from src.models.store import Lecture, Chapter, TranscriptLine, SessionLocal, init_db

def parse_toc_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def time_to_seconds(time_str):
    # Support HH:MM:SS
    parts = time_str.split(':')
    if len(parts) == 3:
        return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
    elif len(parts) == 2:
        return int(parts[0]) * 60 + int(parts[1])
    return 0

def parse_transcript_text(file_path):
    lines_data = []
    if not os.path.exists(file_path):
        return lines_data
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read().splitlines()
        
    current_time = None
    current_text = []
    header_passed = False
    
    for line in content:
        stripped = line.strip()
        # Look for HH:MM:SS or H:MM:SS
        time_match = re.match(r'^(\d{1,2}:\d{2}:\d{2})$', stripped)
        
        if time_match:
            # Save previous block if it exists
            if current_time is not None and current_text:
                sec = time_to_seconds(current_time)
                lines_data.append({
                    "start_time": float(sec),
                    "end_time": float(sec + 5),
                    "content": " ".join(current_text)
                })
            
            current_time = time_match.group(1)
            current_text = []
            header_passed = True
        elif header_passed and stripped:
            # Avoid re-parsing metadata if it appears elsewhere
            if not re.match(r'^[=\-]{5,}$', stripped):
                current_text.append(stripped)
                
    # Save last block
    if current_time is not None and current_text:
        sec = time_to_seconds(current_time)
        lines_data.append({
            "start_time": float(sec),
            "end_time": float(sec + 5),
            "content": " ".join(current_text)
        })
        
    return lines_data

def ingest_lecture(lecture_id, toc_path, transcript_paths, video_filename=None):
    db = SessionLocal()
    init_db()
    
    # Parse ToC
    toc_data = parse_toc_file(toc_path)
    
    # Create or update Lecture
    lecture = db.query(Lecture).filter(Lecture.id == lecture_id).first()
    video_path = os.path.join("data", video_filename) if video_filename else None
    
    # Get and clean title
    raw_title = toc_data.get("lecture_title", lecture_id)
    
    # 1. Extract lecture number from lecture_id (e.g., "lecture-5" -> "5")
    num_match = re.search(r"lecture-(\d+)", lecture_id)
    n_str = num_match.group(1) if num_match else "?"
    
    # 2. Aggressive boilerplate cleaning
    # Remove everything before the last '|' or ':' which usually denotes "Stanford ... | "
    # However, some titles are "Stanford CS231N: Topic". Let's handle it manually:
    clean = re.sub(r"^Stanford\s+CS231[Nn][\s\|:,-]*", "", raw_title)
    clean = re.sub(r".*Spring\s+2025\s*[\s\|:-]*", "", clean, flags=re.IGNORECASE)
    clean = re.sub(r"^Lecture\s+\d+[:：]\s*", "", clean, flags=re.IGNORECASE)
    clean = re.sub(r"^Deep Learning for Computer Vision\s*[\s\|:-]*", "", clean, flags=re.IGNORECASE)
    
    clean_title = f"Lecture {n_str}: {clean.strip()}"

    if not lecture:
        lecture = Lecture(
            id=lecture_id, 
            title=clean_title,
            video_url=video_path
        )
        db.add(lecture)
    else:
        lecture.title = clean_title
        lecture.video_url = video_path
    
    # Clear existing chapters/lines for re-ingestion
    db.query(Chapter).filter(Chapter.lecture_id == lecture_id).delete()
    db.query(TranscriptLine).filter(TranscriptLine.lecture_id == lecture_id).delete()
    
    # Add Chapters
    for item in toc_data.get("toc", []):
        chapter = Chapter(
            lecture_id=lecture_id,
            title=item["title"],
            summary=item["summary"],
            start_time=float(time_to_seconds(item["start_time"])),
            end_time=float(time_to_seconds(item["end_time"]))
        )
        db.add(chapter)
        
    # Add Transcript Lines
    for t_path in transcript_paths:
        lines = parse_transcript_text(t_path)
        for l in lines:
            line = TranscriptLine(
                lecture_id=lecture_id,
                start_time=l["start_time"],
                end_time=l["end_time"],
                content=l["content"]
            )
            db.add(line)
            
    db.commit()
    db.close()
    print(f"Successfully ingested lecture: {lecture_id}")

if __name__ == "__main__":
    # Ingest Lecture 1
    ingest_lecture(
        "lecture-1", 
        "data/ToC-summary-lecture-1.txt", 
        ["data/splits/Lecture1_Part1.txt", "data/splits/Lecture1_Part2.txt"],
        video_filename="Stanford-CS224N-NLP-with-Deep-Learning-S_Media_DzpHeXVSC5I_001_1080p.mp4"
    )
    # Ingest Lecture 2
    ingest_lecture(
        "lecture-2", 
        "data/ToC-summary-lecture-2.txt", 
        ["data/splits/Lecture2_Part1.txt", "data/splits/Lecture2_Part2.txt"],
        video_filename="Stanford-CS224N-NLP-with-Deep-Learning-S_Media_nBor4jfWetQ_001_1080p.mp4"
    )
