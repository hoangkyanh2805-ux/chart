# Ngữ cảnh 01: Kiến trúc & Chức năng trích xuất từ ChartAnimator.io

## 1. Bản chất ứng dụng
ChartAnimator là một web studio chuyên tạo video hoạt họa biểu đồ phân tích kỹ thuật. 
Trang web bao gồm:
- **Canvas Viewport:** Hiển thị nến, đường giá, các vùng kỹ thuật (FVG, Order Block).
- **Controls Panel:** 
  - Sliders điều chỉnh nến: Open, High, Low, Close, Wick Size, Candle Width, Gap.
  - Bộ nút thêm nến, xóa nến, chọn chế độ nến (Single, Group, ZigZag).
  - Reveal Animation Selector: chọn kiểu chuyển động nến xuất hiện.
- **Timeline & Playhead:** Tua thời gian, chỉnh số lượng nến xuất hiện theo giây.
- **Render Engine:** Xuất MP4 1080p / 4K hoặc ảnh GIF động không có watermark.

## 2. Các điểm độc đáo cần tái hiện
1. **Khả năng điều chỉnh trực quan 100%:** Người dùng không cần code hay nhập công thức phức tạp, kéo thanh trượt nến thay đổi hình dạng theo thời gian thực.
2. **Animation mượt mà:** Nến vẽ ra không bị giật, bấc nến co giãn mượt, đường giá di chuyển kèm hiệu ứng hạt / glow.
3. **Bộ màu hiện đại:** Theme Dark Mode mặc định, nến Bullish màu xanh cyan neon (`#00F5A0`), nến Bearish màu đỏ hồng neon (`#FF3366`), nền tối sâu (`#0B0E14`).
