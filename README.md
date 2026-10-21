# ChartAnimator — Animated Trading Chart Video Maker

> Dự án xây dựng công cụ đồ họa trực tuyến tạo video phân tích kỹ thuật dạng hoạt ảnh (Forex, Crypto, Stocks) với các mô hình SMC/ICT, mô phỏng giá Brownian Motion (GBM) và xuất video 4K/Shorts trực tiếp từ trình duyệt.

Dự án này được thiết kế và vận hành theo mô hình **Harness 3 Tầng có kỷ luật** kết hợp phương pháp **Clean-Room Reverse Engineering (REA + Claude Agent)**.

---

## 🏛️ Cấu trúc Harness 3 Tầng của dự án

### 🟢 Tầng 1 — Nền tảng: Ngữ cảnh • Bản đồ • Đầu ra
- [CLAUDE.md](file:///g:/Other%20computers/My%20Computer/Project/chart/CLAUDE.md): Chỉ dẫn cốt lõi cho AI Agent (Ai, làm gì, nguyên tắc làm việc).
- [MAP.md](file:///g:/Other%20computers/My%20Computer/Project/chart/MAP.md): Sơ đồ quy ước vị trí file, cập nhật liên tục.
- [contexte/](file:///g:/Other%20computers/My%20Computer/Project/chart/contexte): Chứa toàn bộ tài liệu bóc tách được từ [ChartAnimator.io](https://www.chartanimator.io/), công thức toán học GBM, quy chuẩn vẽ SMC (FVG, Order Block).
- [livrables/](file:///g:/Other%20computers/My%20Computer/Project/chart/livrables): Thư mục chứa sản phẩm bàn giao, artifacts và test reports.

### 🟡 Tầng 2 — Harness: Rules • Skills • Agents • MCP • Bảo mật
- [SPEC.md](file:///g:/Other%20computers/My%20Computer/Project/chart/SPEC.md): Đặc tả toàn bộ tính năng và logic của ChartAnimator.
- [PLAN.md](file:///g:/Other%20computers/My%20Computer/Project/chart/PLAN.md): Kế hoạch từng Phase thực thi.
- [AGENTS.md](file:///g:/Other%20computers/My%20Computer/Project/chart/AGENTS.md): Phân định vai trò riêng biệt giữa Spec Agent, Builder Agent và Mutation Test Agent.
- [.mcp.json](file:///g:/Other%20computers/My%20Computer/Project/chart/.mcp.json): Kết nối công cụ ngoài `rea-agents`.
- [.claude/rules/](file:///g:/Other%20computers/My%20Computer/Project/chart/.claude/rules): Quy tắc Clean-Room cấm copy code, quy tắc kiểm thử 3 bản hỏng (Mutation Testing).
- [scripts/](file:///g:/Other%20computers/My%20Computer/Project/chart/scripts): Script tự động hóa setup REA và chạy kiểm thử.

### 🟣 Tầng 3 — Đa nhiệm: Git Worktree • Branch • CI/CD
- `.worktreeinclude`: Cấu hình cho phép chạy nhiều Agent song song trên các Git Worktree khác nhau.
- `.github/workflows/ci.yml`: Pipeline CI tự động chạy kiểm thử.

---

## 🚀 Khởi động nhanh (Quick Start)

### 1. Thiết lập công cụ REA MCP
```bash
powershell -ExecutionPolicy Bypass -File ./scripts/setup-rea.ps1
```

### 2. Kiểm thử đột biến (Mutation Testing)
```bash
powershell -ExecutionPolicy Bypass -File ./scripts/run-mutation-test.ps1
```
