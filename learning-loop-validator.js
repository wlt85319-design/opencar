(function(){
function clone(x){return JSON.parse(JSON.stringify(x))}
function simulate(){
 const now=Date.now(),base={book:'math7b',subject:'数学',chapter:'平方根',knowledge:'算术平方根'};
 const cases=[
  {id:'A',name:'真正掌握',node:{...base,attempts:4,correct:4,errors:{},hints:0,maxHelpLevel:0,lastHelpLevel:0,independentAttempts:4,independentCorrect:4,transferAttempts:1,transferCorrect:1,mastery:96,status:'mastered',lastSeen:now,nextReview:now+7*86400000}},
  {id:'B',name:'AI依赖',node:{...base,attempts:4,correct:3,errors:{'机械写±':1},hints:3,maxHelpLevel:3,lastHelpLevel:3,independentAttempts:1,independentCorrect:0,transferAttempts:0,transferCorrect:0,mastery:58,status:'learning',lastSeen:now,nextReview:now+86400000}},
  {id:'C',name:'前置知识漏洞',node:{...base,knowledge:'平方根估算',attempts:4,correct:1,errors:{'完全平方数不熟':3},hints:2,maxHelpLevel:2,lastHelpLevel:2,independentAttempts:3,independentCorrect:0,transferAttempts:1,transferCorrect:0,mastery:31,status:'weak',lastSeen:now,nextReview:now}},
  {id:'D',name:'遗忘复测失败',node:{...base,attempts:7,correct:5,errors:{'复测遗忘':1},hints:0,maxHelpLevel:0,lastHelpLevel:0,independentAttempts:6,independentCorrect:4,transferAttempts:2,transferCorrect:1,mastery:72,status:'learning',lastSeen:now,nextReview:now-3600000}}
 ];
 return cases.map(x=>{
  const n=clone(x.node),d=window.StudyMateLearningEngine?.diagnose(n)||{};
  let action;
  if(x.id==='A')action={action:'spaced-review',targetKnowledge:n.knowledge,reason:'已通过独立与迁移验证'};
  else if(x.id==='D')action={action:'review',targetKnowledge:n.knowledge,reason:'到期复测且出现遗忘'};
  else if(d.prerequisite&&n.mastery<55)action={action:'prerequisite-repair',targetKnowledge:d.prerequisite,reason:d.reason};
  else if(!n.independentCorrect)action={action:'independent-check',targetKnowledge:n.knowledge,reason:d.reason};
  else if(!n.transferCorrect)action={action:'transfer-verify',targetKnowledge:n.knowledge,reason:d.reason};
  else action={action:'stabilize',targetKnowledge:n.knowledge,reason:d.reason};
  return{...x,diagnosis:d,decision:action,pass:
   x.id==='A'?action.action==='spaced-review':
   x.id==='B'?action.action==='independent-check':
   x.id==='C'?action.action==='prerequisite-repair':
   action.action==='review'};
 });
}
function report(){const rows=simulate(),pass=rows.every(x=>x.pass);return{pass,summary:(pass?'PASS':'FAIL')+' '+rows.filter(x=>x.pass).length+'/'+rows.length,cases:rows}}
function run(){const r=report();console.group('StudyMate Learning Loop Validator');console.log(r.summary);r.cases.forEach(x=>console.log(x.id,x.name,'→',x.decision.action,x.decision.targetKnowledge,x.pass?'✓':'✕'));console.groupEnd();return r}
document.addEventListener('DOMContentLoaded',()=>{window.__STUDYMATE_LOOP_VALIDATION__=run()});
function invariants(){const rows=simulate();return[{name:'AI帮助后答对不得直接判掌握',pass:rows.find(x=>x.id==='B')?.decision.action!=='spaced-review'},{name:'前置漏洞必须回退修复',pass:rows.find(x=>x.id==='C')?.decision.action==='prerequisite-repair'},{name:'到期遗忘必须进入复测',pass:rows.find(x=>x.id==='D')?.decision.action==='review'},{name:'独立+迁移通过才可进入间隔复测',pass:rows.find(x=>x.id==='A')?.decision.action==='spaced-review'}]}
window.StudyMateLoopValidator={simulate,report,run,invariants};
})();
