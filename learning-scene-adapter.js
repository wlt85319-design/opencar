(function(){
const VALID_SCENES=new Set(['explore','practice','repair']);
const DEFAULT_STAGE={explore:'concept',practice:'procedure',repair:'mastery-check'};
const PRACTICE_STAGES=new Set(['procedure','practice','calculation','experiment','evidence','speaking','writing','conversation','transfer','application']);
const REPAIR_STAGES=new Set(['mastery-check','retention','review','repair']);
function engine(){const e=window.StudyMateLearningEngine;if(!e)throw new Error('StudyMateLearningEngine not loaded');return e}
function resolve(input={}){
 const identity=window.StudyMateLearningIdentity;
 if(!identity)throw new Error('StudyMateLearningIdentity not loaded');
 const raw={book:'math7a',uiBookId:'math7a',subject:'数学',chapter:'第一章 有理数',...input};
 const ctx=identity.resolve(raw);
 if(!ctx.curriculumCode||!ctx.learningId)throw new Error(`Scene learning could not resolve curriculum identity: ${raw.curriculumCode||raw.knowledge||''}`);
 return ctx;
}
function inferScene(input={}){
 if(VALID_SCENES.has(input.scene))return input.scene;
 const stage=String(input.stage||'').toLowerCase(),mode=String(input.mode||'').toLowerCase();
 if(mode==='review'||REPAIR_STAGES.has(stage))return'repair';
 if(mode==='transfer'||PRACTICE_STAGES.has(stage))return'practice';
 return'explore';
}
function sceneOf(input){const scene=inferScene(input);if(!VALID_SCENES.has(scene))throw new Error(`Unknown learning scene: ${scene}`);return scene}
function record(input={}){
 const scene=sceneOf(input),ctx=resolve(input),mode=input.mode||'practice',stage=input.stage||DEFAULT_STAGE[scene];
 const node=engine().record({...ctx,correct:!!input.correct,error:input.error||'',helpLevel:Math.max(0,input.helpLevel||0),hint:!!input.hint,mode,stage,scene,activityTag:input.activityTag||null,sourceKnowledge:input.sourceKnowledge||input.knowledge||null,sourceId:input.sourceId||null});
 return{context:ctx,node,scene,stage,mode,nextTask:window.StudyMateDailyPlan?.task?.(node)||null};
}
function hint(input={}){
 const scene=sceneOf(input),ctx=resolve(input),level=Math.max(1,input.level||1);
 const node=engine().hint({...ctx,level,scene,activityTag:input.activityTag||null,sourceKnowledge:input.sourceKnowledge||input.knowledge||null,sourceId:input.sourceId||null});
 return{context:ctx,node,scene,level};
}
function state(input={}){const scene=sceneOf(input),ctx=resolve(input),node=engine().get(ctx.book,ctx.chapter,ctx.knowledge,ctx.learningId);return{context:ctx,node,scene,nextTask:node&&window.StudyMateDailyPlan?.task?.(node)||null}}
function trail(input={}){const s=state(input);return(s.node?.events||[]).filter(e=>!input.scene||e.scene===input.scene)}
function summary(input={}){const s=state(input),events=s.node?.events||[];const scenes={explore:0,practice:0,repair:0};for(const e of events)if(e.type==='attempt'&&VALID_SCENES.has(e.scene))scenes[e.scene]++;return{...s,scenes,totalSceneAttempts:Object.values(scenes).reduce((a,b)=>a+b,0)}}
window.StudyMateSceneLearning={VALID_SCENES:[...VALID_SCENES],inferScene,resolve,record,hint,state,trail,summary};
})();
