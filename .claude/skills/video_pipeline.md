# Skill: Video Pipeline (Kỹ năng Dựng & Xuất Video Đa Nền Tảng)

## Mục đích
Quản trị quy trình render video từ Canvas đồ họa, đảm bảo chuẩn 60FPS mượt mà, định dạng 9:16 dọc và an toàn bố cục (Safe Zones).

## Quy trình thực hiện
1. **Kiểm tra Safe Zones:** Đảm bảo toàn bộ chữ (Tiêu đề, Phụ đề, Thẻ lệnh) nằm trong vùng an toàn $32px \le X \le (Width - 32px)$ và cách đáy $120px$.
2. **Khóa trạng thái (State Freeze):** Đóng băng timeline tại $0.0s$ trước khi khởi chạy recording.
3. **Capture luồng Canvas:** Thu luồng `canvas.captureStream(60)` bằng MediaRecorder (V1) hoặc WebCodecs (V2).
4. **Đóng gói file:** Xuất file MP4/WebM chất lượng cao và tự động kích hoạt tải xuống cho người dùng.

