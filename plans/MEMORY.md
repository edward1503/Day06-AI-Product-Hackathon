# AI Tutor — Project Memory

## Trạng thái hệ thống (cập nhật 2026-04-09)
- Backend: FastAPI + Gemini 2.0 Flash (SSE streaming)
- DB: SQLite (local + ephemeral trên Railway) — chưa lên cloud
- Frontend: Vanilla JS + HTML (`src/api/static/index.html`)
- Auth: Chưa có
- Hosting: **Railway** — https://day06-ai-product-hackathon-production.up.railway.app/
- Video: YouTube embed hoạt động (youtube_id trong DB), Drive embed sẵn sàng (cần set Drive File ID)

## Features cần build (theo thứ tự ưu tiên)
- [x] Session 1: Fix data pipeline (ToC keys, transcript parser, model name, ThinkingConfig)
- [x] Session 2: Deploy lên Railway (Procfile, requirements.txt, .gitignore, PORT env var)
- [x] Session 2.5: Video embed (YouTube iframe + Google Drive iframe + timestamp slider thủ công)
- [ ] Session 3: Cloud DB — Neon PostgreSQL (thay SQLite để data persist qua redeploy)
- [ ] Session 4: Clerk auth (Google login)
- [ ] Session 5: Google Drive video (thay YouTube bằng video từ Drive nếu cần)

## Bugs đã fix
1. **ToC ingestion**: code đọc sai key JSON — `table_of_contents`/`topic_title`/`detailed_summary`/`timestamp`
2. **Transcript parser**: regex sai format — sửa sang YouTube format (timestamp riêng dòng)
3. **Model name**: `gemini-3-flash-preview` → `gemini-2.0-flash`
4. **ThinkingConfig**: gây lỗi với model không hỗ trợ thinking — thêm guard conditional
5. **Windows path**: `os.path.join` tạo backslash trong URL — thêm `.replace("\\", "/")`
6. **Video không hiển thị trên Railway**: `video_url: null` vì MP4 không deploy — thêm YouTube/Drive iframe embed fallback

## Vấn đề còn tồn đọng
- **SQLite ephemeral trên Railway**: DB reset mỗi lần redeploy → Procfile chạy ingestion script khi start, nhưng QAHistory sẽ mất. Cần Session 3 (Neon) để fix.
- **Drive File ID chưa set**: `LECTURE_1_DRIVE_ID` env var chưa cấu hình. YouTube embed đang dùng thay thế.
- **Timestamp trên YouTube/Drive iframe**: không lấy tự động được (cross-origin) → dùng slider/input thủ công
- **Chưa push code mới nhất**: cần `git push` để Railway deploy bản có YouTube embed

## Quyết định kỹ thuật
- Cloud DB: **Neon** (neon.tech, free 0.5GB PostgreSQL)
- Hosting: **Railway** (deploy từ GitHub, $5 free credit/tháng)
- Auth: **Clerk** (Google SSO, free 10k MAU)
- Video: YouTube embed (mặc định) / Google Drive iframe (khi set drive_file_id)
- Không dùng Docker trong giai đoạn này
- User lưu data video trên Google Drive

## Files đã tạo/sửa

### Session 1 — Fix data pipeline
- `src/services/ingestion.py` — fixed ToC keys + transcript parser + drive_file_id param
- `src/config.py` — fixed model name + thêm Clerk env vars
- `src/services/llm_service.py` — fixed ThinkingConfig guard
- `src/models/store.py` — thêm `youtube_id` + `drive_file_id` columns
- `scripts/ingest_cs231n.py` — extract YouTube ID + DRIVE_FILE_IDS config
- `requirements.txt` — cập nhật deps (psycopg2, PyJWT, httpx)

### Session 2 — Railway deployment
- `Procfile` — `web: PYTHONPATH=. python scripts/ingest_cs231n.py && uvicorn ...`
- `.gitignore` — chỉ ignore .mp4/.pdf, giữ transcripts/ToC trong git
- `src/api/app.py` — PORT env var, auto init_db, makedirs safety, list_lectures trả thêm youtube_id/drive_file_id

### Session 2.5 — Video embed
- `src/api/static/index.html` — YouTube/Drive iframe, timestamp slider + input thủ công, dual video mode (local/drive/youtube), captureFrame guard

### Plan files
- `plans/MEMORY.md` — file này
- `plans/01-fix-data-pipeline.md` ✅
- `plans/02-hosting-railway.md`, `plans/02-hosting-railway-guide.md` ✅
- `plans/03-cloud-db-neon.md` ⏳
- `plans/04-clerk-auth.md` ⏳
- `plans/05-google-drive-video.md` ⏳

## Railway env vars hiện tại
```
GEMINI_API_KEY=<đã set>
DEFAULT_MODEL=gemini-2.0-flash
PYTHONPATH=.
LECTURE_1_DRIVE_ID=<chưa set — optional, YouTube đang dùng thay>
```

## Ghi chú demo
- Data: CS231N Lecture 1 (Stanford Deep Learning for CV)
- YouTube ID: `2fq9wYslV0A` (đã lưu trong DB)
- Railway URL: https://day06-ai-product-hackathon-production.up.railway.app/
- Sau khi sửa code, chỉ cần `git push` → Railway tự redeploy

## Việc cần làm session tới
1. **Push code mới** để Railway có YouTube embed
2. **Session 3**: Setup Neon PostgreSQL → set `DATABASE_URL` trên Railway
3. **Session 4**: Clerk auth (tạo app trên clerk.com → lấy keys → code login flow)
