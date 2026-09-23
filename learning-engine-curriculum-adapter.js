(function(){
function resolve(input){
 const map=window.StudyMateCurriculumLearningMap;
 if(!map) throw new Error('StudyMateCurriculumLearningMap not loaded');
 const x=typeof input==='string'?{curriculumCode:input}:input||{};
 const r=map.resolve(x);
 if(!r.curriculumCode||!r.book||!r.subject||!r.chapter||!r.knowledge) throw new Error(`Unknown or incomplete curriculum code: ${x.curriculumCode||''}`);
 const identity=window.StudyMateLearningIdentity;
 return identity?identity.resolve(r):r;
}
function orchestrator(){
 const o=window.StudyMateLearningOrchestrator;
 if(!o) throw new Error('StudyMateLearningOrchestrator not loaded');
 return o;
}
function engine(){
 const e=window.StudyMateLearningEngine;
 if(!e) throw new Error('StudyMateLearningEngine not loaded');
 return e;
}
function attempt(input){const x=resolve(input);return{context:x,...orchestrator().attempt(x)}}
function hint(input){const x=resolve(input);return{context:x,...orchestrator().hint(x)}}
function transfer(input,choice){const x=resolve(input);return{context:x,...orchestrator().transfer(x,choice)}}
function state(input){const x=resolve(input);return{context:x,...orchestrator().state(x)}}
function tutor(input,current=0){const x=resolve(input);return{context:x,tutor:orchestrator().tutor(x,current)}}
function node(code){const x=resolve(code);return engine().get(x.book,x.chapter,x.knowledge,x.learningId)}
function evidence(code){const x=resolve(code);return engine().evidence(x.book,x.chapter,x.knowledge,x.learningId)}
function bookState(book){
 const map=window.StudyMateCurriculumLearningMap;
 return map.byBook(book).map(x=>{const y=resolve(x);return{curriculumCode:y.curriculumCode,learningId:y.learningId,chapter:y.chapter,knowledge:y.knowledge,node:engine().get(y.book,y.chapter,y.knowledge,y.learningId)}});
}
function next(){
 const n=orchestrator().next();
 if(!n)return null;
 const map=window.StudyMateCurriculumLearningMap;
 const m=map.all().find(x=>x.book===n.book&&x.chapter===n.chapter&&x.knowledge===n.knowledge)||null;
 return{...n,curriculumCode:m?.curriculumCode||null};
}
window.StudyMateCurriculumLearning={resolve,attempt,hint,transfer,state,tutor,node,evidence,bookState,next};
})();
