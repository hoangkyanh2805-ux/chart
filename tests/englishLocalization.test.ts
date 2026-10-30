import { describe, it, expect } from 'vitest';
import {
  translateTradingTextToEnglish,
  convertStateToEnglish,
  generateEnglishSubtitles,
} from '@/utils/englishLocalization';

describe('English Video Localization for US/EU Audience', () => {
  it('should translate Vietnamese technical setups into institutional English', () => {
    const vnText = 'TẠI SAO BẠN THUA LỖ KHI BUY GOLD TẠI ĐỈNH?';
    const enText = translateTradingTextToEnglish(vnText);
    expect(enText).toBe('WHY RETAIL TRADERS LOSE BUYING HIGHS');
  });

  it('should translate Vietnamese callout pin to English', () => {
    const vnCallout = '🎯 RÚT CHÂN HỖ TRỢ ($4128)';
    const enCallout = translateTradingTextToEnglish(vnCallout);
    expect(enCallout).toBe('🎯 SUPPORT REJECTION ($4128)');
  });

  it('should generate 4-stage English kinetic subtitles', () => {
    const subs = generateEnglishSubtitles('BUY', 10, 20, '0.05 lot', 70, 3.5);
    expect(subs.length).toBe(4);
    expect(subs[0].stageName).toBe('Hook');
    expect(subs[0].text).toContain('$10');
    expect(subs[1].stageName).toBe('Trap');
    expect(subs[2].stageName).toBe('Setup');
    expect(subs[2].text).toContain('BUY 0.05 lot');
    expect(subs[3].stageName).toBe('Execution');
    expect(subs[3].text).toContain('1:3.5 R:R');
  });

  it('should convert complete chart state to US/EU institutional copy', () => {
    const state = {
      headlineText: 'TẠI SAO BẠN THUA LỖ KHI BUY GOLD TẠI ĐỈNH?',
      sublineText: 'Bẫy Liquidity Sweep M15 & Điểm vào lệnh chuẩn SMC',
      calloutPinText: '🎯 RÚT CHÂN HỖ TRỢ ($4128)',
      badges: ['1. LOSS $30', '2. SL 20 PIPS', '3. LOT 0.05'] as [string, string, string],
      scriptSubtitles: [
        { timePercent: 0.0, text: 'Rất nhiều trader thấy cây nến xanh lớn...', stageName: 'Hook' },
      ],
      overlays: [
        {
          id: 'o1',
          type: 'LIQUIDITY_LINE' as const,
          startCandleIndex: 0,
          endCandleIndex: 4,
          priceStart: 4143,
          priceEnd: 4143,
          color: '#FF3366',
          label: 'Bẫy Thanh Khoản Đỉnh ($4,143.00)',
        },
      ],
      executionOrder: {
        type: 'BUY' as const,
        lot: 0.05,
        entry: 4128,
        sl: 4126,
        tp: 4135,
        risk: 10,
        reward: 35,
        pips: 70,
      },
    };

    const en = convertStateToEnglish(state);

    expect(en.headlineText).toBe('WHY RETAIL TRADERS LOSE BUYING HIGHS');
    expect(en.sublineText).toBe('M15 Liquidity Sweep & Institutional SMC Entry');
    expect(en.calloutPinText).toBe('🎯 SUPPORT REJECTION ($4128)');
    expect(en.badges[0]).toBe('1. LOSS $10');
    expect(en.badges[1]).toBe('2. ENTRY SL 20p');
    expect(en.badges[2]).toBe('3. SIZE 0.05 LOT');
    expect(en.scriptSubtitles.length).toBe(4);
    expect(en.scriptSubtitles[0].stageName).toBe('Hook');
    expect(en.overlays[0].label).toContain('Buy-Side Liquidity Sweep (BSL)');
  });
});

