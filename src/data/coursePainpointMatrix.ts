import { Candle, Overlay } from '../types/chart';

export interface CoursePainPointPreset {
  id: string;
  courseId: string;
  courseTitle: string;
  lessonFocus: string;
  painPointId: string;
  painPointName: string;
  painPointQuote: string;
  title: string;
  hookHeadline: string;
  hookSubline: string;
  duration: number;
  badges: [string, string, string];
  strategy: 'SMC' | 'Price Action' | 'Market Structure' | 'Key Level' | 'Risk-First';
  script: {
    hook: string; // 0-3s
    tension: string; // 3-15s
    payoff: string; // 15-25s
    cta: string; // 25-30s
    voiceoverNotes: string;
  };
  candles: Candle[];
  overlays: Overlay[];
}

export const COURSE_PAINPOINT_PRESETS: CoursePainPointPreset[] = [
  // 1. OPT 3 (SMC Jayce Pham) + PDF TRAP (PP-0039 / 44 Trading Powers)
  {
    id: 'opt3-smc-fvg-ce-pdf-trap',
    courseId: 'OPT 3',
    courseTitle: 'OPT 3: Advanced SMC — The Complete Smart Money Concepts',
    lessonFocus: 'Fair Value Gap (FVG) & 50% Consequent Encroachment (C.E.)',
    painPointId: 'PP-PDF-TRAP',
    painPointName: 'Cái bẫy săn lùng PDF 44 Trading Powers',
    painPointQuote: 'Tải 40 cuốn sách PDF về ngấu nghiến nhưng vào lệnh vẫn cháy tài khoản...',
    title: 'A PDF WON\'T KEEP YOU ALIVE: The 50% FVG Secret',
    hookHeadline: 'A PDF WON\'T KEEP YOU ALIVE',
    hookSubline: 'A predefined 50% FVG tap will. Here is why.',
    duration: 12,
    badges: ['1. LOSS BUDGET $30', '2. FVG 50% C.E. TAP', '3. SL 20 PIPS'],
    strategy: 'SMC',
    script: {
      hook: 'Cuốn PDF 44 Trading Powers thứ 45 sẽ không cứu được tài khoản của bạn đâu.',
      tension: 'Bạn đánh dấu hàng chục cái hộp trên màn hình rồi tự hỏi tại sao giá đâm xuyên qua. Smart money không vào lệnh ở mép hộp ngẫu nhiên. Họ chờ điểm 50% Consequent Encroachment để cân bằng thanh khoản.',
      payoff: 'Nhìn cây nến rút râu này tại 4,128.50: Chạm đúng 50% FVG, Stop Loss đặt sau râu nến chỉ 20 pips ($30 rủi ro). Khi thị trường mở rộng, lợi nhuận đạt 1:3.5 RR.',
      cta: 'Dừng tích lũy PDF. Định lượng rủi ro trước khi bấm nút Buy.',
      voiceoverNotes: 'Giọng dứt khoát, điềm tĩnh, nhịp điệu dồn dập ở 3 giây đầu.',
    },
    candles: [
      { id: 'c-1', index: 0, open: 4124.0, high: 4126.5, low: 4122.0, close: 4125.0 },
      { id: 'c-2', index: 1, open: 4125.0, high: 4138.0, low: 4124.5, close: 4137.0 }, // Big Displacement Candle
      { id: 'c-3', index: 2, open: 4137.0, high: 4145.0, low: 4136.0, close: 4144.0 }, // Leaves Gap between c1 high (4126.5) & c3 low (4136.0)
      { id: 'c-4', index: 3, open: 4144.0, high: 4144.5, low: 4133.0, close: 4134.0 }, // Pullback begins
      { id: 'c-5', index: 4, open: 4134.0, high: 4135.0, low: 4128.5, close: 4131.0 }, // Tap exactly at 50% C.E. (4131.25) & rejection wick
      { id: 'c-6', index: 5, open: 4131.0, high: 4142.0, low: 4130.0, close: 4141.0 }, // Strong Bullish confirmation
      { id: 'c-7', index: 6, open: 4141.0, high: 4154.0, low: 4140.0, close: 4153.0 }, // Expansion rally
      { id: 'c-8', index: 7, open: 4153.0, high: 4165.0, low: 4151.0, close: 4162.0 }, // Target TP reached
    ],
    overlays: [
      {
        id: 'ov-fvg-box',
        type: 'FVG',
        startCandleIndex: 1,
        endCandleIndex: 5,
        priceStart: 4126.5,
        priceEnd: 4136.0,
        color: '#00F5A0',
        opacity: 0.22,
        label: 'Bullish FVG [4126.50 - 4136.00]',
      },
      {
        id: 'ov-ce-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 1,
        endCandleIndex: 5,
        priceStart: 4131.25,
        priceEnd: 4131.25,
        color: '#F59E0B',
        opacity: 0.9,
        label: '50% Consequent Encroachment (C.E.)',
      },
      {
        id: 'ov-rr-trade',
        type: 'LONG_SHORT',
        startCandleIndex: 4,
        endCandleIndex: 7,
        priceStart: 4131.0, // Entry
        priceEnd: 4162.0,   // TP
        color: '#00F5A0',
        opacity: 0.25,
        label: 'Long XAUUSD +310 Pips (1:3.5 RR)',
      },
    ],
  },

  // 2. OPT 11 (Foundation Forex & Risk-First) + GỒNG LỖ CHÁY TÀI KHOẢN (PP-0039 / Lost $62k)
  {
    id: 'opt11-risk-first-sl-defined-loss',
    courseId: 'OPT 11',
    courseTitle: 'OPT 11: The Complete Foundation FOREX Trading Course',
    lessonFocus: 'Position Sizing, Stop Loss Mechanics & Risk Budgeting',
    painPointId: 'PP-0039',
    painPointName: 'Mất $62,000 vì gồng lỗ và vào lot bừa bãi',
    painPointQuote: 'Charts confuse me... lost $62k trying to revenge trade.',
    title: 'THE STOP LOSS CAME FIRST: Stop Holding Bleeding Trades',
    hookHeadline: 'THE STOP LOSS CAME FIRST',
    hookSubline: 'The entry came second. That order is everything.',
    duration: 10,
    badges: ['1. BUDGET $30', '2. SL 20 PIPS', '3. SIZE 0.05 LOT'],
    strategy: 'Risk-First',
    script: {
      hook: 'Lệnh này bạn dự định mất bao nhiêu tiền trước khi bấm Buy?',
      tension: '90% trader chỉ chăm chú tìm điểm vào lệnh với giấc mơ x2 tài khoản, nhưng không hề biết mình sẽ cắt lỗ ở đâu khi giá quay đầu. Đó là lý do họ gồng lỗ từ $50 thành cháy $62,000.',
      payoff: 'Công thức sống còn: Ngân sách $30 chia cho 20 pips Stop Loss = chính xác 0.05 lot. Dù thị trường có đi ngược, bạn chỉ mất $30. Nhưng khi đúng, bạn ăn trọn 70 pips.',
      cta: 'Quy tắc 1: Đặt mức lỗ trước khi nhìn vào chart.',
      voiceoverNotes: 'Giọng dứt khoát, mang tính thức tỉnh, không thương hại.',
    },
    candles: [
      { id: 'c-1', index: 0, open: 4132.0, high: 4134.0, low: 4128.0, close: 4129.0 },
      { id: 'c-2', index: 1, open: 4129.0, high: 4130.0, low: 4121.0, close: 4122.5 }, // Flash drop towards support
      { id: 'c-3', index: 2, open: 4122.5, high: 4129.0, low: 4118.0, close: 4128.0 }, // Strong rejection pinbar at support
      { id: 'c-4', index: 3, open: 4128.0, high: 4136.0, low: 4126.0, close: 4135.5 }, // Confirmed push
      { id: 'c-5', index: 4, open: 4135.5, high: 4145.0, low: 4134.0, close: 4143.0 },
      { id: 'c-6', index: 5, open: 4143.0, high: 4152.0, low: 4141.0, close: 4149.5 }, // Take Profit hit
    ],
    overlays: [
      {
        id: 'ov-support-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 5,
        priceStart: 4120.0,
        priceEnd: 4120.0,
        color: '#6366F1',
        opacity: 0.8,
        label: 'Key Support ($4,120.00)',
      },
      {
        id: 'ov-sl-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 2,
        endCandleIndex: 4,
        priceStart: 4118.0,
        priceEnd: 4118.0,
        color: '#EF4444',
        opacity: 0.9,
        label: 'Strict Stop Loss: 4,118.00 (-$30 Max Loss)',
      },
      {
        id: 'ov-long-rr',
        type: 'LONG_SHORT',
        startCandleIndex: 2,
        endCandleIndex: 5,
        priceStart: 4128.0,
        priceEnd: 4149.5,
        color: '#00F5A0',
        opacity: 0.22,
        label: 'Long XAUUSD +215 Pips (1:3.5 RR)',
      },
    ],
  },

  // 3. OPT 4 (Market Structure Bootcamp) + KHÔNG BIẾT ĐỌC CHART (PP-0023)
  {
    id: 'opt4-market-structure-bos-pp0023',
    courseId: 'OPT 4',
    courseTitle: 'OPT 4: The Complete Market Structure Course — Pro Bootcamp 2026',
    lessonFocus: 'Swing Highs/Lows, Break of Structure (BOS) & Change of Character (CHoCH)',
    painPointId: 'PP-0023',
    painPointName: 'Không biết đọc biểu đồ, thấy nến nhảy loạn xạ',
    painPointQuote: 'Damn, that\'s cool. Anyways how do I read a chart? (824/1543 comments)',
    title: 'STOP GUESSING CANDLES: The 3 Swing Rules',
    hookHeadline: 'STOP GUESSING CANDLES',
    hookSubline: 'Market structure is not random. It is an auction.',
    duration: 12,
    badges: ['1. HIGHER HIGH (HH)', '2. BREAK OF STRUCTURE (BOS)', '3. RETEST ENTRY'],
    strategy: 'Market Structure',
    script: {
      hook: '824 người bình luận hỏi: Làm sao để đọc được cây nến này?',
      tension: 'Bỏ qua 20 chỉ báo lòe loẹt trên màn hình đi. Thị trường chỉ có đúng 2 trạng thái: Tạo đỉnh cao hơn (Higher High) hoặc phá vỡ cấu trúc đáy (Break of Structure).',
      payoff: 'Khi nến đóng cửa vượt qua đỉnh cũ tại 4,136.00, đó là Break of Structure (BOS). Việc của bạn không phải đuổi theo nến xanh, mà là kiên nhẫn đợi một nhịp hồi pullback về đỉnh cũ bị phá.',
      cta: 'Cấu trúc thị trường là kim chỉ nam duy nhất.',
      voiceoverNotes: 'Giọng sư phạm, giải thích từng thanh nến rõ ràng như chỉ tay trên bảng đen.',
    },
    candles: [
      { id: 'c-1', index: 0, open: 4122.0, high: 4136.0, low: 4120.0, close: 4134.0 }, // Swing High at 4136
      { id: 'c-2', index: 1, open: 4134.0, high: 4135.0, low: 4126.0, close: 4128.0 }, // Pullback Swing Low
      { id: 'c-3', index: 2, open: 4128.0, high: 4142.0, low: 4127.5, close: 4140.0 }, // Strong BOS above 4136
      { id: 'c-4', index: 3, open: 4140.0, high: 4148.0, low: 4139.0, close: 4146.5 }, // New Higher High (HH)
      { id: 'c-5', index: 4, open: 4146.5, high: 4147.0, low: 4136.0, close: 4137.0 }, // Perfect Retest of broken 4136 level
      { id: 'c-6', index: 5, open: 4137.0, high: 4155.0, low: 4135.0, close: 4153.0 }, // Continuation rally
      { id: 'c-7', index: 6, open: 4153.0, high: 4166.0, low: 4150.0, close: 4163.0 }, // TP target
    ],
    overlays: [
      {
        id: 'ov-bos-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 5,
        priceStart: 4136.0,
        priceEnd: 4136.0,
        color: '#F59E0B',
        opacity: 0.85,
        label: 'BOS Level ($4,136.00)',
      },
      {
        id: 'ov-retest-box',
        type: 'ORDER_BLOCK',
        startCandleIndex: 4,
        endCandleIndex: 6,
        priceStart: 4134.0,
        priceEnd: 4138.0,
        color: '#6366F1',
        opacity: 0.2,
        label: 'Break & Retest Zone',
      },
      {
        id: 'ov-rr-trade',
        type: 'LONG_SHORT',
        startCandleIndex: 4,
        endCandleIndex: 6,
        priceStart: 4137.0,
        priceEnd: 4163.0,
        color: '#00F5A0',
        opacity: 0.22,
        label: 'Long XAUUSD +260 Pips (1:3.2 RR)',
      },
    ],
  },

  // 4. OPT 9 (Key Level Strategy) + BẪY BREAKOUT GIẢ (PP-FOMO-BREAKOUT)
  {
    id: 'opt9-keylevel-liquidity-sweep-fomo',
    courseId: 'OPT 9',
    courseTitle: 'OPT 9: The Complete Trading Course Key Level Strategy — 2026 Updates',
    lessonFocus: 'Key Levels, Liquidity Sweeps & Reversal Confirmation',
    painPointId: 'PP-FOMO-BREAKOUT',
    painPointName: 'Đu nến xanh Breakout bị dính bẫy quét thanh khoản',
    painPointQuote: 'Cứ mỗi lần thấy cây nến xanh bự nhảy vào Buy là nó cắm đầu đi xuống...',
    title: 'THE LIQUIDITY SWEEP TRAP: Why Breakouts Fail',
    hookHeadline: 'YOU STOP WATCHING THE SWEEP',
    hookSubline: 'You start watching what happens right after it.',
    duration: 11,
    badges: ['1. BSL LIQUIDITY POOL', '2. SWEEP REJECTION WICK', '3. SHORT AT KEY LEVEL'],
    strategy: 'Key Level',
    script: {
      hook: 'Tại sao cứ hễ bạn nhảy vào Buy nến xanh là thị trường lại cắm đầu?',
      tension: 'Bởi vì cây nến xanh đó được thiết kế để dụ bạn và hàng ngàn retail trader khác nhảy vào mua. Các tổ chức tài chính lớn cần thanh khoản (Buy Stop Liquidity) để xả hàng bán khống.',
      payoff: 'Nhìn bấc nến rút ngược tại đỉnh 4,148.00: Giá vừa quét qua đỉnh cũ đúng 10 pips rồi đóng cửa rút chân dài ngoằng. Ngay lập tức mở vị thế Short với SL phía trên râu nến.',
      cta: 'Đừng làm thanh khoản cho cá mập. Hãy đi theo dòng tiền thông minh.',
      voiceoverNotes: 'Nhịp nói châm biếm ở phần FOMO, sau đó chuyển sang lạnh lùng, sắc bén.',
    },
    candles: [
      { id: 'c-1', index: 0, open: 4130.0, high: 4142.0, low: 4128.0, close: 4140.0 }, // Resistance high at 4142
      { id: 'c-2', index: 1, open: 4140.0, high: 4141.0, low: 4132.0, close: 4135.0 }, // Dip
      { id: 'c-3', index: 2, open: 4135.0, high: 4144.0, low: 4134.0, close: 4141.0 }, // Testing high again
      { id: 'c-4', index: 3, open: 4141.0, high: 4149.0, low: 4133.0, close: 4134.5 }, // Massive Liquidity Sweep Wick to 4149 then closed DOWN at 4134.5!
      { id: 'c-5', index: 4, open: 4134.5, high: 4136.0, low: 4122.0, close: 4123.0 }, // Heavy displacement dump
      { id: 'c-6', index: 5, open: 4123.0, high: 4124.0, low: 4110.0, close: 4112.0 }, // Continuation crash
    ],
    overlays: [
      {
        id: 'ov-bsl-line',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 0,
        endCandleIndex: 4,
        priceStart: 4142.0,
        priceEnd: 4142.0,
        color: '#EF4444',
        opacity: 0.9,
        label: 'Buy-Side Liquidity Pool ($4,142.00)',
      },
      {
        id: 'ov-sweep-mark',
        type: 'LIQUIDITY_LINE',
        startCandleIndex: 3,
        endCandleIndex: 3,
        priceStart: 4149.0,
        priceEnd: 4149.0,
        color: '#F59E0B',
        opacity: 0.9,
        label: '▲ SWEEP HIGH (+7 pips trap)',
      },
      {
        id: 'ov-short-rr',
        type: 'LONG_SHORT',
        startCandleIndex: 3,
        endCandleIndex: 5,
        priceStart: 4134.5, // Entry Short
        priceEnd: 4112.0,   // TP
        color: '#EF4444',
        opacity: 0.22,
        label: 'Short XAUUSD +225 Pips (1:3.8 RR)',
      },
    ],
  },

  // 5. OPT 1 (Multiple Timeframe Theory) + NHÌN CHART QUÁ KHỨ THÌ DỄ (PP-0020)
  {
    id: 'opt1-mtf-top-down-pp0020',
    courseId: 'OPT 1',
    courseTitle: 'OPT 1: Master Multiple Timeframe Theory in Trading within 1 Hour',
    lessonFocus: 'Top-Down Analysis: H4 Trend Direction + M15 Entry Execution',
    painPointId: 'PP-0020',
    painPointName: 'Nhìn chart chạy rồi thì nói gì chả đúng',
    painPointQuote: 'Recorded charts... easy when you already know where it moves.',
    title: 'THE TOP-DOWN FILTER: Kill The Hindsight Illusion',
    hookHeadline: 'IT\'S EASY ON RECORDED CHARTS',
    hookSubline: 'Until you step into live market without an H4 anchor.',
    duration: 10,
    badges: ['1. H4 HTF TREND BIAS', '2. M15 ZONE PULLBACK', '3. ZERO HINDSIGHT ENTRY'],
    strategy: 'Price Action',
    script: {
      hook: 'Ai cũng bảo: Nhìn biểu đồ quá khứ thì nói gì chẳng đúng!',
      tension: 'Nhưng bạn có biết tại sao trader kỳ cựu nhìn biểu đồ trực tiếp vẫn bình tĩnh? Vì họ không nhìn cây nến M1 đơn lẻ. Họ dùng bộ lọc H4 Top-Down để biết chắc hướng đi chính trước khi vào lệnh.',
      payoff: 'Khi H4 đang là xu hướng tăng mạnh, trên khung M15 bạn chỉ tìm duy nhất một việc: Sự suy yếu của đợt giảm hồi về hỗ trợ 4,124.00. Khi nến M15 rút chân xác nhận, bấm Buy không cần suy đoán.',
      cta: 'Muốn bỏ tật nhìn sau? Hãy phân tích từ trên xuống dưới.',
      voiceoverNotes: 'Giọng thẳng thắn, thách thức tư duy trader thích than phiền.',
    },
    candles: [
      { id: 'c-1', index: 0, open: 4118.0, high: 4125.0, low: 4116.0, close: 4124.0 },
      { id: 'c-2', index: 1, open: 4124.0, high: 4135.0, low: 4122.0, close: 4133.0 }, // HTF Expansion wave
      { id: 'c-3', index: 2, open: 4133.0, high: 4134.0, low: 4124.0, close: 4125.0 }, // LTF Pullback into HTF zone
      { id: 'c-4', index: 3, open: 4125.0, high: 4132.0, low: 4123.5, close: 4131.0 }, // Reversal confirmation
      { id: 'c-5', index: 4, open: 4131.0, high: 4145.0, low: 4130.0, close: 4144.0 }, // Clean follow-through
    ],
    overlays: [
      {
        id: 'ov-htf-zone',
        type: 'ORDER_BLOCK',
        startCandleIndex: 0,
        endCandleIndex: 4,
        priceStart: 4120.0,
        priceEnd: 4125.0,
        color: '#6366F1',
        opacity: 0.25,
        label: 'H4 Bullish Anchor Zone [4120 - 4125]',
      },
      {
        id: 'ov-rr-long',
        type: 'LONG_SHORT',
        startCandleIndex: 3,
        endCandleIndex: 4,
        priceStart: 4131.0,
        priceEnd: 4144.0,
        color: '#00F5A0',
        opacity: 0.22,
        label: 'Top-Down Long +130 Pips (1:3.0 RR)',
      },
    ],
  },
];
