---
name: hermes-smc-verifier
description: Chuyên gia toán học nến và thẩm định kỹ thuật Smart Money Concepts (SMC) chuẩn tổ chức cho Vàng XAUUSD. Kiểm định tỷ lệ R:R tối thiểu 1:3.5, SL 20 pips, tính toán Consequent Encroachment (C.E.) 50% FVG và quét thanh khoản BSL/SSL.
---

# Hermes Institutional SMC & Risk-First Math Engine

Skill này đảm bảo mọi setup nến do Hermes đề xuất và nạp lên Stage Canvas đều đáp ứng 100% các tiêu chuẩn toán học nghiêm ngặt của giới giao dịch chuyên nghiệp.

## 1. Công Thức Quản Lý Vốn Chuẩn Tổ Chức
1. **Ngân sách rủi ro (Risk Budget):**
   - Vốn $1,000 $\to$ Rủi ro 1% = **$10** (1R).
   - Vốn $3,000 - $5,000 $\to$ Ngân sách cố định = **$30 - $50**.
2. **Khoảng dừng lỗ (Stop Loss):** Bắt buộc **20 pips** ($2.00 giá Vàng).
3. **Kích thước lệnh (Position Sizing):**
   $$\text{Lot Size} = \frac{\text{Risk Budget}}{\text{SL Pips} \times 10}$$
   - Với Budget $10: $10 / (20 \times 10) = **0.05 lot**.
   - Với Budget $30: $30 / (20 \times 10) = **0.15 lot**.
4. **Tỷ lệ Lời : Lỗ (Risk : Reward):** Tối thiểu **1:3.0 đến 1:3.5**.
   - Target tối thiểu: $20 \times 3.5 = \mathbf{+70\text{ pips}}$.

## 2. Tiêu Chuẩn Nến & Vùng Cản Kỹ Thuật (XAUUSD ~$4,128.00)
- **Fair Value Gap (FVG):** Điểm vào lệnh chuẩn xác tại **50% Consequent Encroachment (C.E.)**.
- **Liquidity Sweep (BSL / SSL):** Bắt buộc có râu nến quét qua đỉnh/đáy phiên Á trước khi xuất hiện nến đảo chiều (Displacement bar).
- **Clean Support/Resistance:** Luôn có nến rút chân (Rejection Wick Pinbar) chạm cản trước khi giá mở rộng.

