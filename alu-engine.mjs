import {logic} from './logic-engine.mjs';
const g=(t,a,b)=>logic(t,a,b),and=(a,b)=>g('AND',a,b),or=(a,b)=>g('OR',a,b),xor=(a,b)=>g('XOR',a,b),not=a=>g('NOT',a);
export const bits=(n,width=8)=>Array.from({length:width},(_,i)=>(n>>i)&1);
export const value=bits=>bits.reduce((n,b,i)=>n+(b<<i),0);
export const half=(a,b)=>({sum:xor(a,b),carry:and(a,b)});
export function full(a,b,cin){const h1=half(a,b),h2=half(h1.sum,cin);return {a,b,cin,x:h1.sum,c1:h1.carry,c2:h2.carry,sum:h2.sum,carry:or(h1.carry,h2.carry)}}
export function mux2(a,b,s){const left=and(a,not(s)),right=and(b,s);return {left,right,out:or(left,right)}}
export function mux4(inputs,select){const [s0,s1]=bits(select,2),l=mux2(inputs[0],inputs[1],s0),r=mux2(inputs[2],inputs[3],s0),last=mux2(l.out,r.out,s1);return {s0,s1,l,r,last,out:last.out}}
export function decode2(select,enable=1){const [s0,s1]=bits(select,2);return [and(and(not(s1),not(s0)),enable),and(and(not(s1),s0),enable),and(and(s1,not(s0)),enable),and(and(s1,s0),enable)]}
export function ripple(a,b,sub=0){const aa=bits(a),bb=bits(b);let cin=sub;const stages=aa.map((x,i)=>{const original=bb[i],modified=xor(original,sub),f=full(x,modified,cin);cin=f.carry;return {...f,i,original,modified}});const result=value(stages.map(s=>s.sum));return {stages,result,carry:cin,borrow:sub?not(cin):0,overflow:xor(stages[7].cin,cin)}}
export const operations=['ADD','SUB','AND','OR','XOR','NOT'];
export function alu(a,b,op){if(!Number.isInteger(a)||a<0||a>255||!Number.isInteger(b)||b<0||b>255||!operations.includes(op))throw Error('Invalid ALU input');const aa=bits(a),bb=bits(b),arithmetic=ripple(a,b,Number(op==='SUB'));const selector=operations.indexOf(op),enable=decode2(selector%4);const rows=aa.map((x,i)=>{const y=bb[i],stage=arithmetic.stages[i],candidates=[stage.sum,stage.sum,and(x,y),or(x,y),xor(x,y),not(x),0,0],low=mux4(candidates.slice(0,4),selector%4),high=mux4(candidates.slice(4),selector%4),selected=mux2(low.out,high.out,selector>=4?1:0);return {i,a:x,b:y,stage,candidates,low,high,selected,out:selected.out}});const result=value(rows.map(x=>x.out)),math=op==='ADD'||op==='SUB';return {a,b,op,selector,enable,rows,result,flags:{Z:Number(result===0),C:math?arithmetic.carry:0,V:math?arithmetic.overflow:0,N:bits(result)[7],B:op==='SUB'?arithmetic.borrow:0}}}
