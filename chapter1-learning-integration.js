(function(){
if(!window.StudyMateSceneLearning||typeof lessons==='undefined')return;
const Scene=window.StudyMateSceneLearning;
const CODES={prologue:'M7A-1.1',sign:'M7A-1.1',tolerance:'M7A-1.R1',rational:'M7A-1.2',line:'M7A-1.2',opposite:'M7A-1.2',absolute:'M7A-1.2',compare:'M7A-1.2',finale:'M7A-1.A'};
let exploreHintUsed=false,practiceHintUsed=false,repairAssisted=false;
function baseInput(scene,source={}){
 const lesson=lessons[lessonIndex],curriculumCode=CODES[lesson.id];
 if(!curriculumCode)return null;
 return{scene,curriculumCode,book:'math7a',uiBookId:'math7a',subject:'数学',chapter:'第一章 有理数',knowledge:lesson.title,sourceKnowledge:source.error||source.tag||lesson.skills?.[0]||lesson.title,sourceId:`chapter1:${lesson.id}:${source.tag||'activity'}`,activityTag:source.tag||null};
}
function exploreStage(){return['concept','procedure','explanation','procedure','explanation','transfer','mastery-check'][phaseIndex(lessons[lessonIndex])]||'concept'}
function record(scene,source,correct,{stage=null,mode=null,helpLevel=0,error=null}={}){
 const input=baseInput(scene,source);if(!input)return null;
 const s=stage||(scene==='explore'?exploreStage():'procedure');
 return Scene.record({...input,correct,error:correct?'':(error||source?.error||'未通过'),helpLevel,stage:s,mode:mode||(s==='transfer'?'transfer':'practice')});
}
function hint(scene,source,level=1){const input=baseInput(scene,source);return input?Scene.hint({...input,level}):null}

// Exploration keeps the original story/UI flow; only scored interactions become learning evidence.
const originalRecordMistake=recordMistake;
recordMistake=function(source){
 if(activeScene==='explore')record('explore',source,false,{helpLevel:exploreHintUsed?1:0});
 return originalRecordMistake(source);
};
const originalSuccess=success;
success=function(source,message,scored){
 if(activeScene==='explore'&&scored)record('explore',source,true,{helpLevel:exploreHintUsed?1:0});
 const result=originalSuccess(source,message,scored);if(scored)exploreHintUsed=false;return result;
};

// Practice evidence is captured before the original click handler mutates practiceStage.
const originalRenderPracticeOptions=renderPracticeOptions;
renderPracticeOptions=function(options,answer,source,isReason){
 originalRenderPracticeOptions(options,answer,source,isReason);
 const host=document.getElementById('practiceAnswers');if(!host)return;
 if(host.__learningCapture)host.removeEventListener('click',host.__learningCapture,true);
 const phase=practiceStage;
 host.__learningCapture=function(e){
  const btn=e.target.closest?.('[data-practice-answer]');if(!btn)return;
  const correct=Number(btn.dataset.practiceAnswer)===answer;
  const stage=phase===0?'procedure':phase===1?'explanation':'transfer';
  record('practice',source,correct,{stage,mode:phase===2?'transfer':'practice',helpLevel:practiceHintUsed?1:0});
  if(correct)practiceHintUsed=false;
 };
 host.addEventListener('click',host.__learningCapture,true);
};

// Repair phases are same-session remediation. Phase 3 is an independent mastery check,
// not a true delayed review; real retention remains scheduled by the Learning Engine.
const originalRenderRepairOptions=renderRepairOptions;
renderRepairOptions=function(options,answer,source){
 originalRenderRepairOptions(options,answer,source);
 const host=document.getElementById('repairAnswers');if(!host)return;
 if(host.__learningCapture)host.removeEventListener('click',host.__learningCapture,true);
 const phase=repairPhase;
 host.__learningCapture=function(e){
  const btn=e.target.closest?.('[data-repair-answer]');if(!btn)return;
  const correct=Number(btn.dataset.repairAnswer)===answer;
  const stage=phase===0?'explanation':phase===1?'transfer':'mastery-check';
  record('repair',source,correct,{stage,mode:phase===1?'transfer':'practice',helpLevel:repairAssisted?1:0,error:activeFault||source?.error});
  if(correct)repairAssisted=false;else repairAssisted=true;
 };
 host.addEventListener('click',host.__learningCapture,true);
};

const exploreHint=document.getElementById('hintBtn');
exploreHint?.addEventListener('click',()=>{exploreHintUsed=true;hint('explore',lessons[lessonIndex].steps[stepIndex],1)});
const practiceHint=document.getElementById('practiceHint');
practiceHint?.addEventListener('click',()=>{practiceHintUsed=true;hint('practice',currentPracticeItems()[practiceRound%currentPracticeItems().length],1)});

window.StudyMateChapter1LearningBridge={
 curriculumCodeForLesson:id=>CODES[id]||null,
 state(){const input=baseInput(activeScene,lessons[lessonIndex].steps?.[stepIndex]||{});return input?Scene.state(input):null},
 summary(){const input=baseInput(activeScene,lessons[lessonIndex].steps?.[stepIndex]||{});return input?Scene.summary(input):null}
};
})();
