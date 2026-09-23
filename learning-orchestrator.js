(function(){
const E=()=>window.StudyMateLearningEngine,M=()=>window.StudyMateMasteryEngine,R=()=>window.StudyMateRelations;
function inferScene(input={}){
 const shared=window.StudyMateSceneLearning?.inferScene?.(input);if(shared)return shared;
 const stage=String(input.stage||'').toLowerCase(),mode=String(input.mode||'').toLowerCase();
 if(mode==='review'||['mastery-check','retention','review','repair'].includes(stage))return'repair';
 if(mode==='transfer'||['procedure','practice','calculation','experiment','evidence','speaking','writing','conversation','transfer','application'].includes(stage))return'practice';
 return'explore';
}
function enrich(input={}){return{...input,scene:input.scene||inferScene(input),sourceKnowledge:input.sourceKnowledge||input.knowledge||null}}
function context(x){return{book:x.book,subject:x.subject,chapter:x.chapter,knowledge:x.knowledge,curriculumCode:x.curriculumCode||null,learningId:x.learningId||null,parentKnowledge:x.parentKnowledge||null,uiBookId:x.uiBookId||null,scene:x.scene||null,activityTag:x.activityTag||null,sourceKnowledge:x.sourceKnowledge||x.knowledge||null,sourceId:x.sourceId||null}}
function decide(ctx,node){
 const diagnosis=E()?.diagnose(node)||{};
 const mastery=M()?.recommend(ctx)||{mode:'learn'};
 const next=E()?.nextAction()||null;
 return{node,diagnosis,mastery,next,tutor:{level:node?.lastHelpLevel||0,maxLevel:node?.maxHelpLevel||0},relations:{prerequisites:R()?.prerequisites(ctx.subject,ctx.knowledge)||[],related:R()?.related(ctx.subject,ctx.knowledge)||[],transfers:R()?.transfers(ctx.subject,ctx.knowledge)||[]}};
}
window.StudyMateLearningOrchestrator={
 attempt(input){const event=enrich(input),ctx=context(event);window.StudyMateDataModel?.attempt(event);const node=E().record({...event,mode:event.mode||'practice'});const state=decide(ctx,node);window.StudyMateDataModel?.mastery({...event,evidenceType:event.mode==='transfer'?'transfer':'practice',passed:!!event.correct,score:node.mastery});return state},
 hint(input){const event=enrich(input),ctx=context(event);window.StudyMateDataModel?.hint(event);const node=E().hint({...event,level:Math.max(1,event.level||1)});return decide(ctx,node)},
 transfer(input,choice){const event=enrich({...input,mode:'transfer',stage:'transfer',scene:input.scene||'practice'}),ctx=context(event);const v=M().variant(ctx.subject,ctx.knowledge),correct=v?choice===v.answer:false;window.StudyMateDataModel?.attempt({...event,correct,response:choice,helpLevel:0,error:correct?'':'迁移验证失败'});const ev=M().evaluate(ctx,choice);window.StudyMateDataModel?.mastery({...event,evidenceType:'transfer',passed:!!ev?.ok,score:ev?.result?.mastery});return{evaluation:ev,...decide(ctx,ev?.result||E().get(ctx.book,ctx.chapter,ctx.knowledge,ctx.learningId))}},
 state(input){const ctx=context(enrich(input)),node=E()?.get(ctx.book,ctx.chapter,ctx.knowledge,ctx.learningId)||null;return decide(ctx,node)},
 next(){return E()?.nextAction()||null},
 prerequisitePath(input,depth=3){const ctx=context(enrich(input));return R()?.path(ctx.subject,ctx.knowledge,depth)||[]},
 tutor(input,current=0){const spec=window.StudyMateKnowledgeEngine?.get(input.subject,input.knowledge);if(!spec)return null;const level=window.StudyMateTutor.nextLevel(current);return{level,message:window.StudyMateTutor.help(spec,level)}}
};
})();
