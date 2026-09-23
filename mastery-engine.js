(function(){
const V=[
['数学',/算术平方根/,'如果正方形面积是25，边长是多少？',['5','±5','−5'],0,'算术平方根只取非负值。','平方根的意义'],
['数学',/平方根估算/,'不计算精确值，√50位于哪两个整数之间？',['7和8','5和6','25和26'],0,'49<50<64，所以7<√50<8。','完全平方数'],
['数学',/代入消元/,'已知y=x+2，代入2x+y=8后得到？',['3x+2=8','2x+x=8','y+y=8'],0,'用x+2整体替换y。','等式与代入'],
['数学',/公共解集/,'x≥−1且x<3，解集是？',['−1≤x<3','x≥−1或x<3','x<−1'],0,'同时满足两个条件，所以取交集。','不等式解集'],
['物理',/频率|音调/,'甲音叉每秒振动500次，乙每秒250次，通常谁音调高？',['甲','乙','一样'],0,'频率更高的甲音调通常更高。','振动与频率'],
['物理',/平均速度|速度/,'汽车150m行驶10s，平均速度为？',['15m/s','1500m/s','0.067m/s'],0,'v=s/t=150/10。','路程和时间'],
['物理',/压强/,'压力不变，受力面积变为原来的1/3，压强怎样？',['变为3倍','变为1/3','不变'],0,'p=F/S，面积减小到1/3，压强增至3倍。','压力与受力面积'],
['物理',/机械效率/,'某机械总功100J，有用功80J，效率为？',['80%','125%','20%'],0,'η=80/100=80%。','有用功与总功'],
['英语',/^Listening/,'听一段新的校园广播，第一遍最应该完成什么？',['判断主题和主要信息','写下每个单词','暂停查所有生词'],0,'迁移到新材料仍先抓整体意义。','听力主旨'],
['英语',/^Grammar/,'学会一条语法规则后，哪项最能验证迁移？',['在新情境自己造句','再背一遍规则','抄教材例句'],0,'独立生成新句才是迁移。','语法输出'],
['英语',/^Reading/,'面对一篇新短文，判断作者观点最可靠的方法？',['找主题句和文本证据','凭常识猜','选最长选项'],0,'新文本中仍要依据文本证据。','阅读证据'],
['英语',/^Writing/,'换一个新主题写短文，第一步最合理的是？',['确定目的和要点结构','直接堆高级词','复制旧范文'],0,'结构策略应能迁移到新主题。','写作规划']
];
const P=[
['数学',/平方根|实数/,'完全平方数与平方运算'],
['数学',/二元一次方程|消元/,'一元一次方程与等式性质'],
['数学',/不等式/,'有理数正负与数轴'],
['数学',/统计/,'数据分类与百分比'],
['物理',/速度|运动/,'长度、时间与单位换算'],
['物理',/密度/,'质量、体积与比例'],
['物理',/压强/,'力与面积'],
['物理',/浮力/,'重力、密度与受力分析'],
['物理',/功|机械/,'力、距离与比例'],
['英语',/Grammar|Writing/,'核心句型与词序'],
['英语',/Listening|Speaking/,'核心词汇与语音辨识'],
['英语',/Reading/,'词汇与句子理解']
];
function variant(subject,k){const x=V.find(v=>v[0]===subject&&v[1].test(k));return x?{q:x[2],options:x[3],answer:x[4],explain:x[5],prerequisite:x[6]}:null}
function prerequisite(subject,k){return P.find(v=>v[0]===subject&&v[1].test(k))?.[2]||null}
window.StudyMateMasteryEngine={
variant,
prerequisite,
evaluate(ctx,choice){const v=variant(ctx.subject,ctx.knowledge);if(!v)return null;const ok=choice===v.answer;const result=window.StudyMateLearningEngine.record({...ctx,correct:ok,error:ok?'':'迁移验证失败',helpLevel:0,mode:'transfer',stage:'transfer',scene:ctx.scene||'practice',activityTag:ctx.activityTag||'mastery-transfer',sourceKnowledge:ctx.sourceKnowledge||ctx.knowledge||null,sourceId:ctx.sourceId||null});return{ok,result,explain:v.explain,prerequisite:ok?null:(v.prerequisite||prerequisite(ctx.subject,ctx.knowledge))}},
recommend(ctx){const n=window.StudyMateLearningEngine.get(ctx.book,ctx.chapter,ctx.knowledge,ctx.learningId||null);if(!n)return{mode:'learn'};if(n.mastery<55)return{mode:'repair',prerequisite:prerequisite(ctx.subject,ctx.knowledge)};if(!n.independentCorrect)return{mode:'independent-check'};if(!n.transferCorrect)return{mode:'transfer',variant:variant(ctx.subject,ctx.knowledge)};if(n.lastReviewResult==='fail'){const failure=window.StudyMateReviewScheduler?.classifyFailure(n)||null;return{mode:'review',reason:'retention-failed',days:Math.max(1,n.reviewIntervalDays||1),target:failure?.target||n.knowledge,failure}}if(n.mastery<90)return{mode:'stabilize'};return{mode:'spaced-review',days:7}}
};
})();

