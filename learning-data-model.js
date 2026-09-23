(function(){
const VERSION=1,EVENT_KEY='studymate_events_v1',PROFILE_KEY='studymate_profile_v1';
const uid=()=>localStorage.getItem('studymate_student_id')||(()=>{const x='stu_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);localStorage.setItem('studymate_student_id',x);return x})();
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch(e){return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
function event(type,payload={}){const xs=read(EVENT_KEY,[]),e={schemaVersion:VERSION,eventId:'evt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,7),studentId:uid(),type,occurredAt:new Date().toISOString(),...payload};xs.push(e);write(EVENT_KEY,xs.slice(-2000));return e}
function profile(){return read(PROFILE_KEY,{schemaVersion:VERSION,studentId:uid(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()})}
function updateProfile(patch){const p={...profile(),...patch,studentId:uid(),schemaVersion:VERSION,updatedAt:new Date().toISOString()};write(PROFILE_KEY,p);return p}
function knowledgeRef(x){return{subject:x.subject,bookId:x.book||x.bookId,chapter:x.chapter,knowledge:x.knowledge,curriculumCode:x.curriculumCode||null,learningId:x.learningId||null,parentKnowledge:x.parentKnowledge||null,uiBookId:x.uiBookId||null}}
function attempt(x){return event('learning.attempt',{knowledge:knowledgeRef(x),mode:x.mode||'practice',correct:!!x.correct,errorType:x.error||null,helpLevel:x.helpLevel||0,hintUsed:!!x.hint,response:x.response??null,durationMs:x.durationMs??null})}
function hint(x){return event('tutor.help',{knowledge:knowledgeRef(x),helpLevel:x.level||1})}
function mastery(x){return event('mastery.evidence',{knowledge:knowledgeRef(x),evidenceType:x.evidenceType,passed:!!x.passed,score:x.score??null})}
function relation(x){return event('graph.relation_used',{knowledge:knowledgeRef(x),relationType:x.relationType,to:x.to,why:x.why||''})}
function review(x){return event('review.result',{knowledge:knowledgeRef(x),passed:!!x.passed,previousMastery:x.previousMastery??null})}
function exportData(){return{schemaVersion:VERSION,student:profile(),events:read(EVENT_KEY,[]),learningGraph:window.StudyMateLearningEngine?.graph()||{},exportedAt:new Date().toISOString()}}
window.StudyMateDataModel={VERSION,studentId:uid(),profile,updateProfile,event,attempt,hint,mastery,relation,review,export:exportData,events:()=>read(EVENT_KEY,[])};
})();
