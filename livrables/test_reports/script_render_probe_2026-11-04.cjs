const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const vm = require('vm');
function load(file) {
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(compiled, { module, exports: module.exports, performance, console, require: name => { throw new Error('Unexpected dependency: ' + name); } }, { filename: file });
  return module.exports;
}
const { jevFastReflexVerify } = load('src/utils/jevReflexGate.ts');
const { validateAndNormalizeSetup } = load('src/utils/dynamicValidator.ts');
const basic = { headline: 'TEST', slPips: 20, riskBudget: 30, rrRatio: 3.5, targetPips: 70 };
const jevWrongLot = jevFastReflexVerify({ ...basic, lotSize: '999 lot' });
const jevNoMedia = jevFastReflexVerify(basic);
const candles = [
 {id:'a',index:0,open:4120,high:4125,low:4118,close:4122},
 {id:'b',index:1,open:4122,high:4126,low:4120,close:4124},
 {id:'c',index:2,open:4124,high:4125,low:4115,close:4123},
 {id:'d',index:3,open:4123,high:4132,low:4122,close:4130},
];
const input = { title: 'BUY SUPPORT REBOUND', candles, calloutCandleIndex:2, executionOrder: {type:'BUY',entry:4128,sl:4130,tp:4125,lot:0.05,risk:30}, scriptSubtitles:[{timePercent:0,text:'A'},{timePercent:0.3,text:'B'},{timePercent:0.6,text:'C'}] };
const badOrder = validateAndNormalizeSetup(input);
const unrelatedSubtitles = validateAndNormalizeSetup({ ...input, executionOrder: { ...input.executionOrder,sl:4126,tp:4135 }, scriptSubtitles:[{timePercent:0.8,text:'UNRELATED'},{timePercent:0.1,text:'UNRELATED'},{timePercent:0.3,text:'UNRELATED'}] });
const invalidOhlc = validateAndNormalizeSetup({ ...input, candles:[{...candles[0],high:0}, ...candles.slice(1)], executionOrder:{...input.executionOrder,sl:4126,tp:4135} });
const diagnostics = ['src/components/canvas/renderPaperTheme.ts','tests/paperThemeRenderer.test.ts'].map(file => {const s=ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);return {file, errors:s.parseDiagnostics.map(d=>({line:s.getLineAndCharacterOfPosition(d.start).line+1,code:d.code,message:ts.flattenDiagnosticMessageText(d.messageText,' ')}))};});
const result = {
  auditedAt: '2026-11-04', networkCalls:0,
  jevWrongLot:{passed:jevWrongLot.passed,lot:jevWrongLot.calibratedPayload.lotSize,gates:jevWrongLot.gates},
  jevNoMedia:{passed:jevNoMedia.passed,gates:jevNoMedia.gates},
  reversedOrder:{isValid:badOrder.isValid,score:badOrder.score,checks:badOrder.checks},
  unsortedUnrelatedSubtitles:{isValid:unrelatedSubtitles.isValid,score:unrelatedSubtitles.score,checks:unrelatedSubtitles.checks},
  invalidNonTriggerOHLC:{isValid:invalidOhlc.isValid,score:invalidOhlc.score,checks:invalidOhlc.checks},
  diagnostics
};
const {generateStrategySetup,executeHermesDirective}=load('src/utils/hermesEngine.ts');
const sweep=generateStrategySetup('Liquidity Sweep & Institutional Reversal',4128,10,20,'0.05 lot',3.5);
const fvg=generateStrategySetup('Fair Value Gap',4128,10,20,'0.05 lot',3.5);
const gap=fvg.overlays.find(x=>x.type==='FVG');
const trade=fvg.overlays.find(x=>x.type==='LONG_SHORT');
const parsed=executeHermesDirective('Buy FVG retest at $4,132.50. Risk $10. SL 20 pips. R:R 1:3.5.','audit-fixture.md');
result.scriptContract={
 sweep:{chatDirection:/sell|supply|bearish/i.test('Liquidity Sweep & Institutional Reversal')?'SELL':'BUY',generatedTrade:sweep.overlays.find(x=>x.type==='LONG_SHORT')},
 fvg:{gap:[gap.priceStart,gap.priceEnd],ce:(gap.priceStart+gap.priceEnd)/2,overlayEntry:trade.priceStart,chatEntry:4128},
 rrGeometry:[2,7].map(rr=>({requestedRR:rr,overlay:generateStrategySetup('Risk-First',4128,10,20,'0.05 lot',rr).overlays.find(x=>x.type==='LONG_SHORT')})),
 parsedOrdinaryBrief:{basePrice:parsed.basePrice,riskBudget:parsed.riskBudget,lotSize:parsed.lotSize,lotNumericUsedByImporter:parseFloat(parsed.lotSize.replace(/[^0-9.]/g,''))}
};
fs.writeFileSync('livrables/test_reports/script_render_probe_2026-11-04.json', JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));

