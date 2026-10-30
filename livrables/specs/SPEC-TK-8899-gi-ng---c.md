# SPEC: [TK-8899] Yêu Cầu Chỉnh Sửa & Feedback Team
**Ngày tạo:** 09:47:06 30/10/2026
**Người gửi:** Trader Tuấn
**Phân loại:** Giọng đọc

---

## 1. Vấn Đề Gặp Phải (User Problem)
> "Chữ phụ đề chạy hơi nhanh so với nến"

## 2. Kết Quả Mong Muốn (Desired Outcome / Behavior)
> "Kéo dài thời gian đọc Stage 3 thêm 1.5 giây"

## 3. Quy Chuẩn Kỹ Thuật & Bất Biến (Financial & System Invariants)
- **Tỷ lệ Risk:Reward:** Tối thiểu 1:3.5.
- **Quản trị Rủi ro (Risk Budget):** Cố định $10 hoặc $30 cho mã XAUUSD M15.
- **Bố cục hiển thị:** An toàn Safe-Zone 9:16 (không đè Dynamic Island Notch, không đè hộp phụ đề).
- **Âm thanh & Phụ đề:** Khớp chuẩn pha thoại và nến hoạt họa.

## 4. Tiêu Chí Nghiệm Thu (Acceptance Criteria)
- [ ] Vấn đề "Chữ phụ đề chạy hơi nhanh so với nến..." được giải quyết hoàn toàn.
- [ ] Bộ kiểm thử `npm test` (114 bài test) PASS 100%.
- [ ] Giao diện hoạt động mượt mà trên môi trường Web Vercel.

---
*Tự động sinh bởi ChartAnimator Ticket System & Hermes Native Orchestrator.*
