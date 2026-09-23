(function(){
const actions=document.getElementById('actions');
if(!actions||typeof verifiedLesson!=='function')return;
const defaultActionHandler=actions.onclick;
actions.onclick=event=>{
  const verified=verifiedLesson(),button=event.target.closest('button');
  if(!verified){defaultActionHandler?.(event);return}
  if(!button)return;
  [...actions.querySelectorAll('button')].forEach(x=>x.classList.remove('correct','wrong'));
  const choice=+button.dataset.choice,current=verified.stages[stage],mission=crossMission();
  const answer=stage===6?0:current.answer;
  if(answer===undefined)return;
  const ok=choice===answer;
  button.classList.add(ok?'correct':'wrong');
  const feedback=document.getElementById('feedback');
  feedback.textContent=stage===6?(ok?mission.success:'还没有完成两个学科的共同任务。先按顺序读取数据、判断条件，再输出结果。'):(ok?current.correct:current.wrong);
  feedback.hidden=false;
  window.StudyMateLearningOrchestrator?.attempt(learningContext({correct:ok,error:ok?'':current.wrong,helpLevel:tutorLevel,mode:'practice',stage:evidenceStage()}));
};
})();
