const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
if(['review-CS302-01-01','review-CS302-01-02'].includes(params.get('lesson'))){
 const url=new URL('index.html',location.href);
 url.searchParams.set('returnLesson',params.get('lesson'));url.searchParams.set('section',params.get('section')||'reading');
 $('back').href=url.href;$('back').textContent='الرجوع إلى الدرس';
}
const sender='02:00:00:00:01:10',localHost='02:00:00:00:01:20',routerIn='02:00:00:00:01:01',routerOut='02:00:00:00:02:01',remoteHost='02:00:00:00:02:20';
function journey(remote,message){
 const payload=[['البيانات',message]];
 const segment=[['منفذ المصدر → الوجهة','51000 → 8080'],...payload];
 const dest=remote?'192.0.2.20':'10.0.1.20';
 const packet=ttl=>[['IP المصدر','10.0.1.10'],['IP الوجهة النهائية',dest],['TTL',String(ttl)],...segment];
 const frame=(src,dst,ttl)=>[['MAC المرسل',src],['MAC الخطوة التالية',dst],...packet(ttl)];
 const steps=[
 ['التطبيق يجهّز الرسالة','التطبيق يسلّم البيانات إلى TCP عبر اتصال قائم.',payload],
 ['TCP يضيف المنفذين','منفذ الوجهة يحدد التطبيق المستقبِل.',segment],
 ['IPv4 يحدد الجهاز المقصود','عنوان الوجهة النهائية موجود قبل إرسال أول إطار.',packet(64)],
 ['Ethernet يرسل الإطار الأول',remote?'الوجهة خارج شبكة المرسل /24؛ لذلك يوجَّه الإطار إلى واجهة الراوتر المحلية.':'الوجهة في نفس شبكة المرسل /24؛ لذلك يوجَّه الإطار إلى الجهاز نفسه.',frame(sender,remote?routerIn:localHost,64)]];
 if(remote)steps.push(['الراوتر يعيد التغليف','يزيل الراوتر إطار الوصلة الأولى، ويخفض TTL، ويرسل إطارًا جديدًا من واجهته الثانية. عنوان IP للوجهة يظل كما هو.',frame(routerOut,remoteHost,63)]);
 steps.push(['الجهاز المستقبِل يفك إطار Ethernet','بعد التحقق من الإطار، يسلّم الجهاز حزمة IPv4 إلى طبقة الشبكة.',packet(remote?63:64)],['IPv4 يسلّم البيانات إلى TCP','يطابق الجهاز عنوان وجهته ثم يزيل رأس IPv4.',segment],['وصول الرسالة إلى التطبيق','يسلّم TCP البيانات إلى التطبيق المرتبط بالمنفذ 8080.',payload]);
 return steps;
}
let steps=[],index=0;
function draw(){const [title,why,fields]=steps[index];$('stage').textContent=(index+1)+' / '+steps.length+' · '+title;$('why').textContent=why;
 $('fields').replaceChildren(...fields.flatMap(([k,v])=>{const key=document.createElement('dt'),value=document.createElement('dd');key.textContent=k;value.dir='auto';value.textContent=v;return [key,value]}));
 $('prev').disabled=index===0;$('next').disabled=index===steps.length-1;
}
function start(){index=0;steps=journey($('destination').value==='remote',$('message').value);draw()}
$('send').onclick=start;$('destination').onchange=start;$('prev').onclick=()=>{index--;draw()};$('next').onclick=()=>{index++;draw()};start();