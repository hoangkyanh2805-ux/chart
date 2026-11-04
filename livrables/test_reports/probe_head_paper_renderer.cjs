// Offline historical committed renderer probe; no application working-tree imports.
const cp=require('child_process'),ts=require('typescript'),vm=require('vm'),crypto=require('crypto');
const rev='a7a63e5af22c32daddd31238aa34dac8ea567b59';
const source=cp.execFileSync('git',['show',rev+':src/components/canvas/renderPaperTheme.ts'],{encoding:'utf8'});
const parsed=ts.createSourceFile('renderer.ts',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
if(parsed.parseDiagnostics.length) throw Error('Historical renderer parse failed');
const exp={};vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{exports:exp});
function run(candles,overlays,headline='AUDIT CUSTOM HEADLINE') {
 const log=[],obj={};const ctx=new Proxy(obj,{set(t,k,v){log.push(['set',k,v]);t[k]=v;return true},get(t,k){if(k in t)return t[k];if(k==='measureText')return s=>{log.push([k,s]);return {width:s.length*7}};if(k==='createLinearGradient'||k==='createRadialGradient')return(...a)=>{log.push([k,...a]);return{addColorStop:(...b)=>log.push(['addColorStop',...b])}};return(...a)=>log.push([k,...a])}});
 exp.renderPaperTheme({ctx,width:360,height:640,currentTime:56,duration:58.5,progress:56/58.5,headlineText:headline,sublineText:'AUDIT SUBLINE',candles,overlays});return {commands:log.length,sha256:crypto.createHash('sha256').update(JSON.stringify(log)).digest('hex')};
}
const empty=run([],[]), low=run([{open:1,high:4,low:0,close:3}],[{type:'long-position',priceStart:1,priceEnd:4,startCandleIndex:0,endCandleIndex:1}]),high=run(Array.from({length:80},()=>({open:90000,high:95000,low:100,close:200})),[{type:'short-position',priceStart:90000,priceEnd:100,startCandleIndex:20,endCandleIndex:70}]),control=run([],[],'DIFFERENT CONTROL HEADLINE');
const result={scope:'Historical committed source only; mock Canvas command trace, not browser raster or working-tree runtime',revision:rev,parseDiagnostics:parsed.parseDiagnostics.length,empty,low,high,control,identicalGeometryInputs:empty.sha256===low.sha256&&low.sha256===high.sha256,headlineControlChangesOutput:control.sha256!==empty.sha256};
console.log(JSON.stringify(result,null,2));
if(!result.identicalGeometryInputs||!result.headlineControlChangesOutput)process.exitCode=1;
