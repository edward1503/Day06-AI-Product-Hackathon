# Session 5 — Google Drive Video Embed

## Mục tiêu
Thay local MP4 bằng Google Drive iframe để tránh lưu file lớn trên server.

## Setup Google Drive (manual)
1. Upload video lên Google Drive
2. Right-click → Share → "Anyone with the link" → Copy link
3. Lấy File ID từ URL: `https://drive.google.com/file/d/{FILE_ID}/view`
4. Embed URL: `https://drive.google.com/file/d/{FILE_ID}/preview`

## Code changes

### `src/models/store.py`
Thêm column vào `Lecture`:
```python
drive_file_id = Column(String, nullable=True)
```

### `src/services/ingestion.py`
Accept và store `drive_file_id` trong `ingest_lecture()`.

### `scripts/ingest_cs231n.py`
Pass `drive_file_id` khi gọi `ingest_lecture()`.

### `src/api/app.py`
Include `drive_file_id` trong response của `list_lectures`.

### `src/api/static/index.html`
Thay `<video>` element bằng iframe:
```html
<div id="videoContainer">
  <video id="mainVideo" controls style="display:none; width:100%;"></video>
  <iframe id="drivePlayer" style="display:none; width:100%; aspect-ratio:16/9; border:0; border-radius:8px;"
    allow="autoplay"></iframe>
</div>
```

Trong `selectLecture()`:
```javascript
if (lec.drive_file_id) {
    document.getElementById('mainVideo').style.display = 'none';
    const iframe = document.getElementById('drivePlayer');
    iframe.src = `https://drive.google.com/file/d/${lec.drive_file_id}/preview`;
    iframe.style.display = 'block';
    currentVideoMode = 'drive';
} else {
    // fallback to local video
}
```

## Lưu ý về timestamp
- Google Drive iframe không expose `currentTime` qua JS (cross-origin restriction)
- Giải pháp: thêm manual timestamp input hoặc timestamp tự cập nhật theo thời gian xem
- Hoặc: user gõ timestamp thủ công khi hỏi
- Đây là limitation của Drive embed — acceptable cho demo

## Status: ⏳ PENDING
