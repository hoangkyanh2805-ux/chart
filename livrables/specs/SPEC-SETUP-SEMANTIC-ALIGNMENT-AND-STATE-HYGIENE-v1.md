# ĐẶC TẢ KỸ THUẬT: ĐỒNG BỘ NGỮ NGHĨA SETUP & VỆ SINH TRẠNG THÁI STUDIO
## (SPEC-SETUP-SEMANTIC-ALIGNMENT-AND-STATE-HYGIENE-v1)

- **Mã tài liệu:** `SPEC-SETUP-SEMANTIC-ALIGNMENT-AND-STATE-HYGIENE-v1`
- **Phiên bản:** `1.0.0`
- **Trạng thái:** `PENDING_REVIEW`
- **Áp dụng cho:** `src/store/useChartStore.ts`, `src/data/templates.ts`, `src/components/StageCanvas.tsx`, `src/utils/hermesEngine.ts`
- **Mục tiêu:** Chấm dứt triệt để lỗi "rò rỉ trạng thái bẩn" (Dirty State Leakage) và đảm bảo 100% tính đồng nhất giữa Tiêu đề kịch bản, Hình thái nến, Chỉ báo SMC, Thẻ lệnh vào và Phụ đề thuyết minh.

---

## 1. VẤN ĐỀ CỐT LÕI & PHÂN TÍCH NGUYÊN NHÂN (ROOT CAUSE)

### 1.1. Hiện tượng lỗi thực tế
Người dùng hoặc biên tập viên khi chuyển đổi giữa các mẫu kịch bản trên giao diện gặp phải hiện tượng **"Nội dung một đằng, biểu đồ một nẻo"**:
1. Chọn template BUY/LONG (ví dụ: *London Quét Đáy Á Bùng Nổ Tăng Giá*):
   - Biểu đồ nến vẽ giá tăng từ $4,114 lên $4,162 (+265 pips).
   - Nhưng trên màn hình lại xuất hiện Ghim Callout: **"🎯 BẪY DỤ BUY QUÉT ĐỈNH"** (của kèo SELL trước đó).
   - Thẻ lệnh hiển thị màu đỏ: **"SELL 0.05 LOT @ 4136.0"**.
   - Phụ đề chạy chữ: *"Market Maker xả hàng bán tháo sập 240 pips..."*.
2. Khi mở ứng dụng lần đầu:
   - Tiêu đề giật gân về "Bẫy quét đỉnh Vàng", nhưng nến ban đầu lại là cụm nến đi ngang không có đỉnh, ghim găm vào nến bình thường.

### 1.2. Phân tích nguyên nhân mã nguồn
1. **Rò rỉ trạng thái (Dirty State Leakage) trong `loadTemplate()`:**
   - Trong `src/store/useChartStore.ts`, khi nạp một template không có trường `calloutPinText`, `executionOrder`, `scriptSubtitles`, hệ thống dùng toán tử `|| state.calloutPinText` hoặc `?? state.executionOrder`.
   - Điều này làm template mới **kế thừa toàn bộ dữ liệu của template cũ**, tạo ra sự lai tạp mâu thuẫn 180°.
2. **Dữ liệu Template phân mảnh (Incomplete Template Schema):**
   - Chỉ có 3 template Hexagold được khai báo các trường TikTok Dynamics mới.
   - 8 template còn lại (Templates 4–11) thiếu 100% metadata kịch bản, dẫn đến việc luôn bị nhiễm bẩn dữ liệu từ trước.

---

## 2. NGUYÊN TẮC BẤT BIẾN KỸ THUẬT (THE 6 SEMANTIC INVARIANTS)

Bất kỳ setup nào (dù nạp từ Template, import từ Brief hay sinh từ Hermes AI) đều phải thỏa mãn **6 nguyên tắc bất biến**:

### Invariant 1: Tính Đồng Nhất Hướng Lệnh (Directional Consistency)
* Nếu kịch bản là **BUY (LONG)**:
  * $\text{TP} > \text{Entry} > \text{SL}$.
  * Thẻ lệnh bắt buộc màu xanh lá: `type: 'BUY'`.
  * Màu chữ lợi nhuận: `+XXX PIPS` (xanh ngọc `#00F5A0`).
* Nếu kịch bản là **SELL (SHORT)**:
  * $\text{SL} > \text{Entry} > \text{TP}$.
  * Thẻ lệnh bắt buộc màu đỏ: `type: 'SELL'`.
  * Màu chữ lợi nhuận: `+XXX PIPS` (xanh ngọc khi đạt TP).

### Invariant 2: Tính Chuẩn Xác của Râu Nến Kích Hoạt (Trigger Wick Alignment)
* **Bẫy Quét Đỉnh (BSL Sweep / Bull Trap):** Nến kích hoạt phải có **râu trên (upper wick) vượt qua cản đỉnh** và thân nến đóng phía dưới cản. Ghim `Callout Pin` bắt buộc cắm vào nến này.
* **Bẫy Quét Đáy (SSL Sweep / Bear Trap):** Nến kích hoạt phải có **râu dưới (lower wick) đâm thủng cản đáy** và thân nến rút chân đóng phía trên cản. Ghim `Callout Pin` bắt buộc cắm vào nến này.

### Invariant 3: Đồng Bộ Tiêu Đề ↔ Cấu Trúc Nến (Title-To-Candle Cohesion)
* Tiêu đề có chứa các từ khóa: `Quét Đáy`, `Breakout`, `Bật Tăng`, `Scalp Buy`, `Spring`, `Bullish` $\implies$ Toàn bộ chuỗi nến sau điểm kích hoạt phải có xu hướng tăng ($Close_{cuối} > Open_{đầu}$).
* Tiêu đề có chứa: `Quét Đỉnh`, `Sập`, `CPI Dump`, `Supply Zone`, `Bearish`, `Phân Phối` $\implies$ Toàn bộ chuỗi nến sau điểm kích hoạt phải có xu hướng giảm ($Close_{cuối} < Open_{đầu}$).

### Invariant 4: Đồng Bộ Nhịp Thời Gian Phụ Đề (Storyboard-Timeline Sync)
Mỗi video đều phải có đúng **4 chặng phụ đề** tương ứng với tiến độ `progress = currentTime / duration`:
1. `timePercent: 0.00` — **[HOOK]** Nêu nghịch lý/câu hỏi đánh vào nỗi đau (0–25% thời lượng).
2. `timePercent: 0.28` — **[TRAP]** Chỉ ra cái bẫy thanh khoản của Market Maker khi nến quét xuất hiện (25–55% thời lượng).
3. `timePercent: 0.58` — **[SETUP]** Chỉ dấu chân Big Boys (FVG, Order Block, MSS) (55–80% thời lượng).
4. `timePercent: 0.82` — **[EXECUTION]** Chốt chặn Risk-First ($30 Risk, SL 20p, chốt lời target) (80–100% thời lượng).

### Invariant 5: Căn Chỉnh Vị Trí Ghim Callout (Pin Anchor Accuracy)
* `calloutCandleIndex` phải là một chỉ số hợp lệ trong mảng nến ($0 \le \text{index} < \text{candles.length}$).
* Nội dung ghim `calloutPinText` phải mô tả đúng hành động giá tại chính cây nến đó (ví dụ: không được cắm ghim *"BẪY DỤ BUY"* vào cây nến quét đáy).

### Invariant 6: Kỷ Luật Quản Trị Vốn Risk-First (Risk-First Math Formula)
* $\text{Risk Budget} = \$30$ (hoặc \$10 cho tài khoản nhỏ).
* $\text{SL} \le 20\text{ pips}$ (tối đa không quá 25 pips đối với Vàng M15).
* $\text{Tỷ lệ R:R} \ge 1:3.0$ ($\text{Khoảng cách TP} \ge 3 \times \text{Khoảng cách SL}$).

---

## 3. THIẾT KẾ ĐẶC TẢ SỬA ĐỔI (DETAILED SPECIFICATION)

### 3.1. Sửa đổi Store: Vệ sinh trạng thái tuyệt đối (`src/store/useChartStore.ts`)
Loại bỏ hoàn toàn cơ chế lấy trộm trạng thái cũ trong `loadTemplate()`:

```typescript
// QUY TẮC MỚI: State Isolation - Không bao giờ fallback sang state cũ!
loadTemplate: (template) =>
  set((state) => ({
    candles: template.candles,
    overlays: template.overlays,
    duration: template.duration,
    currentTime: template.duration,
    isPlaying: false,
    revealMode: template.revealMode || 'sequential',
    headlineText: template.headlineText || template.title,
    sublineText: template.sublineText || template.description?.substring(0, 70) || '',
    badges: template.badges || ['1. LOSS $30', '2. SL 20 PIPS', '3. LOT 0.05'],
    
    // Nếu template KHÔNG khai báo -> Reset về trạng thái sạch, KHÔNG lấy của template trước!
    showCalloutPin: template.showCalloutPin ?? (!!template.calloutPinText),
    calloutPinText: template.calloutPinText || '',
    calloutCandleIndex: template.calloutCandleIndex ?? 0,
    showPipCounter: template.showPipCounter ?? (!!template.targetPips),
    targetPips: template.targetPips ?? 0,
    showExecutionBadge: template.showExecutionBadge ?? (!!template.executionOrder),
    executionOrder: template.executionOrder || null,
    scriptSubtitles: template.scriptSubtitles || [],
    
    settings: {
      ...state.settings,
      aspectRatio: template.aspectRatio || state.settings.aspectRatio,
      spotlightEnabled: template.spotlightEnabled ?? true,
    },
  }))
```

---

### 3.2. Đặc tả dữ liệu chuẩn hóa cho toàn bộ 11 Templates (`src/data/templates.ts`)

Mỗi template bắt buộc phải có đầy đủ 100% các trường: `headlineText`, `sublineText`, `badges`, `showCalloutPin`, `calloutPinText`, `calloutCandleIndex`, `showPipCounter`, `targetPips`, `showExecutionBadge`, `executionOrder`, `scriptSubtitles`.

#### Bảng đặc tả 11 Templates sau chuẩn hóa:

| # | ID Template | Hướng Lệnh | Callout Pin Text | Entry / SL / TP | Target Pips | Chủ đề Subtitles |
| :--- | :--- | :---: | :--- | :--- | :---: | :--- |
| **1** | `hexagold-asia-sweep` | **SELL** | 🎯 BẪY DỤ BUY QUÉT ĐỈNH | $4136 / $4142 / $4112 | 240p | Quét đỉnh Á dụ Buy $\to$ sập MSS |
| **2** | `hexagold-cpi-dump` | **SELL** | ⚡ JUDAS SWEEP 4,155.00 | $4128 / $4138 / $4093 | 350p | Tin CPI giật bấc gom thanh khoản $\to$ FVG |
| **3** | `hexagold-risk-first-30` | **SELL** | 🛡️ $30 RISK BUDGET LOCKED | $4132 / $4138 / $4113 | 190p | Đặt SL \$30 trước khi tính Entry |
| **4** | `xauusd-london-asia-sweep` | **BUY** | 🎯 QUÉT ĐÁY Á 4,114.00 (H1 OB) | $4132 / $4124 / $4158.5 | 265p | London quét thủng đáy Á chạm H1 OB $\to$ NY Bùng Nổ |
| **5** | `xauusd-cpi-spike-reversal` | **SELL** | ⚡ BẪY QUÉT THANH KHOẢN CPI | $4128 / $4138 / $4100 | 280p | Cú đâm Judas tin CPI $\to$ Retest Bearish FVG |
| **6** | `xauusd-4150-round-level` | **SELL** | 🛑 CẢN TÂM LÝ $4,150.00 | $4136 / $4146 / $4114 | 220p | Đám đông Buy-stop bị phân phối tại số tròn |
| **7** | `xauusd-m15-scalp-fvg` | **BUY** | 🎯 CHẠM 50% FVG C.E. (4131.5) | $4133 / $4127 / $4154 | 210p | M15 Scalp canh mua tại 50% Consequent Encroachment |
| **8** | `xauusd-break-retest-support` | **BUY** | 🚀 PHÁ CẢN THÀNH HỖ TRỢ $4,132 | $4134 / $4128 / $4155 | 210p | Breakout kháng cự cũ kiểm định hỗ trợ mới |
| **9** | `xauusd-h1-supply-distribution` | **SELL** | 🏛️ H1 SUPPLY ZONE PHÂN PHỐI | $4149 / $4153 / $4116 | 330p | FOMO mua đỉnh tại khối cung H1 $\to$ Tổ chức Short |
| **10**| `xauusd-risk-first-3steps` | **BUY** | 🛡️ HỖ TRỢ $4,128 (SL 20 PIPS) | $4129 / $4125 / $4150 | 210p | 3 bước Azzam: Khóa lỗ \$30, đo 20p, vào lệnh |
| **11**| `xauusd-wyckoff-spring` | **BUY** | 💎 WYCKOFF SPRING RŨ BỎ 4,112 | $4126 / $4118 / $4145 | 190p | Pha C Wyckoff đâm thủng hỗ trợ gom hàng xong |

---

### 3.3. Đồng bộ Khởi Tạo Ban Đầu (`INITIAL_CANDLES` & Initial State)
* Khi người dùng truy cập web lần đầu tiên, không dùng mảng nến ngẫu nhiên lạc quẻ.
* Khởi tạo ban đầu sẽ nạp **ngay lập tức Template 1 (`hexagold-asia-sweep`)** làm trạng thái mặc định, đảm bảo:
  * Tiêu đề: *"TẠI SAO BẠN THUA LỖ KHI BUY GOLD TẠI ĐỈNH?"*.
  * Nến: Đúng 7 cây nến của kịch bản Quét Đỉnh Á.
  * Ghim: Cắm chính xác vào cây nến số 2 (cây nến quét râu $4,146).
  * Lệnh: SELL 0.05 lot, SL $4,142, TP $4,112.
  * Phụ đề: Đồng bộ từng giây.
  $\implies$ **Giao diện vừa mở lên là chuẩn chỉ, không có bất kỳ hạt sạn nào.**

---

## 4. CHIẾN LƯỢC KIỂM THỬ TỰ ĐỘNG (AUTOMATED TEST SUITE)

Tạo test suite mới tại `tests/templateSemanticAlignment.test.ts` để tự động hóa việc kiểm tra:

1. **Test 1 - Check Hướng Lệnh:** Với mọi template có `executionOrder`:
   * Nếu `BUY`: Khẳng định $TP > Entry > SL$.
   * Nếu `SELL`: Khẳng định $SL > Entry > TP$.
2. **Test 2 - Check Độ Dài Nến & Chỉ Số Ghim:**
   * Khẳng định $0 \le calloutCandleIndex < candles.length$.
3. **Test 3 - Check Tính Đầy Đủ Metadata:**
   * 100% 11 templates bắt buộc phải có `scriptSubtitles` với ít nhất 4 chặng (`Hook`, `Trap`, `Setup`, `Execution`).
4. **Test 4 - Check Không Rò Rỉ Trạng Thái:**
   * Chạy mô phỏng chuyển từ Template SELL sang Template BUY $\implies$ Khẳng định `executionOrder.type` chuyển thành `'BUY'`, không còn dấu vết `'SELL'`.

---

## 5. KẾT QUẢ NGHIỆM THU (ACCEPTANCE CRITERIA)

* [ ] Tất cả 11 templates trong thư viện hiển thị tiêu đề, ghim callout, thẻ lệnh, phụ đề và hình thái nến khớp nhau 100%.
* [ ] Chuyển đổi qua lại giữa bất kỳ template nào không còn hiện tượng rò rỉ dữ liệu cũ.
* [ ] Giao diện khởi động mặc định hiển thị đồng bộ hoàn hảo.
* [ ] Bộ test `npm test` chạy PASS toàn bộ các bài kiểm tra đồng bộ ngữ nghĩa.

