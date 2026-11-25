import {alu,operations} from './alu-engine.mjs';
import {logic} from './logic-engine.mjs';
export {operations};
const AND=(a,b)=>logic('AND',a,b),OR=(a,b)=>logic('OR',a,b),NOT=a=>logic('NOT',a),XOR=(a,b)=>logic('XOR',a,b);
const bit=n=>[0,1].includes(n),word=n=>Number.isInteger(n)&&n>=0&&n<=255;
export const modes=['SR','D','JK','T'];
export const actions=['HOLD','LOAD','SHL','SHR','ALU'];
export function flip(type,q,{s=0,r=0,d=0,j=0,k=0,t=0}={}){
 if(type==='SR'){if(s&&r)return null;if(s)return 1;if(r)return 0;return q}
 if(type==='D')return d;
 if(type==='JK'){if(j&&k)return q===null?null:NOT(q);if(j)return 1;if(k)return 0;return q}
 if(type==='T')return t?(q===null?null:NOT(q)):q;
 throw Error('Unknown flip-flop');
}
export const initial=()=>({clock:0,tick:0,edges:0,q:0,mode:'D',s:0,r:0,d:0,j:0,k:0,t:0,reset:0,enable:1,down:0,count:0,reg:0,action:'HOLD',data:0,serial:0,a:5,b:3,op:'ADD',timeline:[]});
export function valid(s){return !!s&&['clock','s','r','d','j','k','t','reset','enable','down','serial'].every(k=>bit(s[k]))&&(s.q===null||bit(s.q))&&['count','reg','data','a','b'].every(k=>word(s[k]))&&modes.includes(s.mode)&&actions.includes(s.action)&&operations.includes(s.op)&&Number.isSafeInteger(s.tick)&&s.tick>=0&&Number.isSafeInteger(s.edges)&&s.edges>=0&&s.edges<=s.tick&&Array.isArray(s.timeline)&&s.timeline.length<=64&&s.timeline.every(f=>Number.isSafeInteger(f.tick)&&bit(f.clock)&&(f.q===null||bit(f.q))&&word(f.count)&&word(f.reg)&&bit(f.d)&&bit(f.reset)&&bit(f.enable));}
export function next(s){const n={...s,clock:NOT(s.clock),tick:s.tick+1};if(n.clock===1){n.edges++;if(s.reset){n.q=0;n.count=0;n.reg=0}else{n.q=flip(s.mode,s.q,s);if(s.enable){n.count=alu(s.count,1,s.down?'SUB':'ADD').result;switch(s.action){case 'LOAD':n.reg=s.data;break;case 'SHL':n.reg=((s.reg<<1)&255)|s.serial;break;case 'SHR':n.reg=(s.reg>>>1)|(s.serial<<7);break;case 'ALU':n.reg=alu(s.a,s.b,s.op).result;break}}}}
 n.timeline=[...s.timeline,{tick:n.tick,clock:n.clock,q:n.q,count:n.count,reg:n.reg,d:n.d,reset:n.reset,enable:n.enable}].slice(-64);return n;}
export function pulse(s){return next(next(s))}
export const history=s=>({past:[],present:s,future:[]});
export function commit(h,s){return {past:[...h.past,h.present].slice(-120),present:s,future:[]}}
export function undo(h){return h.past.length?{past:h.past.slice(0,-1),present:h.past.at(-1),future:[h.present,...h.future]}:h}
export function redo(h){return h.future.length?{past:[...h.past,h.present],present:h.future[0],future:h.future.slice(1)}:h}
