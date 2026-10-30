# QUY TẮC BẮT BUỘC: HERMES v0.20 GROUNDED CITATIONS & EVIDENCE LEDGER

Áp dụng cho toàn bộ các Agent làm việc trong dự án: **Audit Agent, Clean-Room Builder, QA Agent, Hermes Copilot**.

---

## 1. NGUYÊN TẮC BẤT BIẾN
1. **"Traceability $\neq$ Verified Provenance $\neq$ Truth"**:
   - Nhiệm vụ của Harness là kiểm tra sự liên kết tất định giữa **Claim $\to$ ID [n] $\to$ Source trong Ledger $\to$ Verbatim Quote**.
2. **Cấm tuyệt đối việc model tự bịa URL hoặc tự viết phần `# Sources:`**:
   - Mọi file code hoặc tài liệu phải được đăng ký vào Sổ cái (Ledger) trước.
   - Phần `# Sources & Citations Ledger:` ở cuối báo cáo sẽ do Harness tự động render từ Ledger.
3. **Quy tắc trừng phạt Nghiêm ngặt (Strict Gate - Fail Fast)**:
   - Nếu trích dẫn một dòng code hoặc một comment của khán giả mà **không khớp 100% nguyên văn (verbatim)** trong file nguồn $\to$ Phản hồi bị **REJECT NGAY LẬP TỨC** (`E_GROUNDING_QUOTE_MISMATCH`).
   - Agent bắt buộc phải dùng công cụ `read_file` đọc lại file gốc trước khi đưa ra nhận định tiếp theo.

---

## 2. ĐỊNH DANH SỔ CÁI (LEDGER FORMAT)

### Khi nhận định về Mã Nguồn (Code Audit & Debug):
Mọi trích dẫn phải tuân thủ định dạng:
`[n] path/to/file.tsx#L<start>-L<end> (SHA: <git_commit_hash>)`
* Kèm đoạn code verbatim thực tế từ dòng `<start>` đến dòng `<end>`.
* Cấm bịa tên hàm, cấm trích dẫn code không có thật trong file.

### Khi nhận định về Nỗi Đau Khán Giả & Kịch Bản (Market/Channel Intelligence):
Mọi trích dẫn comment hoặc bài giảng phải tuân thủ định dạng:
`[n] channel-brain-v3.md#sec-1.4 (PP-0023)` hoặc `[n] azzam_courses/smc_pro.md#L45`
* Quote bắt buộc phải là chuỗi con nguyên văn trong `channel-brain-v3.md` hoặc 1,204 comments thật của kênh.
* Nếu chưa tìm được comment gốc để kiểm chứng $\to$ **BẮT BUỘC gắn nhãn `[unverified]`**, tuyệt đối không bịa comment.

---

## 3. LỆNH KIỂM TOÁN TỰ ĐỘNG
Chạy lệnh kiểm tra Grounding độc lập:
```bash
node scripts/verify_grounding.js
```
Hoặc chạy lệnh kiểm toán tổng thể dự án:
```bash
npm run verify:goal
```

