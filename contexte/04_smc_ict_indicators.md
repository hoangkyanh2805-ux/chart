# Ngữ cảnh 04: Quy chuẩn hình học các công cụ Smart Money Concepts (SMC)

## 1. Fair Value Gap (FVG)
- **Định nghĩa Bullish FVG:**
  - Xét bộ 3 nến liên tiếp $C_1, C_2, C_3$.
  - Khoảng trống giữa $High(C_1)$ và $Low(C_3)$ khi $Low(C_3) > High(C_1)$.
  - Tọa độ hộp FVG trên Canvas:
    - $Y_{top} = \text{pixel}(Low(C_3))$
    - $Y_{bottom} = \text{pixel}(High(C_1))$
    - $X_{start} = \text{pixel}(C_2.index)$
    - $X_{end} = \text{pixel}(\text{CurrentIndex hoặc điểm bị lấp Gap})$

- **Định nghĩa Bearish FVG:**
  - $Low(C_1) > High(C_3)$.
  - $Y_{top} = \text{pixel}(Low(C_1))$, $Y_{bottom} = \text{pixel}(High(C_3))$.

## 2. Order Block (OB)
- Là cây nến giảm cuối cùng trước một đợt tăng mạnh phá vỡ cấu trúc (Bullish OB), hoặc cây nến tăng cuối cùng trước đợt giảm mạnh (Bearish OB).
- Vùng hộp Order Block bao phủ từ $Open$ đến $Low$ (hoặc $High$ đến $Low$) của cây nến đó, kéo dài sang phải.

## 3. Thước đo Long/Short Risk:Reward
- Gồm 3 đường: Entry Price, Stop Loss (SL), Take Profit (TP).
- Tỷ lệ $R:R = \frac{|TP - Entry|}{|Entry - SL|}$.
- Hiển thị trực quan: Vùng xanh lá cho Target/Profit, vùng đỏ cho Risk/Loss.
