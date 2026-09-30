/** Historical B–F harness for release 5ff471c. Phase G supersedes its popup UX checks in qa-motion-offer.mjs. */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
const origin = process.argv[2] || 'http://127.0.0.1:3054';
const phase = process.argv[3] || 'policy';
const output = 'docs/prompts-output/[54-0]/evidence';
const port = 9500 + process.pid % 1000;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const label=process.env.QA_LABEL || '';
const report = { origin, phase, browser: process.env.CHROME_BIN || 'Google Chrome macOS', checks: [], errors: [] };
mkdirSync(output, { recursive: true });
const chrome = spawn(process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new',`--remote-debugging-port=${port}`,'--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader', ...(['127.0.0.1','localhost'].includes(new URL(origin).hostname)?['--ignore-certificate-errors']:[]), `--user-data-dir=/tmp/jia-54-qa-${process.pid}`, 'about:blank'], { stdio: 'ignore' });
let ws;
try {
 let targets=[];
 for(let i=0;i<60&&!targets.length;i++){await sleep(200);targets=await fetch(`http://127.0.0.1:${port}/json`).then(r=>r.json()).catch(()=>[]);}
 ws=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
 let seq=0;const pending=new Map();
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id);}else if(m.method==='Network.loadingFailed'){(report.networkFailures??=[]).push(m.params);}else if(m.method==='Runtime.consoleAPICalled' && m.params.type==='error'){(report.consoleErrors??=[]).push(m.params.args.map(a=>a.value||a.description).join(' '));}else if(m.method==='Runtime.exceptionThrown')report.errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);};
 const send=(method,params={})=>new Promise((r,j)=>{const id=++seq;pending.set(id,m=>m.error?j(Error(JSON.stringify(m.error))):r(m.result));ws.send(JSON.stringify({id,method,params}));});
 const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);return r.result.value;};
 const check=async(name,expression)=>{const value=await ev(expression);report.checks.push({name,pass:!!value,value});if(!value){report.debug=await ev(`({focus:document.hasFocus(),active:document.activeElement?.outerHTML.slice(0,300),focusVisible:document.querySelector(':focus-visible')?.outerHTML.slice(0,300),hidden:document.hidden,dialog:document.querySelector('dialog[open]')?.outerHTML.slice(0,120),deck:document.querySelector('[class*=TalleresCarrusel_deck]')?.getBoundingClientRect().toJSON()})`);throw Error(name);}};
 const wait=async expression=>{for(let i=0;i<160;i++){if(await ev(`Boolean(${expression})`))return;await sleep(100);}report.timeout=await ev(`({url:location.href,title:document.title,html:document.documentElement?.outerHTML.slice(0,600),ready:document.readyState})`);throw Error(`Timeout: ${expression}`);};
 const media=async reduce=>send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:reduce?'reduce':'no-preference'}]});
 const viewport=async(width,touch=false)=>{await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:touch});await send('Emulation.setTouchEmulationEnabled',{enabled:touch});};
 const load=async()=>{await ev('window.qaPreviousDocument=true');await send('Page.navigate',{url:origin+'/almeria-2026'});await wait(`!window.qaPreviousDocument && document.documentElement?.dataset.motion && document.querySelector('footer')`);await sleep(350);};
 const button=text=>`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)})`;
 const click=async text=>{await ev(`${button(text)}.click()`);await sleep(120);};
 const shot=async name=>{const {data}=await send('Page.captureScreenshot',{format:'png'});writeFileSync(`${output}/${name}.png`,Buffer.from(data,'base64'));};
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Emulation.setFocusEmulationEnabled',{enabled:true});
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
 if(phase==='compact') {
  await viewport(1440);await media(false);await load();
  const deck=`document.querySelector('[class*="TalleresCarrusel_deck"]')`;
  await ev(`${deck}.scrollIntoView({block:'start',behavior:'instant'})`);await sleep(300);
  await check('all workshop cards omit people and theme preview',`[...document.querySelectorAll('[data-workshop-body]')].every(body=>!body.querySelector('[class*="SheetCard_who"], [class*="SheetCard_theme"]'))`);
  const gaps=await ev(`[...document.querySelectorAll('[data-workshop-body]')].map(body=>{const p=body.querySelector('[class*="SheetCard_subtitle"]'),b=body.querySelector('button');return p?b.getBoundingClientRect().top-p.getBoundingClientRect().bottom:0})`);
  report.checks.push({name:'subtitle to sheet action stays compact',pass:gaps.every(gap=>gap<=5),gaps});if(gaps.some(gap=>gap>5))throw Error('subtitle gap');
  await shot('workshops-compact-desktop');await ev(`${deck}.querySelector('article button').click()`);await sleep(150);
  await check('full sheet retains people and theme on desktop',`document.querySelector('dialog[open]').textContent.includes('Manuel Salmerón Águila') && [...document.querySelectorAll('dialog[open] dt')].some(dt=>dt.textContent.trim()==='Temática')`);
  await shot('workshop-complete-desktop');
 }
 if(phase==='input') {
  const deck=`document.querySelector('[class*="TalleresCarrusel_deck"]')`;
  const track=`document.querySelector('[class*="TalleresCarrusel_grid"]')`;
  const expanded=`${deck}.hasAttribute('data-expanded')`;
  const center=async selector=>ev(`(()=>{const r=(${selector}).getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  const tap=async point=>{await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...point,radiusX:2,radiusY:2,force:1,id:1}]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(150);};
  await viewport(390,true);await media(false);await load();await ev(`${deck}.scrollIntoView({block:'center',behavior:'instant'})`);
  await tap(await center(`${deck}.querySelector('[class*="TalleresCarrusel_expand"]')`));
  await check('native first tap opens deck without sheet',`${expanded} && !document.querySelector('dialog[open]')`);await sleep(5300);await check('native opening tap is not exploration',`!${expanded}`);
  await tap(await center(`${deck}.querySelector('[class*="TalleresCarrusel_expand"]')`));
  const point=await center(`${track}.firstElementChild.querySelector('[data-workshop-media]')`);point.x=260;
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...point,id:2}]});
  for(let x=240;x>=70;x-=20){await send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:point.y,id:2}]});await sleep(30);}
  await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(600);
  await check('native touch swipe scrolls without sheet',`${track}.scrollLeft>6 && !document.querySelector('dialog[open]')`);await sleep(5300);await check('native swipe preserves expansion',expanded);
  await viewport(390,false);await load();await ev(`${deck}.scrollIntoView({block:'center',behavior:'instant'})`);
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',...await center(`${deck}.querySelector('[class*="TalleresCarrusel_expand"]')`)});await sleep(250);await check('narrow mouse hover expands',expanded);
  await sleep(5300);await check('hover idle closes',`!${expanded}`);await sleep(700);await check('stationary pointer does not reopen',`!${expanded}`);
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:2,y:2});await send('Input.dispatchMouseEvent',{type:'mouseMoved',...await center(`${deck}.querySelector('[class*="TalleresCarrusel_expand"]')`)});await sleep(200);await check('real pointer reentry reopens',expanded);
  const tilt=`${track}.firstElementChild.querySelector('[data-workshop-media]').firstElementChild`;
  const pos=await center(tilt);await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:pos.x+40,y:pos.y+50});await sleep(250);await check('narrow mouse tilt engine runs',`${tilt}.hasAttribute('data-active') && ${tilt}.style.getPropertyValue('--tilt-scale')==='1.07'`);
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:2,y:2});await load();await ev(`${deck}.scrollIntoView({block:'center',behavior:'instant'});${deck}.querySelector('[class*="TalleresCarrusel_expand"]').focus()`);
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await sleep(150);
  await check('keyboard expansion returns focus to track',`${expanded} && document.activeElement===${track}`);
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await ev(`document.activeElement.blur()`);await viewport(1440);await viewport(390);await sleep(5300);await check('keyboard exploration survives viewport roundtrip',expanded);
 }
 if(phase==='extra') {
  await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.qaDraws={};for(const C of [window.WebGLRenderingContext,window.WebGL2RenderingContext]){if(!C)continue;for(const name of ['drawArrays','drawElements']){const original=C.prototype[name];C.prototype[name]=function(...args){const key=this.canvas.className||'shoe';window.qaDraws[key]=(window.qaDraws[key]||0)+1;return original.apply(this,args)}}}`});
  await viewport(1440);await media(false);await load();
  await ev(`window.qaModal=document.createElement('dialog');qaModal.textContent='QA';document.body.append(qaModal);qaModal.showModal()`);await media(true);await sleep(200);
  await check('automatic offer defers to existing modal',`document.querySelectorAll('dialog[open]').length===1 && qaModal.open`);
  await ev(`qaModal.close();qaModal.remove()`);await sleep(150);await check('offer resumes when modal closes',`document.querySelector('dialog[open]')?.textContent.includes('Estás viendo')`);
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
  await check('native dialog keyboard focus stays inside',`document.querySelector('dialog[open]').contains(document.activeElement)`);
  await click('Seguir sin animaciones');
  await ev(`document.querySelector('[data-classroom]').scrollIntoView({block:'center',behavior:'instant'})`);await sleep(1300);
  const calmDraws=await ev(`JSON.stringify(qaDraws)`);await sleep(600);await check('reduced light is still',`JSON.stringify(qaDraws)===${JSON.stringify(calmDraws)}`);
  await click('Animaciones');const scrollBefore=await ev('scrollY');await click('Activar');
  await check('acceptance preserves document scroll',`Math.abs(scrollY-${scrollBefore})<1`);
  await sleep(700);const lit=await ev(`Object.entries(qaDraws).find(([k])=>k.includes('lightCanvas'))?.[1]||0`);await sleep(600);
  await check('classroom light starts live after acceptance',`(Object.entries(qaDraws).find(([k])=>k.includes('lightCanvas'))?.[1]||0)>${lit}`);
  await ev(`document.querySelector('footer').scrollIntoView({block:'end',behavior:'instant'})`);await sleep(800);
  const shoe=await ev(`qaDraws.shoe||0`);await ev(`document.querySelector('[class*="shoeHit"]').dispatchEvent(new MouseEvent('dblclick',{bubbles:true}))`);await sleep(600);
  await check('horseshoe responds live',`(qaDraws.shoe||0)>${shoe}`);
  await ev(`document.querySelector('footer').dispatchEvent(new PointerEvent('pointerenter',{pointerType:'mouse'}))`);await sleep(600);
  await check('tumbleweed engine starts live',`!!document.querySelector('.weed')`);
  const weed=await ev(`document.querySelector('.weed')?.style.transform`);await sleep(500);
  await check('tumbleweed moves',`document.querySelector('.weed')?.style.transform!==${JSON.stringify(weed)}`);
  await ev(`document.querySelector('[class*="Action_primary"]').scrollIntoView({block:'center',behavior:'instant'})`);
  const primary=await ev(`(()=>{const r=document.querySelector('[class*="Action_primary"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',...primary});await sleep(50);
  const star=await ev(`getComputedStyle(document.querySelector('[class*="Action_badge"]')).transform`);await sleep(200);
  await check('sheriff star turns after override',`getComputedStyle(document.querySelector('[class*="Action_badge"]')).transform!=='none'`);
  await check('button reflection enabled after override',`getComputedStyle(document.querySelector('[class*="Action_primary"]'),'::after').animationName!=='none'`);
  await ev(`document.querySelector('footer').scrollIntoView({block:'end',behavior:'instant'})`);
  const bottom=await ev(`(()=>{const r=document.querySelector('[class*="bottomInner"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);await send('Input.dispatchMouseEvent',{type:'mouseMoved',...bottom});await sleep(200);
  await check('footer reflection animation enabled',`getComputedStyle(document.querySelector('[class*="SiteFooter_bottom"]'),'::before').animationName!=='none'`);
  await click('Animaciones');await click('Usar la preferencia del sistema');await sleep(2500);
  const stopped=await ev(`JSON.stringify(qaDraws)`);await ev(`document.querySelector('[class*="shoeHit"]').dispatchEvent(new MouseEvent('dblclick',{bubbles:true}))`);await sleep(600);
  report.stopDiagnostics={before:stopped,after:await ev('JSON.stringify(qaDraws)'),weeds:await ev("document.querySelectorAll('.weed').length"),motion:await ev('document.documentElement.dataset.motion')};
  await check('withdrawal stops WebGL redraw loops',`JSON.stringify(qaDraws)===${JSON.stringify(stopped)} && !document.querySelector('.weed')`);
  await media(false);await load();await ev(`document.querySelector('video').scrollIntoView({block:'center',behavior:'instant'})`);await sleep(1500);
  await ev(`document.querySelector('video').pause();window.qaVideo=document.querySelector('video');qaVideo.currentTime=1;qaVideo.muted=true`);await media(true);await sleep(300);
  const video=await ev(`({time:qaVideo.currentTime,muted:qaVideo.muted,volume:qaVideo.volume})`);await click('Activar');
  await check('video node, time and audio preserved',`qaVideo===document.querySelector('video') && Math.abs(qaVideo.currentTime-${video.time})<0.1 && qaVideo.muted===${video.muted} && qaVideo.volume===${video.volume}`);
  await send('Network.deleteCookies',{name:'__Host-jia-motion',url:origin});
  const noGL=await send('Page.addScriptToEvaluateOnNewDocument',{source:`const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(name,...args){return name.startsWith('webgl')?null:original.call(this,name,...args)}`});
  await load();await click('Activar');await sleep(900);
  await check('no WebGL keeps readable route fallback',`document.querySelector('[class*="JornadasRoute_route"]').dataset.state==='fallback' && document.querySelectorAll('[class*="JornadasRoute_stop"]').length>=6`);
  await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:noGL.identifier});
 }
 if(['geometry','timer','resilience','full'].includes(phase)) {
  await media(false);await viewport(390,true);await load();
  const deck=`document.querySelector('[class*="TalleresCarrusel_deck"]')`;
  const track=`document.querySelector('[class*="TalleresCarrusel_grid"]')`;
  const expanded=`${deck}.hasAttribute('data-expanded')`;
  const open=async()=>{await ev(`${deck}.scrollIntoView({block:'center',behavior:'instant'});${deck}.querySelector('[class*="TalleresCarrusel_expand"]').dispatchEvent(new MouseEvent('click',{bubbles:true,detail:1}))`);await sleep(150);};
  if (phase==='full'||phase==='timer') {
  await open();await sleep(4200);await check('deck remains open before 5 seconds',expanded);await sleep(1200);await check('idle deck closes after 5 seconds',`!${expanded}`);
  await open();await ev(`${deck}.querySelector('button[aria-label*="siguiente" i]').click()`);await sleep(5300);await check('arrow exploration cancels idle closing',expanded);
  await ev(`${track}.querySelector('button').click()`);await sleep(150);await check('workshop sheet opens',`!!document.querySelector('dialog[open]')`);await shot('workshop-sheet');
  await ev(`document.querySelector('dialog[open]').close()`);await sleep(200);
  } else if(phase==='resilience') {
   const fresh=async()=>{await load();await open();};
   await fresh();await ev(`${track}.scrollTo({left:180,behavior:'instant'})`);await sleep(5300);
   await check('programmatic scroll does not count as exploration',`!${expanded} && ${track}.scrollLeft===0`);
   await fresh();await ev(`${track}.focus()`);await sleep(5300);
   await check('keyboard focus blocks closing',expanded);
   await ev(`document.activeElement.blur()`);await sleep(2000);await check('blur starts a full new window',expanded);await sleep(3300);await check('closes after new focus-free window',`!${expanded}`);
   await fresh();await ev(`window.qaModal=document.createElement('dialog');document.body.append(qaModal);qaModal.showModal()`);await sleep(5300);
   await check('unrelated modal blocks closing',expanded);await ev(`qaModal.close();qaModal.remove()`);await sleep(2000);await check('modal close grants full window',expanded);await sleep(3300);await check('closes after modal unblocks',`!${expanded}`);
   await fresh();await ev(`${track}.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:1,button:0,clientX:200,clientY:300}))`);await sleep(5300);await check('active pointer blocks closing',expanded);
   await ev(`window.dispatchEvent(new PointerEvent('pointerup',{pointerId:1}))`);await sleep(5300);await check('release without exploration rearms',`!${expanded}`);
   await fresh();await ev(`${track}.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:2,button:0,clientX:220,clientY:300}));${track}.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:2,clientX:100,clientY:302}));${track}.scrollTo({left:180,behavior:'instant'})`);await sleep(100);
   await ev(`window.dispatchEvent(new PointerEvent('pointerup',{pointerId:2}));${track}.querySelector('[data-workshop-media]').click()`);await sleep(5300);
   await check('effective horizontal gesture counts and suppresses accidental sheet click',`${expanded} && !document.querySelector('dialog[open]')`);
   await ev(`window.scrollTo({top:0,behavior:'instant'})`);await sleep(300);await check('leaving section still collapses explored deck',`!${expanded}`);await open();await sleep(5300);await check('exploration survives second opening',expanded);
   await fresh();await ev(`${track}.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:3,button:0,clientX:200,clientY:300}));${track}.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:3,clientX:202,clientY:220}));window.dispatchEvent(new PointerEvent('pointerup',{pointerId:3}))`);await sleep(5300);await check('vertical gesture is not exploration',`!${expanded}`);
   await fresh();await ev(`location.hash=${track}.children[1].id`);await sleep(5300);await check('direct workshop anchor counts as exploration',expanded);
   await load();await ev(`history.replaceState(null,'',location.pathname)`);await load();await open();
   await ev(`Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))`);await sleep(5300);await check('hidden tab does not close deck',expanded);
   await ev(`Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'))`);await sleep(2000);await check('visible tab gets full window',expanded);await sleep(3300);await check('visible idle eventually closes',`!${expanded}`);
  } else { await open(); }
  await ev(`${track}.scrollTo({left:0,behavior:'instant'})`);
  for(const width of (['geometry','full'].includes(phase)?[320,390,440,759,760,1440]:[])) {
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
 if(phase==='nojs') {
  await viewport(390,true);await media(true);await send('Emulation.setScriptExecutionDisabled',{value:true});
  await send('Page.navigate',{url:origin+'/almeria-2026'});await wait(`document.querySelector('[class*="Action_primary"]')`);await sleep(200);
  await check('reduce is quiet before hydration without JS',`!document.documentElement.dataset.motion && getComputedStyle(document.querySelector('[class*="Action_primary"]'),'::after').animationName==='none' && getComputedStyle(document.documentElement).scrollBehavior==='auto'`);
  await check('workshop content exists without JS',`document.querySelectorAll('[data-workshop-media]').length===6`);
  await send('Emulation.setScriptExecutionDisabled',{value:false});
 }
 if(report.errors.length)throw Error('Browser exceptions');
 console.log(JSON.stringify({checks:report.checks.length,pass:true,cookies:report.cookies}));
} catch(error) {report.failure=String(error);console.error(error);process.exitCode=1;}
finally {writeFileSync(`${output}/qa-${phase}${label?'-'+label:''}.json`,JSON.stringify(report,null,2)+'\n');ws?.close();chrome.kill();}
