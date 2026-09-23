(function(){
const R={};
const map=(id,asset,note,status='mapped')=>R[id]={status,asset,note};
const partial=(id,asset,note)=>map(id,asset,note,'partial');
const missing=(id,note)=>map(id,null,note,'missing');
const unverified=(id,asset,note)=>map(id,asset,note,'unverified');

// 数学七上：保留原剧情/UI资产；教材主线和专栏按2024人教版原书逐项映射。
['M7A-1.1','M7A-1.2'].forEach(id=>map(id,'chapter1.js','第一章现有“零点失踪案”课程主线对应教材1.1—1.2。'));
map('M7A-1.R1','chapter1.js','已核实存在“允许偏差质检”完整课程。');
map('M7A-1.H1','math7a-textbook-columns-depth-pack.js','已依据教材“漫漫长路识负数”补齐多文明负数史与九维证据链。');
map('M7A-1.A','math7a-textbook-columns-depth-pack.js','原chapter1.js已覆盖标准体重与猜数活动；新增深度包显式建立教材映射和九维证据链。');
['M7A-2.1','M7A-2.R1','M7A-2.2','M7A-2.E1','M7A-2.3','M7A-2.A','M7A-2.P'].forEach(id=>map(id,'chapter2-full-data.js','已核实第二章完整数据包含对应教材主线、阅读/探究/活动/综合实践。'));
['M7A-3.1','M7A-3.R1','M7A-3.2','M7A-3.A','M7A-4.1','M7A-4.2','M7A-4.IT','M7A-4.A','M7A-5.1','M7A-5.2','M7A-5.3','M7A-6.1','M7A-6.2','M7A-6.3'].forEach(id=>map(id,'chapters-full-data.js','原3—6章完整课程数据明确按教材章节开发。'));
['M7A-5.E1','M7A-5.R1','M7A-5.A','M7A-6.H1','M7A-6.R1','M7A-6.R2','M7A-6.A','M7A-6.P'].forEach(id=>map(id,'math7a-textbook-columns-depth-pack.js','已逐项对照教材原文核验，并在不删除原章节资产的前提下补齐九维深度证据链。'));

// 数学七下：第七章与教材专栏/数学活动已有显式深度资产；8—12章主节均已按教材原文与章节总结补足九维深度链。
['M7B-7.O1','M7B-7.E1','M7B-8.R1','M7B-9.R1','M7B-10.H1','M7B-10.R1','M7B-11.R1','M7B-11.P','M7B-12.E1','M7B-12.IT','M7B-12.P'].forEach(id=>map(id,'textbook-gap-content.js','已按教材缺口补入显式任务。'));
['M7B-7.1','M7B-7.2','M7B-7.3','M7B-7.4','M7B-7.A'].forEach(id=>map(id,'math7b-ch7-depth-pack.js','已按教材第七章原文补齐完整深度任务链。'));
['M7B-8.1','M7B-8.2','M7B-8.3','M7B-9.1','M7B-9.2'].forEach(id=>map(id,'math7b-main-sections-completion-pack.js','已逐页核对教材第八、九章主节，补齐数学九维深度证据链。'));
['M7B-10.1','M7B-10.2','M7B-10.3','M7B-10.4'].forEach(id=>map(id,'math7b-ch10-completion-pack.js','已逐页核对教材第十章主节，补齐概念、消元、建模、三元系统的数学九维深度证据链。'));
['M7B-11.1','M7B-11.2','M7B-11.3'].forEach(id=>map(id,'math7b-ch11-completion-pack.js','已逐页核对教材第十一章主节，补齐不等式性质、解集、实际建模和不等式组交集的数学九维深度证据链。'));
['M7B-12.1','M7B-12.2'].forEach(id=>map(id,'math7b-ch12-completion-pack.js','已依据教材统计调查、抽样代表性、统计图选择、连续分组与信息技术内容补齐数学九维深度证据链。'));
['M7B-8.A','M7B-9.A','M7B-10.A','M7B-11.A','M7B-12.H1','M7B-12.A'].forEach(id=>map(id,'math7b-textbook-activity-pack.js','已逐页核对教材数学活动/数学史原文，并补齐数学九维深度证据链。'));

// 物理八上：按教材逐节核验；教材开篇与已确认缺口均有显式学习资产。
map('P8A-0','physics8a-science-journey-pack.js','已按教材“有趣的物理—有用的物理—怎样学好物理”建立观察、推理、探究和实践完整证据链。');
map('P8A-1.1','physics8a-depth-pack.js','长度与时间测量深度包。');
map('P8A-1.2','textbook-gap-content.js','运动的描述已补。');
map('P8A-1.3','physics8a-depth-pack.js','速度与平均速度深度包。');
map('P8A-1.4','physics8a-textbook-completion-pack.js','按教材斜面小车测速实验、分段平均速度与传感器拓展补齐完整证据链。');
map('P8A-2.1','physics8a-depth-pack.js','声音产生与传播深度包。');
map('P8A-2.2','physics8a-depth-pack.js','声音特性深度包。');
['P8A-2.3','P8A-2.4','P8A-2.5'].forEach(id=>map(id,'textbook-gap-content.js','已按教材缺口补齐。'));
['P8A-3.1','P8A-3.2','P8A-3.3'].forEach(id=>map(id,'physics8a-depth-pack.js','温度与物态变化综合深度包。'));
map('P8A-3.4','physics8a-textbook-completion-pack.js','按教材碘实验、生活实例与升华/凝华定义补齐完整证据链。');
map('P8A-3.5','physics8a-textbook-completion-pack.js','按教材“观察—分析—提出改进—实施—评估”厨房实践链补齐。');
['P8A-4.1','P8A-4.2'].forEach(id=>map(id,'physics8a-depth-pack.js','光传播/反射综合深度包。'));
map('P8A-4.3','physics8a-depth-pack.js','平面镜成像深度包。');
['P8A-4.4','P8A-4.5'].forEach(id=>map(id,'textbook-gap-content.js','已按教材缺口补齐。'));
map('P8A-5.1','physics8a-depth-pack.js','凸透镜深度包包含透镜基本概念。');
map('P8A-5.2','textbook-gap-content.js','生活中的透镜已补。');
map('P8A-5.3','physics8a-depth-pack.js','凸透镜成像规律深度包。');
['P8A-5.4','P8A-5.5'].forEach(id=>map(id,'textbook-gap-content.js','已按教材缺口补齐。'));
['P8A-6.1','P8A-6.2','P8A-6.3'].forEach(id=>map(id,'physics8a-depth-pack.js','质量、密度与测量综合深度包。'));
map('P8A-6.4','textbook-gap-content.js','密度的应用已补。');

// 物理八下。
['P8B-7.1','P8B-7.2','P8B-7.3','P8B-8.1','P8B-8.2','P8B-8.3','P8B-9.1','P8B-9.2','P8B-9.3','P8B-10.1','P8B-10.2','P8B-11.1','P8B-11.2','P8B-12.1','P8B-12.3','P8B-12.4'].forEach(id=>map(id,'physics8b-depth-pack.js','已有对应核心深度内容。'));
['P8B-8.4','P8B-9.4','P8B-9.5','P8B-10.3','P8B-10.4','P8B-11.3','P8B-11.4','P8B-12.2'].forEach(id=>map(id,'textbook-gap-content.js','已按教材缺口补齐。'));

// 英语七上下：unit blueprint 以教材目录的 Section A/B、Pronunciation、Grammar、Project 为单位展开。
['E7A-S1','E7A-S2','E7A-S3','E7A-1','E7A-2','E7A-3','E7A-4','E7A-5','E7A-6','E7A-7','E7B-1','E7B-2','E7B-3','E7B-4','E7B-5','E7B-6','E7B-7','E7B-8'].forEach(id=>map(id,'english-unit-blueprints.js','已建立教材单元蓝图；深度是否冻结由英语内容审计另行判断。'));

function get(id){return R[id]||{status:'unmapped',asset:null,note:'尚未建立映射记录。'}}
function stats(manifest){const xs=(manifest||[]).map(x=>({...x,...get(x.code)}));return xs.reduce((a,x)=>{a[x.status]=(a[x.status]||0)+1;return a},{})}
window.StudyMateCurriculumMappingRegistry={all:R,get,stats};
})();
