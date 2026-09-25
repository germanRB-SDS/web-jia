/** Phase G: automatic motion offer, except Apple devices; real browser with explicit platform simulation. */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
const origin = process.argv[2] || 'http://127.0.0.1:3054';
const phase = 'offer';
const output = `docs/prompts-output/[54-0]/evidence/popup-${process.env.QA_LABEL || 'local'}`;
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
 const viewport=async(width,touch=false)=>{await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:touch});await send('Emulation.setTouchEmulationEnabled',{enabled:touch,maxTouchPoints:touch?5:1});};
 const load=async()=>{await ev('window.qaPreviousDocument=true');await send('Page.navigate',{url:origin+'/almeria-2026'});await wait(`!window.qaPreviousDocument && document.documentElement?.dataset.motion && document.querySelector('footer')`);await sleep(350);};
 const button=text=>`[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)})`;
 const click=async text=>{await ev(`${button(text)}.click()`);await sleep(120);};
 const shot=async name=>{const {data}=await send('Page.captureScreenshot',{format:'png'});writeFileSync(`${output}/${name}.png`,Buffer.from(data,'base64'));};
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Emulation.setFocusEmulationEnabled',{enabled:true});

 const platform=async value=>send('Emulation.setUserAgentOverride',{userAgent:await ev('navigator.userAgent'),platform:value});
 const offered=`!!document.querySelector('dialog[open][class*="MotionPreference_dialog"]')`;
 report.platformSimulation='navigator.platform and touch capabilities only; not a physical OS/browser certification';
 await platform('MacIntel');await viewport(1440);await media(false);await load();
 await check('macOS normal does not prompt',`!${offered} && document.documentElement.dataset.motion==='on'`);
 await media(true);await load();await check('macOS reduce remains respected without automatic offer',`!${offered} && document.documentElement.dataset.motion==='reduce'`);
 await platform('Win32');await media(false);await load();
 await check('non-Mac normal offers automatically',`${offered} && document.querySelector('dialog[open]').textContent.includes('únicamente a esta web')`);
 await check('exact two actions and no Close',`JSON.stringify([...document.querySelectorAll('dialog[open] button')].map(b=>b.textContent))===JSON.stringify(['Activar animaciones','Dejar sin animaciones'])`);
 await check('no footer preference control',`![...document.querySelectorAll('footer button,footer a')].some(b=>b.textContent.trim()==='Animaciones')`);
 await check('glass blur and larger activation',`getComputedStyle(document.querySelector('dialog[open]'),'::backdrop').backdropFilter==='blur(24px)' && document.querySelector('dialog[open] button').getBoundingClientRect().height>=60`);
 await check('focus starts inside modal',`document.querySelector('dialog[open]').contains(document.activeElement)`);
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 await check('keyboard remains in modal',`document.querySelector('dialog[open]').contains(document.activeElement)`);
 await shot('offer-desktop');
 await click('Dejar sin animaciones');
 await check('decline stops effects without storing rejection',`!${offered} && document.documentElement.dataset.motion==='reduce' && !document.cookie && localStorage.length===0 && sessionStorage.length===0`);
 await media(true);await media(false);await ev(`location.hash='programa'`);await sleep(150);
 await check('decline survives hash and system changes within visit',`!${offered} && document.documentElement.dataset.motion==='reduce'`);
 await load();await check('new document asks after decline',offered);
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await sleep(150);
 await check('Escape leaves visit calm and stores nothing',`!${offered} && document.documentElement.dataset.motion==='reduce' && !document.cookie`);
 await media(true);await load();await check('reduce also offers',offered);
 await click('Activar animaciones');await check('accept enables live without reloading',`!${offered} && document.documentElement.dataset.motion==='on' && document.documentElement.classList.contains('has-mark')`);
 const cookies=(await send('Network.getCookies',{urls:[origin]})).cookies;report.cookies=cookies;
 const valid=cookies.length===1&&cookies[0].name==='__Host-jia-motion'&&cookies[0].value==='on'&&cookies[0].secure&&cookies[0].sameSite==='Lax'&&cookies[0].path==='/'&&!cookies[0].httpOnly&&Math.abs(cookies[0].expires-Date.now()/1000-15552000)<60;
 report.checks.push({name:'HTTPS opt-in cookie exact attributes and 180 days',pass:valid});if(!valid)throw Error('cookie attributes');
 await load();await check('acceptance suppresses future offer even under reduce',`!${offered} && document.documentElement.dataset.motion==='on'`);
 await send('Network.deleteCookies',{name:'__Host-jia-motion',url:origin});await send('Network.setCookie',{name:'__Host-jia-motion',value:'invalid',url:origin,secure:true,path:'/'});await load();await check('invalid acceptance does not suppress offer',offered);
 await send('Network.deleteCookies',{name:'__Host-jia-motion',url:origin});
 const blocked=await send('Page.addScriptToEvaluateOnNewDocument',{source:`Object.defineProperty(document,'cookie',{get(){return ''},set(){}});`});
 await load();await click('Activar animaciones');await check('blocked cookies still allow current-visit activation',`!${offered} && document.documentElement.dataset.motion==='on'`);
 await load();await check('blocked acceptance cannot promise persistence',offered);await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:blocked.identifier});
 await platform('Linux armv8l');await viewport(390,true);await media(false);await load();
 await check('mobile non-Mac offers on load',offered);
 for(const width of [320,390,759]){
  await viewport(width,true);await check(`dialog fits ${width}`,`(()=>{const r=document.querySelector('dialog[open]').getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight})()`);await shot(`offer-${width}`);
 }
 await platform('MacIntel');await viewport(390,true);await load();await check('iPad desktop identity is excluded',`!${offered} && navigator.maxTouchPoints>1`);
 for (const apple of ['iPhone','iPad']) {await platform(apple);await load();await check(`${apple} does not offer automatically`, `!${offered} && document.documentElement.dataset.motion==='on'`);}
 await platform('MacIntel');await viewport(1440,false);await load();await check('actual desktop Mac remains excluded',`!${offered}`);
 if(report.errors.length)throw Error('Browser exceptions');
 console.log(JSON.stringify({checks:report.checks.length,pass:true}));
} catch(error) {report.failure=String(error);console.error(error);process.exitCode=1;}
finally {writeFileSync(`${output}/qa-offer.json`,JSON.stringify(report,null,2)+'\n');ws?.close();chrome.kill();}
