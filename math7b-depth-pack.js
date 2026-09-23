(function(){
const A=(chapter,knowledge,items)=>({chapter,knowledge,items});
window.MATH7B_DEPTH_PACK=[
A('第八章 实数','平方根与算术平方根',[
{type:'definition',title:'平方根 vs 算术平方根',task:'分别解释“9的平方根”和“√9”，指出答案数量为什么不同。'},
{type:'representation',title:'面积—边长—根号',task:'用正方形面积模型解释√2为什么表示长度而不是“2除以某个数”。'},
{type:'counterexample',title:'±号边界',task:'判断“√16=±4”错在哪里，并给出正确表达。'},
{type:'error',title:'负数开平方',task:'在实数范围解释为什么√(-4)没有意义，但∛(-8)有意义。'},
{type:'transfer',title:'测量迁移',task:'面积约20cm²的正方形边长大约多少？先估算再说明误差。'}
]),
A('第八章 实数','平方根估算',[
{type:'procedure',title:'完全平方数夹逼',task:'不用计算器判断√70位于哪两个整数之间。'},
{type:'representation',title:'数轴定位',task:'把√10定位到数轴，并解释位置依据。'},
{type:'error',title:'错误线性估计',task:'解释为什么√20不是10，也不是20÷2。'},
{type:'verification',title:'平方回检',task:'估得√50≈7.1后，用平方检查数量级是否合理。'},
{type:'transfer',title:'现实长度',task:'正方形面积53m²，给施工人员一个合理边长近似值并说明精度。'}
]),
A('第九章 平面直角坐标系','坐标与平移',[
{type:'representation',title:'图形—坐标互译',task:'根据三个点坐标画三角形，再从图中读回坐标。'},
{type:'procedure',title:'整体平移',task:'所有点横坐标+4、纵坐标−2，描述图形移动方向和距离。'},
{type:'counterexample',title:'只移动一个点',task:'解释为什么只改变一个顶点不是图形平移。'},
{type:'transfer',title:'地图定位',task:'把校园平面图建立局部坐标系，并说明原点选择不同为何不影响相对位置。'}
]),
A('第十章 二元一次方程组','消元',[
{type:'method',title:'代入还是加减',task:'比较两个方程组，分别选择更省步骤的消元法并说明理由。'},
{type:'error',title:'倍乘漏项',task:'诊断“方程两边只把含x项乘2”的错误。'},
{type:'explanation',title:'消元为什么合法',task:'说明消元不是消失未知数，而是用等价变形降低未知量数量。'},
{type:'verification',title:'回代双检',task:'解出数对后同时代回两个原方程验证。'},
{type:'transfer',title:'双约束建模',task:'用票数与总价两个约束建立方程组，并检查解的现实意义。'}
]),
A('第十一章 不等式与不等式组','乘除负数变号',[
{type:'concept',title:'方向为什么翻转',task:'用数轴比较2>1与−2<−1，解释乘−1为何改变大小方向。'},
{type:'procedure',title:'完整变形',task:'解−3x+2≥11，每一步标出使用的性质。'},
{type:'counterexample',title:'忘记翻号',task:'把错误解集代入原不等式，用具体数反证。'},
{type:'transfer',title:'安全阈值',task:'把“温度不得低于−5℃”转成不等式并在数轴表示。'}
]),
A('第十二章 数据的收集、整理与描述','抽样与图表',[
{type:'concept',title:'总体—样本',task:'为调查全校睡眠时间定义总体、个体、样本和样本容量。'},
{type:'counterexample',title:'方便抽样偏差',task:'解释只调查早到校学生为什么可能偏。'},
{type:'representation',title:'同数据不同图',task:'同一数据分别考虑条形、折线、扇形图，说明哪个最合适。'},
{type:'error',title:'误导图表',task:'识别截断纵轴造成的视觉夸大。'},
{type:'transfer',title:'校园调查',task:'设计一个可执行的小型调查，写出抽样方案、图表和结论限制。'}
]),

A('第八章 实数','立方根',[
{type:'definition',title:'立方根唯一性',task:'比较8、0、−8的立方根，解释为什么每个实数只有一个实数立方根。'},
{type:'representation',title:'体积—棱长',task:'用正方体体积模型解释∛27=3。'},
{type:'counterexample',title:'平方根规则误迁移',task:'诊断“负数没有立方根”的错误来源。'},
{type:'verification',title:'立方回检',task:'估计∛30后用立方检验范围。'},
{type:'transfer',title:'体积反求长度',task:'体积约120cm³的正方体棱长约多少？说明估算过程。'}
]),
A('第八章 实数','实数分类与数轴',[
{type:'concept',title:'有理与无理',task:'把−3、0.25、0.333…、√2、π分类并说明依据。'},
{type:'counterexample',title:'无限小数误判',task:'解释为什么无限小数不一定是无理数。'},
{type:'representation',title:'实数数轴',task:'在数轴上同时定位−√2、1.5、π并比较大小。'},
{type:'procedure',title:'绝对值与相反数',task:'对含根号的实数求相反数和绝对值。'},
{type:'transfer',title:'测量数据',task:'判断实际测量近似值与理论无理数之间的关系。'}
]),
A('第九章 平面直角坐标系','有序数对与象限',[
{type:'definition',title:'顺序不可交换',task:'比较(2,−3)与(−3,2)，解释顺序的意义。'},
{type:'representation',title:'象限与坐标轴',task:'根据点的位置写坐标，并判断哪些点不属于任何象限。'},
{type:'error',title:'横纵颠倒',task:'诊断地图定位中横纵坐标写反造成的位置错误。'},
{type:'procedure',title:'到坐标轴距离',task:'由P(a,b)解释到x轴和y轴距离为什么分别与|b|、|a|有关。'},
{type:'transfer',title:'对称定位',task:'给出一点，写出关于x轴、y轴和原点的对称点并解释变化规律。'}
]),
A('第十章 二元一次方程组','实际问题与三元系统',[
{type:'model',title:'两条独立约束',task:'从人数与金额情境中分别提取两个等量关系。'},
{type:'counterexample',title:'约束不独立',task:'解释两个等价方程为什么不能唯一确定两个未知数。'},
{type:'procedure',title:'三元逐层消元',task:'选择一个未知量先消去，把三元系统降成二元系统。'},
{type:'verification',title:'现实检验',task:'得到负人数或非整数数量时判断模型或解是否符合情境。'},
{type:'transfer',title:'混合实验',task:'根据三种材料的质量与总量约束建立三元方程组。'}
]),
A('第十一章 不等式与不等式组','解集与公共部分',[
{type:'representation',title:'空心实心端点',task:'把x>2、x≥2分别画在数轴上并解释端点差异。'},
{type:'concept',title:'解与解集',task:'解释“3是一个解”和“x>2是解集”有什么不同。'},
{type:'procedure',title:'区间求交',task:'在同一数轴表示x≥−1与x<3并得到公共部分。'},
{type:'counterexample',title:'误取并集',task:'用具体数说明为什么不等式组不能把两个解集简单合并。'},
{type:'transfer',title:'设备工作区间',task:'把两个安全条件转成不等式组并解释最终可用范围。'}
]),
A('第十二章 数据的收集、整理与描述','数据整理与统计项目',[
{type:'procedure',title:'编码与频数',task:'把一组原始调查数据编码、计数并形成频数表。'},
{type:'concept',title:'分组边界',task:'设计连续数据分组，避免重叠或遗漏边界。'},
{type:'representation',title:'表到图',task:'从频数表选择合适统计图并保持比例正确。'},
{type:'explanation',title:'结论与限制',task:'根据图表写结论，同时说明样本和测量的局限。'},
{type:'transfer',title:'完整统计项目',task:'完成问题—抽样—采集—整理—可视化—解释—反思的小项目。'}
]),
];
function byKnowledge(k){return window.MATH7B_DEPTH_PACK.filter(x=>k.includes(x.knowledge)||x.knowledge.includes(k))}
window.StudyMateMathDepth={all:window.MATH7B_DEPTH_PACK,byKnowledge};
})();
