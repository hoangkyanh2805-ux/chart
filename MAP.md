# MAP.md — Bản đồ dự án & Quy ước cây thư mục
## (Chuẩn hóa đồng bộ theo Claude Code Harness 3 Tầng)

> **Nguyên tắc:** Bản đồ này là Single Source of Truth về vị trí tệp tin. Khi tạo mới hoặc tái cấu trúc, bắt buộc phải cập nhật file này trước tiên.

```
chart/
├── CLAUDE.md                   # [TẦNG 1] Hướng dẫn cốt lõi, 5 câu hỏi nền tảng (Tự nạp)
├── CLAUDE.local.md             # [TẦNG 2] Cấu hình môi trường cá nhân (Nằm trong .gitignore)
├── MAP.md                      # [TẦNG 1] Bản đồ cấu trúc thư mục (File này)
├── AGENTS.md                   # [TẦNG 2] Phân vai: Orchestrator Hermes, Builder Coder, Auditor
├── SPEC.md                     # [TẦNG 2] Đặc tả kỹ thuật nền tảng ứng dụng ChartAnimator
├── PLAN.md                     # [TẦNG 2] Kế hoạch hành động theo từng Phase & Task
├── README.md                   # [TẦNG 3] Giới thiệu tổng quan kiến trúc Harness 3 Tầng
├── .mcp.json                   # [TẦNG 2] Cấu hình kết nối công cụ ngoài (MCP project)
├── .env.example                # [TẦNG 2/3] Biến môi trường mẫu (Không chứa secrets)
├── .env.local                  # [TẦNG 2/3] Secrets thực tế (Nằm trong .gitignore)
├── .worktreeinclude            # [TẦNG 3] Cấu hình sao chép tệp khi dùng Git Worktree
├── .gitignore                  # [TẦNG 2/3] Bảo vệ secrets, node_modules, .next, cache
├── package.json                # Cấu hình dependency, scripts và test commands
├── tsconfig.json               # Cấu hình TypeScript compiler
├── tailwind.config.ts          # Cấu hình Tailwind CSS styles
│
├── .claude/                    # [TẦNG 2] Cấu hình Harness hoàn chỉnh
│   ├── settings.json           # Thiết lập chung cho AI Agent
│   ├── rules/                  # Bộ quy tắc kỷ luật bắt buộc
│   │   ├── clean_room.md       # Quy tắc Clean-Room & cấm copy code thô
│   │   ├── mutation_test.md    # Quy tắc kiểm thử 3 bản hỏng (Mutation Testing)
│   │   ├── canvas_rules.md     # Quy tắc tối ưu FPS & bộ nhớ Canvas
│   │   ├── semantic_validation.md # Quy tắc đối soát ngữ nghĩa & Risk-First
│   │   └── grounded_citations.md  # Quy tắc Hermes v0.20 Grounded Citations & Sổ cái Ledger
│   ├── skills/                 # Kỹ năng đóng gói cho AI Agent
│   │   ├── hermes_director.md  # Kỹ năng đạo diễn kịch bản & setup XAUUSD
│   │   ├── video_pipeline.md   # Kỹ năng xử lý xuất video WebCodecs / MediaRecorder
│   │   └── setup_verifier.md   # Kỹ năng kiểm định tính toàn vẹn kỹ thuật
│   ├── agents/                 # Hồ sơ định danh các Sub-Agents
│   │   ├── hermes_orchestrator.md # Tổng đạo diễn nội dung & phân bổ nhiệm vụ
│   │   ├── clean_room_builder.md  # Kỹ sư lập trình Clean-Room không đọc code thô
│   │   └── compliance_auditor.md  # Chuyên gia kiểm định chính sách tài chính
│   └── output-styles/          # Mẫu format chuẩn đầu ra
│       ├── spec_style.md       # Mẫu tài liệu đặc tả kỹ thuật (.spec.md)
│       └── audit_report_style.md # Mẫu báo cáo kiểm định chất lượng video
│
├── contexte/                   # [TẦNG 1] Ngữ cảnh tri thức tích lũy
│   ├── 01_chartanimator_decompiled.md  # Bóc tách giao diện & tính năng ChartAnimator.io
│   ├── 02_rea_cleanroom_process.md     # Quy trình Clean-Room REA 4 bước
│   ├── 03_gbm_mathematics.md           # Công thức toán học Brownian Motion (GBM)
│   └── 04_smc_ict_indicators.md        # Định nghĩa các vùng FVG, Order Block, Liquidity
│
├── knowledge/                  # [TẦNG 1] Kho tri thức miền ứng dụng (Domain Knowledge)
│   └── azzam_courses/          # 11 khóa học thực chiến của Azzam Academy (OPT 1 - OPT 11)
│       ├── INDEX.md            # Mục lục tổng quan 11 khóa học
│       └── 01_opt_11...md      # Chi tiết từng khóa học
│
├── livrables/                  # [TẦNG 1] Sản phẩm bàn giao nghiệm thu
│   ├── specs/                  # Các bản đặc tả kỹ thuật đã nghiệm thu
│   │   ├── SPEC-SETUP-SEMANTIC-ALIGNMENT-AND-STATE-HYGIENE-v1.md
│   │   ├── SPEC-DYNAMIC-CONTENT-RUNTIME-VALIDATOR-AND-AUTO-NORMALIZER-v1.md
│   │   └── CHARTANIMATOR-BRIDGE-CHART-CAPABILITY-MANIFEST-v1.md
│   └── test_reports/           # Báo cáo kiểm định & audit chất lượng
│       ├── audit_report_strict_video_qa.md
│       └── audit_report_trading_integrity.md
│
├── sources/                    # [TẦNG 2] Tài liệu nguồn & dữ liệu thô
│   └── raw_chartanimator_dom.json
│
├── scripts/                    # [TẦNG 2] Scripts tự động hóa
│   ├── setup-rea.ps1           # Cài đặt công cụ REA MCP
│   ├── run-mutation-test.ps1   # Script chạy kiểm thử đột biến
│   ├── verify_goal.js          # Tự động xác thực mục tiêu /goal
│   └── sync_azzam_knowledge.js # Đồng bộ tri thức khóa học
│
├── src/                        # [TẦNG 2] Mã nguồn ứng dụng Clean-Room
│   ├── app/                    # Next.js App Router (Giao diện chính & API routes)
│   │   ├── api/hermes/         # API kết nối kịch bản & AI chat
│   │   ├── api/ai/parse-brief/ # API phân tích kịch bản thô
│   │   ├── globals.css         # Tailwind & theme styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Trang chính Studio Editor
│   ├── components/             # UI Components
│   │   ├── StageCanvas.tsx     # Canvas chính render video TikTok 9:16 có Safe Zones
│   │   ├── ChartCanvas.tsx     # Canvas kỹ thuật OHLC dạng TradingView
│   │   ├── TemplateSidebar.tsx # Thư viện 11 mẫu kịch bản chuẩn hóa
│   │   ├── AuditorPanel.tsx    # Bảng Kiểm Duyệt Viên Chuyên Gia 4 Trạm cho Editor
│   │   ├── TextTypographyPanel.tsx # Studio hiệu chỉnh Typography & Subtitles
│   │   ├── ControlsPanel.tsx   # Bộ trượt nến OHLC & tham số GBM
│   │   ├── NleTimeline.tsx     # Timeline đa rãnh phi tuyến tính (NLE)
│   │   ├── ExportModal.tsx     # Modal xuất video 30/60 FPS có Pre-Export Hard Gate
│   │   ├── BriefImporterModal.tsx # Bộ nhập kịch bản bên ngoài
│   │   └── Header.tsx          # Thanh công cụ trên cùng
│   ├── math/                   # Toán học & Mô phỏng
│   │   ├── coordinates.ts      # Chuyển đổi tọa độ giá sang Pixel Canvas Y
│   │   ├── gbm.ts              # Động cơ mô phỏng giá Geometric Brownian Motion
│   │   ├── zigzag.ts           # Động cơ sinh sóng đỉnh đáy
│   │   └── groupCandles.ts     # Động cơ tạo cụm nến mô hình
│   ├── store/                  # Trạng thái toàn cục (Zustand)
│   │   └── useChartStore.ts    # Core store với nguyên tắc State Isolation
│   ├── data/                   # Dữ liệu kịch bản & Templates
│   │   ├── templates.ts        # 11 kịch bản chuẩn hóa 100% metadata
│   │   ├── azzamOps.ts         # Danh mục kịch bản thực chiến
│   │   └── coursePainpointMatrix.ts # Ma trận kết nối 11 khóa học & nỗi đau
│   ├── utils/                  # Tiện ích hệ thống
│   │   ├── dynamicValidator.ts # Bộ kiểm định thời gian thực & Auto-Normalizer
│   │   ├── groundedCitations.ts # Động cơ Hermes v0.20 Grounded Citations & Evidence Ledger
│   │   ├── hermesEngine.ts     # Bộ máy sinh kịch bản đạo diễn Hermes
│   │   └── recorder.ts         # Bộ ghi video Canvas thời gian thực
│   └── types/                  # Định nghĩa kiểu dữ liệu TypeScript
│       └── chart.ts            # Candle, Overlay, ExecutionOrder, ValidationReport
│
├── tests/                      # [TẦNG 2] Test Suite tự động (Vitest)
│   ├── coordinates.test.ts     # Kiểm định thuật toán ánh xạ tọa độ Canvas
│   ├── hermesEngine.test.ts    # Kiểm định động cơ kịch bản đạo diễn
│   ├── coursePainpointMatrix.test.ts # Kiểm định ma trận khóa học
│   ├── templateSemanticAlignment.test.ts # Kiểm định 11 templates chuẩn hóa
│   ├── dynamicContentValidator.test.ts   # Kiểm định nội dung động & ngẫu nhiên
│   ├── groundedCitations.test.ts # Kiểm định Hermes Grounded Citations & 3 Broken Mutations
│   └── inAppAuditor.test.ts      # Kiểm định In-App Auditor & Pre-Export Hard Gate
│
└── .github/                    # [TẦNG 3] CI/CD & GitHub Actions
    └── workflows/
        └── ci.yml              # Pipeline tự động chạy test khi push/PR
```
