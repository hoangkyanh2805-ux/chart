# SPEC.md — Đặc tả kỹ thuật ứng dụng ChartAnimator

## 1. Mục tiêu sản phẩm
Xây dựng công cụ đồ họa trực tuyến giúp nhà sáng tạo nội dung tài chính biến các thiết lập giao dịch (OHLC, SMC, ICT) thành video hoạt họa độ nét cao phục vụ truyền thông xã hội (YouTube Shorts, TikTok, Reels, 16:9 ngang và 9:16 dọc).

---

## 2. Các thành phần hệ thống (Component Breakdown)

### A. Candle Builder & Price Engine
1. **Dữ liệu OHLC cơ bản:**
   - Hỗ trợ thêm từng nến bằng tay thông qua các thanh trượt: `Open`, `High`, `Low`, `Close`.
   - Tự động nhận diện màu sắc nến: $Close \ge Open$ (Bullish / Xanh lá/ngọc), $Close < Open$ (Bearish / Đỏ/hồng).
   - Tùy chỉnh trực quan: `Wick Width` (độ dày bấc nến), `Body Width` (độ rộng thân nến), `Candle Gap` (khoảng cách giữa các nến).
2. **Generative Price Simulation (GBM Engine):**
   - Mô phỏng chuỗi giá theo mô hình Chuyển động Brown hình học:
     $$S_{t+1} = S_t \cdot \exp\left((\mu - 0.5\sigma^2)dt + \sigma \sqrt{dt} Z\right)$$
   - Tùy chỉnh: Độ dốc xu hướng (Trend/Drift $\mu$), Độ biến động (Volatility $\sigma$), Số lượng nến ($N$).
3. **Chế độ dựng nến nâng cao:**
   - **Group Candles:** Dựng nhanh cụm nến theo mô hình (Engulfing, Morning Star, Pinbar,...).
   - **ZigZag Candles:** Tạo sóng dao động đỉnh đáy tự động.

---

### B. Canvas & Animation Engine
1. **Viewport & Responsive Ratio:**
   - Tùy chọn khung hình: 9:16 (1080x1920 dọc cho Shorts/Reels/TikTok) và 16:9 (1920x1080 ngang cho YouTube).
   - Hệ tọa độ chuẩn hóa (Normalized 0.0 -> 1.0) để đảm bảo không bị vỡ layout khi đổi độ phân giải.
2. **Hiệu ứng xuất hiện (Reveal Animations):**
   - **Linear Sequential Reveal:** Nến xuất hiện lần lượt từ trái sang phải theo nhịp thời gian.
   - **Wick-then-Body Reveal:** Bấc nến vẽ ra biên độ trước, sau đó thân nến nở dần từ Open đến Close.
   - **Brownian Reveal:** Nến hình thành bằng đường đi dao động giá thời gian thực theo tick data giả lập.
3. **Keyframe Timeline:**
   - Dòng thời gian đa layer (Candle Track, Overlay Track, Audio Track, Text Track).
   - Thanh trượt Playhead điều khiển scrub thời gian từ $0.0s \to T_{max}$.

---

### C. Smart Trading Overlays & Annotations
1. **Smart Money Concepts (SMC) & ICT:**
   - **Fair Value Gap (FVG):** Hộp màu nổi bật khoảng trống giữa bấc nến thứ 1 và bấc nến thứ 3.
   - **Order Block (OB):** Vùng cung/cầu (Supply/Demand) đánh dấu cây nến kích hoạt đảo chiều.
   - **Liquidity Sweep Line:** Đường nét đứt đánh dấu quét thanh khoản đỉnh/đáy.
2. **Công cụ giảng dạy (Teaching Tools):**
   - **Spotlight Mode:** Làm tối toàn bộ biểu đồ và chỉ soi sáng khu vực đang phân tích.
   - **Glow Orb:** Tạo hiệu ứng ánh sáng gradient lung linh phía sau biểu đồ.
   - **Point Callout & Arrows:** Mũi tên và bóng chú thích đánh số (1, 2, 3) từng bước vào lệnh.
   - **Long / Short Risk-Reward Marker:** Thước đo rủi ro/lợi nhuận tự động tính tỉ lệ R:R.

---

### D. Export Pipeline (Video & Hình ảnh)
1. **Xuất video Client-side bằng WebCodecs:**
   - Sử dụng `VideoEncoder` (H.264/AVC) + `mp4-muxer` để tạo file `.mp4` ở tốc độ render nhanh hơn thời gian thực mà không tiêu tốn RAM hay băng thông server.
   - Hỗ trợ xuất ảnh tĩnh (PNG) và ảnh động (GIF).
2. **Preset độ phân giải:**
   - 1080p HD (60fps) và 4K UHD.
