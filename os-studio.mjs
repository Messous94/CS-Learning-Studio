import {schedule,pages} from './os-engine.mjs';
const catalog=[
 {
  "id": "review-CS301-01-01",
  "title": "بنية نظام التشغيل ومستويات الامتياز",
  "model": "trace",
  "scenario": [
   "وضع التنفيذ",
   "محاولة الوصول إلى جهاز مباشرة تُفحص وفق مستوى الامتياز.",
   [
    "مستخدم",
    "نواة"
   ],
   [
    [
     "طلب كتابة سجل الجهاز",
     "المعالج يمنع التعليمة المميّزة",
     "استثناء حماية → النواة"
    ],
    [
     "طلب كتابة سجل الجهاز",
     "المعالج يسمح بالتعليمة",
     "تغيّر سجل الجهاز"
    ]
   ]
  ]
 },
 {
  "id": "review-CS301-01-02",
  "title": "العمليات واستدعاءات النظام وتبديل السياق",
  "model": "trace",
  "scenario": [
   "حدث العملية",
   "عند الحجب يحفظ النظام سياق العملية ويختار عملية جاهزة.",
   [
    "قراءة حاجبة",
    "قراءة جاهزة"
   ],
   [
    [
     "P1 تطلب القراءة",
     "حفظ PC والسجلات؛ P1 تنتظر",
     "استعادة سياق P2",
     "اكتمال الإدخال؛ P1 جاهزة"
    ],
    [
     "P1 تطلب القراءة",
     "البيانات متاحة في المخزن",
     "العودة إلى P1"
    ]
   ]
  ]
 },
 {
  "id": "review-CS301-02-01",
  "title": "سياسات جدولة المعالج ومقاييس العدالة",
  "model": "schedule",
  "scenario": null
 },
 {
  "id": "review-CS301-02-02",
  "title": "محاكاة FCFS وSJF وRound Robin",
  "model": "schedule",
  "scenario": null
 },
 {
  "id": "review-CS301-03-01",
  "title": "العمليات مقابل الخيوط والذاكرة المشتركة",
  "model": "trace",
  "scenario": [
   "نوع المشاركة",
   "الخيوط داخل العملية تشترك في فضاء العناوين، ولكل خيط مكدسه.",
   [
    "خيطان",
    "عمليتان بذاكرة خاصة"
   ],
   [
    [
     "A يكتب x=7",
     "B يقرأ نفس الموقع",
     "B يرى 7"
    ],
    [
     "لكل عملية x=0",
     "A يكتب x=7 في نسخته",
     "B يرى 0"
    ]
   ]
  ]
 },
 {
  "id": "review-CS301-03-02",
  "title": "حالات السباق ومناطق التنفيذ الحرجة",
  "model": "trace",
  "scenario": [
   "حماية الزيادة",
   "الزيادة قراءة ثم تعديل ثم كتابة. راقب أثر ترتيب التنفيذ.",
   [
    "دون قفل",
    "بقفل"
   ],
   [
    [
     "A يقرأ 0",
     "B يقرأ 0",
     "A يكتب 1",
     "B يكتب 1؛ ضاعت زيادة"
    ],
    [
     "A يأخذ القفل ويقرأ 0",
     "B ينتظر",
     "A يكتب 1 ويحرر القفل",
     "B يقرأ 1 ويكتب 2"
    ]
   ]
  ]
 },
 {
  "id": "review-CS301-04-01",
  "title": "الأقفال والسيمافورات والمتغيرات الشرطية",
  "model": "trace",
  "scenario": [
   "تصاريح السيمافور",
   "كل دخول ناجح يستهلك تصريحًا، والتحرير يسمح لمنتظر بالدخول.",
   [
    "تصريح واحد",
    "تصريحان"
   ],
   [
    [
     "A يدخل؛ المتاح 0",
     "B ينتظر",
     "A يحرر؛ B يدخل"
    ],
    [
     "A يدخل؛ المتاح 1",
     "B يدخل؛ المتاح 0",
     "A يحرر؛ المتاح 1"
    ]
   ]
  ]
 },
 {
  "id": "review-CS301-04-02",
  "title": "الجمود: الشروط والكشف والتجنب",
  "model": "trace",
  "scenario": [
   "ترتيب الأقفال",
   "دورة انتظار بين عمليتين وموارد أحادية النسخة تكشف الجمود.",
   [
    "ترتيب متعاكس",
    "ترتيب موحّد"
   ],
   [
    [
     "A يملك X وB يملك Y",
     "A ينتظر Y",
     "B ينتظر X؛ دورة انتظار"
    ],
    [
     "A يملك X؛ B ينتظر X",
     "A يأخذ Y وينتهي",
     "B يأخذ X ثم Y وينتهي"
    ]
   ]
  ]
 },
 {
  "id": "review-CS301-05-01",
  "title": "فضاء العناوين والصفحات والذاكرة الافتراضية",
  "model": "trace",
  "scenario": [
   "عنوان افتراضي",
   "حجم الصفحة 256 بايت. يحفظ التحويل الإزاحة ويستبدل رقم الصفحة برقم الإطار.",
   [
    "العنوان 300",
    "العنوان 520"
   ],
   [
    [
     "300 = 1 × 256 + 44",
     "جدول الصفحات: الصفحة 1 في الإطار 3",
     "العنوان الفيزيائي 812"
    ],
    [
     "520 = 2 × 256 + 8",
     "الصفحة 2 غير مقيمة؛ خطأ صفحة",
     "تحميلها في الإطار 4",
     "العنوان الفيزيائي 1032"
    ]
   ]
  ]
 },
 {
  "id": "review-CS301-05-02",
  "title": "خوارزميات استبدال الصفحات وتحليل Page Faults",
  "model": "pages",
  "scenario": null
 },
 {
  "id": "review-CS301-06-01",
  "title": "بنية نظام الملفات وInodes",
  "model": "trace",
  "scenario": [
   "العملية على الملف",
   "اسم الملف في الدليل يشير إلى inode، وهو يشير إلى كتل البيانات.",
   [
    "قراءة ملف",
    "إنشاء رابط صلب"
   ],
   [
    [
     "البحث عن notes في الدليل",
     "notes → inode 7",
     "inode 7 → الكتلة 12",
     "قراءة بيانات الكتلة 12"
    ],
    [
     "notes → inode 7",
     "إنشاء alias → inode 7",
     "عدد الروابط يصبح 2؛ كتلة البيانات واحدة"
    ]
   ]
  ]
 },
 {
  "id": "review-CS301-06-02",
  "title": "إدارة الأدلة والتخصيص والتعافي",
  "model": "trace",
  "scenario": [
   "لحظة الانقطاع",
   "في نموذج سجلّ المعاملات، يُعاد تطبيق التغييرات المعتمدة عند الاسترداد.",
   [
    "قبل الاعتماد",
    "بعد الاعتماد"
   ],
   [
    [
     "تسجيل تخصيص كتلة وإضافة اسم",
     "انقطاع قبل علامة الاعتماد",
     "الاسترداد يتجاهل المعاملة الناقصة"
    ],
    [
     "تسجيل تخصيص كتلة وإضافة اسم",
     "كتابة علامة الاعتماد ثم انقطاع",
     "إعادة تطبيق التغييرات؛ الاسم يشير إلى الكتلة المخصصة"
    ]
   ]
  ]
 },
 {
  "id": "review-CS301-07-01",
  "title": "المقاطعات وبرامج الأجهزة وDMA",
  "model": "trace",
  "scenario": [
   "طريقة النقل",
   "قارن مسؤولية المعالج أثناء نقل البيانات من جهاز إلى الذاكرة.",
   [
    "DMA",
    "إدخال مبرمج"
   ],
   [
    [
     "المعالج يضبط العنوان والطول",
     "متحكم DMA ينقل الكتلة إلى الذاكرة",
     "مقاطعة اكتمال النقل"
    ],
    [
     "المعالج يقرأ كلمة من الجهاز",
     "المعالج يكتب الكلمة في الذاكرة",
     "تتكرر الخطوتان لباقي الكتلة"
    ]
   ]
  ]
 },
 {
  "id": "review-CS301-07-02",
  "title": "جدولة الإدخال والإخراج والتخزين",
  "model": "trace",
  "scenario": [
   "سياسة القرص",
   "الرأس يبدأ عند 50 والطلبات مرتبة 90، 45، 60. قارن مسافة الحركة.",
   [
    "FCFS",
    "SSTF"
   ],
   [
    [
     "50 → 90 | 40",
     "90 → 45 | 45",
     "45 → 60 | 15",
     "المجموع 100 مسار"
    ],
    [
     "50 → 45 | 5",
     "45 → 60 | 15",
     "60 → 90 | 30",
     "المجموع 50 مسار"
    ]
   ]
  ]
 },
 {
  "id": "review-CS301-08-01",
  "title": "تنفيذ Shell يتعامل مع العمليات والأنابيب",
  "model": "trace",
  "scenario": [
   "طرف الكتابة في الأنبوب",
   "يحصل القارئ على نهاية الملف بعد استهلاك البيانات وإغلاق جميع أطراف الكتابة.",
   [
    "إغلاق الطرف",
    "ترك نسخة مفتوحة"
   ],
   [
    [
     "المنتج يكتب سطرًا ثم يغلق الطرف",
     "المستهلك يقرأ السطر",
     "انتهت نسخ الكتابة؛ القراءة التالية EOF"
    ],
    [
     "المنتج يكتب سطرًا ويغلق طرفه",
     "الأب يحتفظ بنسخة كتابة مفتوحة",
     "بعد السطر ينتظر القارئ مزيدًا من البيانات"
    ]
   ]
  ]
 },
 {
  "id": "review-CS301-08-02",
  "title": "محاكاة الجدولة والتزامن واختبارهما",
  "model": "schedule",
  "scenario": null
 }
];
const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
const origin=catalog.find(l=>l.id===params.get('lesson'));
if(origin){const url=new URL('./index.html',location.href);url.searchParams.set('returnLesson',origin.id);url.searchParams.set('section',params.get('section')||'reading');$('return').href=url.href;$('return').textContent='الرجوع إلى الدرس';}
for(const l of catalog)$('lesson').add(new Option(l.title,l.id));
let lab,result,step;
function configure(){
 lab=catalog.find(l=>l.id===$('lesson').value);
 const scheduling=lab.model==='schedule', paging=lab.model==='pages';
 $('title').textContent=lab.title;
 $('intro').textContent=scheduling?'أدخل لكل عملية وقت الوصول ومدة التنفيذ. قارن ترتيب التشغيل وزمن الانتظار والاستجابة والدوران. SJF هنا غير استباقية.':paging?'ثلاثة إطارات فارغة. أدخل سلسلة مراجع وقارن الإخلاء بحسب أقدم تحميل أو أبعد استخدام سابق.':lab.scenario[1];
 $('policy-label').textContent=lab.scenario?.[0]||'الخوارزمية';
 const options=scheduling?['FCFS','SJF','RR']:paging?['FIFO','LRU']:lab.scenario[2];
 $('policy').replaceChildren(...options.map(v=>new Option(v==='RR'?'Round Robin':v,v)));
 $('input-row').hidden=!(scheduling||paging);
 $('input-label').textContent=scheduling?'الوصول:المدة لكل عملية':'أرقام الصفحات بالترتيب';
 $('input').value=scheduling?'0:5, 1:2, 2:1':'1, 2, 3, 1, 4, 1';
 calculate();
}
function calculate(){
 const policy=$('policy').value;
 $('quantum-row').hidden=policy!=='RR'||lab.model!=='schedule';
 step=0;
 try{
 if(lab.model==='schedule')result=schedule($('input').value,policy,policy==='RR'?Number($('quantum').value):1);
 else if(lab.model==='pages'){
 const tokens=$('input').value.trim().split(/[\s,،]+/);
 if(tokens.length>80||tokens.some(v=>!/^\d{1,2}$/.test(v)))throw Error('أدخل من 1 إلى 80 مرجعًا بأرقام صفحات من 0 إلى 99.');
 result=pages(tokens.map(Number),policy);
 }else result={events:lab.scenario[3][$('policy').selectedIndex],summary:''};
 draw();
 }catch(e){result=null;draw();$('status').textContent=e.message}
}
function draw(){
 const count=result?.events.length||0;
 $('events').replaceChildren(...(result?.events||[]).slice(0,step).map((value,i)=>{const li=document.createElement('li');li.textContent=value;if(i===step-1)li.className='current';return li}));
 $('summary').textContent=result&&step===count?result.summary:'';
 $('status').textContent='الخطوة '+step+' من '+count;
 $('prev').disabled=!step;$('next').disabled=$('all').disabled=step===count;
}
$('lesson').value=origin?.id||catalog[0].id;
$('lesson').onchange=configure;
$('policy').onchange=calculate;$('input').oninput=$('quantum').oninput=calculate;
$('prev').onclick=()=>{step--;draw()};$('next').onclick=()=>{step++;draw()};$('all').onclick=()=>{step=result.events.length;draw()};configure();
