import os
import glob
from src.services.ingestion import ingest_lecture

def find_file(directory, pattern):
    files = glob.glob(os.path.join(directory, pattern))
    return files[0] if files else None

def find_video_for_lecture(video_dir, n):
    """Try multiple patterns to find the video file for lecture n."""
    patterns = [
        f"*Lecture_{n}_*.mp4",
        f"*Lecture {n}*.mp4",
        f"*Lecture {n}：*.mp4",
        f"*lecture-{n}*.mp4",
        f"*lecture_{n}*.mp4",
    ]
    for pat in patterns:
        result = find_file(video_dir, pat)
        if result:
            return result
    return None

def discover_lectures(toc_dir):
    """Auto-discover all available lecture numbers from ToC files."""
    lecture_nums = []
    for f in glob.glob(os.path.join(toc_dir, "lecture-*.json")):
        basename = os.path.basename(f)  # lecture-1.json
        try:
            num = int(basename.replace("lecture-", "").replace(".json", ""))
            lecture_nums.append(num)
        except ValueError:
            pass
    return sorted(lecture_nums)

def main():
    base_dir = "data/cs231n"
    toc_dir = os.path.join(base_dir, "ToC_Summary")
    transcript_dir = os.path.join(base_dir, "transcripts")
    video_dir = os.path.join(base_dir, "videos")

    # Auto-discover all lectures from ToC files
    lecture_nums = discover_lectures(toc_dir)
    if not lecture_nums:
        # Fallback: also check slides/ToC_Summary
        alt_toc = os.path.join(base_dir, "slides", "ToC_Summary")
        lecture_nums = discover_lectures(alt_toc)
    
    if not lecture_nums:
        print("No lecture ToC files found!")
        return

    print(f"Found {len(lecture_nums)} lecture(s): {lecture_nums}")
    
    for n in lecture_nums:
        lecture_id = f"lecture-{n}"
        
        # 1. Find ToC
        toc_path = os.path.join(toc_dir, f"lecture-{n}.json")
        if not os.path.exists(toc_path):
            toc_path = os.path.join(base_dir, "slides", "ToC_Summary", f"lecture-{n}.json")
            if not os.path.exists(toc_path):
                print(f"Skipping {lecture_id}: ToC not found")
                continue
                
        # 2. Find Transcript
        transcript_path = find_file(transcript_dir, f"*Lecture_{n}_*.txt")
        if not transcript_path:
            transcript_path = find_file(transcript_dir, f"*Lecture {n}*.txt")
            
        transcript_paths = [transcript_path] if transcript_path else []
            
        # 3. Find Video — auto-scan local files
        video_path = find_video_for_lecture(video_dir, n)
        
        if video_path:
            # Convert to URL path: data/cs231n/videos/X.mp4 → /data/cs231n/videos/X.mp4
            video_url = "/" + video_path.replace("\\", "/")
        else:
            video_url = None

        print(f"Ingesting {lecture_id}...")
        print(f"  ToC: {toc_path}")
        print(f"  Transcript: {transcript_path or '(not found)'}")
        print(f"  Video: {video_url or '(not found)'}")

        try:
            ingest_lecture(
                lecture_id=lecture_id,
                toc_path=toc_path,
                transcript_paths=transcript_paths,
                video_url=video_url
            )
        except Exception as e:
            print(f"FAILED to ingest {lecture_id}: {e}")
            continue

if __name__ == "__main__":
    main()
