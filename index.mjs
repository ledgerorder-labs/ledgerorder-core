function integer(v,label,min=0) {if (!Number.isSafeInteger(v)||v<min||v>4294967295) throw new TypeError(`Invalid ${label}`);return v;}
function text(v,label){if(typeof v!=='string'||!v.trim())throw new TypeError(`Invalid ${label}`);return v;}
export function canonical(v){if(Array.isArray(v))return '['+v.map(canonical).join(',')+']';if(v&&typeof v==='object')return '{'+Object.keys(v).sort().map(k=>JSON.stringify(k)+':'+canonical(v[k])).join(',')+'}';return JSON.stringify(v);}
export function orderEvents(events){return [...events].sort((a,b)=>a.ledger-b.ledger||a.transactionIndex-b.transactionIndex||a.eventIndex-b.eventIndex||a.id.localeCompare(b.id));}
function validate(x){
 if(x?.schemaVersion!==1||!Array.isArray(x.events)||!Array.isArray(x.ranges))throw new TypeError('Expected schemaVersion 1, events and ranges');
 text(x.network,'network');text(x.scope,'scope');text(x.provider,'provider');integer(x.startLedger,'startLedger',1);integer(x.endLedger,'endLedger',1);
 if(x.endLedger<x.startLedger)throw new TypeError('Invalid requested interval');
 for(const r of x.ranges){integer(r.start,'range start',1);integer(r.end,'range end',1);if(r.end<r.start)throw new TypeError('Invalid coverage range');}
 for(const e of x.events){text(e.id,'event id');integer(e.ledger,'ledger',1);integer(e.transactionIndex,'transactionIndex');integer(e.eventIndex,'eventIndex');text(e.payloadDigest,'payloadDigest');if(!/^[a-f0-9]{64}$/.test(e.payloadDigest))throw new TypeError('Expected SHA-256 payloadDigest');if(e.ledger<x.startLedger||e.ledger>x.endLedger)throw new TypeError('Event outside requested interval');}
}
export function gaps(start,end,ranges){
 let cursor=start;const missing=[];
 for(const r of [...ranges].sort((a,b)=>a.start-b.start)){if(r.end<cursor||r.start>end)continue;if(r.start>cursor)missing.push({start:cursor,end:Math.min(end,r.start-1)});cursor=Math.max(cursor,r.end+1);if(cursor>end)break;}
 if(cursor<=end)missing.push({start:cursor,end});return missing;
}
function inventory(x){
 const map=new Map(),duplicates=[],conflicts=[],positions=new Map();
 for(const e of x.events){const key=e.id;const body=canonical([e.ledger,e.transactionIndex,e.eventIndex,e.payloadDigest]);
 if(map.has(key)){if(map.get(key).body!==body)conflicts.push(key);else duplicates.push(key);}else map.set(key,{event:e,body});
 const position=canonical([e.ledger,e.transactionIndex,e.eventIndex]);if(positions.has(position)&&positions.get(position)!==key)conflicts.push(`position:${position}`);else positions.set(position,key);}
 return {map,duplicates,conflicts};
}
export function compare(left,right){
 validate(left);validate(right);
 for(const key of ['network','scope','startLedger','endLedger'])if(left[key]!==right[key])throw new Error(`Mismatched ${key}`);
 if(left.provider===right.provider)throw new Error('Expected distinct provider labels');
 const a=inventory(left),b=inventory(right),onlyLeft=[],onlyRight=[],changed=[];
 for(const [id,item] of a.map){if(!b.map.has(id))onlyLeft.push(id);else if(b.map.get(id).body!==item.body)changed.push(id);}
 for(const id of b.map.keys())if(!a.map.has(id))onlyRight.push(id);
 const leftGaps=gaps(left.startLedger,left.endLedger,left.ranges),rightGaps=gaps(right.startLedger,right.endLedger,right.ranges);
 const problems=onlyLeft.length+onlyRight.length+changed.length+leftGaps.length+rightGaps.length+a.conflicts.length+b.conflicts.length;
 return {schemaVersion:1,kind:'ledgerorder-audit',network:left.network,scope:left.scope,startLedger:left.startLedger,endLedger:left.endLedger,onlyLeft:onlyLeft.sort(),onlyRight:onlyRight.sort(),changed:changed.sort(),leftGaps,rightGaps,leftDuplicates:a.duplicates,rightDuplicates:b.duplicates,leftConflicts:a.conflicts,rightConflicts:b.conflicts,orderedIds:orderEvents([...a.map.values()].map(v=>v.event)).map(e=>e.id),status:problems?'review-required':'matching-declared-exports',trust:'provider-declared-coverage-only'};
}
