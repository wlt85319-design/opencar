(function(){
const REL=[
['平方根估算','完全平方数与平方运算'],['算术平方根','平方根的意义'],['实数与数轴','数轴与有理数'],
['代入消元','一元一次方程与等式性质'],['加减消元','一元一次方程与等式性质'],['公共解集','不等式解集'],
['平均速度','长度、时间与单位换算'],['密度','质量、体积与比例'],['压强','力与面积'],['浮力','重力、密度与受力分析'],['机械效率','功与能量'],
['Grammar','核心句型与词序'],['Writing','核心句型与词序'],['Listening','核心词汇与语音辨识'],['Speaking','核心词汇与语音辨识'],['Reading','词汇与句子理解']
];
function prereq(subject,k){const r=window.StudyMateRelations?.prerequisites(subject,k)?.[0];if(r)return r.to;const x=REL.find(r=>k.includes(r[0]));return x&&x[1]}
function reason(n){const e=Object.entries(n.errors||{}).sort((a,b)=>b[1]-a[1])[0];return e?e[0]:(n.mastery<55?'掌握不稳定':'需要复测')}
function model(){const g=window.StudyMateLearningEngine?.graph()||{},nodes=Object.values(g).sort((a,b)=>a.mastery-b.mastery),weak=nodes.filter(n=>n.mastery<75).slice(0,8);return weak.map(n=>{const ev=window.StudyMateEvidenceModel?.evaluate(n);return{knowledge:n.knowledge,subject:n.subject,mastery:n.mastery,status:n.status,evidence:ev?.level?.label||'',nextGate:window.StudyMateEvidenceModel?.nextGate(n)||'',reason:reason(n),prerequisite:prereq(n.subject,n.knowledge)||window.StudyMateMasteryEngine?.prerequisite(n.subject,n.knowledge)||null,book:n.book,chapter:n.chapter}})}
function render(){const host=document.getElementById('learningGraph');if(!host)return;const xs=model();if(!xs.length){host.innerHTML='<div class="graph-empty"><b>学习图谱正在建立</b><p>完成几次独立练习后，这里会显示知识漏洞、前置关系和最短修复路径。</p></div>';return}host.innerHTML=xs.map((x,i)=>'<article class="graph-row"><div class="graph-node '+x.status+'"><small>'+x.subject+'</small><b>'+x.knowledge+'</b><span>'+x.evidence+' · 下一关：'+x.nextGate+'</span></div><div class="graph-link"><i>←</i><span>'+ (x.prerequisite?'建议先修复':'主要问题') +'</span></div><div class="graph-node prerequisite"><small>'+(x.prerequisite?'前置知识':'诊断')+'</small><b>'+(x.prerequisite||x.reason)+'</b><span>'+(x.prerequisite?'修复后再验证':x.reason)+'</span></div><button data-i="'+i+'">去修复</button></article>').join('');host.querySelectorAll('button').forEach(b=>b.onclick=function(){const x=xs[+b.dataset.i];location.href='./subject-course.html?book='+encodeURIComponent(x.book)+'&unit=0&focus='+encodeURIComponent(x.prerequisite||x.knowledge)})}
window.StudyMateGraph={model,render};document.addEventListener('DOMContentLoaded',render);
})();
