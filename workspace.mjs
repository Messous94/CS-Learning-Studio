export const ids=['code','cpu','registers','memory','trace','notes'];
export const split=(axis,a,b,ratio=.5)=>({axis,a,b,ratio});
export const standard=()=>split('x',split('y','code','trace',.58),split('x',split('y','cpu','memory',.43),split('y','registers','notes',.43),.5),.34);
export const leaves=t=>!t?[]:typeof t==='string'?[t]:[...leaves(t.a),...leaves(t.b)];
export function remove(t,id){if(!t||typeof t==='string')return t===id?null:t;const a=remove(t.a,id),b=remove(t.b,id);return a&&b?{...t,a,b}:a||b;}
export function dock(t,id,target,edge){if(id===target||!ids.includes(id)||!leaves(t).includes(target))return t;const base=remove(t,id);const walk=n=>typeof n==='string'?n===target?(edge==='left'||edge==='top'?split(edge==='left'?'x':'y',id,n):split(edge==='right'?'x':'y',n,id)):n:{...n,a:walk(n.a),b:walk(n.b)};return walk(base);}
export function restore(t){const seen=new Set();function check(n,depth=0){if(depth>8)return false;if(typeof n==='string'){if(!ids.includes(n)||seen.has(n))return false;seen.add(n);return true}return !!n&&['x','y'].includes(n.axis)&&Number.isFinite(n.ratio)&&n.ratio>=.15&&n.ratio<=.85&&check(n.a,depth+1)&&check(n.b,depth+1)}return t===null||check(t)?t:standard()}
export function ratioAt(t,path,r){if(!path.length)return {...t,ratio:Math.min(.85,Math.max(.15,r))};const [k,...rest]=path;return {...t,[k]:ratioAt(t[k],rest,r)}}
