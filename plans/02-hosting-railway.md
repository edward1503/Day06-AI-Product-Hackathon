# Session 2 — Deploy lên Railway

## Mục tiêu
App chạy trên Railway, user truy cập bằng link public.

## Files cần tạo
- `requirements.txt` — Python dependencies
- `Procfile` — start command cho Railway

## Procfile
```
web: PYTHONPATH=/app uvicorn src.api.app:app --host 0.0.0.0 --port $PORT
```

## requirements.txt
```
fastapi
uvicorn[standard]
sqlalchemy
google-genai
python-dotenv
psycopg2-binary
PyJWT[crypto]
httpx
```

## Env vars cần set trên Railway
```
GEMINI_API_KEY=<key>
DEFAULT_MODEL=gemini-2.0-flash
DATABASE_URL=<neon connection string> (sau Session 3)
CLERK_JWKS_URL=<url> (sau Session 4)
CLERK_PUBLISHABLE_KEY=<key> (sau Session 4)
```

## Steps
1. Tạo `requirements.txt` và `Procfile`
2. Push repo lên GitHub (nếu chưa)
3. Railway.app → New Project → Deploy from GitHub
4. Set env vars
5. Deploy

## Lưu ý
- SQLite trên Railway là ephemeral (mất khi redeploy)
- Railway tự inject `$PORT` — không hardcode port 8000
- Railway tự detect `Procfile` và chạy `web` dyno

## Status: ⏳ PENDING
