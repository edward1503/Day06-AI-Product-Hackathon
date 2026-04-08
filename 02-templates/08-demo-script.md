# Demo script — 2 phút

Cấu trúc demo cho demo round. Tổng 2 phút, mỗi người trong nhóm nói ít nhất 1 phần.

---

## Structure

| Phần | Thời gian | Nội dung | Ai nói |
|------|-----------|----------|--------|
| **Problem** | 20 giây | Ai gặp vấn đề gì? Hiện giải thế nào? Tại sao chưa đủ? | ___ |
| **Solution** | 20 giây | AI giải thế nào? Automation hay augmentation? Tại sao chọn vậy? | ___ |
| **Live demo** | 60 giây | Show 1 flow chính chạy thật. Chỉ ra: input → AI xử lý → output → user thấy gì | ___ |
| **Lessons** | 20 giây | Failure mode chính là gì? Điều học được khi build? | ___ |

---

## Tips

- **Show, don't tell:** demo chạy thật, không chỉ nói miệng
- **Nói chậm:** 2 phút ngắn hơn bạn nghĩ — nói nhanh = peer không hiểu
- **Mỗi người nói:** phân công rõ trước, không để 1 người nói hết
- **Chuẩn bị backup:** nếu demo crash → có screenshot/video backup
- **Mở sẵn mọi thứ:** trước khi peer đến, laptop mở sẵn demo, không để mất thời gian load

---

## Anti-patterns

- Đừng show code — peer cần thấy product, không cần thấy code
- Đừng giải thích API — "dùng GPT-4o" là đủ
- Đừng quá 2 phút — hard limit, peer cần thời gian điền feedback
- Đừng demo nhiều flow — 1 flow chính, demo tốt > demo nhiều

## Checklist trước demo

- [ ] Demo script viết ra giấy, mỗi người biết phần mình
- [ ] Dry run ít nhất 1 lần, bấm giờ
- [ ] Backup plan nếu demo crash
- [ ] Mỗi người trả lời được: "Auto hay aug?", "Failure mode chính?", "Phần mình làm gì?"

---

## Mở rộng (optional — bonus)

### Demo edge case

Ngoài happy path, demo thêm 1 tình huống AI xử lý chưa tốt — và show cách product handle:

| Phần | Thời gian | Nội dung |
|------|-----------|----------|
| **Happy path** | 40 giây | Flow chính, AI đúng, user hài lòng |
| **Edge case** | 20 giây | Input khó → AI không chắc hoặc sai → show UI handle: fallback, gợi ý thay thế, option escalate |

Tại sao? Peer và GV ấn tượng hơn rất nhiều khi nhóm biết product mình fail ở đâu và đã design cho nó.

### Before → After live comparison

Demo cả flow cũ (không AI) và flow mới (có AI) cạnh nhau:

1. **30 giây:** show flow cũ — user phải làm thủ công, mất bao lâu, bao nhiêu bước
2. **30 giây:** show flow mới — cùng task, AI hỗ trợ, nhanh hơn / ít bước hơn

So sánh trực tiếp tạo "aha moment" cho người xem.

### Hỏi peer thử ngay

Mời 1 peer ngồi thử demo ngay tại chỗ (thay vì chỉ nhìn nhóm demo):

- Đưa laptop/điện thoại cho peer
- Nói: "thử nhập triệu chứng của bạn xem AI gợi ý gì"
- Quan sát phản ứng — peer tự trải nghiệm ấn tượng hơn peer nghe kể

### Câu hỏi mở rộng

- Nếu demo crash giữa chừng, câu nói nào sẽ cứu tình huống? (Plan B nên chuẩn bị sẵn lời nói)
- Demo 2 phút chỉ show được 1 flow — nếu có 5 phút, sẽ show thêm gì?
- Peer hỏi "tại sao không dùng ChatGPT/Gemini trực tiếp?" — trả lời thế nào?
