(function(){
const R=(subject,from,type,to,why)=>({subject,from,type,to,why});
window.STUDYMATE_RELATIONS=[
R('数学','算术平方根','prerequisite','平方根的意义','先区分“一个非负值”和“两个平方根”'),
R('数学','平方根估算','prerequisite','完全平方数与平方运算','估算依赖相邻完全平方数'),
R('数学','无理数的发现','prerequisite','有理数','必须先知道整数比和有限/循环小数'),
R('数学','实数与数轴','prerequisite','数轴与有理数','先理解数与位置的一一对应'),
R('数学','坐标与平移','prerequisite','有序数对','平移后的点仍靠坐标描述'),
R('数学','代入消元','prerequisite','一元一次方程与等式性质','代入后最终转化为一元方程'),
R('数学','加减消元','prerequisite','等式性质','倍乘和相加减必须保持等式成立'),
R('数学','实际问题','prerequisite','数量关系与方程','先把语言关系翻译成方程'),
R('数学','一元一次不等式','prerequisite','一元一次方程','解法结构相似但要处理不等号方向'),
R('数学','乘除负数变号','prerequisite','有理数正负','必须理解负数乘除对大小关系的影响'),
R('数学','不等式组','prerequisite','不等式解集','不等式组取多个条件的公共部分'),
R('数学','统计图','prerequisite','数据整理','没有整理的数据无法正确可视化'),
R('数学','抽样偏差','related','总体与样本','样本代表性决定能否推断总体'),
R('数学','平面直角坐标系','transfer','地理地图网格','二维定位思想可以迁移到地图'),
R('数学','统计图','transfer','物理实验图像','数据可视化用于发现实验规律'),

R('物理','平均速度','prerequisite','长度、时间与单位换算','速度由路程和时间定义'),
R('物理','速度图像','prerequisite','速度','图像是运动量之间关系的表示'),
R('物理','音调与频率','prerequisite','振动与声源','频率描述振动快慢'),
R('物理','响度与振幅','prerequisite','振动与声源','振幅描述振动幅度'),
R('物理','熔化凝固','prerequisite','温度与温标','物态变化实验需要正确读温度'),
R('物理','反射定律','prerequisite','光的直线传播','光线模型是反射作图基础'),
R('物理','平面镜成像','prerequisite','反射定律','平面镜成像由反射光线形成'),
R('物理','凸透镜成像规律','prerequisite','主光轴焦点焦距','必须先理解f和2f位置'),
R('物理','近视远视','prerequisite','眼睛成像','矫正建立在眼球成像位置上'),
R('物理','密度','prerequisite','质量与体积','密度是质量与体积的比'),
R('物理','二力平衡','prerequisite','力的三要素','平衡判断依赖力的大小方向作用线'),
R('物理','摩擦力','prerequisite','弹力与压力','滑动摩擦实验需要识别压力'),
R('物理','压强','prerequisite','压力与面积','压强同时依赖压力和受力面积'),
R('物理','液体压强','prerequisite','压强','液体压强是压强概念的具体应用'),
R('物理','浮力','prerequisite','受力分析','先识别重力、拉力与浮力'),
R('物理','阿基米德原理','prerequisite','浮力与密度','F浮与排液体积、液体密度相关'),
R('物理','功率','prerequisite','功','功率描述做功快慢'),
R('物理','机械效率','prerequisite','有用功总功','效率是有用功与总功之比'),
R('物理','杠杆平衡','prerequisite','力与力臂','力矩关系依赖正确力臂'),
R('物理','速度图像','transfer','数学图像','用坐标图表示变量关系'),
R('物理','实验数据','transfer','数学统计','实验结论依赖数据整理与图表'),

R('英语','Listening','prerequisite','核心词汇与语音辨识','听不出声音或不懂关键词会阻断意义'),
R('英语','Speaking','prerequisite','核心词汇与句型','输出需要可调用的词汇和句型'),
R('英语','Reading','prerequisite','词汇与句子理解','阅读主旨建立在句子理解之上'),
R('英语','Writing','prerequisite','核心句型与词序','写作输出需要稳定句法骨架'),
R('英语','AI Conversation','prerequisite','Speaking','AI对话要求学生即时自主表达'),
R('英语','Project','prerequisite','听说读写综合能力','项目要求多种语言能力协同'),
R('英语','Mastery Check','prerequisite','独立输出','检测阶段要减少提示验证真实掌握'),
R('英语','Weather report','transfer','物理温度与地理气候','真实天气表达连接科学数据'),
R('英语','data report','transfer','数学统计图','英语用于描述数据趋势和比较')
];
const match=(a,b)=>a===b||a.includes(b)||b.includes(a);
window.StudyMateRelations={
find(subject,k,type){return window.STUDYMATE_RELATIONS.filter(r=>r.subject===subject&&match(k,r.from)&&(!type||r.type===type))},
prerequisites(subject,k){return this.find(subject,k,'prerequisite')},
related(subject,k){return this.find(subject,k,'related')},
transfers(subject,k){return this.find(subject,k,'transfer')},
path(subject,k,depth=3){const seen=new Set(),out=[];let frontier=[k];for(let d=0;d<depth&&frontier.length;d++){const next=[];frontier.forEach(x=>this.prerequisites(subject,x).forEach(r=>{if(!seen.has(r.to)){seen.add(r.to);out.push({...r,depth:d+1});next.push(r.to)}}));frontier=next}return out}
};
})();
