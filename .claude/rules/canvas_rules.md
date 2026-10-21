# Rule: Hiệu năng Canvas & Video Pipeline

1. **Normalized Coordinates:** Không bao giờ lưu tọa độ đối tượng ở dạng pixel cứng; luôn lưu theo tọa độ chuẩn hóa (`ratio 0.0 -> 1.0` hoặc `candle_index` và `price`).
2. **Device Pixel Ratio (DPR):** Luôn nhân `window.devicePixelRatio` khi setup canvas buffer để nến nét căng trên màn hình Retina / 4K.
3. **Dirty Rect / Offscreen Canvas:** Không render lại toàn bộ nếu chỉ có 1 layer thay đổi khi ở chế độ preview tĩnh.
4. **Deterministic Frames:** Khi tua timeline đến frame $F$, hàm `renderFrame(F)` phải trả về hình ảnh giống nhau 100% (idempotent), không phụ thuộc vào `Date.now()` hay biến ngẫu nhiên không có seed.
