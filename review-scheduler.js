(function(){
const DAY=86400000,STEPS=[1,3,7,14,30];
function history(n){return{streak:n.reviewStreak||0,failures:n.reviewFailures||0,lastResult:n.lastReviewResult||null}}
function interval(n,passed){
 const h=history(n);
 if(!passed)return Math.max(1,STEPS[Math.max(0,Math.min(h.streak-1,STEPS.length-1))]||1);
 return STEPS[Math.min(h.streak,STEPS.length-1)];
}
function schedule(n,passed,now=Date.now()){
 const days=interval(n,passed);
 return{days,dueAt:now+days*DAY,reason:passed?'复测通过，扩大间隔':'复测失败，缩短到较短间隔'};
}
function classifyFailure(n){
 const d=window.StudyMateLearningEngine?.diagnose(n)||{};
 if(d.prerequisite&&n.mastery<55)return{type:'prerequisite-instability',label:'前置知识仍不稳定',target:d.prerequisite};
 if((n.independentCorrect||0)>0&&(n.transferCorrect||0)>0)return{type:'forgetting',label:'更像遗忘',target:n.knowledge};
 return{type:'incomplete-mastery',label:'原本就没有形成稳定掌握',target:d.prerequisite||n.knowledge};
}
function apply(n,passed,now=Date.now()){
 if(passed){n.reviewStreak=(n.reviewStreak||0)+1;n.lastReviewResult='pass'}else{n.reviewFailures=(n.reviewFailures||0)+1;n.reviewStreak=Math.max(0,(n.reviewStreak||0)-1);n.lastReviewResult='fail'}
 n.lastReviewAt=now;const s=schedule(n,passed,now);n.nextReview=s.dueAt;n.reviewIntervalDays=s.days;return{schedule:s,failure:passed?null:classifyFailure(n)};
}
window.StudyMateReviewScheduler={STEPS,history,interval,schedule,classifyFailure,apply};
})();
