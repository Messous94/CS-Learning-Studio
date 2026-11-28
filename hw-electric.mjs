const experiments={
 'proposal-HW101-02':{
 title:'المجال عند منتصف المسافة بين شحنتين',
 explanation:'ضع شحنتين على محور أفقي، الأولى يسار المنتصف والثانية يمينه. الاتجاه الموجب نحو اليمين. المجال الكلي هو مجموع المجالين بإشارتيهما، والقوة على شحنة اختبار موجبة تتجه مع المجال.',
 fields:[['الشحنة اليسرى (nC)',1],['الشحنة اليمنى (nC)',-1],['المسافة بين الشحنتين (m)',2,0.01]],
 calculate:([left,right,d])=>{const field=8.99*(left-right)/(d/2)**2;return 'المجال = '+format(field)+' N/C · '+(field>0?'إلى اليمين':field<0?'إلى اليسار':'المجالان يتلاشيان')+' · القوة على شحنة اختبار +1 nC = '+format(field)+' nN'}
 },
 'proposal-HW101-03':{
 title:'نقل شحنة بين نقطتين',
 explanation:'فرق الجهد هو الجهد النهائي ناقص الابتدائي. تغيّر طاقة الوضع يساوي الشحنة مضروبة في فرق الجهد، وشغل المجال يساوي سالب هذا التغيّر.',
 fields:[['الشحنة (µC)',2],['الجهد الابتدائي (V)',1],['الجهد النهائي (V)',4]],
 calculate:([q,start,end])=>'فرق الجهد = '+format(end-start)+' V · تغيّر طاقة الوضع = '+format(q*(end-start))+' µJ · شغل المجال = '+format(-q*(end-start))+' µJ'
 },
 'proposal-HW101-04':{
 title:'مصدر جهد ومقاومة مثالية',
 explanation:'اتخذ اتجاه التيار المرجعي من طرف فرق الجهد الموجب عبر المقاومة. حسب قانون أوم I = V/R. القدرة الحرارية المستهلكة P = I²R.',
 fields:[['فرق الجهد (V)',12],['المقاومة (Ω)',6,0.001]],
 calculate:([v,r])=>'التيار = '+format(v/r)+' A · القدرة المستهلكة = '+format(v*v/r)+' W'
 }
};
function format(n){return Number(n.toPrecision(6)).toString()}
export function physicsPanel(id){
 const lab=experiments[id];if(!lab)return '';
 const inputs=lab.fields.map(([label,value,min])=>'<label class="field">'+label+' <input type="number" step="any" required '+(min===undefined?'':'min="'+min+'"')+' value="'+value+'"></label>').join('');
 return '<section class="panel" data-physics="'+id+'"><h2>'+lab.title+'</h2><p>'+lab.explanation+'</p>'+inputs+'<p class="notice" role="status">'+lab.calculate(lab.fields.map(f=>f[1]))+'</p></section>';
}
document.addEventListener('input',e=>{
 const panel=e.target.closest('[data-physics]');if(!panel)return;
 const fields=[...panel.querySelectorAll('input')];
 panel.querySelector('[role=status]').textContent=fields.every(f=>f.validity.valid && Number.isFinite(f.valueAsNumber))?experiments[panel.dataset.physics].calculate(fields.map(f=>f.valueAsNumber)):'راجع القيم والحد الأدنى الموضّح في الحقل.';
});