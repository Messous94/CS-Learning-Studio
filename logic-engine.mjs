export const gates = {AND:2,OR:2,NOT:1,NAND:2,NOR:2,XOR:2,XNOR:2};
export const types = ['INPUT',...Object.keys(gates),'OUTPUT'];
export const arity = t => t==='INPUT'?0:t==='OUTPUT'?1:gates[t];
export function logic(t,a,b){switch(t){case 'AND':return a&b;case 'OR':return a|b;case 'NOT':return 1-a;case 'NAND':return 1-(a&b);case 'NOR':return 1-(a|b);case 'XOR':return a^b;case 'XNOR':return 1-(a^b);case 'OUTPUT':return a;default:throw Error('Unknown gate')}}
export const empty=()=>({nodes:[],wires:[],next:1});
export function add(c,type){if(!types.includes(type)||c.nodes.length>=60)throw Error('Invalid component or limit reached');const id='n'+c.next;return {...c,next:c.next+1,nodes:[...c.nodes,{id,type,value:0}]}}
export function remove(c,id){return {...c,nodes:c.nodes.filter(n=>n.id!==id),wires:c.wires.filter(w=>w.from!==id&&w.to!==id)}}
export function toggle(c,id){return {...c,nodes:c.nodes.map(n=>n.id===id&&n.type==='INPUT'?{...n,value:1-n.value}:n)}}
export function connect(c,from,to,pin){const a=c.nodes.find(n=>n.id===from),b=c.nodes.find(n=>n.id===to);if(!a||!b||a.type==='OUTPUT'||from===to||!Number.isInteger(pin)||pin<0||pin>=arity(b.type))throw Error('Invalid connection');const wires=c.wires.filter(w=>w.to!==to||w.pin!==pin);const visit=(id,seen=new Set())=>{if(id===from)return true;if(seen.has(id))return false;seen.add(id);return wires.filter(w=>w.from===id).some(w=>visit(w.to,seen))};if(visit(to))throw Error('Circuit cycles are not supported');return {...c,wires:[...wires,{from,to,pin}]}}
export function disconnect(c,to,pin){return {...c,wires:c.wires.filter(w=>w.to!==to||w.pin!==pin)}}
export function evaluate(c){const values={};function get(id){if(Object.hasOwn(values,id))return values[id];const n=c.nodes.find(x=>x.id===id);if(n.type==='INPUT')return values[id]=n.value;const inputs=Array.from({length:arity(n.type)},(_,pin)=>{const w=c.wires.find(w=>w.to===id&&w.pin===pin);return w?get(w.from):null});return values[id]=inputs.includes(null)?null:logic(n.type,...inputs)}c.nodes.forEach(n=>get(n.id));return values}
export function valid(c){try{if(!c||!Array.isArray(c.nodes)||!Array.isArray(c.wires)||c.nodes.length>60||!Number.isSafeInteger(c.next)||c.next<1)return false;const ids=new Set();for(const n of c.nodes){if(!/^n[1-9][0-9]*$/.test(n.id)||ids.has(n.id)||!types.includes(n.type)||![0,1].includes(n.value)||Number(n.id.slice(1))>=c.next)return false;ids.add(n.id)}let temp={...c,wires:[]};for(const w of c.wires){if(temp.wires.some(x=>x.to===w.to&&x.pin===w.pin))return false;temp=connect(temp,w.from,w.to,w.pin)}return true}catch{return false}}
export function sample(){let c=empty();for(const t of ['INPUT','INPUT','XOR','AND','OUTPUT','OUTPUT'])c=add(c,t);for(const [f,t,p] of [['n1','n3',0],['n2','n3',1],['n1','n4',0],['n2','n4',1],['n3','n5',0],['n4','n6',0]])c=connect(c,f,t,p);return c}
export function history(c){return {past:[],present:c,future:[]}}
export function commit(h,c){return {past:[...h.past,h.present].slice(-100),present:c,future:[]}}
export function undo(h){return h.past.length?{past:h.past.slice(0,-1),present:h.past.at(-1),future:[h.present,...h.future]}:h}
export function redo(h){return h.future.length?{past:[...h.past,h.present],present:h.future[0],future:h.future.slice(1)}:h}
