import {assemble,boot,tick,phases,ops} from './integrated-engine.mjs';
import {ids,standard,leaves,remove,dock,restore,ratioAt,split} from './workspace.mjs';
const workspace=document.getElementById('workspace'),panels=Object.fromEntries([...workspace.children].map(p=>[p.dataset.panel,p]));
const $=id=>document.getElementById(id)||Object.values(panels).map(p=>p.querySelector('#'+id)).find(Boolean);
const names={code:'Assembly Editor',cpu:'CPU Datapath',registers:'Registers & Flags',memory:'RAM Inspector',trace:'Execution Trace',notes:'Lab Notes'};
const sample='LDI R0, 3\nLDI R1, 1\nLDI R2, 0\nloop: ADD R2, R0\nSUB R0, R1\nJNZ loop\nSTORE R2, 240\nHALT';
const fresh=()=>({id:crypto.randomUUID(),code:sample,accepted:sample,notes:'',breaks:'',speed:'250',tree:standard(),mobile:'code',machine:boot(assemble(sample)),past:[],future:[]});
let data;try{data=JSON.parse(localStorage.getItem('cs-integrated-325'))}catch{}
if(!data?.tabs?.length){const first=fresh();data={tabs:[first],active:first.id}}
const tab=()=>data.tabs.find(t=>t.id===data.active);let maximized=null,dragged=null,timer=null;
function save(){try{localStorage.setItem('cs-integrated-325',JSON.stringify(data))}catch{$('status').textContent='تعذر الحفظ المحلي'}}
function btn(text,fn,label=text){const b=document.createElement('button');b.textContent=text;b.onclick=fn;b.setAttribute('aria-label',label);return b}
function changeTree(tree){tab().tree=tree;maximized=null;drawLayout();save()}
function move(id,target,edge){changeTree(dock(tab().tree,id,target,edge))}
function panelHeader(id){const p=panels[id],h=p.querySelector('h2');h.replaceChildren();const title=document.createElement('span');title.textContent=names[id];title.className='panel-drag';title.title='اسحب لنقل النافذة';title.onpointerdown=e=>{if(narrow.matches||maximized||e.button!==0)return;e.preventDefault();const origin={x:e.clientX,y:e.clientY};let target=null,edge=null;title.setPointerCapture(e.pointerId);const clear=()=>{workspace.querySelectorAll('[data-drop]').forEach(x=>x.removeAttribute('data-drop'));target=null;edge=null};title.onpointermove=ev=>{if(!dragged&&Math.hypot(ev.clientX-origin.x,ev.clientY-origin.y)<6)return;dragged=id;clear();const p=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('article[data-panel]');if(!p||p===panels[id]||!workspace.contains(p))return;const r=p.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width,y=(ev.clientY-r.top)/r.height;edge=[['left',x],['right',1-x],['top',y],['bottom',1-y]].sort((a,b)=>a[1]-b[1])[0][0];target=p.dataset.panel;p.setAttribute('data-drop',edge)};const finish=ev=>{const dest=target,side=edge,valid=dragged&&ev.type==='pointerup';clear();dragged=null;title.onpointermove=title.onpointerup=title.onpointercancel=title.onlostpointercapture=null;if(title.hasPointerCapture(e.pointerId))title.releasePointerCapture(e.pointerId);if(valid&&dest&&side)move(id,dest,side)};title.onpointerup=title.onpointercancel=title.onlostpointercapture=finish};const tools=document.createElement('span');tools.className='panel-tools';const select=document.createElement('select');select.setAttribute('aria-label','نقل '+names[id]);select.append(new Option('نقل…',''));for(const other of leaves(tab().tree).filter(x=>x!==id))for(const [edge,label] of [['left','يسار'],['right','يمين'],['top','أعلى'],['bottom','أسفل']])select.append(new Option(label+' '+names[other],other+':'+edge));select.onchange=()=>{if(select.value){const [target,edge]=select.value.split(':');move(id,target,edge)}};tools.append(select,btn(maximized===id?'↙':'□',()=>{maximized=maximized===id?null:id;drawLayout()},'تكبير أو استعادة '+names[id]),btn('×',()=>changeTree(remove(tab().tree,id)),'إغلاق '+names[id]));h.append(title,tools)}
function build(t,path=[]){if(!t){const empty=document.createElement('div');empty.className='empty';empty.textContent='افتح نافذة من القائمة أو استعد التخطيط.';return empty}if(typeof t==='string'){panelHeader(t);return panels[t]}const el=document.createElement('div');el.className='split '+t.axis;const first=document.createElement('div'),second=document.createElement('div'),handle=document.createElement('div');first.className=second.className='split-child';handle.className='split-handle';handle.tabIndex=0;handle.setAttribute('role','separator');handle.setAttribute('aria-orientation',t.axis==='x'?'vertical':'horizontal');handle.setAttribute('aria-label','تغيير حجم النوافذ');handle.setAttribute('aria-valuemin','15');handle.setAttribute('aria-valuemax','85');function setRatio(r){r=Math.min(.85,Math.max(.15,r));el.style.setProperty('--ratio',`${r*100}%`);handle.setAttribute('aria-valuenow',String(Math.round(r*100)));tab().tree=ratioAt(tab().tree,path,r)}el.style.setProperty('--ratio',`${t.ratio*100}%`);handle.setAttribute('aria-valuenow',String(Math.round(t.ratio*100)));handle.onpointerdown=e=>{e.preventDefault();handle.setPointerCapture(e.pointerId);handle.onpointermove=ev=>{const r=el.getBoundingClientRect();setRatio(t.axis==='x'?(ev.clientX-r.left)/r.width:(ev.clientY-r.top)/r.height)};const finish=()=>{handle.onpointermove=null;save()};handle.onpointerup=finish;handle.onpointercancel=finish};handle.onkeydown=e=>{const d=['ArrowLeft','ArrowUp'].includes(e.key)?-.03:['ArrowRight','ArrowDown'].includes(e.key)?.03:0;if(d){e.preventDefault();setRatio(Number(handle.getAttribute('aria-valuenow'))/100+d);save()}};first.append(build(t.a,[...path,'a']));second.append(build(t.b,[...path,'b']));el.append(first,handle,second);return el}
const narrow=matchMedia('(max-width: 760px)');narrow.addEventListener('change',drawLayout);function drawLayout(){const t=tab(),visible=leaves(t.tree);if(!visible.includes(t.mobile))t.mobile=visible[0];const bar=$('mobile-panels');bar.replaceChildren();for(const id of visible){const b=btn(names[id],()=>{t.mobile=id;save();drawLayout()});b.setAttribute('role','tab');b.setAttribute('aria-selected',String(id===t.mobile));bar.append(b)}workspace.replaceChildren(build(narrow.matches?t.mobile||null:maximized||t.tree));const opener=$('open-panel');opener.replaceChildren(new Option('فتح نافذة…',''));for(const id of ids.filter(id=>!visible.includes(id)))opener.append(new Option(names[id],id));opener.disabled=visible.length===ids.length;opener.onchange=()=>{if(opener.value){const id=opener.value;t.mobile=id;changeTree(t.tree?split('x',t.tree,id,.65):id)}}}

function stop(){clearInterval(timer);timer=null}
$('angle').oninput=e=>$('board').style.setProperty('--angle',e.target.value+'deg');
$('zoom').oninput=e=>$('board').style.setProperty('--zoom',String(Number(e.target.value)/100));
if(location.hash==='#hardware')$('hardware').open=true;
function explainPulse(state) {
  if (!state.cycles) return 'المعالج جاهز. اضغط «نبضة واحدة» لجلب أول تعليمة.';
  const previousPhase = (state.phase + phases.length - 1) % phases.length;
  if (previousPhase === 0) return 'جلب المعالج بايت التعليمة من عنوان الذاكرة '+state.mar+' إلى سجل التعليمة IR. قيمته '+state.ir+'.';
  if (previousPhase === 1) return 'قرأ المعالج بايت المعامل من العنوان '+state.mar+'. قيمة المعامل '+state.arg+'.';
  const operation = ops[state.ir >> 4];
  if (previousPhase === 2) return 'فكّت وحدة التحكم ترميز التعليمة '+operation+' استعدادًا لتنفيذها.';
  if (previousPhase === 3) {
    if (operation === 'STORE') return 'كتب المعالج القيمة '+state.mdr+' في عنوان الذاكرة '+state.mar+'.';
    if (operation === 'LOAD') return 'قرأ المعالج القيمة '+state.mdr+' من عنوان الذاكرة '+state.mar+'.';
    if (state.path.includes('Latch')) return 'نفّذ المعالج '+operation+' وحفظ النتيجة المؤقتة '+state.tmp+' حتى نبضة الكتابة.';
    return 'أنهى المعالج مرحلة تنفيذ '+operation+'. تحدد النبضة التالية عنوان التعليمة القادمة أو حالة التوقف.';
  }
  if (state.halt) return 'اكتملت تعليمة HALT وتوقف المعالج.';
  if (state.path.startsWith('Latch')) return 'كُتبت القيمة '+state.tmp+' في السجل R'+(state.ir & 3)+'.';
  return 'اكتملت تعليمة '+operation+'. عنوان التعليمة التالية '+state.pc+'.';
}
const lessonParams = new URLSearchParams(location.search);
if (lessonParams.get('lesson') && lessonParams.get('title')) {
  const context = $('lesson-context');
  context.textContent = 'المحاكي مرتبط بدرس «'+lessonParams.get('title')+'».';
  const backLink=document.createElement('a');
  const target=new URL('./index.html',location.href);
  target.searchParams.set('returnLesson',lessonParams.get('lesson'));
  target.searchParams.set('section',lessonParams.get('section') || 'reading');
  backLink.href=target.href;
  backLink.textContent='الرجوع إلى الدرس';
  context.append(' ',backLink);
  context.hidden = false;
}
const guides = new Map([
  ['register', {title:'كتابة السجل', code:'LDI R0, 9\nHALT', question:'بعد أي نبضة تظهر القيمة 9 في R0 لأول مرة؟', choices:[1,4,5], unit:'نبضة', measure:s=>s.r[0]===9?s.cycles:null}],
  ['memory', {title:'الكتابة والقراءة من الذاكرة', code:'LDI R0, 12\nSTORE R0, 240\nLDI R0, 0\nLOAD R1, 240\nHALT', question:'ما قيمة R1 بعد القراءة من عنوان الذاكرة 240؟', choices:[0,12,240], measure:s=>s.halt?s.r[1]:null}],
  ['branch', {title:'القفز الشرطي', code:'LDI R0, 2\nLDI R1, 1\nSUB R0, R1\nJNZ taken\nLDI R2, 4\nHALT\ntaken: LDI R2, 7\nHALT', question:'ما قيمة R2 عند التوقف بعد اختبار شرط JNZ؟', choices:[0,4,7], measure:s=>s.halt?s.r[2]:null}]
]);
function selectGuide(id) {
  const guide=guides.get(id);
  if(!guide)return;
  let experiment=data.tabs.find(t=>t.guide===id && t.code===guide.code && t.accepted===guide.code);
  if(!experiment){
    experiment={...fresh(),guide:id,code:guide.code,accepted:guide.code,machine:boot(assemble(guide.code))};
    data.tabs.push(experiment);
  }
  data.active=experiment.id;
}
function renderGuide(t) {
  const guide=guides.get(t.guide);
  const visible=guide && t.code===guide.code && t.accepted===guide.code;
  $('guide-task').hidden=!visible;
  if(!visible)return;
  $('guide-question').textContent=guide.question;
  const prediction=$('prediction');
  if(prediction.dataset.guide!==t.guide){
    prediction.replaceChildren(new Option('اختر توقّعك',''), ...guide.choices.map(n=>new Option(String(n),String(n))));
    prediction.dataset.guide=t.guide;
  }
  prediction.value=t.prediction??'';
  const states=[...t.past,t.machine];
  const actual=states.map(guide.measure).find(n=>n!==null);
  $('guide-result').textContent=actual===undefined?'شغّل البرنامج أو تقدّم نبضة بنبضة.':('النتيجة الفعلية: '+actual+(guide.unit?' '+guide.unit:'')+(prediction.value===''?'':Number(prediction.value)===actual?' · توقّعك صحيح.':' · توقّعك كان '+prediction.value+'.'));
}
$('prediction').onchange=e=>{tab().prediction=e.target.value;refresh()};
$('guide-list').replaceChildren(...Array.from(guides,([id,g])=>btn(g.title,()=>{selectGuide(id);load()})));
function render(){const t=tab(),s=t.machine;renderGuide(t);
for(const key of ['pc','ir','mar','mdr']){
  const chip=$('chip-'+key),name=key.toUpperCase();
  chip.textContent=name+' '+s[key];
  chip.classList.toggle('active',new RegExp('\\b'+name+'\\b','i').test(s.path));
}
$('hardware-path').textContent=s.path;
$('pulse-explanation').textContent=explainPulse(s);
$('status').textContent=s.halt?'HALT':'PC '+s.pc+' · '+phases[s.phase]+' · Clock '+s.cycles;
$('cpu').replaceChildren(...s.path.split(' → ').map(v=>{const n=document.createElement('div');n.className='block';n.textContent=v;return n}));
$('registers').textContent=s.r.map((v,i)=>'R'+i+' = '+v).join(' | ')+' · '+['pc','ir','mar','mdr'].map(k=>k.toUpperCase()+' '+s[k]).join(' | ')+' · '+['Z','C','N','V'].map(k=>k+' '+s.flags[k]).join(' ');
$('trace').textContent=[...t.past.slice(-12),s].map(v=>v.cycles+'  '+v.path).join('\n');
$('memory').textContent=s.ram.map((v,i)=>(i%16===0?'\n'+i.toString(16).padStart(2,'0')+' | ':'')+v.toString(16).padStart(2,'0')).join(' ');$('memory').style.whiteSpace='pre';$('memory').style.fontFamily='monospace';
$('back').disabled=!t.past.length;$('redo').disabled=!t.future.length;
for(const id of ['run','instruction','step'])$(id).disabled=s.halt||t.code!==t.accepted;
}
function load(){stop();const t=tab();maximized=null;$('code').value=t.code;$('notes').value=t.notes;$('breaks').value=t.breaks;$('speed').value=t.speed;
$('experiments').replaceChildren(...data.tabs.map((x,i)=>btn('تجربة '+(i+1)+(x===t?' ✓':''),()=>{data.active=x.id;load()})),btn('＋ تجربة',()=>{const x=fresh();data.tabs.push(x);data.active=x.id;load()}));drawLayout();$('listing').textContent=assemble(t.accepted).map(v=>v.toString(16).padStart(2,'0')).join(' ');render();save()}
function advance(){const t=tab();if(t.machine.halt)return;t.past.push(t.machine);t.past=t.past.slice(-100);t.machine=tick(t.machine);t.future=[]}
function refresh(){render();save()}
$('code').oninput=()=>{stop();tab().code=$('code').value;refresh()};$('notes').oninput=()=>{tab().notes=$('notes').value;save()};$('breaks').oninput=()=>{stop();tab().breaks=$('breaks').value;save()};$('speed').onchange=()=>{stop();tab().speed=$('speed').value;save()};
$('compile').onclick=$('reset').onclick=()=>{stop();try{const t=tab(),bytes=assemble(t.code);t.machine=boot(bytes);t.accepted=t.code;t.past=[];t.future=[];load()}catch(e){$('status').textContent=e.message}};
$('step').onclick=()=>{stop();advance();refresh()};$('instruction').onclick=()=>{stop();do{advance()}while(!tab().machine.halt&&tab().machine.phase);refresh()};
function parseBreakpoints(input) {
  const points = {addresses:[], registers:[], writes:[]};
  for (const token of input.trim().toUpperCase().split(/[\s,،]+/).filter(Boolean)) {
    const match = /^(?:(R[0-3]|PC|IR|MAR|MDR)=|(W):)?(0X[0-9A-F]+|\d+)$/.exec(token);
    if (!match || Number(match[3]) > 255) throw Error('شرط توقف غير صالح: '+token);
    const value = Number(match[3]);
    if (match[1]) points.registers.push({name:match[1],value});
    else if (match[2]) points.writes.push(value);
    else points.addresses.push(value);
  }
  return points;
}
function registerValue(state,name) {
  return name.startsWith('R') ? state.r[Number(name[1])] : state[name.toLowerCase()];
}
function matchedConditions(points,before,after) {
  const reasons=[];
  if (before.phase===3 && ops[before.ir >> 4]==='STORE' && points.writes.includes(after.mar))
    reasons.push('كتابة القيمة '+after.mdr+' في عنوان الذاكرة '+after.mar);
  for (const {name,value} of points.registers) {
    if (registerValue(before,name)!==value && registerValue(after,name)===value)
      reasons.push('وصل السجل '+name+' إلى '+value);
  }
  return reasons;
}
$('run').onclick=()=>{
  stop();
  const t=tab();
  let points;
  try {points=parseBreakpoints(t.breaks)} catch(error){$('status').textContent=error.message;return}
  timer=setInterval(()=>{
    const before=t.machine;
    advance();
    refresh();
    const after=t.machine;
    const reasons=matchedConditions(points,before,after);
    if (!after.halt && after.phase===0 && points.addresses.includes(after.pc))
      reasons.push('عنوان التعليمة PC '+after.pc);
    if (reasons.length) {
      stop();
      $('status').textContent='توقف عند النبضة '+after.cycles+' · '+reasons.join(' · ');
    } else if(after.halt) stop();
  },Number(t.speed));
};
$('pause').onclick=stop;for(const [id,src,dst] of [['back','past','future'],['redo','future','past']])$(id).onclick=()=>{stop();const t=tab();if(t[src].length){t[dst].push(t.machine);t.machine=t[src].pop();refresh()}};
$('layout').onclick=()=>changeTree(standard());$('fullscreen').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();window.addEventListener('pagehide',stop);
if(!history.state?.guideOpened){selectGuide(lessonParams.get('guide'));history.replaceState({...history.state,guideOpened:true},'')}
load();
