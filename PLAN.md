# PLAN.md — Kế hoạch thực hiện từng bước (Clean-Room Execution Plan)
## (Cập nhật tiến độ nghiệm thu theo Claude Code Harness 3 Tầng)

---

## Giai đoạn 1: Thiết lập nền tảng & Cấu trúc Canvas (Hoàn thành)
- [x] Khởi tạo dự án Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Zustand.
- [x] Xây dựng Core State (`src/store/useChartStore.ts`): Lưu mảng nến `Candle[]`, các lớp `Overlay[]`, tỷ lệ khung hình (16:9, 9:16).
- [x] Cài đặt Canvas Engine cơ bản: Vẽ nến Bullish/Bearish với tỷ lệ tọa độ chuẩn hóa.
- [x] **Kiểm thử đột biến (Mutation Check 1):** Thuật toán mapping tọa độ giá -> pixel Y (`tests/coordinates.test.ts` PASS 100%).

---

## Giai đoạn 2: Trình tạo nến & Mô phỏng giá (Hoàn thành)
- [x] Giao diện bảng điều khiển OHLC trực quan (`src/components/ControlsPanel.tsx`).
- [x] Tích hợp thuật toán toán học GBM (Geometric Brownian Motion) tạo nến tự động theo Trend & Volatility (`src/math/gbm.ts`).
- [x] Hỗ trợ tạo cụm nến (Group Candle Builder) và sóng ZigZag (`src/math/zigzag.ts`, `src/math/groupCandles.ts`).
- [x] **Kiểm thử đột biến (Mutation Check 2):** Kiểm tra tính hợp lệ của nến ($High \ge \max(Open, Close)$ và $Low \le \min(Open, Close)$) (PASS 100%).

---

## Giai đoạn 3: Timeline, Animation & Đồng bộ Ngữ Nghĩa (Hoàn thành)
- [x] Thiết kế Timeline Player: Play/Pause, tua thời gian (scrubber), FPS control (30/60 fps) (`src/components/NleTimeline.tsx`).
- [x] Triển khai các thuật toán Reveal: Sequential Reveal, Wick-then-body Reveal, Brownian Walk Reveal.
- [x] Tích hợp công cụ vẽ: FVG (Fair Value Gap), Order Block, Long/Short Tool, Safe Zones 9:16.
- [x] **Đặc tả & Kiểm thử Đồng bộ Ngữ Nghĩa (SPEC 1):**
  - Chấm dứt lỗi rò rỉ trạng thái (Dirty State Leakage).
  - Chuẩn hóa 100% 11 kịch bản mẫu trong `src/data/templates.ts`.
  - Bộ kiểm định `tests/templateSemanticAlignment.test.ts` (PASS 36/36 tests).
- [x] **Đặc tả & Kiểm thử Nội Dung Động / Ngẫu nhiên (SPEC 2):**
  - Xây dựng Bộ lọc kiểm định thời gian thực 4 chốt chặn (`src/utils/dynamicValidator.ts`).
  - Tự động chuẩn hóa SL 20 pips, Risk \$30, RR 1:3.5 (`applyAutoNormalize`).
  - Bộ kiểm định `tests/dynamicContentValidator.test.ts` (PASS 11/11 tests).

---

## Giai đoạn 4: Bộ xuất Video (WebCodecs) & Hoàn thiện (Đang triển khai)
- [x] Tích hợp pipeline xuất video trên trình duyệt bằng `MediaRecorder` + 60FPS (`src/utils/recorder.ts`, `src/components/ExportModal.tsx`).
- [x] Thư viện 11 Template mẫu chuẩn hóa (SMC Liquidity Sweep, FVG Entry, Wyckoff, Hexagold Viral).
- [x] Huy hiệu kiểm định trực quan `[✓ VERIFIED]` trên Canvas Studio.
- [ ] Nâng cấp pipeline xuất video offline bằng `WebCodecs API` (`VideoEncoder` + `mp4-muxer`) cho Headless Bridge CLI.
- [ ] Tích hợp PRNG Seed cố định (Mulberry32) cho thuật toán sinh nến GBM.

---

## 📋 Bằng chứng kiểm định Shell (Verified in Shell)
* **Tổng số bài test:** 64 tests PASS (5 test suites).
* **Trạng thái máy chủ:** HTTP 200 OK tại `http://localhost:3000`.
