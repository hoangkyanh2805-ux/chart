# Ngữ cảnh 03: Toán học Geometric Brownian Motion (GBM) trong tạo nến

Để tái hiện tính năng **GBM Builder** và **Brownian Reveal** của ChartAnimator:

## 1. Phương trình vi phân ngẫu nhiên (SDE)
Mô hình chuẩn của Black-Scholes / GBM:
$$dS_t = \mu S_t dt + \sigma S_t dW_t$$

Dạng giải tích rời rạc từng bước thời gian $\Delta t$:
$$S_{t+\Delta t} = S_t \exp\left(\left(\mu - \frac{1}{2}\sigma^2\right)\Delta t + \sigma \sqrt{\Delta t} Z\right)$$

Trong đó:
- $S_t$: Giá tại thời điểm $t$.
- $\mu$: Tham số xu hướng (Drift) – giá trị dương tạo xu hướng tăng (Uptrend), âm tạo giảm (Downtrend).
- $\sigma$: Độ biến động (Volatility) – quyết định độ dài bấc nến và biên độ dao động.
- $Z$: Biến ngẫu nhiên phân phối chuẩn tắc $Z \sim \mathcal{N}(0, 1)$ (sử dụng biến đổi Box-Muller trong JavaScript).

## 2. Tạo nến OHLC từ chuỗi bước giá nội bộ (Sub-ticks)
Mỗi cây nến gồm $M$ bước giá nhỏ (mặc định $M = 20$ ticks):
- $Open = S_0$
- $Close = S_M$
- $High = \max(S_0, S_1, \dots, S_M)$
- $Low = \min(S_0, S_1, \dots, S_M)$
