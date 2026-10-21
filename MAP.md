# MAP.md — Bản đồ dự án & Quy ước cây thư mục

> Bản đồ này được cập nhật thường xuyên mỗi khi tạo mới, di chuyển hoặc tái cấu trúc các thư mục/tập tin trong dự án.

```
chart/
├── CLAUDE.md                   # Hướng dẫn cốt lõi & nguyên tắc làm việc AI
├── CLAUDE.local.md             # Cấu hình cá nhân môi trường dev (nằm trong .gitignore)
├── MAP.md                      # Bản đồ cấu trúc thư mục (File này)
├── AGENTS.md                   # Phân vai và quy tắc cho các Sub-Agents (REA, Clean-Room, Test)
├── SPEC.md                     # Đặc tả kỹ thuật toàn diện ứng dụng ChartAnimator
├── PLAN.md                     # Kế hoạch hành động theo từng Phase
├── README.md                   # Giới thiệu dự án, setup môi trường và chạy thử
├── .mcp.json                   # Cấu hình MCP server (kết nối rea-agents)
├── .env.example                # Biến môi trường mẫu
├── .worktreeinclude            # Quy ước file khi dùng Git Worktree
├── .gitignore                  # Bỏ qua node_modules, build, .env, livrables tạm
│
├── .claude/                    # Cấu hình quy chuẩn nội bộ của Harness (Tầng 2)
│   ├── settings.json           # Thiết lập chung cho AI Agent
│   ├── rules/                  # Bộ quy tắc kỷ luật bắt buộc
│   │   ├── clean_room.md       # Quy tắc Clean-Room & cấm copy code
│   │   ├── mutation_test.md    # Quy tắc kiểm thử 3 bản hỏng (Mutation Testing)
│   │   └── canvas_rules.md     # Quy tắc tối ưu hóa FPS & bộ nhớ Canvas
│   ├── skills/                 # Kỹ năng đóng gói cho Agent
│   │   ├── rea_audit.md        # Hướng dẫn bóc tách tính năng bằng REA
│   │   └── video_muxer.md      # Kỹ năng xử lý xuất video WebCodecs
│   └── output-styles/          # Mẫu format đầu ra cho spec, test report
│
├── contexte/                   # Ngữ cảnh tri thức tích lũy (Tầng 1)
│   ├── 01_chartanimator_decompiled.md  # Bóc tách giao diện & tính năng ChartAnimator.io
│   ├── 02_rea_cleanroom_process.md     # Quy trình làm việc REA 4 bước
│   ├── 03_gbm_mathematics.md           # Công thức toán học GBM & mô phỏng nến
│   └── 04_smc_ict_indicators.md        # Định nghĩa các vùng FVG, Order Block, Liquidity
│
├── livrables/                  # Sản phẩm bàn giao nghiệm thu (Tầng 1)
│   ├── specs/                  # Các bản đặc tả chi tiết đã nghiệm thu
│   ├── architecture/           # Sơ đồ kiến trúc & luồng dữ liệu
│   └── test_reports/           # Báo cáo kiểm thử đột biến (Mutation Test Reports)
│
├── sources/                    # Tài liệu thô thu thập từ REA / website mục tiêu
│   └── raw_chartanimator_dom.json
│
├── scripts/                    # Scripts tự động hóa
│   ├── setup-rea.ps1           # Cài đặt và kích hoạt rea-agents MCP
│   └── run-mutation-test.ps1   # Script chạy 3 test cases cố tình hỏng
│
├── docs/                       # Tài liệu người dùng & API
│   └── ARCHITECTURE.md         # Tài liệu kiến trúc hệ thống
│
└── .github/
    └── workflows/
        └── ci.yml              # CI/CD tự động chạy test & mutation suite
```
