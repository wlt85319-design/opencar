(function(){
const LEVELS=[
 {id:'seen',rank:0,label:'接触过',desc:'已经进入过这个知识点，但还没有形成有效掌握证据。'},
 {id:'understood',rank:1,label:'理解',desc:'能识别概念、条件或母规则。'},
 {id:'assisted',rank:2,label:'有帮助能做',desc:'在 AI 提示或引导下能够完成。'},
 {id:'independent',rank:3,label:'独立能做',desc:'Level 0 下能独立完成新题。'},
 {id:'transfer',rank:4,label:'能够迁移',desc:'换情境、换表述或换结构后仍能独立完成。'},
 {id:'retained',rank:5,label:'延迟后仍会',desc:'经过时间间隔后复测仍然保持。'}
];
function evidence(n){
 if(!n)return{level:LEVELS[0],reasons:['暂无有效学习证据'],checks:{}};
 const dimensions=window.StudyMateEvidenceDimensions,proof=dimensions?.proof(n.subject,n.evidenceDimensions),gaps=dimensions?.gaps(n.subject,n.evidenceDimensions)||[];
 const checks={
  seen:(n.attempts||0)>0,
  understood:(n.correct||0)>0||(n.attempts||0)>=2,
  assisted:(n.correct||0)>0&&(n.maxHelpLevel||0)>0,
  independent:(n.independentCorrect||0)>0,
  transfer:(n.transferCorrect||0)>0,
  retained:(n.reviewPassed||0)>0&&n.lastReviewResult!=='fail'
 };
 let rank=checks.seen?0:0;
 if(checks.understood&&(proof?.ready!==false))rank=1;
 if(checks.assisted)rank=Math.max(rank,2);
 if(checks.independent)rank=3;
 if(checks.independent&&checks.transfer&&(proof?.ready!==false))rank=4;
 if(checks.independent&&checks.transfer&&checks.retained)rank=5;
 const reasons=[];
 if(checks.independent)reasons.push('已有 Level 0 独立正确证据');else if(checks.assisted)reasons.push('目前正确表现仍依赖 AI 帮助');else reasons.push('尚缺独立正确证据');
 if(checks.transfer)reasons.push('迁移验证已通过');else if(rank>=3)reasons.push('还需要迁移验证');
 if(checks.retained)reasons.push('最近一次延迟复测保持通过');else if(n.lastReviewResult==='fail')reasons.push('最近一次延迟复测未通过，需要重新巩固后复测');else if(rank>=4)reasons.push('还需要延迟复测');
 if(gaps.length)reasons.push('证据缺口：'+gaps.slice(0,2).map(x=>x.label).join('、'));return{level:LEVELS[rank],reasons,checks,dimensions:n.evidenceDimensions||null,gaps,proof};
}
function nextGate(n){const e=evidence(n);if(e.level.rank<1)return'理解概念';if(e.level.rank<3)return'Level 0 独立验证';if(e.level.rank<4)return'迁移验证';if(e.level.rank<5)return'延迟复测';return'保持并扩大迁移范围'}
window.StudyMateEvidenceModel={LEVELS,evaluate:evidence,nextGate};
})();
