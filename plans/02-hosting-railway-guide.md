# Hướng dẫn deploy AI Tutor lên Railway

## Tổng quan

Railway sẽ:
- Đọc `requirements.txt` → cài dependencies
- Đọc `Procfile` → chạy ingestion script + start server
- Tự inject biến `PORT` → app lắng nghe đúng port
- Cấp URL public dạng `https://xxx.up.railway.app`

---

## Bước 1 — Tạo tài khoản Railway

1. Vào [railway.app](https://railway.app)
2. Đăng nhập bằng **GitHub** (bắt buộc để link repo)
3. Railway cho mỗi tài khoản **$5 credit/tháng** miễn phí (đủ cho demo)

---

## Bước 2 — Push code lên GitHub

Nếu repo chưa có trên GitHub:

```bash
# Trong thư mục project
git add -A
git commit -m "Prepare for Railway deployment"
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```

Nếu đã có repo, push các thay đổi mới:

```bash
git add -A
git commit -m "Add Procfile + fix data pipeline for deployment"
git push
```

**Kiểm tra:** đảm bảo các file sau có trên GitHub:
- `requirements.txt`
- `Procfile`
- `data/cs231n/transcripts/` (file .txt)
- `data/cs231n/ToC_Summary/` (file .json)
- `src/` (toàn bộ code)

**KHÔNG nên có trên GitHub:** `.env`, `app.db`, `data/**/*.mp4`

---

## Bước 3 — Tạo project trên Railway

1. Vào [railway.app/new](https://railway.app/new)
2. Chọn **"Deploy from GitHub repo"**
3. Chọn repo vừa push
4. Railway sẽ tự detect Python + `Procfile` → bắt đầu build

> ⚠️ Build sẽ **fail lần đầu** vì chưa set biến môi trường → đó là bình thường, tiếp tục bước 4.

---

## Bước 4 — Cấu hình biến môi trường (Environment Variables)

Trong Railway dashboard → chọn project → tab **"Variables"** → thêm từng biến:

| Biến | Giá trị | Ghi chú |
|------|---------|---------|
| `GEMINI_API_KEY` | `AIzaSy...` (key Gemini của bạn) | Lấy từ [aistudio.google.com](https://aistudio.google.com/apikey) |
| `DEFAULT_MODEL` | `gemini-2.0-flash` | Model AI sử dụng |
| `PYTHONPATH` | `.` | Để Python tìm được `src/` module |

### Lấy Gemini API Key (nếu chưa có):

1. Vào [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Đăng nhập Google
3. Click **"Create API Key"**
4. Copy key (dạng `AIzaSy...`)

---

## Bước 5 — Deploy lại

Sau khi set biến môi trường:

1. Railway sẽ tự động **redeploy** (nếu không, click **"Redeploy"** trên dashboard)
2. Chờ build xong (khoảng 1-2 phút)
3. Check **"Logs"** tab — bạn sẽ thấy:
   ```
   Ingesting lecture-1...
   Successfully ingested lecture-1: 10 chapters, 1 transcript file(s)
   INFO:     Uvicorn running on http://0.0.0.0:PORT
   ```

---

## Bước 6 — Lấy URL public

1. Trong Railway dashboard → tab **"Settings"** → mục **"Networking"**
2. Click **"Generate Domain"** → Railway tạo URL dạng:
   ```
   https://ai-tutor-production-xxxx.up.railway.app
   ```
3. **Truy cập URL này** → app AI Tutor hiển thị

---

## Bước 7 — Test nhanh

1. Mở URL Railway trên trình duyệt
2. Chọn bài giảng trong dropdown (Lecture 1)
3. Gõ câu hỏi: "Computer vision là gì?"
4. Nếu AI trả lời dựa trên transcript → RAG hoạt động ✅

---

## Cập nhật code sau này

Mỗi lần bạn push code lên GitHub, Railway **tự động deploy lại**:

```bash
git add -A
git commit -m "Update feature X"
git push
```

Không cần thao tác gì thêm trên Railway dashboard.

---

## Troubleshooting

### Build failed — "ModuleNotFoundError"
→ Kiểm tra `requirements.txt` có đủ package không. Thêm package thiếu rồi push lại.

### App crash — "GEMINI_API_KEY not set"
→ Kiểm tra tab Variables trên Railway dashboard.

### Trang trắng / 404
→ Kiểm tra tab Logs. Nếu thấy `"Error: No such file or directory: 'src/api/static/index.html'"` → check Procfile có `PYTHONPATH=.`

### Video không load
→ Bình thường — file MP4 không deploy lên Railway. Video sẽ hoạt động sau khi làm Session 5 (Google Drive embed).

### App chạy chậm sau khi idle
→ Railway free tier tự sleep sau 10 phút. Request đầu tiên sau sleep mất ~5-10 giây. Đây là giới hạn của free tier.

---

## Chi phí

| Hạng mục | Chi phí |
|----------|---------|
| Railway | $5/tháng credit miễn phí (đủ dùng) |
| Gemini API | Free tier: 15 request/phút |
| Tổng | **$0** cho demo |

---

## Tiếp theo

Sau khi deploy thành công:
- **Session 3**: Thêm Neon PostgreSQL (để data không mất khi redeploy)
- **Session 4**: Thêm Clerk auth (đăng nhập Google)
- **Session 5**: Google Drive video embed
