# Session 3 — Cloud DB: Neon PostgreSQL

## Mục tiêu
Thay SQLite bằng Neon PostgreSQL để data persist khi Railway redeploy.

## Setup Neon (manual — bạn cần làm thủ công)
1. Vào https://neon.tech → Sign up (free, không cần credit card)
2. Create project → chọn region gần nhất (Singapore hoặc US East)
3. Copy connection string: `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`

## Code changes ✅ ĐÃ XONG

### `src/models/store.py`
Đã thay engine creation để hỗ trợ cả SQLite (local) và PostgreSQL (cloud):
```python
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
```

### `requirements.txt`
Đã có `psycopg2-binary` (PostgreSQL driver cho Python).

### `scripts/ingest_cs231n.py`
Không cần sửa — tự động dùng engine mới từ `store.py`.

## ⚠️ Các bước CẦN LÀM THỦ CÔNG trên Railway

### Bước 1: Tạo database Neon
1. Vào https://neon.tech → Sign up
2. **Create Project** → đặt tên (ví dụ: `ai-tutor`)
3. Chọn region: **Singapore** (gần nhất cho VN)
4. Sau khi tạo xong → vào **Dashboard** → copy **Connection string**
   - Dạng: `postgresql://neondb_owner:abc123@ep-cool-name-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`

### Bước 2: Set env var trên Railway
1. Vào https://railway.com → project của bạn
2. Vào tab **Variables**
3. Thêm biến mới:
   ```
   DATABASE_URL=postgresql://neondb_owner:abc123@ep-cool-name-123456.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Railway sẽ tự redeploy

### Bước 3: Verify
- Truy cập https://day06-ai-product-hackathon-production.up.railway.app/
- Chat hỏi AI → kiểm tra QA history persist
- Redeploy lại Railway → data vẫn còn ✅

## Notes
- Neon free tier: 0.5GB storage, 1 compute unit
- Auto-suspend sau 5 phút không hoạt động (cold start ~1-2s)
- SQLAlchemy ORM không cần thay đổi models — chỉ cần đổi engine
- Local dev: không set `DATABASE_URL` → tự động dùng SQLite (`app.db`)
- Railway: set `DATABASE_URL` → dùng Neon PostgreSQL

## Status: ✅ CODE DONE — Chờ cấu hình Neon + Railway env var
