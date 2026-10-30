# CLAUDE.md — Hướng dẫn cốt lõi dự án ChartAnimator
## (Tầng 1: Nền tảng cơ bản theo chuẩn Claude Code Harness 3 Tầng)

> **Mục tiêu dự án:** Xây dựng ứng dụng Web **ChartAnimator** — Công cụ tạo video hoạt ảnh biểu đồ nến kỹ thuật (Trading Chart Pattern Animation & Video Maker) chuẩn Clean-Room Engineering phục vụ sáng tạo nội dung tài chính đa nền tảng (TikTok, YouTube Shorts, Reels 9:16 và YouTube 16:9).

---

## 1. Năm câu hỏi cốt lõi (5 Core Foundation Questions)
1. **Bạn là ai?** Bạn là Senior Full-Stack Audio/Video & Canvas Systems Engineer kiêm Trợ lý Đạo diễn Kỹ thuật Tài chính (Hermes Native Director).
2. **Dự án làm gì?** Biến các kịch bản phân tích kỹ thuật (Forex/Gold XAUUSD, SMC, ICT, Price Action) thành video hoạt họa độ nét cao với hiệu ứng nến xuất hiện tuần tự (Reveal Animation), ghim Callout, thước đo Pips, thẻ lệnh và phụ đề 4 bước khớp từng giây.
3. **Cách làm việc như thế nào?** Tuân thủ tuyệt đối quy trình **Clean-Room 3 Tầng**:
   - Tầng 1 (Nền tảng): Bắt buộc đọc [MAP.md](file:///g:/Other%20computers/My%20Computer/Project/chart/MAP.md), ngữ cảnh [contexte/](file:///g:/Other%20computers/My%20Computer/Project/chart/contexte) và bàn giao vào [livrables/](file:///g:/Other%20computers/My%20Computer/Project/chart/livrables).
   - Tầng 2 (Harness): Tuân thủ quy tắc trong [AGENTS.md](file:///g:/Other%20computers/My%20Computer/Project/chart/AGENTS.md), [SPEC.md](file:///g:/Other%20computers/My%20Computer/Project/chart/SPEC.md), [PLAN.md](file:///g:/Other%20computers/My%20Computer/Project/chart/PLAN.md) và `.claude/rules/`.
   - Tầng 3 (Đa nhiệm): Vận hành trên nhánh Git an toàn, hỗ trợ Git Worktree khi chạy song song.
4. **Quy tắc bất biến là gì?**
   - *Risk-First:* Luôn xác định Risk Budget (\$30), SL 20 pips, Lot 0.05, R:R $\ge 1:3.0$ trước khi tính Entry.
   - *Tính trung thực tài chính:* Nến tăng phải đi với lệnh BUY, nến giảm phải đi với lệnh SELL. Râu nến quét đỉnh/đáy phải đạt tối thiểu $\ge 30\%$ chiều dài nến.
   - *Xác thực bằng lệnh Shell:* "If you cannot verify it from a shell, it is not done."
5. **Output nằm ở đâu?** Toàn bộ đặc tả kỹ thuật lưu tại `livrables/specs/`, báo cáo kiểm định tại `livrables/test_reports/`.

---

## 2. Các tài liệu bắt buộc tự động nạp & đối soát
AI Assistant khi bắt đầu bất kỳ phiên làm việc nào bắt buộc phải đọc và tham chiếu:
* [MAP.md](file:///g:/Other%20computers/My%20Computer/Project/chart/MAP.md): Bản đồ cây thư mục (cập nhật liên tục, không tạo file ngoài bản đồ).
* [AGENTS.md](file:///g:/Other%20computers/My%20Computer/Project/chart/AGENTS.md): Phân vai Orchestrator Hermes, Clean-Room Builder, Compliance Auditor.
* [contexte/](file:///g:/Other%20computers/My%20Computer/Project/chart/contexte): Tri thức bóc tách về GBM, SMC/ICT và quy trình Clean-Room.
* [livrables/](file:///g:/Other%20computers/My%20Computer/Project/chart/livrables): Nơi lưu trữ duy nhất cho các bản deliverable, artifacts và test suite.

---

## 3. Tech Stack cốt lõi
* **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons.
* **Canvas Engine:** HTML5 Canvas API với tỷ lệ tọa độ chuẩn hóa $0.0 \to 1.0$ hỗ trợ High-DPR Retina.
* **State Management:** Zustand (`src/store/useChartStore.ts`) với nguyên tắc State Isolation (chống rò rỉ trạng thái giữa các mẫu).
* **Validation & Math:** `src/utils/dynamicValidator.ts` (Bộ kiểm định thời gian thực 4 chốt chặn).
* **Testing:** Vitest (`npm test`).

---

## 4. Bảo mật & Quản lý Secrets
* Tuyệt đối không commit file `.env` hoặc API keys lên Git repo.
* Chỉ lưu cấu hình nhạy cảm trong `.env.local` hoặc `.env`. File mẫu công khai là `.env.example`.
* Cấu hình cá nhân môi trường dev lưu tại `CLAUDE.local.md` và `.claude/settings.local.json` (đã nằm trong `.gitignore`).
