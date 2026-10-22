# AGENTS.md — Quy tắc phân vai và điều phối Agents

Trong dự án ChartAnimator, quy trình AI được chia thành các vai trò chuyên biệt tuân thủ mô hình **Clean-Room Engineering**:

---

## 1. Audit & Spec Agent (REA Agent)
- **Nhiệm vụ:**
  - Kết nối với REA MCP server (`npx rea-agents`).
  - Phân tích bundle, file mã hóa hoặc giao diện của [ChartAnimator.io](https://www.chartanimator.io/).
  - Trích xuất: Định dạng dữ liệu (JSON schema), công thức toán học, hành vi tương tác và lưu vào `sources/` hoặc `contexte/`.
- **Ràng buộc nghiêm ngặt:** 
  - **Không** viết code tính năng cho dự án.
  - Chỉ xuất tài liệu đặc tả logic và hành vi (`.spec.md`).

---

## 2. Clean-Room Builder Agent (Coder)
- **Nhiệm vụ:**
  - Khởi tạo phiên làm việc mới độc lập.
  - Đọc duy nhất [SPEC.md](file:///g:/Other%20computers/My%20Computer/Project/chart/SPEC.md) và tài liệu trong [contexte/](file:///g:/Other%20computers/My%20Computer/Project/chart/contexte).
  - Viết code mới 100% bằng TypeScript, React, Canvas API.
- **Ràng buộc nghiêm ngặt:**
  - Không đọc mã nguồn dịch ngược (decompiled raw code) từ `sources/`.
  - Tuân thủ quy chuẩn Clean Architecture: tách biệt Data Model, Math Engine, Render Layer và UI Component.

---

## 3. Mutation Testing Agent (QA)
- **Nhiệm vụ:**
  - Tạo test suite kiểm tra tính đúng đắn của Canvas và Video pipeline.
  - Thực thi quy tắc **3 Broken Mutations**: Tạo ra 3 phiên bản code lỗi có chủ đích:
    1. Lỗi đảo ngược tọa độ Canvas.
    2. Lỗi nến sai cấu trúc OHLC.
    3. Lỗi drop frame khi xuất video.
  - Đảm bảo toàn bộ 3 phiên bản lỗi này đều bị Test Suite bắt được (**FAIL 100%**).
  - Lập báo cáo kiểm định lưu vào [livrables/test_reports/](file:///g:/Other%20computers/My%20Computer/Project/chart/livrables).

---

## 4. Strict Trading Video & Compliance Auditor Agent (Quality Expert)
- **Nhiệm vụ:**
  - Đóng vai trò chuyên gia kiểm duyệt nội dung trading khắt khe và khó tính nhất.
  - Kiểm tra tiêu chuẩn kịch bản:
    1. **Hook & Retention**: Đánh giá 3 giây đầu tiên của video (có giật gân, tạo tension ngay lập tức không? Có dính AI-smell hay sáo rỗng không?).
    2. **Tính chân thực thị trường (Financial Integrity)**: Kiểm tra mã XAUUSD bám sát giá thực ($4,129.00), nến hồi về hỗ trợ ($4,128.00), nến rút râu (rejection wick), tỷ lệ Risk:Reward tối thiểu 1:3.
    3. **Tuân thủ chính sách (Finance Policy Map & 8 NEVERs)**: Bắt buộc nhãn `ILLUSTRATION / NOT FINANCIAL ADVICE`, không hứa hẹn lợi nhuận, không hô tín hiệu (signal), luôn đặt Risk Budget ($30) trước Entry.
    4. **Xuất video đa nền tảng**: Thẩm định độ phân giải và an toàn bố cục (Safe Zones) cho 9:16 (Shorts/TikTok/Reels), 16:9 (YouTube Landscape) và 1:1 (Social Feed).
  - Báo cáo kiểm định lưu vào [livrables/audit_report_strict_video_qa.md](file:///g:/Other%20computers/My%20Computer/Project/chart/livrables).
