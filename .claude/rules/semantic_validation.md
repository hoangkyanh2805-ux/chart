# Quy tắc Kiểm định Ngữ nghĩa & Kỷ luật Tài chính (Semantic Validation & Risk-First Rules)

> Bắt buộc tuân thủ đối với mọi Agent khi tạo hoặc chỉnh sửa setup biểu đồ nến, kịch bản video hoặc bộ nạp dữ liệu.

---

## 1. Nguyên tắc Bất Biến về Hướng Lệnh (Direction Invariant)
* **Kịch bản TĂNG (BUY / LONG):**
  * $TP > Entry > SL$.
  * Chuỗi nến sau điểm kích hoạt phải có xu hướng tăng ($Close_{\text{cuối}} > Entry$).
  * Ghim Callout Pin cắm vào nến quét đáy (rút chân dưới $\ge 30\%$).
* **Kịch bản GIẢM (SELL / SHORT):**
  * $SL > Entry > TP$.
  * Chuỗi nến sau điểm kích hoạt phải có xu hướng giảm ($Close_{\text{cuối}} < Entry$).
  * Ghim Callout Pin cắm vào nến quét đỉnh (râu trên $\ge 30\%$).

---

## 2. Công thức Kỷ luật Vốn Risk-First (\$30 Budget)
* **Stop Loss:** Cố định tối đa **20 pips** (2.0 giá Vàng M15).
* **Tỷ lệ R:R:** Tối thiểu **1:3.0** (mặc định khuyến nghị 1:3.5).
* **Khối lượng (Size):** Cố định **0.05 lot** ứng với mức chịu lỗ tối đa **\$30.00**.
* **Tuyệt đối không:** Hô tín hiệu, hứa hẹn lợi nhuận, giấu rủi ro hoặc đặt Entry trước khi xác định SL.

---

## 3. Quy chuẩn Phụ đề Kịch bản (4-Stage Subtitle Protocol)
* **Chặng 1 (0–25%):** [HOOK] Nêu nghịch lý/câu hỏi đánh vào nỗi đau người xem.
* **Chặng 2 (25–55%):** [TRAP] Chỉ ra cái bẫy thanh khoản của Market Maker tại điểm râu nến quét.
* **Chặng 3 (55–80%):** [SETUP] Nhận diện dấu chân Big Boys (FVG, Order Block, MSS).
* **Chặng 4 (80–100%):** [EXECUTION] Chốt chặn lệnh bảo vệ vốn \$30 và target lợi nhuận.

