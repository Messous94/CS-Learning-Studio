import {alu} from './alu-engine.mjs';
export const ops={0:'HALT',1:'LDI',2:'LOAD',3:'STORE',4:'ADD',5:'SUB',6:'JMP'};
export const phases=['FETCH_ADDR','FETCH_READ','FETCH_IR','DECODE','OPERAND_ADDR','OPERAND_READ','EXECUTE'];
export const sample=[1,5,3,240,1,3,4,240,3,241,0,0];
export const byte=n=>Number.isInteger(n)&&n>=0&&n<=255;
export function decodeAddress(address){if(!byte(address))throw Error('Invalid address');return Array.from({length:256},(_,i)=>Number(i===address))}
export function access(ram,address,{enable=1,read=0,write=0,data=0}={}){if(!Array.isArray(ram)||ram.length!==256||!byte(address)||!byte(data)||![enable,read,write].every(x=>x===0||x===1))throw Error('Invalid bus');if(read&&write)throw Error('Read and Write conflict');if(!enable)return {ram,data:null};const selected=decodeAddress(address).indexOf(1);if(write){const next=ram.slice();next[selected]=data;return {ram:next,data}}return {ram,data:read?ram[selected]:null}}
export function initial(program=sample){const ram=Array(256).fill(0);program.forEach((v,i)=>{if(i>=256||!byte(v))throw Error('Invalid program');ram[i]=v});return {ram,pc:0,mar:0,mdr:0,ir:0,acc:0,operand:0,phase:'FETCH_ADDR',clock:0,tick:0,halt:false,error:'',signals:{enable:0,read:0,write:0,address:null,data:null,source:'—'},trace:[]}}
const idle=()=>({enable:0,read:0,write:0,address:null,data:null,source:'—'});
export function next(s){if(s.halt)return s;const n={...s,clock:1-s.clock,tick:s.tick+1,signals:idle()};if(n.clock===1){const sig=n.signals;switch(s.phase){
case 'FETCH_ADDR':n.mar=s.pc;sig.address=n.mar;sig.source='PC → MAR';n.phase='FETCH_READ';break;
case 'FETCH_READ':{const a=access(s.ram,s.mar,{read:1});n.mdr=a.data;Object.assign(sig,{enable:1,read:1,address:s.mar,data:a.data,source:'RAM → MDR'});n.phase='FETCH_IR';break}
case 'FETCH_IR':n.ir=s.mdr;n.pc=alu(s.pc,1,'ADD').result;sig.data=s.mdr;sig.source='MDR → IR / PC + 1';n.phase='DECODE';break;
case 'DECODE':sig.source='IR → Control Unit';if(!Object.hasOwn(ops,s.ir)){n.error='Invalid opcode: '+s.ir;n.halt=true}else if(s.ir===0){n.halt=true}else n.phase='OPERAND_ADDR';break;
case 'OPERAND_ADDR':n.mar=s.pc;sig.address=n.mar;sig.source='PC → MAR';n.phase='OPERAND_READ';break;
case 'OPERAND_READ':{const a=access(s.ram,s.mar,{read:1});n.mdr=a.data;n.operand=a.data;n.pc=alu(s.pc,1,'ADD').result;Object.assign(sig,{enable:1,read:1,address:s.mar,data:a.data,source:'RAM → MDR / operand'});n.phase='EXECUTE';break}
case 'EXECUTE':{const op=ops[s.ir];if(op==='LDI'){n.acc=s.operand;sig.data=n.acc;sig.source='MDR → ACC'}else if(op==='JMP'){n.pc=s.operand;sig.address=n.pc;sig.source='Operand → PC'}else{n.mar=s.operand;sig.address=n.mar;sig.enable=1;if(op==='STORE'){n.mdr=s.acc;const a=access(s.ram,n.mar,{write:1,data:n.mdr});n.ram=a.ram;Object.assign(sig,{write:1,data:n.mdr,source:'ACC → MDR → RAM'})}else{const a=access(s.ram,n.mar,{read:1});n.mdr=a.data;n.acc=op==='LOAD'?n.mdr:alu(s.acc,n.mdr,op).result;Object.assign(sig,{read:1,data:n.mdr,source:op==='LOAD'?'RAM → MDR → ACC':'RAM → MDR → ALU → ACC'})}}n.phase='FETCH_ADDR';break}
default:throw Error('Invalid phase')}}n.trace=[...s.trace,{tick:n.tick,clock:n.clock,phase:s.phase,pc:n.pc,mar:n.mar,mdr:n.mdr,ir:n.ir,acc:n.acc,...n.signals}].slice(-32);return n}
export function pulse(s){return next(next(s))}
export function editMemory(s,address,data){return {...s,ram:access(s.ram,address,{write:1,data}).ram}}
export function valid(s){return !!s&&Array.isArray(s.ram)&&s.ram.length===256&&s.ram.every(byte)&&['pc','mar','mdr','ir','acc','operand'].every(k=>byte(s[k]))&&phases.includes(s.phase)&&[0,1].includes(s.clock)&&Number.isSafeInteger(s.tick)&&s.tick>=0&&typeof s.halt==='boolean'&&typeof s.error==='string'&&s.signals&&['enable','read','write'].every(k=>[0,1].includes(s.signals[k]))&&Array.isArray(s.trace)&&s.trace.length<=32}
export const history=s=>({past:[],present:s,future:[]});
export const commit=(h,s)=>({past:[...h.past,h.present].slice(-100),present:s,future:[]});
export const undo=h=>h.past.length?{past:h.past.slice(0,-1),present:h.past.at(-1),future:[h.present,...h.future]}:h;
export const redo=h=>h.future.length?{past:[...h.past,h.present],present:h.future[0],future:h.future.slice(1)}:h;
