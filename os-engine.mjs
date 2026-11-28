export function schedule(input, policy, quantum) {
  const rows=input.trim().split(/[,،]/).map((pair,i)=>{
    const match=/^\s*(\d+)\s*:\s*(\d+)\s*$/.exec(pair);
    if(!match)throw Error('اكتب كل عملية بصيغة وصول:مدة، وافصل العمليات بفاصلة.');
    const arrival=Number(match[1]),burst=Number(match[2]);
    if(arrival>100 || burst<1 || burst>50)throw Error('الوصول من 0 إلى 100 والمدة من 1 إلى 50.');
    return {id:i+1,arrival,burst,left:burst,first:null};
  });
  if(rows.length>12 || !Number.isInteger(quantum)||quantum<1||quantum>50)throw Error('الحد 12 عملية والشريحة من 1 إلى 50.');
  const pending=[...rows].sort((a,b)=>a.arrival-b.arrival||a.id-b.id),queue=[],events=[];
  let time=0;
  function admit(){while(pending.length && pending[0].arrival<=time)queue.push(pending.shift())}
  while(pending.length||queue.length){
    if(!queue.length && pending[0].arrival>time){events.push('خمول '+time+' ← '+pending[0].arrival);time=pending[0].arrival}
    admit();
    if(policy==='SJF')queue.sort((a,b)=>a.burst-b.burst||a.arrival-b.arrival||a.id-b.id);
    const p=queue.shift(),start=time;
    p.first??=start;
    const slice=policy==='RR'?Math.min(p.left,quantum):p.left;
    time+=slice;p.left-=slice;events.push('P'+p.id+' | '+start+' → '+time);
    admit();if(p.left)queue.push(p);else p.end=time;
  }
  return {events,summary:rows.map(p=>'P'+p.id+' · انتظار '+(p.end-p.arrival-p.burst)+' · استجابة '+(p.first-p.arrival)+' · دوران '+(p.end-p.arrival)).join('\n')};
}
export function pages(sequence,policy){
 const frames=[],last=new Map(),events=[];let faults=0;
 sequence.forEach((p,i)=>{const hit=frames.includes(p);
 if(!hit){faults++;if(frames.length===3){const victim=policy==='FIFO'?frames[0]:frames.reduce((a,b)=>last.get(a)<last.get(b)?a:b);frames.splice(frames.indexOf(victim),1)}frames.push(p)}
 last.set(p,i);events.push('صفحة '+p+' · '+(hit?'موجودة':'خطأ صفحة')+' · ['+frames.join(', ')+']')});
 return {events,summary:'أخطاء الصفحات: '+faults};
}