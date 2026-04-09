# Session 3 — Cloud DB: Neon PostgreSQL

## Mục tiêu
Thay SQLite bằng Neon PostgreSQL để data persist khi Railway redeploy.

## Setup Neon (manual)
1. Vào neon.tech → Sign up (free, không cần credit card)
2. Create project → chọn region gần nhất (Singapore hoặc US East)
3. Copy connection string: `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`

## Code changes

### `src/models/store.py`
Thay engine creation:
```python
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")
# Neon/Heroku dùng postgres:// nhưng SQLAlchemy cần postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
```

### `scripts/ingest_cs231n.py`
Phải chạy sau khi set `DATABASE_URL` env var để populate Neon DB.

## Env vars cần set
```
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
```

## Notes
- Neon free tier: 0.5GB storage, 1 compute unit
- Auto-suspend sau 5 phút không hoạt động (cold start ~1-2s)
- SQLAlchemy ORM không cần thay đổi models — chỉ cần đổi engine

## Status: ⏳ PENDING
