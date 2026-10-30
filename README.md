# ChartAnimator — Animated Trading Chart Video Maker
## Vận hành theo mô hình Claude Code Harness — 3 Tầng Kỷ Luật

> Dự án xây dựng công cụ đồ họa trực tuyến tạo video phân tích kỹ thuật dạng hoạt ảnh (Forex/Gold XAUUSD, Crypto, Stocks) với các mô hình SMC/ICT, mô phỏng giá Brownian Motion (GBM) và xuất video 9:16 Shorts/TikTok trực tiếp từ trình duyệt.

Dự án được cấu trúc và quản trị nghiêm ngặt theo **Mô hình Claude Code Harness 3 Tầng** ("Từ thư mục trống đến quy trình AI có kỷ luật"):

---

## 🏛️ Cấu trúc Harness 3 Tầng của dự án

### 🟢 1. TẦNG 1 — NỀN TẢNG: Ngữ cảnh • Bản đồ • Đầu ra (Bắt đầu mọi dự án)
* **[CLAUDE.md](file:///g:/Other%20computers/My%20Computer/Project/chart/CLAUDE.md):** Bản chỉ dẫn cốt lõi trả lời 5 câu hỏi nền tảng (Bạn là ai, Dự án làm gì, Cách làm việc, Quy tắc bất biến, Output bàn giao). Tự động nạp đầu tiên.
* **[MAP.md](file:///g:/Other%20computers/My%20Computer/Project/chart/MAP.md):** Bản đồ quy ước cây thư mục thực tế của dự án. Single Source of Truth về vị trí tệp tin.
* **[contexte/](file:///g:/Other%20computers/My%20Computer/Project/chart/contexte):** Tri thức bóc tách về Clean-Room REA, toán học GBM và chỉ báo SMC/ICT.
* **[knowledge/](file:///g:/Other%20computers/My%20Computer/Project/chart/knowledge):** Kho tri thức 11 khóa học thực chiến của Azzam Academy (OPT 1 - OPT 11).
* **[livrables/](file:///g:/Other%20computers/My%20Computer/Project/chart/livrables):** Nơi chứa sản phẩm bàn giao, artifacts (`livrables/specs/`) và báo cáo kiểm định (`livrables/test_reports/`).

---

### 🟡 2. TẦNG 2 — HARNESS: Rules • Skills • Agents • MCP • Bảo mật (Dự án thật, dài hạn)
* **[CLAUDE.local.md](file:///g:/Other%20computers/My%20Computer/Project/chart/CLAUDE.local.md):** Sở thích và cấu hình cá nhân môi trường dev (nằm trong `.gitignore`).
* **[AGENTS.md](file:///g:/Other%20computers/My%20Computer/Project/chart/AGENTS.md):** Quy tắc phân vai: Orchestrator Hermes, Clean-Room Builder, Compliance Auditor, Spec Agent.
* **[SPEC.md](file:///g:/Other%20computers/My%20Computer/Project/chart/SPEC.md):** Đặc tả mục tiêu và logic sản phẩm.
* **[PLAN.md](file:///g:/Other%20computers/My%20Computer/Project/chart/PLAN.md):** Kế hoạch hành động từng giai đoạn kèm bằng chứng nghiệm thu (Shell-verified).
* **[.mcp.json](file:///g:/Other%20computers/My%20Computer/Project/chart/.mcp.json):** Kết nối công cụ ngoài (MCP project).
* **[.claude/](file:///g:/Other%20computers/My%20Computer/Project/chart/.claude):**
  * `settings.json` / `settings.local.json`: Cấu hình hệ thống.
  * `rules/`: Quy tắc Clean-Room, Mutation Testing, Canvas optimization và Semantic Validation.
  * `skills/`: Kỹ năng đóng gói (`hermes_director.md`, `video_pipeline.md`, `setup_verifier.md`).
  * `agents/`: Hồ sơ Sub-agents (`hermes_orchestrator.md`, `clean_room_builder.md`, `compliance_auditor.md`).
  * `output-styles/`: Mẫu format cho bản Spec và Báo cáo kiểm định.
* **[sources/](file:///g:/Other%20computers/My%20Computer/Project/chart/sources):** Tài liệu nguồn & dữ liệu thô ban đầu.
* **[scripts/](file:///g:/Other%20computers/My%20Computer/Project/chart/scripts):** Script tự động hóa (`verify_goal.js`, `run-mutation-test.ps1`, `sync_azzam_knowledge.js`).
* **Bảo mật:** Biến môi trường mẫu `.env.example` (không chứa secrets), file thực tế `.env` / `.env.local` được bảo vệ tuyệt đối trong `.gitignore`.

---

### 🟣 3. TẦNG 3 — ĐA NHIỆM: GitHub riêng tư • Branch • Worktree • Pull Request (Đồng bộ mọi nơi)
* **Git Private Repo & Lịch sử Commit:** Quản trị nhánh an toàn, dễ dàng rollback.
* **[.worktreeinclude](file:///g:/Other%20computers/My%20Computer/Project/chart/.worktreeinclude):** Cấu hình cho phép chạy nhiều Agent song song trên các Git Worktree khác nhau:
  * `Session A (feature-api)`: Phát triển API và tích hợp kịch bản.
  * `Session B (fix-ui)`: Tối ưu Canvas và Safe Zones TikTok.
  * `Session C (tests)`: Chạy kiểm thử tự động.
* **[.github/workflows/ci.yml](file:///g:/Other%20computers/My%20Computer/Project/chart/.github/workflows/ci.yml):** Pipeline GitHub Actions tự động chạy test suite khi có commit hoặc Pull Request.

---

## 🚀 Khởi chạy & Kiểm định (Verification Commands)

### 1. Chạy Web Studio trên trình duyệt
```bash
npm run dev
# Mở trình duyệt tại http://localhost:3000
```

### 2. Chạy toàn bộ Test Suite (64/64 tests PASS)
```bash
npm test
```

### 3. Tự động xác thực mục tiêu /goal
```bash
npm run verify:goal
```
