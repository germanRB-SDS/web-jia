/** Targeted browser regression checks using the project's existing CDP approach. */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
const origin = process.argv[2] || 'http://127.0.0.1:3054';
const phase = process.argv[3] || 'policy';
const output = 'docs/prompts-output/[54-0]/evidence';
const port = 9354;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const report = { origin, phase, checks: [], errors: [] };
mkdirSync(output, { recursive: true });
const chrome = spawn(process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new',`--remote-debugging-port=${port}`,'--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader', '--ignore-certificate-errors', `--user-data-dir=/tmp/jia-54-qa-${process.pid}`, 'about:blank'], { stdio: 'ignore' });
let ws;
try {
 let targets=[];
 for(let i=0;i<60&&!targets.length;i++){await sleep(200);targets=await fetch(`http://127.0.0.1:${port}/json`).then(r=>r.json()).catch(()=>[]);}
 ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
 let seq=0;const pending=new Map();
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id);}else if(m.method==='Runtime.exceptionThrown')report.errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);};
 const send=(method,params={})=>new Promise((r,j)=>{const id=++seq;pending.set(id,m=>m.error?j(Error(JSON.stringify(m.error))):r(m.result));ws.send(JSON.stringify({id,method,params}));});
 const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);return r.result.value;};
 const check=async(name,expression)=>{const value=await ev(expression);report.checks.push({name,pass:!!value,value});if(!value)throw Error(name);};
 const wait=async expression=>{for(let i=0;i<160;i++){if(await ev(`Boolean(${expression})`))return;await sleep(100);}throw Error(`Timeout: ${expression}`);};
 const media=async reduce=>send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:reduce?'reduce':'no-preference'}]});
 const viewport=async(width,touch=false)=>{await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:touch});await send('Emulation.setTouchEmulationEnabled',{enabled:touch});};
 const load=async()=>{await send('Page.navigate',{url:origin+'/almeria-2026'});await wait(`document.documentElement.dataset.motion && document.querySelector('footer')`);await sleep(350);};
 const button=text=>`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)})`;
 const click=async text=>{await ev(`${button(text)}.click()`);await sleep(120);};
 const shot=async name=>{const {data}=await send('Page.captureScreenshot',{format:'png'});writeFileSync(`${output}/${name}.png`,Buffer.from(data,'base64'));};
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 if(phase==='policy'||phase==='full') {
 await viewport(1440);await media(true);await load();
 await check('reduce prompts and stays calm',`document.documentElement.dataset.motion==='reduce' && document.querySelector('dialog[open]')?.textContent.includes('Estás viendo esta web sin animaciones. Actívalas (solo para esta página).')`);
 await shot('motion-offer');
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await sleep(150);
 await check('Escape closes without persistence',`!document.querySelector('dialog[open]') && !document.cookie.includes('__Host-jia-motion') && localStorage.length===0 && sessionStorage.length===0`);
 await ev(`location.hash='programa'`);await sleep(150);
 await check('hash does not reprompt',`!document.querySelector('dialog[open]')`);
 await load();await check('new document prompts again',`!!document.querySelector('dialog[open]')`);
 await click('Activar');
 await check('accept enables live CSS and JS',`document.documentElement.dataset.motion==='on' && !document.querySelector('dialog[open]') && document.documentElement.classList.contains('has-mark') && getComputedStyle(document.querySelector('[class*="TiltCard_inner"]')).transitionDuration!=='0s'`);
 const cookies=(await send('Network.getCookies',{urls:[origin]})).cookies;
 report.cookies=cookies.map(({name,value,secure,httpOnly,sameSite,path,expires})=>({name,value,secure,httpOnly,sameSite,path,expires}));
 await check('acceptance cookie only',`document.cookie==='__Host-jia-motion=on'`);
 await load();await check('acceptance survives reload without popup',`document.documentElement.dataset.motion==='on' && !document.querySelector('dialog[open]')`);
 await media(false);await media(true);await sleep(150);
 await check('override survives system changes',`document.documentElement.dataset.motion==='on'`);
 await click('Animaciones');await click('Usar la preferencia del sistema');
 await check('withdrawal removes only preference and stops effects',`document.documentElement.dataset.motion==='reduce' && !document.cookie.includes('__Host-jia-motion') && !document.querySelector('dialog[open]') && !document.documentElement.classList.contains('has-mark')`);
 await media(false);await sleep(150);await check('system changes update live',`document.documentElement.dataset.motion==='on'`);
 await load();await check('normal system never prompts',`!document.querySelector('dialog[open]')`);
 await send('Network.setCookie',{name:'__Host-jia-motion',value:'invalid',url:origin,secure:true,path:'/'});
 await media(true);await load();await check('invalid cookie ignored',`document.documentElement.dataset.motion==='reduce' && !!document.querySelector('dialog[open]')`);
 await click('Seguir sin animaciones');
 await send('Network.deleteCookies',{name:'__Host-jia-motion',url:origin});
 const blocked=await send('Page.addScriptToEvaluateOnNewDocument',{source:`Object.defineProperty(document,'cookie',{get(){return ''},set(){}});`});
 await load();await click('Activar');await check('blocked cookies allow in-memory choice',`document.documentElement.dataset.motion==='on' && !document.querySelector('dialog[open]')`);
 await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:blocked.identifier});
 }
 if(phase!=='policy') {
  await media(false);await viewport(390,true);await load();
  const deck=`document.querySelector('[class*="TalleresCarrusel_deck"]')`;
  const track=`document.querySelector('[class*="TalleresCarrusel_grid"]')`;
  const expanded=`${deck}.hasAttribute('data-expanded')`;
  const open=async()=>{await ev(`${deck}.scrollIntoView({block:'center',behavior:'instant'});${deck}.querySelector('[class*="TalleresCarrusel_expand"]').dispatchEvent(new MouseEvent('click',{bubbles:true,detail:1}))`);await sleep(150);};
  if (phase==='full') {
  await open();await sleep(4200);await check('deck remains open before 5 seconds',expanded);await sleep(1200);await check('idle deck closes after 5 seconds',`!${expanded}`);
  await open();await ev(`${deck}.querySelector('button[aria-label*="siguiente" i]').click()`);await sleep(5300);await check('arrow exploration cancels idle closing',expanded);
  await ev(`${track}.querySelector('button').click()`);await sleep(150);await check('workshop sheet opens',`!!document.querySelector('dialog[open]')`);await shot('workshop-sheet');
  await ev(`document.querySelector('dialog[open]').close()`);await sleep(200);
  } else { await open(); }
  await ev(`${track}.scrollTo({left:0,behavior:'instant'})`);
  for(const width of [320,390,440,759,760,1440]) {
   await viewport(width,false);await ev(`${deck}.scrollIntoView({block:'center',behavior:'instant'})`);await sleep(200);
   const geometry=await ev(`(()=>{const t=${track},a=t.firstElementChild,m=a.querySelector('[data-workshop-media]'),p=m.firstElementChild; const b=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}};return {width:${width},track:b(t),card:b(a),media:b(m),poster:b(p)}})()`);
   report.checks.push({name:`geometry ${width}`,pass:geometry.poster.w<=geometry.media.w,geometry});
   if(width<760) {
    const bounds=await ev(`(()=>{const m=${track}.firstElementChild.querySelector('[data-workshop-media]'),t=m.firstElementChild,i=t.firstElementChild,box=m.getBoundingClientRect();i.style.transition='none';const poses=[];for(const [x,y] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){t.style.setProperty('--tilt-scale','1.07');t.style.setProperty('--tilt-deg','12deg');t.style.setProperty('--tilt-ax',x);t.style.setProperty('--tilt-ay',y);const r=i.getBoundingClientRect();poses.push({x,y,left:r.left-box.left,right:box.right-r.right,top:r.top-box.top,bottom:box.bottom-r.bottom});}for(const n of ['--tilt-scale','--tilt-deg','--tilt-ax','--tilt-ay'])t.style.removeProperty(n);i.style.removeProperty('transition');return poses})()`);
    const pass=bounds.every(b=>Math.min(b.left,b.right,b.top,b.bottom)>=-0.5);report.checks.push({name:`max tilt bounds ${width}`,pass,bounds});if(!pass)throw Error(`Tilt clipping at ${width}`);
   }
   await shot(`workshops-${width}`);
  }
 }
 if(report.errors.length)throw Error('Browser exceptions');
 console.log(JSON.stringify({checks:report.checks.length,pass:true,cookies:report.cookies}));
} catch(error) {report.failure=String(error);console.error(error);process.exitCode=1;}
finally {writeFileSync(`${output}/qa-${phase}.json`,JSON.stringify(report,null,2)+'\n');ws?.close();chrome.kill();}
