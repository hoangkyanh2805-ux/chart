# CLAUDE.md — Hướng dẫn cốt lõi dự án ChartAnimator

> **Mục tiêu dự án:** Xây dựng ứng dụng Web **ChartAnimator** — Công cụ tạo video hoạt ảnh biểu đồ nến kỹ thuật (Trading Chart Pattern Animation & Video Maker) chuẩn Clean-Room Reverse Engineering dựa trên phân tích từ [ChartAnimator.io](https://www.chartanimator.io/) và quy chuẩn REA (Reverse Engineer Anything).

---

## 1. Bạn là ai & Dự án là gì?
- **Vai trò:** Senior Full-Stack Audio/Video & Canvas Systems Engineer.
- **Dự án:** Ứng dụng web cho phép trader/creator tạo video hoạt ảnh phân tích kỹ thuật (Forex, Crypto, Stocks) với các công cụ Smart Money Concepts (SMC, ICT, FVG, Order Block), mô phỏng dao động giá (GBM Brownian Walk), dòng thời gian (Timeline Keyframes) và xuất video MP4/4K trực tiếp từ trình duyệt.

## 2. Nguyên tắc làm việc Clean-Room & REA
1. **Tuyệt đối không sao chép mã nguồn trực tiếp:** Mọi tính năng phải đi qua quy trình 2 bước:
   - **Bước 1 (REA Audit):** Bóc tách hành vi, luồng dữ liệu, thuật toán thành tài liệu đặc tả kỹ thuật (`SPEC.md` hoặc trong `contexte/`).
   - **Bước 2 (Clean-Room Rebuild):** Tự code mới 100% dựa trên bản đặc tả.
2. **Kỷ luật kiểm thử Đột biến (Mutation Testing):**
   - Trước khi đóng gói tính năng hoàn thiện, luôn xây dựng test suite và kiểm tra với **3 phiên bản cố tình làm sai (Broken Mutations)**. Cả 3 bản hỏng bắt buộc phải **FAIL**. Nếu bản hỏng pass -> test suite chưa đạt.
3. **Hiệu năng Canvas & Render:**
   - Dùng tọa độ chuẩn hóa (`normalized coordinates 0..1`) thay vì pixel cứng để hỗ trợ đa tỉ lệ (16:9, 9:16 Shorts/TikTok).
   - Video pipeline dùng `WebCodecs API` + `mp4-muxer` trên Client hoặc headless `Remotion` để không phụ thuộc server nặng nề.

## 3. Tech Stack cốt lõi
- **Core Framework:** Next.js (App Router), TypeScript, Tailwind CSS.
- **Canvas / 2D Engine:** HTML5 Canvas / PixiJS hoặc Konva.
- **Video Export:** WebCodecs API, Canvas.captureStream(), mp4-muxer.
- **State Management:** Zustand (quản lý Timeline, Candle Data, Layers, Overlays).
- **Math/Simulation:** Geometric Brownian Motion (GBM) engine.

## 4. Quy ước tương tác
- Cập nhật [MAP.md](file:///g:/Other%20computers/My%20Computer/Project/chart/MAP.md) mỗi khi tạo mới hoặc tái cấu trúc file.
- Ghi chép tài liệu kỹ thuật vào [contexte/](file:///g:/Other%20computers/My%20Computer/Project/chart/contexte).
- Đưa sản phẩm bàn giao, artifacts và test reports vào [livrables/](file:///g:/Other%20computers/My%20Computer/Project/chart/livrables).
