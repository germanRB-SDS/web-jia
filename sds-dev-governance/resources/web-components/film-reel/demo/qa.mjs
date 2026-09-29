/** Portable Chrome DevTools smoke. Requires CHROME_BIN; no browser installation or external service.
 * node demo/qa.mjs <URL> <evidence-directory> <desktop|touch|reduce>
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const [url, output, mode = 'desktop'] = process.argv.slice(2);
if (!url || !output || !process.env.CHROME_BIN) throw new Error('URL, output directory and CHROME_BIN required');
const slug = JSON.parse(readFileSync(new URL('../package.json', import.meta.url))).name.replace(/^sds-/, '').replace(/-demo$/, '');
const mobile = mode === 'touch', reduced = mode === 'reduce';
const width = mobile ? 390 : 1440, height = mobile ? 844 : 1000;
const profile = mkdtempSync(join(tmpdir(), 'sds-ui-qa-'));
const chrome = spawn(process.env.CHROME_BIN, ['--headless=new', '--remote-debugging-port=0', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${profile}`, 'about:blank'], {stdio:'ignore'});
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const report = {slug, mode, width, height, checks:[], errors:[]};
let ws;
try {
 let port;
 for (let i=0;i<60&&!port;i++) { await delay(200); try {port=readFileSync(join(profile,'DevToolsActivePort'),'utf8').split('\n')[0];} catch {} }
 assert.ok(port, 'Chrome started');
 const targets=await fetch(`http://127.0.0.1:${port}/json`).then(r=>r.json());
 ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
 let id=0; const pending=new Map();
 ws.onmessage=event=>{const msg=JSON.parse(event.data); if(msg.id) {const p=pending.get(msg.id);if(p){clearTimeout(p.timer);pending.delete(msg.id);msg.error?p.reject(new Error(JSON.stringify(msg.error))):p.resolve(msg.result);}} else if(msg.method==='Runtime.exceptionThrown') report.errors.push(msg.params.exceptionDetails.exception?.description||msg.params.exceptionDetails.text);};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id; const timer=setTimeout(()=>{pending.delete(n);reject(new Error('CDP timeout '+method));},12000);pending.set(n,{resolve,reject,timer});ws.send(JSON.stringify({id:n,method,params}));});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text);return r.result.value;};
 const check=(name,value)=>{report.checks.push({name,pass:!!value});assert.ok(value,name);};
 const point=async selector=>evaluate(`(()=>{const a=[...document.querySelectorAll(${JSON.stringify(selector)})]; const e=a.find(e=>{const r=e.getBoundingClientRect();return r.left>80 && r.right<innerWidth && r.top>=0 && r.bottom<innerHeight})||a[0];const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width};})()`);
 const mouse=(type,x,y,buttons=0)=>send('Input.dispatchMouseEvent',{type,x,y,button:buttons?'left':'none',buttons,clickCount:1});
 const click=async p=>{if(mobile){await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:p.x,y:p.y}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}else{await mouse('mouseMoved',p.x,p.y);await mouse('mousePressed',p.x,p.y,1);await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:p.x,y:p.y,button:'left',buttons:0,clickCount:1});}};
 const key=async key=>{await send('Input.dispatchKeyEvent',{type:'keyDown',key,code:key,text:key==='Enter'?'\r':undefined,windowsVirtualKeyCode:{Escape:27,ArrowRight:39,ArrowLeft:37,Enter:13}[key]});await send('Input.dispatchKeyEvent',{type:'keyUp',key,code:key});};
 const drag=async p=>{if(mobile){await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:p.x,y:p.y}]});for(let i=1;i<=8;i++){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:p.x-i*12,y:p.y}]});await delay(20);}await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}else{await mouse('mousePressed',p.x,p.y,1);for(let i=1;i<=8;i++){await mouse('mouseMoved',p.x-i*12,p.y,1);await delay(20);}await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:p.x-96,y:p.y,button:'left',buttons:0});}};
 await send('Page.enable');await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile});
 await send('Emulation.setTouchEmulationEnabled',{enabled:mobile,maxTouchPoints:1});
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:reduced?'reduce':'no-preference'}]});
 await send('Page.navigate',{url}); await delay(1800);
 check('visible images loaded',await evaluate('[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.right>0&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight&&r.width>0}).every(i=>i.complete&&i.naturalWidth>0)'));
 check('no horizontal page overflow',await evaluate('document.documentElement.scrollWidth<=innerWidth+1'));
 if(slug==='collaborators-carousel') {
  const viewport='[role="group"][tabindex="0"]', track='[role="group"] ul';
  const transform=()=>evaluate(`document.querySelector('${track}').style.transform`);
  const before=await transform();await delay(900);const after=await transform();check(reduced?'reduce stops drift':'idle drift',reduced?before===after:before!==after);
  check('only real cards tabbable',await evaluate('[...document.querySelectorAll("li[aria-hidden=true] a")].every(a=>a.tabIndex===-1) && document.querySelectorAll("[data-card-index]").length===6'));
  const p=await point('[data-card-index]');
  if(!mobile&&!reduced){await mouse('mouseMoved',p.x+25,p.y-20);await delay(400);check('tilt and scale on hover',await evaluate('!!document.querySelector("[data-active]") && !!document.querySelector("[data-active]").style.getPropertyValue("--tilt-scale")'));}
  await evaluate(`document.querySelector('${viewport}').focus()`);const old=await transform();await key('ArrowRight');await delay(reduced?100:1100);check('keyboard navigation',old!==await transform());
  await evaluate('document.activeElement.blur()');const oldDrag=await transform();await drag(await point('[data-card-index]'));await delay(400);check('drag changes strip',oldDrag!==await transform());
 } else if(slug==='film-reel') {
  const transform=()=>evaluate('document.querySelector("[data-track]").style.transform');
  const before=await transform();await delay(700);check(reduced?'reduce stops drift':'idle drift',reduced?before===await transform():before!==await transform());
  const poster=await point('button[data-poster]');
  if(!mobile&&!reduced){await mouse('mouseMoved',poster.x,poster.y);await delay(300);check('hover enlarges preview',await evaluate('[...document.querySelectorAll("[data-poster]")].some(e=>getComputedStyle(e).transform!=="none")'));}
  await click(poster);await delay(350);check('tap/click opens modal',await evaluate('!!document.querySelector("dialog[open]")'));
  check('scroll locked and close focused',await evaluate('document.documentElement.style.overflow==="hidden" && document.activeElement.getAttribute("aria-label")==="Cerrar"'));
  const {data}=await send('Page.captureScreenshot',{format:'png'});mkdirSync(output,{recursive:true});writeFileSync(join(output,`${mode}-viewer.png`),Buffer.from(data,'base64'));
  await key('Escape');await delay(300);check('Escape closes and restores focus',await evaluate('!document.querySelector("dialog[open]") && document.activeElement.matches("button[data-poster]") && document.documentElement.style.overflow!=="hidden"'));
  await mouse('mouseMoved',0,0);await key('Enter');await delay(300);check('Enter opens viewer',await evaluate('!!document.querySelector("dialog[open]")'));
  await click(await point('button[aria-label="Cerrar"]'));await delay(300);
  await evaluate('document.activeElement.blur()');await mouse('mouseMoved',0,0);const old=await transform();await drag(await point('button[data-poster]'));await delay(250);check('drag changes strip without opening modal',old!==await transform()&&!await evaluate('!!document.querySelector("dialog[open]")'));
 } else {
  const caption=()=>evaluate('document.querySelector("p[aria-live]").textContent');
  const initial=await caption();await delay(3800);check(reduced?'reduce stops autoplay':'autoplay advances',reduced?initial===await caption():initial!==await caption());
  const next=await point('button[aria-label="Siguiente"]');await click(next);await delay(reduced?120:1100);
  const seen=[];for(let i=0;i<6;i++){seen.push(await caption());await click(next);await delay(reduced?80:1000);}check('all items reachable and wrap',new Set(seen).size===6&&seen[0]===await caption());
  await evaluate('document.querySelector("button[aria-label=Anterior]").focus()');const old=await caption();await key('ArrowLeft');await delay(reduced?100:1100);check('keyboard backwards',old!==await caption());
  const p=await point('[data-cursor="open"]');const beforeDrag=await caption();await drag(p);await delay(1200);check('drag changes cube',beforeDrag!==await caption());
  check('accessible complete list',await evaluate('document.querySelector("ul").children.length===6'));
 }
 check('no runtime exceptions',report.errors.length===0);
 mkdirSync(output,{recursive:true});const {data}=await send('Page.captureScreenshot',{format:'png'});writeFileSync(join(output,`${mode}.png`),Buffer.from(data,'base64'));
 report.status='PASS';
} catch(e){report.status='FAIL';report.error=String(e);process.exitCode=1;}
finally {mkdirSync(output,{recursive:true});writeFileSync(join(output,`${mode}.json`),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));ws?.close();chrome.kill();await delay(200);rmSync(profile,{recursive:true,force:true});}
