(function(){
const KEY='studymate_learning_graph_v2';
const LEGACY='studymate_learning_graph_v1';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||localStorage.getItem(LEGACY)||'{}')}catch(e){return{}}};
const save=g=>localStorage.setItem(KEY,JSON.stringify(g));
const legacyId=(book,chapter,k)=>[book,chapter,k].join('::');
const id=(book,chapter,k,learningId)=>learningId?`lid::${learningId}`:legacyId(book,chapter,k);
function ensure(g,key,meta,legacyKey){
 if(!g[key]&&legacyKey&&g[legacyKey]){g[key]={...g[legacyKey],...meta,migratedFrom:legacyKey};delete g[legacyKey]}
 return g[key]||(g[key]={...meta,attempts:0,correct:0,errors:{},hints:0,maxHelpLevel:0,lastHelpLevel:0,independentAttempts:0,independentCorrect:0,transferAttempts:0,transferCorrect:0,reviewAttempts:0,reviewPassed:0,reviewStreak:0,reviewFailures:0,lastReviewAt:0,lastReviewResult:null,reviewIntervalDays:0,evidenceDimensions:null,mastery:0,lastSeen:0,nextReview:0,status:'new',events:[],sceneAttempts:{},sceneHints:{}})
}
function score(n){
 const accuracy=n.attempts?n.correct/n.attempts:0;
 const independent=n.independentAttempts?n.independentCorrect/n.independentAttempts:0;
 const transfer=n.transferAttempts?n.transferCorrect/n.transferAttempts:0;
 const practice=Math.min(1,n.attempts/4);
 const helpPenalty=Math.min(.28,(n.maxHelpLevel||0)*.045+n.hints*.018);
 const errorPenalty=Math.min(.22,Object.values(n.errors||{}).reduce((a,b)=>a+b,0)*.02);
 const raw=accuracy*.30+independent*.28+transfer*.24+practice*.18-helpPenalty-errorPenalty;
 return Math.max(0,Math.min(100,Math.round(raw*100)));
}
function reviewDelay(m){return m>=90?7:m>=75?3:m>=55?1:0}
function status(n){if(n.mastery>=90&&n.independentCorrect>0&&n.transferCorrect>0)return'mastered';if(n.mastery>=75)return'stable';if(n.mastery>=55)return'learning';return'weak'}
function pushEvent(n,e){n.events=(n.events||[]).slice(-39);n.events.push({t:Date.now(),...e})}
function update(n,{preserveReview=false}={}){const dim=window.StudyMateEvidenceDimensions;if(dim&&n.evidenceDimensions){n.dimensionScore=dim.score(n.subject,n.evidenceDimensions);n.evidenceProof=dim.proof(n.subject,n.evidenceDimensions)}n.mastery=score(n);n.status=status(n);if(!preserveReview)n.nextReview=Date.now()+reviewDelay(n.mastery)*86400000}
function markScene(n,scene,type='attempt'){if(!scene)return;n.lastScene=scene;const key=type==='hint'?'sceneHints':'sceneAttempts';n[key]=n[key]||{};n[key][scene]=(n[key][scene]||0)+1}
window.StudyMateLearningEngine={
 record({book,subject,chapter,knowledge,correct,error='',helpLevel=0,hint=false,mode='practice',stage='',curriculumCode=null,learningId=null,parentKnowledge=null,uiBookId=null,scene=null,activityTag=null,sourceKnowledge=null,sourceId=null}){
  const g=load(),legacyKey=legacyId(book,chapter,knowledge),key=id(book,chapter,knowledge,learningId),n=ensure(g,key,{book,subject,chapter,knowledge,curriculumCode,learningId,parentKnowledge,uiBookId},learningId?legacyKey:null);
  n.attempts++;if(correct)n.correct++;if(error)n.errors[error]=(n.errors[error]||0)+1;if(hint)n.hints++;
  n.lastHelpLevel=helpLevel;n.maxHelpLevel=Math.max(n.maxHelpLevel||0,helpLevel);n.lastSeen=Date.now();markScene(n,scene);
  if(helpLevel===0){n.independentAttempts++;if(correct)n.independentCorrect++}
  if(mode==='transfer'){n.transferAttempts++;if(correct)n.transferCorrect++}if(mode==='review'){n.reviewAttempts++;if(correct)n.reviewPassed++}
  const dim=window.StudyMateEvidenceDimensions;if(dim){const rec=dim.record(n.evidenceDimensions||dim.empty(),{subject,mode,stage,correct});n.evidenceDimensions=rec.state;n.lastEvidenceDimension=rec.dimension}
  pushEvent(n,{type:'attempt',correct,error,helpLevel,mode,stage,scene,activityTag,sourceKnowledge,sourceId});let reviewDecision=null;if(mode==='review'&&window.StudyMateReviewScheduler)reviewDecision=window.StudyMateReviewScheduler.apply(n,correct);update(n,{preserveReview:mode==='review'});if(reviewDecision)n.lastReviewDecision=reviewDecision;save(g);return n;
 },
 hint({book,subject,chapter,knowledge,level,curriculumCode=null,learningId=null,parentKnowledge=null,uiBookId=null,scene=null,activityTag=null,sourceKnowledge=null,sourceId=null}){const g=load(),legacyKey=legacyId(book,chapter,knowledge),key=id(book,chapter,knowledge,learningId),n=ensure(g,key,{book,subject,chapter,knowledge,curriculumCode,learningId,parentKnowledge,uiBookId},learningId?legacyKey:null);n.hints++;n.lastHelpLevel=level;n.maxHelpLevel=Math.max(n.maxHelpLevel||0,level);n.lastSeen=Date.now();markScene(n,scene,'hint');pushEvent(n,{type:'hint',level,scene,activityTag,sourceKnowledge,sourceId});update(n);save(g);return n},
 get(book,chapter,knowledge,learningId=null){const g=load();return g[id(book,chapter,knowledge,learningId)]||g[legacyId(book,chapter,knowledge)]||null},
 evidence(book,chapter,knowledge,learningId=null){const n=this.get(book,chapter,knowledge,learningId);return window.StudyMateEvidenceModel?.evaluate(n)||null},
 graph(){return load()},
 weak(limit=8){return Object.values(load()).filter(x=>x.status==='weak'||x.status==='learning').sort((a,b)=>a.mastery-b.mastery||b.lastSeen-a.lastSeen).slice(0,limit)},
 mistakes(limit=20){return Object.values(load()).filter(x=>Object.values(x.errors||{}).some(Boolean)).sort((a,b)=>Object.values(b.errors||{}).reduce((s,n)=>s+n,0)-Object.values(a.errors||{}).reduce((s,n)=>s+n,0)||b.lastSeen-a.lastSeen).slice(0,limit).map(x=>({...x,mistakeCount:Object.values(x.errors||{}).reduce((s,n)=>s+n,0),topError:Object.entries(x.errors||{}).sort((a,b)=>b[1]-a[1])[0]?.[0]||null}))},
 due(limit=8){const now=Date.now();return Object.values(load()).filter(x=>x.nextReview&&x.nextReview<=now).sort((a,b)=>a.nextReview-b.nextReview).slice(0,limit)},
 diagnose(n){if(!n)return null;const err=Object.entries(n.errors||{}).sort((a,b)=>b[1]-a[1])[0]?.[0];const prereq=window.StudyMateRelations?.prerequisites(n.subject,n.knowledge)?.[0];return{reason:err||((n.maxHelpLevel||0)>=3?'依赖较高等级AI帮助':n.transferAttempts&&!n.transferCorrect?'迁移验证未通过':'掌握度不足'),prerequisite:prereq?.to||window.StudyMateMasteryEngine?.prerequisite(n.subject,n.knowledge)||null,relationWhy:prereq?.why||''}},
 nextAction(){const due=this.due(1)[0],weak=this.weak(1)[0],x=due||weak;if(!x)return null;const d=this.diagnose(x);const repair=d.prerequisite&&x.mastery<55;return{...x,...d,targetKnowledge:repair?d.prerequisite:x.knowledge,action:due?'review':repair?'prerequisite-repair':x.transferCorrect?'stabilize':'transfer-verify',minutes:x.mastery<55?12:8,tasks:x.mastery<55?3:2}},
 reset(){localStorage.removeItem(KEY);localStorage.removeItem(LEGACY)}
};
window.StudyMateTutor={
 help(spec,level){const L=Math.max(0,Math.min(4,level));if(L===0)return'先独立完成，我暂时不给提示。';if(L===1)return '微提示：检查“'+spec.error+'”这一点。';if(L===2)return '关键提示：'+spec.intro;if(L===3)return '引导：先回答这个问题——'+spec.q;return '完整讲解：'+spec.intro+' '+spec.explain},
 nextLevel(current){return Math.min(4,(current||0)+1)}
};
})();
