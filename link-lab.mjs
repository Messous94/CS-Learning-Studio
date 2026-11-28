const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search),lesson=params.get('lesson');
if(['review-CS302-02-01','review-CS302-02-02'].includes(lesson)){
 const url=new URL('index.html',location.href);url.searchParams.set('returnLesson',lesson);url.searchParams.set('section',params.get('section')||'reading');
 $('back').href=url.href;$('back').textContent='الرجوع إلى الدرس';
 if(lesson.endsWith('02-02'))$('mode').value='access';
}
function encode(){
 const bits=$('bits').value,flips=Number($('error').value);
 if(!/^[01]{1,16}$/.test(bits)||flips>bits.length){$('wave').textContent='';$('check').textContent='أدخل بتات ثنائية كافية لنمط الخطأ المختار.';return}
 const parity=[...bits].filter(b=>b==='1').length%2;
 const frame=bits+parity,received=[...frame].map((b,i)=>i<flips?String(1-Number(b)):b).join('');
 const manchester=$('coding').value==='Manchester';
 const signal=[...frame].map(b=>manchester?(b==='1'?'▔▁':'▁▔'):(b==='1'?'▔▔':'▁▁')).join('│');
 $('wave').textContent=frame.split('').map(b=>' '+b).join(' ')+'\n'+signal;
 const rejected=[...received].filter(b=>b==='1').length%2;
 $('check').textContent='بت التكافؤ: '+parity+' · المستقبَل: '+received+' · '+(rejected?'اكتشف فحص التكافؤ خطأ.':flips?'اجتاز الفحص رغم تغيّر بتين؛ التكافؤ لا يكشف كل الأخطاء.':'اجتاز الإطار فحص التكافؤ.');
}
function plan(medium,same){
 if(medium==='switch')return ['لكل جهاز وصلة مستقلة مع المبدّل.',same?'تصل الإطارات على منفذين في نفس اللحظة دون تصادم.':'يستقبل المبدّل الإطارين بالتتابع.','إذا احتاجا نفس منفذ الخروج، ينتظر أحدهما في الطابور عند توافر مساحة.'];
 if(medium==='hub')return same?['الجهازان يستشعران وسطًا خاليًا.','يبدآن قبل وصول إشارة الآخر؛ يحدث تصادم.','يكشفان التصادم ويوقفان الإرسال ثم ينتظران فترتي تراجع عشوائيتين قبل إعادة المحاولة.']:['الجهاز الأول يرسل على الوسط المشترك.','بعد انتهاء الإطار وفاصل الإطارات يرسل الجهاز الثاني.','لا يحدث تصادم في هذا الترتيب.'];
 return same?['القناة خالية وينتهي عدّاد التراجع للمحطتين معًا.','يتداخل الإطاران عند المستقبِل؛ في هذا المثال لا يُفك أي منهما.','لا يصل ACK؛ توسّع المحطتان نافذة التنافس وتعيدان المحاولة.']:['تنتهي مهلة الجهاز الأول فيرسل، ويجمّد الثاني عدّاده أثناء انشغال القناة.','يرد المستقبِل بتأكيد ACK.','بعد خلوّ القناة وفترة الانتظار، يستأنف الثاني العدّ ثم يرسل.'];
}
let events,index;
function restart(){events=plan($('medium').value,$('timing').value==='same');index=0;$('trace').replaceChildren();$('step').disabled=false;$('note').textContent=$('medium').value==='wifi'?'مثال لقناة واحدة وإطارات أحادية الوجهة، مع وجود المحطتين ضمن مجال الاستشعار.':'تابع ما يحدث عند محاولة إرسال إطارين.'}
function mode(){const access=$('mode').value==='access';$('encoding').hidden=access;$('access').hidden=!access;encode();restart()}
$('step').onclick=()=>{const li=document.createElement('li');li.textContent=events[index++];$('trace').append(li);$('step').disabled=index===events.length};
$('reset').onclick=$('medium').onchange=$('timing').onchange=restart;
$('bits').oninput=$('coding').onchange=$('error').onchange=encode;$('mode').onchange=mode;mode();