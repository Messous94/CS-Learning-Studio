import {alu} from './alu-engine.mjs';
import {access} from './memory-engine.mjs';
export const ops='NOP HALT LDI MOV ADD SUB AND OR XOR NOT LOAD STORE JMP JZ JNZ JC'.split(' ');
export function assemble(src){
 const labels=new Map(), lines=[];
 for(let [i,line] of src.split('\n').entries()){
  line=line.split(';')[0].trim().toUpperCase();
  const m=line.match(/^([A-Z_]\w*):/);
  if(m){if(labels.has(m[1]))throw Error('Duplicate label '+m[1]);labels.set(m[1],lines.length*2);line=line.slice(m[0].length).trim()}
  if(line)lines.push({line,i});
 }
 if(!lines.length||lines.length>128)throw Error('Program length must be 1–128 instructions');
 return lines.flatMap(({line,i})=>{
 const [op,...args]=line.replaceAll(',',' ').split(/\s+/),idx=ops.indexOf(op);
 const fail=()=>{throw Error('Line '+(i+1)+' · '+line)};
 const reg=x=>/^R[0-3]$/.test(x)?Number(x[1]):fail();
 const num=x=>{const n=labels.get(x)??(/^(0X[0-9A-F]+|\d+)$/.test(x)?Number(x):NaN);return n>=0&&n<=255?n:fail()};
 const argc=idx<2?0:idx===9||idx>=12?1:2;
 if(idx<0||args.length!==argc)fail();
 const dst=idx>=2&&idx<=11?reg(args[0]):0;
 const operand=idx>=12?num(args[0]):[2,10,11].includes(idx)?num(args[1]):idx>=3&&idx<=8?reg(args[1]):0;
 return [idx*16+dst,operand]});
}
export function boot(bytes){const ram=Array(256).fill(0);ram.splice(0,bytes.length,...bytes);return {ram,r:[0,0,0,0],pc:0,ir:0,mar:0,mdr:0,arg:0,tmp:0,flags:{Z:0,C:0,N:0,V:0},phase:0,halt:false,cycles:0,path:'READY'}}
export const phases=['FETCH','FETCH ARG','DECODE','EXECUTE','WRITE BACK'];
export function tick(prev){
 if(prev.halt)return prev;
 const s={...prev,r:[...prev.r],cycles:prev.cycles+1},op=ops[s.ir>>4],dst=s.ir&3;
 if(s.phase<=1){s.mar=s.pc;s.mdr=access(s.ram,s.mar,{read:1}).data;s.pc=(s.pc+1)&255;if(s.phase===0)s.ir=s.mdr;else s.arg=s.mdr;s.path='PC → MAR → RAM → MDR → '+(s.phase?'Operand':'IR')}
 else if(s.phase===2)s.path='IR → Control Unit · '+op;
 else if(s.phase===3){
 s.path='Control Unit → '+op;
 if(['ADD','SUB','AND','OR','XOR','NOT'].includes(op)){const f=alu(s.r[dst],s.r[s.arg&3],op);s.tmp=f.result;s.flags=f.flags;s.path='Register File → ALU → Latch · '+s.tmp}
 if(op==='LDI'||op==='MOV'){s.tmp=op==='LDI'?s.arg:s.r[s.arg&3];s.path=op+' → Latch · '+s.tmp}
 if(op==='LOAD'||op==='STORE'){s.mar=s.arg;if(op==='LOAD'){s.mdr=access(s.ram,s.mar,{read:1}).data;s.tmp=s.mdr;s.path='MAR → RAM → MDR → Latch'}else{s.mdr=s.r[dst];s.ram=access(s.ram,s.mar,{write:1,data:s.mdr}).ram;s.path='Register → MDR → RAM'}}
 }else{if(['LDI','MOV','ADD','SUB','AND','OR','XOR','NOT','LOAD'].includes(op)){s.r[dst]=s.tmp;s.path='Latch → R'+dst+' · '+s.tmp}else if(op==='JMP'||op==='JZ'&&s.flags.Z||op==='JNZ'&&!s.flags.Z||op==='JC'&&s.flags.C){s.pc=s.arg;s.path='Branch → PC · '+s.pc}else{s.halt=op==='HALT';s.path=op+' · retired'}}
 s.phase=(s.phase+1)%5;return s}
