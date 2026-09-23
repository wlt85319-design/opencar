(function(){
const DAY=86400000;
function dueNode(n,now=Date.now()){return !!(n&&n.nextReview&&n.nextReview<=now&&n.independentCorrect>0)}
function queue(limit=10){const g=window.StudyMateLearningEngine?.graph()||{};return Object.values(g).filter(n=>dueNode(n)).sort((a,b)=>a.nextReview-b.nextReview).slice(0,limit).map(n=>({...n,evidence:window.StudyMateEvidenceModel?.evaluate(n),reason:n.reviewPassed?'保持检测':'首次延迟复测'}))}
function schedule(n){if(!n)return null;const base=n.transferCorrect?3:n.independentCorrect?1:0;return{dueAt:Date.now()+base*DAY,days:base}}
function record(ctx,correct){window.StudyMateDataModel?.review({...ctx,passed:correct,previousMastery:window.StudyMateLearningEngine?.get(ctx.book,ctx.chapter,ctx.knowledge)?.mastery});const node=window.StudyMateLearningEngine?.record({...ctx,correct,error:correct?'':'延迟复测失败',helpLevel:0,mode:'review',stage:'retention'});return{node,evidence:window.StudyMateEvidenceModel?.evaluate(node),next:window.StudyMateLearningEngine?.nextAction()}}
window.StudyMateReviewEngine={queue,schedule,record,dueNode};
})();
