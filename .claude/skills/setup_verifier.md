# Skill: Setup Verifier (Kỹ năng Kiểm định Toàn Vẹn Kỹ Thuật)

## Mục đích
Tự động đối soát và chuẩn hóa mọi setup nến, overlays, thẻ lệnh trước khi render video để đảm bảo tính đồng nhất 100%.

## Quy trình thực hiện
1. **Kiểm tra Gate 1:** Dùng `extractSemanticIntent()` để phát hiện hướng BUY/SELL từ Tiêu đề.
2. **Kiểm tra Gate 2:** Dùng `validateCandleGeometry()` để kiểm tra độ dốc nến và râu nến quét.
3. **Kiểm tra Gate 3:** Dùng `enforceRiskFirstMath()` để kiểm tra tính hợp lệ của TP/SL và tỷ lệ R:R $\ge 1:3.0$.
4. **Auto-Normalize:** Nếu phát hiện sai lệch, tự động kích hoạt `validateAndNormalizeSetup()` để sửa lỗi trước khi hiển thị lên Canvas.

