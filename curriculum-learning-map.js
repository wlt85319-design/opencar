(function(){
const subjectOf=book=>book.startsWith('数学')?'数学':book.startsWith('物理')?'物理':book.startsWith('英语')?'英语':'未知';
const ENGLISH_BLUEPRINT_CODE={
 'E7A-S1':'7A|Starter 1 Hello!','E7A-S2':'7A|Starter 2 Keep Tidy!','E7A-S3':'7A|Starter 3 Welcome!',
 'E7A-1':'7A|Unit 1 You and Me','E7A-2':'7A|Unit 2 We’re Family!','E7A-3':'7A|Unit 3 My School','E7A-4':'7A|Unit 4 My Favourite Subject','E7A-5':'7A|Unit 5 Fun Clubs','E7A-6':'7A|Unit 6 A Day in the Life','E7A-7':'7A|Unit 7 Happy Birthday!',
 'E7B-1':'7B|Unit 1 Animal Friends','E7B-2':'7B|Unit 2 No Rules, No Order','E7B-3':'7B|Unit 3 Keep Fit','E7B-4':'7B|Unit 4 Eat Well','E7B-5':'7B|Unit 5 Here and Now','E7B-6':'7B|Unit 6 Rain or Shine','E7B-7':'7B|Unit 7 A Day to Remember','E7B-8':'7B|Unit 8 Once upon a Time'
};
function blueprint(code){
 const key=ENGLISH_BLUEPRINT_CODE[code]; if(!key)return null;
 return (window.ENGLISH_UNIT_BLUEPRINTS||[]).find(u=>`${u.book}|${u.unit}`===key)||null;
}
function build(){
 const manifest=window.StudyMatePEPTextbookManifest?.all||[];
 return manifest.map(x=>{
  const b=blueprint(x.code);
  return{
   curriculumCode:x.code,book:x.book,subject:subjectOf(x.book),chapter:x.chapter,knowledge:x.title,kind:x.kind,page:x.page,
   bigQuestion:b?.bigQuestion||null,language:b?.language||null,pronunciation:b?.pronunciation||null,skills:b?.skills||null,project:b?.project||null,
   stableKey:`${x.book}::${x.chapter}::${x.title}`
  };
 });
}
function all(){return build()}
function get(code){return build().find(x=>x.curriculumCode===code)||null}
function byBook(book){return build().filter(x=>x.book===book)}
function resolve(input={}){
 if(input.curriculumCode){const m=get(input.curriculumCode);if(m)return{...m,...input,book:m.book,subject:m.subject,chapter:m.chapter,knowledge:m.knowledge};}
 return input;
}
function auditFrozenBooks(){
 const books=['数学七上','数学七下','物理八上','物理八下','英语七上','英语七下'];
 return books.map(book=>{const xs=byBook(book),codes=xs.map(x=>x.curriculumCode);return{book,total:xs.length,uniqueCodes:new Set(codes).size,uniqueStableKeys:new Set(xs.map(x=>x.stableKey)).size,complete:xs.length>0&&new Set(codes).size===xs.length&&xs.every(x=>x.subject!=='未知'&&x.chapter&&x.knowledge)}});
}
window.StudyMateCurriculumLearningMap={all,get,byBook,resolve,auditFrozenBooks};
})();
