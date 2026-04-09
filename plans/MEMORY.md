# AI Tutor — Project Memory

## Trạng thái hệ thống
- Backend: FastAPI + Gemini 2.0 Flash (SSE streaming)
- DB: SQLite (local) — chưa lên cloud
- Frontend: Vanilla JS + HTML (`src/api/static/index.html`)
- Auth: Chưa có
- Hosting: Chưa deploy

## Features cần build (theo thứ tự ưu tiên)
- [x] Session 1: Fix data pipeline (RAG đang broken — DB rỗng)
- [x] Session 2: Deploy lên Railway (hosting cơ bản + `requirements.txt`)
- [ ] Session 3: Cloud DB — Neon PostgreSQL (thay SQLite)
- [ ] Session 4: Clerk auth (Google login)
- [ ] Session 5: Google Drive video embed

## Bugs đã fix (Session 1)
1. **ToC ingestion**: code đọc sai key JSON — sửa `table_of_contents` thay `toc`, map `topic_title`/`detailed_summary`/`timestamp`
2. **Transcript parser**: regex sai format — sửa sang YouTube format (timestamp riêng dòng)
3. **Model name**: `gemini-3-flash-preview` → `gemini-2.0-flash`
4. **ThinkingConfig**: gây lỗi với model không hỗ trợ thinking — thêm guard
5. **Windows path**: `os.path.join` tạo backslash trong URL — thêm `.replace("\\", "/")`

## Quyết định kỹ thuật
- Cloud DB: **Neon** (neon.tech, free 0.5GB PostgreSQL)
- Hosting: **Railway** (deploy từ GitHub, không cần Docker)
- Auth: **Clerk** (Google SSO, free 10k MAU)
- Video: **Google Drive iframe embed**
- Không dùng Docker trong giai đoạn này

## Files đã tạo/sửa
### Session 1
- `src/services/ingestion.py` — fixed ToC keys + transcript parser
- `src/config.py` — fixed model name + thêm Clerk env vars
- `src/services/llm_service.py` — fixed ThinkingConfig
- `src/models/store.py` — thêm `youtube_id` column
- `scripts/ingest_cs231n.py` — extract YouTube ID
- `requirements.txt` — cập nhật deps

### Session 2
- `Procfile` — Railway start command
- `.gitignore` — chỉ ignore .mp4/.pdf, giữ transcripts/ToC
- `src/api/app.py` — PORT env var + auto init_db on startup
- `plans/02-hosting-railway-guide.md` — hướng dẫn deploy chi tiết

### Plan files
- `plans/MEMORY.md`, `plans/01-fix-data-pipeline.md`
- `plans/02-hosting-railway.md`, `plans/02-hosting-railway-guide.md`
- `plans/03-cloud-db-neon.md`, `plans/04-clerk-auth.md`, `plans/05-google-drive-video.md`

## Ghi chú demo
- Data: CS231N Lecture 1 (Stanford Deep Learning for CV)
- Transcript: YouTube format với Video ID `2fq9wYslV0A`
- Sau khi fix pipeline, chạy `PYTHONPATH=. python scripts/ingest_cs231n.py` để populate DB
