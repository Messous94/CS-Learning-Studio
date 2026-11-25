import assert from 'node:assert/strict';
import {standard,leaves,dock,remove,restore,ratioAt,split,ids} from '../workspace.mjs';
import {compile,initial,step} from '../studio-engine.mjs';
const t=standard();assert.deepEqual([...leaves(t)].sort(),[...ids].sort());
for(const id of ids)for(const target of ids.filter(x=>x!==id))for(const edge of ['left','right','top','bottom']){const d=dock(t,id,target,edge);assert.deepEqual([...leaves(d)].sort(),[...ids].sort());assert.deepEqual(restore(d),d);assert.equal(leaves(remove(d,id)).includes(id),false)}
assert.equal(ratioAt(t,[],.99).ratio,.85);assert.equal(ratioAt(t,['a'],-1).a.ratio,.15);assert.deepEqual(restore(split('x','code','code')),t);assert.equal(ids.reduce((a,id)=>remove(a,id),t),null);
const p=compile('MOV R0, 5\nMOV R1, 3\nADD R0,R1\nSTORE R0,0x10\nLOAD R2,0x10\nHALT');const h=[initial()];for(let i=0;i<p.length;i++)h.push(step(h.at(-1),p));assert.equal(h[3].r[0],8);assert.equal(h[4].ram[16],8);assert.equal(h[5].r[2],8);assert.equal(h[6].halt,true);assert.equal(h[3].ram[16],0);assert.equal(h[0].r[0],0);assert.throws(()=>compile('MOV R4, 300'));console.log('PASS: 120 docking combinations, tree validation, resize bounds, CPU state history and compilation');
