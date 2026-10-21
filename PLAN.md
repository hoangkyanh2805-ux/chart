# PLAN.md — Kế hoạch thực hiện từng bước (Clean-Room Execution Plan)

## Giai đoạn 1: Thiết lập nền tảng & Cấu trúc Canvas (Tuần 1)
- [ ] Khởi tạo dự án Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, Zustand.
- [ ] Xây dựng Core State (`useChartStore`): Lưu mảng nến `Candle[]`, các lớp `Overlay[]`, cấu hình khung hình (16:9, 9:16).
- [ ] Cài đặt Canvas Engine cơ bản: Vẽ nến Bullish/Bearish với tỷ lệ tọa độ chuẩn hóa.
- [ ] **Kiểm thử đột biến (Mutation Check 1):** Kiểm tra thuật toán mapping tọa độ giá -> pixel Y (cấm đảo ngược chiều nến).

## Giai đoạn 2: Trình tạo nến & Mô phỏng giá (Tuần 2)
- [ ] Giao diện bảng điều khiển OHLC trực quan (Slidier Open, High, Low, Close, Gap, Width).
- [ ] Tích hợp thuật toán toán học GBM (Geometric Brownian Motion) tạo nến tự động theo Trend & Volatility.
- [ ] Hỗ trợ tạo cụm nến (Group Candle Builder) và sóng ZigZag.
- [ ] **Kiểm thử đột biến (Mutation Check 2):** Kiểm tra tính hợp lệ của nến ($High \ge \max(Open, Close)$ và $Low \le \min(Open, Close)$). Nếu vi phạm, trình tạo nến phải từ chối hoặc tự điều chỉnh.

## Giai đoạn 3: Timeline & Animation Engine (Tuần 3)
- [ ] Thiết kế Timeline Player: Play/Pause, tua thời gian (scrubber), FPS control (30/60 fps).
- [ ] Triển khai các thuật toán Reveal:
  - Linear Sequential Reveal (xuất hiện nến theo nhịp).
  - Wick-first Body-later Reveal.
  - Brownian Real-time Walk Reveal.
- [ ] Tích hợp công cụ vẽ: FVG (Fair Value Gap), Order Block, Long/Short Tool, Spotlight & Glow Orb.
- [ ] **Kiểm thử đột biến (Mutation Check 3):** Tua timeline đến frame $T$ bất kỳ phải render hình ảnh deterministic (đồng nhất 100% không bị lệch nến).

## Giai đoạn 4: Bộ xuất Video (WebCodecs) & Hoàn thiện (Tuần 4)
- [ ] Tích hợp pipeline xuất video trên trình duyệt bằng `WebCodecs API` + `mp4-muxer`.
- [ ] Thêm xuất ảnh tĩnh PNG và ảnh động GIF.
- [ ] Thư viện Template mẫu (SMC Liquidity Sweep, FVG Entry, Wyckoff Accumulation).
- [ ] Kiểm thử toàn diện và đóng gói bàn giao vào thư mục [livrables/](file:///g:/Other%20computers/My%20Computer/Project/chart/livrables).
