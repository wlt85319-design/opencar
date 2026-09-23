(function(){
const BOOK_BY_ID={
 math7a:'数学七上',math7b:'数学七下',
 phy8a:'物理八上',phy8b:'物理八下',
 eng7a:'英语七上',eng7b:'英语七下'
};
const clean=x=>String(x||'').toLowerCase().replace(/[\s·—–\-_:：，。、“”‘’（）()!?！？]/g,'');
function canonicalBook(book){return BOOK_BY_ID[book]||book||''}
function hash(text){
 let h=2166136261;
 for(const c of String(text||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}
 return (h>>>0).toString(36);
}
function scoreCandidate(c,input){
 const chapter=clean(input.chapter),section=clean(input.sectionTitle),knowledge=clean(input.knowledge);
 const cc=clean(c.chapter),ct=clean(c.knowledge);
 let s=0;
 if(chapter&&cc&&(chapter===cc||chapter.includes(cc)||cc.includes(chapter)))s+=60;
 if(chapter&&ct&&(chapter.includes(ct)||ct.includes(chapter)))s+=35;
 if(section&&ct&&(section===ct||section.includes(ct)||ct.includes(section)))s+=100;
 if(knowledge&&ct&&(knowledge===ct||knowledge.includes(ct)||ct.includes(knowledge)))s+=80;
 const tail=(c.curriculumCode||'').match(/(\d+(?:\.\d+)*)$/)?.[1];
 if(tail&&section.startsWith(clean(tail)))s+=90;
 return s;
}
function parent(input={}){
 const map=window.StudyMateCurriculumLearningMap;
 if(!map)return null;
 if(input.curriculumCode)return map.get(input.curriculumCode);
 const book=canonicalBook(input.book||input.uiBookId);
 const xs=map.byBook(book);
 if(!xs.length)return null;
 const ranked=xs.map(x=>({x,s:scoreCandidate(x,input)})).sort((a,b)=>b.s-a.s);
 return ranked[0]?.s>0?ranked[0].x:null;
}
function resolve(input={}){
 const p=parent(input);
 if(!p)return{...input,curriculumBook:canonicalBook(input.book||input.uiBookId)||null,curriculumCode:null,learningId:null,parentKnowledge:null};
 const knowledge=input.knowledge||p.knowledge;
 const root=clean(knowledge)===clean(p.knowledge);
 const learningId=root?`${p.curriculumCode}::root`:`${p.curriculumCode}::k:${hash(knowledge)}`;
 return{
  ...input,
  curriculumBook:p.book,
  curriculumCode:p.curriculumCode,
  parentKnowledge:p.knowledge,
  learningId,
  curriculumKind:p.kind,
  curriculumPage:p.page
 };
}
function auditUIContexts(contexts=[]){
 const rows=contexts.map(resolve);
 return{
  total:rows.length,
  resolved:rows.filter(x=>x.curriculumCode&&x.learningId).length,
  unresolved:rows.filter(x=>!x.curriculumCode),
  duplicateLearningIds:rows.filter((x,i)=>x.learningId&&rows.findIndex(y=>y.learningId===x.learningId)!==i)
 };
}
window.StudyMateLearningIdentity={BOOK_BY_ID,canonicalBook,parent,resolve,auditUIContexts,hash};
})();
