# Session 4 — Clerk Authentication

## Mục tiêu
User truy cập link → redirect đến trang login → đăng nhập Google → vào app.

## Setup Clerk (manual)
1. clerk.com → Sign up → Create application
2. Đặt tên app, enable "Google" trong Social connections
3. Lấy **Publishable Key** (`pk_test_...`) và **JWKS URL**
   - JWKS URL format: `https://<your-app>.clerk.accounts.dev/.well-known/jwks.json`
4. Trong Clerk dashboard → Settings → Domains:
   - Add Railway URL vào Allowed origins
   - Add `https://<railway-url>/` vào Redirect URLs

## Files cần tạo/sửa

### NEW: `src/api/static/login.html`
Trang sign-in đơn giản với Clerk component.
Key: load Clerk JS từ CDN với `data-clerk-publishable-key`, mount `Clerk.mountSignIn()`.

### MODIFY: `src/api/static/index.html`
- Thêm Clerk JS CDN script tag
- Thêm `<div id="user-button">` vào header
- Bọc tất cả init code trong `initApp()` function
- On load: check `Clerk.user` → redirect `/login.html` nếu chưa auth
- `getAuthHeaders()` helper để pass Bearer token

### NEW: `src/api/auth.py`
FastAPI dependency để verify Clerk JWT.
Dùng `PyJWT` + JWKS endpoint của Clerk.

### MODIFY: `src/api/app.py`
- Add `user=Depends(verify_clerk_token)` vào các protected endpoints
- Public (không cần auth): `GET /`, `GET /login.html`, static files

### MODIFY: `src/config.py`
```python
CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL", "")
CLERK_PUBLISHABLE_KEY = os.getenv("CLERK_PUBLISHABLE_KEY", "")
```

## Env vars cần set
```
CLERK_JWKS_URL=https://your-app.clerk.accounts.dev/.well-known/jwks.json
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

## Lưu ý quan trọng
- Clerk JS CDN URL phải dùng `@clerk/clerk-js` từ `https://[frontend-api].clerk.accounts.dev/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`
- Hoặc đơn giản hơn: dùng `<script async src="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js" data-clerk-publishable-key="pk_test_...">`
- Backend cần verify JWT mỗi request → cache JWKS để tránh gọi lại mỗi lần

## Status: ⏳ PENDING
