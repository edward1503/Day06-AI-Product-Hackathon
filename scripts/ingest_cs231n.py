import os
import re
from sqlalchemy import text
from src.services.ingestion import ingest_lecture
from src.models.store import SessionLocal, init_db

def find_file_regex(directory, pattern_regex):
    if not os.path.exists(directory):
        return None
    for filename in os.listdir(directory):
        if re.search(pattern_regex, filename, re.IGNORECASE):
            return os.path.join(directory, filename)
    return None

def clear_database():
    print("Clearing old database records...")
    db = SessionLocal()
    init_db()
    try:
        db.execute(text("DELETE FROM qa_history"))
        db.execute(text("DELETE FROM transcript_lines"))
        db.execute(text("DELETE FROM chapters"))
        db.execute(text("DELETE FROM lectures"))
        db.commit()
    except Exception as e:
        print(f"Error clearing database: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    base_dir = "data/cs231n"
    toc_dir = os.path.join(base_dir, "ToC_Summary")
    transcript_dir = os.path.join(base_dir, "transcripts")
    video_dir = os.path.join(base_dir, "videos")
    
    # 0. Clean DB first
    clear_database()
    
    # Loop through lecture numbers 1 to 2
    for n in range(1, 3):
        lecture_id = f"lecture-{n}"
        
        # 1. Find ToC
        toc_path = os.path.join(toc_dir, f"lecture-{n}.json")
        if not os.path.exists(toc_path):
            toc_path = os.path.join(base_dir, "slides", "ToC_Summary", f"lecture-{n}.json")
            if not os.path.exists(toc_path):
                print(f"Skipping {lecture_id}: ToC not found")
                continue
                
        # 2. Find Transcript (Strict Regex matcher expecting Lecture_1_ or Lecture 1 )
        transcript_pattern = rf"Lecture[_\s]{n}[_\s]"
        transcript_path = find_file_regex(transcript_dir, transcript_pattern)
            
        if not transcript_path:
            print(f"Warning for {lecture_id}: Transcript not found")
            transcript_paths = []
        else:
            transcript_paths = [transcript_path]
            
        # 3. Find Video (Strict Regex expecting Lecture 1: or Lecture 1 )
        video_pattern = rf"Lecture\s+{n}[\s：:]"
        video_path = find_file_regex(video_dir, video_pattern)

        if not video_path:
            print(f"Warning for {lecture_id}: Video not found")
            video_rel_path = None
        else:
            # Convert to path relative to 'data' directory
            video_rel_path = os.path.relpath(video_path, "data")
            video_rel_path = video_rel_path.replace("\\", "/")  # Ensure forward slashes for URL

        print(f"Ingesting {lecture_id}...")
        print(f"  ToC: {toc_path}")
        print(f"  Transcript: {transcript_path}")
        print(f"  Video: {video_path}")
        
        try:
            ingest_lecture(
                lecture_id=lecture_id,
                toc_path=toc_path,
                transcript_paths=transcript_paths,
                video_filename=video_rel_path
            )
        except Exception as e:
            print(f"FAILED to ingest {lecture_id}: {e}")
            continue

if __name__ == "__main__":
    main()
