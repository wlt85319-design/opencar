(function(){
const DIMENSIONS=['concept','procedure','explanation','transfer','retention'];
const LABELS={concept:'概念理解',procedure:'方法执行',explanation:'解释理由',transfer:'迁移应用',retention:'延迟保持'};
const WEIGHTS={
 '数学':{concept:.25,procedure:.25,explanation:.20,transfer:.20,retention:.10},
 '物理':{concept:.20,procedure:.15,explanation:.25,transfer:.25,retention:.15},
 '英语':{concept:.15,procedure:.15,explanation:.15,transfer:.35,retention:.20}
};
function empty(){return Object.fromEntries(DIMENSIONS.map(x=>[x,{attempts:0,passed:0,lastAt:0}]))}
function classify(subject,mode,stage){
 if(mode==='review')return'retention';if(mode==='transfer')return'transfer';if(stage==='mastery-check'||stage==='retention')return'transfer';
 if(stage==='explain'||stage==='reason'||stage==='explanation')return'explanation';
 if(subject==='英语'&&(stage==='speaking'||stage==='writing'||stage==='conversation'))return'transfer';
 if(subject==='物理'&&(stage==='experiment'||stage==='evidence'))return'explanation';
 if(stage==='procedure'||stage==='practice'||stage==='calculation')return'procedure';
 return'concept';
}
function record(state,{subject,mode='practice',stage='',correct=false}){
 const d=classify(subject,mode,stage),s=state||empty();s[d]=s[d]||{attempts:0,passed:0,lastAt:0};s[d].attempts++;if(correct)s[d].passed++;s[d].lastAt=Date.now();return{state:s,dimension:d}
}
function score(subject,state){const w=WEIGHTS[subject]||WEIGHTS['数学'];return Math.round(DIMENSIONS.reduce((sum,d)=>{const x=state?.[d],r=x?.attempts?x.passed/x.attempts:0;return sum+r*(w[d]||0)},0)*100)}
function gaps(subject,state){return DIMENSIONS.map(d=>{const x=state?.[d],rate=x?.attempts?x.passed/x.attempts:0;return{id:d,label:LABELS[d],rate,attempts:x?.attempts||0}}).filter(x=>!x.attempts||x.rate<.75)}
function proof(subject,state){
 const ok=d=>(state?.[d]?.passed||0)>0;
 if(subject==='数学')return{ready:ok('concept')&&ok('procedure')&&ok('explanation'),mastered:ok('concept')&&ok('procedure')&&ok('explanation')&&ok('transfer')&&ok('retention')};
 if(subject==='物理')return{ready:ok('concept')&&ok('explanation'),mastered:ok('concept')&&ok('explanation')&&ok('transfer')&&ok('retention')};
 return{ready:ok('concept')&&ok('transfer'),mastered:ok('concept')&&ok('transfer')&&ok('retention')};
}
window.StudyMateEvidenceDimensions={DIMENSIONS,LABELS,WEIGHTS,empty,classify,record,score,gaps,proof};
})();
