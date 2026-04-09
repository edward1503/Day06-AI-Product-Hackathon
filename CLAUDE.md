# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Tutor: a real-time multimodal learning platform that provides AI-powered Q&A over lecture content (video + transcript + table of contents). Students ask questions while watching lectures and get context-aware answers streamed in real time via Gemini API.

## Commands

```bash
# Setup
uv venv .venv && source .venv/bin/activate && uv sync

# Run the FastAPI backend (serves HTML UI at http://localhost:8000)
PYTHONPATH=. uv run python src/api/app.py

# Run the Streamlit lab UI (http://localhost:8501)
PYTHONPATH=. uv run streamlit run src/ui/app.py

# Ingest lecture data into SQLite
PYTHONPATH=. uv run python scripts/ingest_cs231n.py
```

All commands require `PYTHONPATH=.` since imports use `src.*` paths.

## Environment

Requires a `.env` file with:
- `GEMINI_API_KEY` — Google Gemini API key (required)
- `DEFAULT_MODEL` — Gemini model name (default: `gemini-3-flash-preview`)

## Architecture

**Request flow:** User question + current video timestamp -> FastAPI POST `/api/lectures/ask` -> `llm_service.py` builds RAG context (ToC chapters + transcript window +/- 5 min) -> streams Gemini response as NDJSON `{"a": chunk}` -> frontend renders markdown + KaTeX.

**Key layers:**

| Layer | Path | Role |
|-------|------|------|
| API routes | `src/api/app.py` | FastAPI endpoints: list lectures, ask question (streaming), history |
| LLM service | `src/services/llm_service.py` | Context assembly, Gemini streaming call, DB + file logging |
| Ingestion | `src/services/ingestion.py` | Parse JSON ToC + timestamped transcripts -> SQLAlchemy models |
| Models | `src/models/store.py` | SQLAlchemy ORM: Lecture, Chapter, TranscriptLine, QAHistory |
| Config | `src/config.py` | Loads `.env` variables |
| Frontend | `src/api/static/index.html` | Single-page dark UI with video player, chat, markdown/KaTeX rendering |
| Streamlit UI | `src/ui/app.py` | Alternative lab/debug interface |
| Ingestion script | `scripts/ingest_cs231n.py` | Scans `data/cs231n/` for ToC JSON, transcripts, videos and calls ingestion service |

**Database:** SQLite at `app.db` (project root), auto-created via `init_db()`. Four tables: `lectures`, `chapters`, `transcript_lines`, `qa_history`.

**Data directory** (`data/`, gitignored): contains lecture videos (.mp4), transcripts (.txt with `[HH:MM:SS] text` format), ToC summaries (.json), and PDF slides organized under `data/cs231n/`.

**Logging:** All Q&A interactions are saved to both `qa_history` DB table and `logs/qa_history.log` as JSON.

## Dependencies

Managed via `requirements.txt` with `uv`. Key packages: `fastapi`, `uvicorn`, `sqlalchemy`, `google-genai`, `streamlit`, `python-dotenv`.
