# Session 1 — Fix Data Pipeline

## Vấn đề
RAG hoàn toàn không hoạt động vì DB rỗng. Chatbot đang hallucinate 100% vì không có context.

## Bugs cần fix

### Bug 1: `src/services/ingestion.py` — ToC key mismatch
- Code đọc `toc_data.get("toc", [])` → JSON có `"table_of_contents"`
- Code đọc `item["title"]`, `item["summary"]`, `item["start_time"]`, `item["end_time"]` → JSON có `topic_title`, `detailed_summary`, `timestamp` (chỉ start, không có end)

### Bug 2: `src/services/ingestion.py` — Transcript parser sai format
- Code expect: `[HH:MM:SS] text` trên một dòng
- Thực tế: YouTube format — `HH:MM:SS` trên dòng riêng, text trên các dòng tiếp theo

### Bug 3: `src/config.py` — Model name sai
- `gemini-3-flash-preview` không tồn tại → `gemini-2.0-flash`

### Bug 4: `src/services/llm_service.py` — ThinkingConfig lỗi
- `ThinkingConfig(include_thoughts=True)` chỉ hoạt động với thinking-specific models

### Bug 5: Windows path backslash trong URL
- `os.path.join("data", filename)` trên Windows tạo `data\cs231n\...` → URL bị broken

## Status: ✅ COMPLETED
