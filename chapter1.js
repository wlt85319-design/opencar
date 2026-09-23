const PHASES=['发现异常','动手实验','形成规律','独立训练','错因诊断','迁移应用','综合验证'];
const q=(tag,text,options,answer,hint,explain,error)=>({type:'quiz',tag,q:text,options,answer,hint,explain,error});
const story=(tag,text,copy,hint='先弄清任务中什么发生了变化。')=>({type:'story',tag,q:text,copy,hint});
const info=(tag,text,copy)=>({type:'info',tag,q:text,copy});
const input=(tag,text,answer,hint,explain,error,suffix='')=>({type:'input',tag,q:text,answer,hint,explain,error,suffix});

const lessons=[
  {id:'prologue',code:'引言',title:'零点失踪',goal:'从真实冲突中发现：只有数量还不够，数学还需要基准、方向和符号。',world:'零点天文台 · 中央大厅',visual:'alarm',principle:'当两个量数量相同但意义相反时，需要先确定基准和方向，再用正负号进行区分。',skills:['发现矛盾','寻找基准','方向表达','数学建模'],steps:[
    story('案件发生','天文台的温度、账目和农业记录同时失灵。','屏幕上只剩下“3℃”“50万元”“0.7%”，零上与零下、盈利与亏损、增长与减少无法区分。'),
    q('现场判断','“零上3℃”和“零下3℃”都只写成3℃，丢失的关键信息是什么？',['数字大小','方向信息','温度单位'],1,'两个温度的数量相同，差别发生在哪里？','缺少的是相对于0℃的方向：零上与零下。','方向表达'),
    q('寻找基准','记录“比上年减少0.7%”时，比较的基准是什么？',['0%','今年产量','上一年产量'],2,'“比上年”已经提示了比较对象。','变化率是相对于上一年产量而言的。','寻找基准'),
    {type:'multiselect',tag:'修复警报',q:'选择所有“意义相反”的量。',options:['零上与零下','盈利与亏损','3℃与5℃','增加与减少'],answers:[0,1,3],hint:'不是所有不同的量都构成相反意义。',explain:'零上/零下、盈利/亏损、增加/减少都围绕同一基准方向相反；3℃与5℃只是大小不同。',error:'发现矛盾'},
    q('方案选择','怎样用最少的信息区分“增长7.8%”和“减少0.7%”？',['换两种字体','给数字加方向符号','把数字都变大'],1,'数学符号需要表达方向，而不只是装饰。','用“+”和“−”表示相反方向，可以同时保留数量与意义。','数学建模'),
    info('案件结论','零点不是“什么都没有”。','零点可以是温度分界、海平面、标准质量或比较基准。第一章的任务，就是恢复围绕零点建立的有理数系统。')
  ]},
  {id:'sign',code:'1.1',title:'正负信号修复',goal:'理解正数、负数和0，并能在不同约定下双向翻译相反意义的量。',world:'零点天文台 · 信号塔',visual:'thermo',principle:'正负号由基准和约定决定，不代表好坏；0是正负数的分界，也可以表示确定状态。',skills:['基准判断','符号编码','反向解释','理解零点'],steps:[
    story('任务简报','信号塔把所有变化都显示成了正数。','你必须先确定每套系统的基准与正方向，再恢复温度、海拔、盈亏、变化率和移动记录。'),
    {type:'range',tag:'温度实验',q:'把探针调到零下6℃。',copy:'0℃是分界，低于0℃进入负方向。',min:-10,max:10,target:-6,unit:'℃',hint:'从0向负方向移动6格。',explain:'零下6℃记作−6℃。',error:'符号编码'},
    q('概念判断','下面关于0的说法正确的是？',['0是最小的正数','0既不是正数也不是负数','0表示任何情境中都“没有”'],1,'0是分界点，但分界点本身属于哪一边？','0既不是正数也不是负数；0℃、海拔0m都表示确定状态。','理解零点'),
    q('基准编码','一箱橘子标准质量2.5kg，规定超出标准为正。比标准少30g应记作？',['+30g','−30g','0g'],1,'先看约定，再判断“少”位于哪个方向。','比标准少30g记作−30g。','基准判断'),
    q('反向解释','在同一约定下，−27g表示什么？',['实际质量是−27g','比标准少27g','比标准多27g'],1,'带符号的数记录的是相对标准的偏差。','−27g表示比标准质量少27g。','反向解释'),
    {type:'multiselect',tag:'情境辨认',q:'选择所有可以自然使用正负数表示的情境。',options:['收入与支出','海平面以上与以下','苹果和橘子','体重增加与减少','核电荷与电子电荷'],answers:[0,1,3,4],hint:'必须围绕同一对象、同一基准且意义相反。',explain:'水果种类只是分类；其余都存在相反方向或相反意义。',error:'基准判断'},
    q('约定反转','若规定“向正后方移动5m”记作−5m，那么+5m表示？',['仍向正后方5m','向正前方5m','没有移动'],1,'正负方向由题目约定，不由日常习惯决定。','既然正后方规定为负方向，+5m就表示向正前方移动5m。','基准判断'),
    input('数据翻译','规定海平面以上为正，潜水器位于海平面下120m。请输入记录值。','-120','海平面是0，以下位于负方向。','应记作−120m。','符号编码','m'),
    q('Boss挑战','某品牌第二季度销售量“增长率为−2%”的准确含义是？',['销售量为负数','比第一季度减少2%','第二季度只卖出2%'],1,'增长率的符号描述变化方向。','增长率为−2%，表示销售量相对上一季度减少2%。','反向解释')
  ]},
  {id:'tolerance',code:'阅读与思考',title:'允许偏差质检',goal:'理解“标准值±允许偏差”，计算合格区间并处理边界数据。',world:'零点天文台 · 精密工坊',visual:'factory',principle:'标准值是基准，正负偏差给出允许范围；落在闭区间内（含边界）的产品合格。',skills:['识别标准','计算边界','区间判断','现实决策'],steps:[
    story('工坊警报','精密工坊把“偏离标准”误判成了“不合格”。','现实加工不可能每件产品完全相同。你要恢复标准值、允许偏差和合格区间。'),
    q('读懂标注','40mm±0.05mm中的40mm表示什么？',['允许的最大值','标准直径','每次误差'],1,'±前面的数是比较基准。','40mm是产品的标准直径。','识别标准'),
    input('下限计算','该乒乓球允许的最小直径是多少？','39.95','用标准值减去允许偏差。','40−0.05=39.95mm。','计算边界','mm'),
    input('上限计算','该乒乓球允许的最大直径是多少？','40.05','用标准值加上允许偏差。','40+0.05=40.05mm。','计算边界','mm'),
    {type:'tolerance',tag:'质检流水线',q:'逐个检测乒乓球，判断是否合格。',min:39.95,max:40.05,items:[39.94,39.95,40.04,40.05,40.08],hint:'合格范围包含39.95和40.05两个边界。',explain:'39.95mm到40.05mm之间（包括边界）均合格。',error:'区间判断'},
    q('错误诊断','质检员说：“39.95mm比标准小，所以不合格。”错在哪里？',['小于标准都不合格','忽略了允许偏差和边界','标准值应该是39.95mm'],1,'合格不等于与标准完全相等。','39.95mm正好是允许下限，属于合格品。','区间判断'),
    q('迁移应用','包装质量标注2.74g±0.02g，以下哪一个不合格？',['2.72g','2.75g','2.77g'],2,'先算出合格区间。','合格区间是2.72g到2.76g，2.77g超出上限。','现实决策')
  ]},
  {id:'rational',code:'1.2.1',title:'数字档案库',goal:'建立整数、分数和有理数的包含关系，识别同一个数的多重身份。',world:'零点天文台 · 数字档案库',visual:'orbit',principle:'能写成分数形式的数叫有理数；整数和分数都属于有理数，一个数可以同时拥有多重身份。',skills:['数系分类','形式转换','集合包含','分类计数'],steps:[
    story('档案混乱','数字档案库把“写法”当成了“身份”。','−30、0.25、0、循环小数和百分数的档案全部混在一起，你要重建包含关系。'),
    info('建立体系','整数和分数不是两个互不相关的世界。','正整数、0、负整数统称整数；正分数、负分数统称分数。整数也能写成分母为1的分数，因此整数和分数都属于有理数。'),
    {type:'passport',tag:'多重身份证',q:'为每个数字选择它拥有的全部身份。',labels:['正数','负数','整数','分数','有理数'],cards:[['−30',['负数','整数','有理数']],['0',['整数','有理数']],['0.25',['正数','分数','有理数']],['−12%',['负数','分数','有理数']]],hint:'一个数字可能同时属于三个集合；0不分正负。',explain:'身份验证完成：分类是包含关系，不是只能选一个抽屉。',error:'集合包含'},
    q('形式转换','为什么整数−7也是有理数？',['因为负数都是整数','因为−7可以写成−7/1','因为它没有小数点'],1,'有理数的定义关注能否写成分数。','−7=−7/1，所以它能写成分数形式，是有理数。','形式转换'),
    q('小数伪装','下列哪个属于负分数？',['−7','−2.5','0'],1,'有限小数可以化成分数，再判断是否为整数。','−2.5=−5/2，是负分数；−7是负整数。','形式转换'),
    q('循环信号','教材把无限循环小数归入有理数，依据是什么？',['它有无限多位','它能化成分数','它一定大于0'],1,'回到“有理数”的定义。','有限小数和无限循环小数都能化为分数，所以属于有理数。','形式转换'),
    {type:'sort',tag:'快速归档',q:'把数字送入“整数”或“分数”主档案。',cards:[['13','整数'],['−7.5','分数'],['−60','整数'],['8.5%','分数'],['0','整数'],['0.3̇','分数']],bins:['整数','分数'],hint:'百分数、有限小数和循环小数都可以看成分数。',explain:'主档案恢复。注意：两个主档案中的所有数仍都属于有理数。',error:'数系分类'},
    q('错误诊断','“整数不是分数，所以整数不是有理数。”错在哪里？',['整数也能写成分数形式','只有正整数是有理数','0不是有理数'],0,'给整数补一个分母1。','所有整数都能写成分母为1的分数，因此都是有理数。','集合包含'),
    q('Boss计数','−30、−12%、−7.5、−60中，负整数有几个？',['1个','2个','4个'],1,'负整数必须既是负数，又没有分数部分。','−30和−60是负整数，共2个。','分类计数')
  ]},
  {id:'line',code:'1.2.2',title:'重建坐标桥',goal:'从现实位置抽象出数轴，掌握三要素以及数与点的双向对应。',world:'零点天文台 · 坐标桥',visual:'track',principle:'规定了原点、正方向和单位长度的直线才是数轴；符号确定方向，数的绝对值确定距离。',skills:['三要素','数字定位','读点','点的移动','多解意识'],steps:[
    story('桥梁失灵','坐标桥只剩下一条普通直线。','没有原点、正方向和单位长度，任何数字都无法获得准确位置。'),
    {type:'linebuild',tag:'安装三要素',q:'依次安装数轴必需的三个部件。',parts:['原点','正方向','单位长度'],hint:'普通直线必须同时具备三个规定才能成为数轴。',explain:'原点、正方向和单位长度全部安装完成，普通直线升级为数轴。',error:'三要素'},
    q('概念验证','直线上已经标出0和向右箭头，但没有规定单位长度。它是数轴吗？',['是','不是','只要有箭头就是'],1,'三个要素缺一不可。','没有单位长度就不能确定距离，因此不是数轴。','三要素'),
    {type:'range',tag:'整数定位',q:'从0出发，把喵伯爵移动到−4。',min:-9,max:9,target:-4,unit:'',hint:'负数在原点左侧，距离原点4个单位。',explain:'−4位于原点左侧4个单位。',error:'数字定位'},
    q('小数定位','−1.5应位于哪里？',['−1与−2正中间','0与−1正中间','1与2正中间'],0,'先看负号确定方向，再看1.5的距离。','−1.5位于原点左侧1.5个单位，即−1和−2中间。','数字定位'),
    q('分数定位','数−3/2在数轴上的位置与哪个数相同？',['−1.5','1.5','−3'],0,'把分数转成小数观察。','−3/2=−1.5，它们表示数轴上的同一个点。','数字定位'),
    input('移动任务','点A表示−2，从A向右移动5个单位，终点是多少？','3','不要从0重新数，要从−2开始。','−2→−1→0→1→2→3，终点是3。','点的移动'),
    q('双终点调查','点A表示−3，沿数轴向某一方向移动4个单位，终点可能是？',['只有1','−7或1','只有−7'],1,'题目没有说明向左还是向右。','向左到−7，向右到1，因此有两个可能终点。','多解意识'),
    {type:'multiselect',tag:'区间搜索',q:'选择−2到4之间（包括端点）的所有整数。',options:['−3','−2','−1','0','1','2','3','4','5'],answers:[1,2,3,4,5,6,7],hint:'从−2开始逐格走到4，端点也要包含。',explain:'共有−2、−1、0、1、2、3、4七个整数。',error:'读点'},
    q('Boss修桥','下列哪种修改不会改变数轴上数字所表示的关系？',['改变单位长度但重新等距标数','让刻度间距忽大忽小','去掉原点'],0,'数轴可以选择不同单位长度，但必须保持统一。','单位长度可以重新选择；一旦确定，刻度必须等距，且原点不能缺失。','三要素')
  ]},
  {id:'opposite',code:'1.2.3',title:'零点镜像门',goal:'从关于原点对称理解相反数，正确处理0、字母与多重符号。',world:'零点天文台 · 镜像观测室',visual:'mirror',principle:'a与−a互为相反数；它们到原点距离相等、方向相反。0的相反数仍是0。',skills:['镜像关系','规范表达','字母理解','符号化简'],steps:[
    story('镜像故障','镜像门把“长得不一样”误判为相反数。','只有到原点距离相同、分居两侧的两个数，才能结成镜像对。'),
    {type:'range',tag:'镜像定位',q:'左侧数字是−7，把右侧镜像点调到正确位置。',min:-9,max:9,target:7,unit:'',hint:'距离保持7，方向换到另一侧。',explain:'−7与7关于原点对称，互为相反数。',error:'镜像关系'},
    q('语言审判','下面哪句话表达规范？',['−6是相反数','6与−6互为相反数','正数和负数互为相反数'],1,'相反数描述的是两个数之间的特定关系。','必须说明哪两个数互为相反数。','规范表达'),
    q('零点特例','0的相反数是多少？',['不存在','0','−0以外的另一个数'],1,'哪个数与0相加仍为0？','0的相反数还是0。','镜像关系'),
    q('符号剥离','−(−5)等于多少？',['−5','5','0'],1,'外层负号表示“取−5的相反数”。','−5的相反数是5，所以−(−5)=5。','符号化简'),
    q('字母陷阱','“−a一定是负数”正确吗？',['正确','错误，取决于a','只有a=0时正确'],1,'试着令a=−3。','当a=−3时，−a=3，因此−a不一定是负数。','字母理解'),
    input('反向追踪','a的相反数是2.4，a是多少？','-2.4','谁与2.4相加等于0？','a=−2.4。','镜像关系'),
    q('Boss挑战','若a=−3，则−a、−(−a)依次等于？',['3，−3','−3，3','3，3'],0,'每遇到一个最外层负号，就取一次相反数。','−a=3，−(−a)=−3。','符号化简')
  ]},
  {id:'absolute',code:'1.2.4',title:'距离扫描舱',goal:'把绝对值理解为到原点的距离，并能由距离反推位置、解决偏差问题。',world:'零点天文台 · 距离扫描舱',visual:'distance',principle:'|a|表示点a到原点的距离，所以|a|≥0；同一正距离通常对应原点两侧两个点。',skills:['距离本质','分情况规律','双解意识','现实迁移'],steps:[
    story('扫描故障','扫描舱只保留了距离，却有人坚持距离也可以是负数。','你要分清“所在位置”和“到原点的距离”。'),
    {type:'range',tag:'距离实验',q:'把扫描点放到−6，观察它到原点的距离。',min:-8,max:8,target:-6,unit:'',hint:'位置可以是负数，但距离不能是负数。',explain:'点在−6，到原点距离为6，所以|−6|=6。',error:'距离本质'},
    q('基础判断','|−0.5|等于多少？',['−0.5','0.5','0'],1,'绝对值表示距离。','−0.5到原点的距离是0.5。','距离本质'),
    q('零点检查','“绝对值等于它本身的数只有正数。”漏掉了什么？',['0','所有负数','没有遗漏'],0,'检查正负数的分界点。','|0|=0，所以非负数的绝对值都等于它本身。','分情况规律'),
    {type:'multiselect',tag:'双点追踪',q:'若|x|=4，选择x所有可能的值。',options:['−4','0','4','8'],answers:[0,2],hint:'原点左右各有一个距离为4的点。',explain:'x=−4或4。只写一个会漏解。',error:'双解意识'},
    q('符号组合','化简−|−11|的结果是？',['11','−11','0'],1,'先求绝对值，再处理外面的负号。','|−11|=11，所以−|−11|=−11。','分情况规律'),
    q('最近标准','偏差为+5、−3.5、+0.7、−2.5、−0.6g，哪个最接近标准？',['+0.7g','−0.6g','−2.5g'],1,'比较偏差的绝对值。','0.6最小，所以−0.6g最接近标准质量。','现实迁移'),
    q('规律表达','当a<0时，|a|等于？',['a','−a','0'],1,'负数的绝对值是它的相反数。','当a<0时，−a>0且表示距离，所以|a|=−a。','分情况规律'),
    q('Boss挑战','数轴上A、B、C、D四点中，哪个数绝对值最小？',['离原点最近的点','最靠左的点','数字写得最短的点'],0,'绝对值越小，表示该数的点离原点越近。','绝对值比较本质上是比较到原点的距离。','距离本质')
  ]},
  {id:'compare',code:'1.2.5',title:'数字排位赛',goal:'借助数轴、符号和绝对值比较有理数，并完成混合排序与区间判断。',world:'零点天文台 · 数字裁决场',visual:'balance',principle:'数轴右边的数大；正数>0>负数；两个负数比较时，绝对值大的反而小。',skills:['符号优先','负数比较','化简比较','综合排序'],steps:[
    story('排位争议','−8宣称自己的“8”比−5的“5”大，所以自己更大。','裁决不能只看数字外表，要把数放回数轴。'),
    q('位置裁决','比较−8与−5，正确的是？',['−8>−5','−8<−5','两数相等'],1,'数轴上谁更靠左？','−8比−5更靠左，所以−8<−5。','负数比较'),
    info('统一规则','数轴给出比较大小的统一方法。','右边的数大于左边的数，因此正数大于0、0大于负数；两个负数中，离原点更远的数反而更小。'),
    q('异号比较','比较5和−2。',['5>−2','5<−2','无法比较'],0,'正数和负数比较不需要先算绝对值。','任何正数都大于任何负数。','符号优先'),
    q('错误诊断','小元说“|−8|>|−5|，所以−8>−5”。错在哪里？',['绝对值不能比较','两个负数绝对值大的反而小','−8与−5相等'],1,'绝对值大表示离0更远，但它位于哪一侧？','在负半轴上，离0越远越靠左，因此数反而越小。','负数比较'),
    q('先化简','比较−(−1)和−(+2)，正确的是？',['−(−1)>−(+2)','−(−1)<−(+2)','相等'],0,'先把两个数化简成1和−2。','1>−2，所以−(−1)>−(+2)。','化简比较'),
    {type:'sequence',tag:'城市排位',q:'按气温从低到高排列：北京−4.6℃、武汉3.8℃、广州13.1℃、哈尔滨−19.4℃。',items:['北京 −4.6','武汉 3.8','广州 13.1','哈尔滨 −19.4'],order:['哈尔滨 −19.4','北京 −4.6','武汉 3.8','广州 13.1'],hint:'先找最靠左的负数，再到正数。',explain:'−19.4<−4.6<3.8<13.1。',error:'综合排序'},
    {type:'sequence',tag:'混合排序',q:'把−(−1)、−(+2)、0、−3/2按从小到大排列。',items:['−(−1)','−(+2)','0','−3/2'],order:['−(+2)','−3/2','0','−(−1)'],hint:'先化简为1、−2、0、−1.5。',explain:'−2<−1.5<0<1。',error:'化简比较'},
    q('Boss挑战','若a<0，那么a与−a的关系是？',['a>−a','a<−a','a=−a'],1,'a是负数时，−a是什么符号？','a<0而−a>0，所以a<−a。','化简比较')
  ]},
  {id:'finale',code:'数学活动与小结',title:'重启零点天文台',goal:'综合运用本章知识完成数据调查、猜数策略和全系统校准。',world:'零点天文台 · 核心控制室',visual:'core',principle:'面对有理数问题，先识别基准与符号，再借助数轴统一处理位置、对称、距离和大小。',skills:['综合建模','数据分析','策略推理','迁移表达'],steps:[
    story('终局任务','六套设备已经恢复，但中央核心仍缺少一次完整校准。','同一份数据必须依次通过符号、分类、数轴、镜像、距离和排序系统。'),
    q('健康数据','标准体重偏差为−1.1、+2、−0.5、+10、+4.7、−8.3kg，最接近标准的是？',['−1.1kg','−0.5kg','+2kg'],1,'最接近标准要比较偏差的绝对值。','|−0.5|最小，因此该数据最接近标准体重。','数据分析'),
    {type:'sequence',tag:'数据排序',q:'把偏差−1.1、+2、−0.5、+4.7按从小到大排列。',items:['−1.1','+2','−0.5','+4.7'],order:['−1.1','−0.5','+2','+4.7'],hint:'先排负数，再排正数。',explain:'−1.1<−0.5<2<4.7。',error:'数据分析'},
    {type:'guess',tag:'猜数对决',q:'喵伯爵在−50到50之间锁定了一个整数。根据“大了/小了”尽快猜中。',target:-13,hint:'每次猜当前可能区间的中间数，缩小范围最快。',explain:'你通过不断缩小区间找到了目标数，这就是高效的二分策略。',error:'策略推理'},
    q('综合关系','数轴上A、B表示互为相反数，且两点距离为5，它们表示什么数？',['−5和5','−2.5和2.5','0和5'],1,'两个点关于原点对称，它们之间的距离是单点到原点距离的2倍。','每个点到原点距离为2.5，所以表示−2.5和2.5。','综合建模'),
    q('参数判断','当a满足什么条件时，−a>a？',['a>0','a<0','a=0'],1,'−a>a表示a的相反数位于a的右侧。','当a<0时，−a为正数，因此−a>a。','迁移表达'),
    {type:'multiselect',tag:'区间调查',q:'选择所有大于−103且小于−100的数。',options:['−103','−102.8','−102','−100.5','−100','−99.9'],answers:[1,2,3],hint:'两个端点都不包含。',explain:'−102.8、−102、−100.5都严格位于−103与−100之间。',error:'综合建模'},
    q('现实解释','某年人均水资源比上年的增幅为−5.6%，这说明？',['水资源变成负数','比上年减少5.6%','只剩5.6%'],1,'负号描述变化方向，不表示资源数量为负。','增幅为负表示相对上一年有所减少。','迁移表达'),
    q('核心校准','解决本章问题最稳定的思考顺序是？',['先套公式，再看情境','先找基准和符号，再用数轴分析位置、距离与大小','只看数字绝对值'],1,'第一章的所有概念都围绕零点与数轴建立联系。','先明确基准和符号，再借助数轴统一理解，是本章的核心方法。','综合建模'),
    info('系统重启','零点天文台恢复运行。','你已经完成从相反意义的量到有理数体系，再到数轴、相反数、绝对值和大小比较的完整建构。下一章将研究这些数怎样运算。')
  ]}
];

const $=id=>document.getElementById(id);

const fullscreenBtn=$('fullscreenBtn');
if(fullscreenBtn){
  fullscreenBtn.onclick=async()=>{
    try{
      if(!document.fullscreenElement){await document.documentElement.requestFullscreen();}
      else{await document.exitFullscreen();}
    }catch(_){toast('当前浏览器暂不支持全屏，请使用浏览器菜单进入全屏。')}
  };
  document.addEventListener('fullscreenchange',()=>{
    fullscreenBtn.innerHTML=document.fullscreenElement?'<span>⤢</span> 退出全屏':'<span>⛶</span> 全屏';
  });
}
let ccSpeaking=false;
const ccAudio=new Audio();
function stopCcVoice(){
  ccAudio.pause();ccSpeaking=false;
  const btn=$('speakLesson');if(btn)btn.innerHTML='<span>🔊</span><b>听喵伯爵 讲本课</b><small>跟随当前学习节点</small>';
}
function speakCurrentLesson(){
  if(ccSpeaking){stopCcVoice();return}
  const section=String(Math.min(99,lessonIndex+1)).padStart(2,'0');
  const part=String(Math.min(8,Math.max(1,phaseIndex(lessons[lessonIndex])+1))).padStart(2,'0');
  ccAudio.src=`./audio/math7a/u01/s${section}/p${part}.opus`;
  ccAudio.onended=stopCcVoice;ccAudio.onerror=()=>{stopCcVoice();toast('本节点自然男声音频暂不可用。')};
  ccAudio.play().then(()=>{ccSpeaking=true;$('speakLesson').innerHTML='<span>■</span><b>停止讲解</b><small>喵伯爵正在播放自然男声</small>'}).catch(()=>toast('请再次点击播放本课语音。'));
}
let lessonIndex=0,stepIndex=0,answered=false,stepMistakes=0,lessonMistakes=0,lessonCorrect=0;
let xp=Number(localStorage.getItem('yuanlai_ch1_xp')||0);
let completed=new Set(JSON.parse(localStorage.getItem('yuanlai_ch1_v3_completed')||'[]'));
const scores=JSON.parse(localStorage.getItem('yuanlai_ch1_v3_scores')||'{}');
const reasons=JSON.parse(localStorage.getItem('yuanlai_ch1_v3_reasons')||'{}');
let activeScene='explore',practiceRound=0,practiceStage=0,practiceWins=0,repairPhase=0,activeFault='';
const repaired=new Set(JSON.parse(localStorage.getItem('yuanlai_ch1_repaired')||'[]'));

function save(){localStorage.setItem('yuanlai_ch1_v3_completed',JSON.stringify([...completed]));localStorage.setItem('yuanlai_ch1_v3_scores',JSON.stringify(scores));localStorage.setItem('yuanlai_ch1_v3_reasons',JSON.stringify(reasons));localStorage.setItem('yuanlai_ch1_xp',String(xp));localStorage.setItem('yuanlai_ch1_repaired',JSON.stringify([...repaired]));}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),2600)}
function clean(v){return String(v).trim().replace(/[−–—]/g,'-').replace(/＋/g,'+').replace(/，/g,',').replace(/\s/g,'').replace(/^\+/,'')}
function addXp(n){xp+=n;$('xpValue').textContent=xp;save()}
function totalSteps(){return lessons.reduce((n,l)=>n+l.steps.length,0)}
function earnedSteps(){return lessons.reduce((n,l,i)=>n+Math.min(scores[i]||0,l.steps.length),0)}
function phaseIndex(l){return Math.min(PHASES.length-1,Math.floor(stepIndex/Math.max(1,l.steps.length-1)*(PHASES.length-1)))}
function scoredTotal(l){return l.steps.filter(s=>!['story','info'].includes(s.type)).length}
function recordMistake(s){stepMistakes++;lessonMistakes++;if(s.error)reasons[s.error]=(reasons[s.error]||0)+1;save();animateWorldFeedback(s,false)}

function currentPracticeItems(){
  const items=lessons[lessonIndex].steps.filter(s=>s.type==='quiz');
  return items.length?items:[{tag:'规律解释',q:lessons[lessonIndex].principle,options:['我能解释这条规律','我只是记住了答案','我还需要一个例子'],answer:0,hint:'不要只判断熟悉感，试着用自己的话说明。',explain:lessons[lessonIndex].principle,error:lessons[lessonIndex].skills[0]}];
}
function switchScene(scene){
  activeScene=scene;
  document.querySelectorAll('[data-scene]').forEach(b=>b.classList.toggle('active',b.dataset.scene===scene));
  ['explore','practice','repair'].forEach(name=>{const panel=$(`${name}Panel`);panel.hidden=name!==scene;panel.classList.toggle('active',name===scene)});
  if(scene==='practice')renderPractice();
  if(scene==='repair')renderRepair();
  window.scrollTo({top:0,behavior:'smooth'});
}
function renderSceneStatus(){
  if(!$('repairState'))return;
  const faultCount=Object.entries(reasons).filter(([name,count])=>count>0&&!repaired.has(name)).length;
  $('exploreState').textContent=`${Math.round(earnedSteps()/totalSteps()*100)}%`;
  $('practiceState').textContent=practiceWins>=3?'本轮完成':`${practiceWins} / 3`;
  $('repairState').textContent=`${faultCount} 个漏洞`;
  $('repairCount').textContent=faultCount;
}
function updateTrainingStepper(){
  document.querySelectorAll('.training-stepper span').forEach((el,i)=>{el.classList.toggle('active',i===practiceStage);el.classList.toggle('done',i<practiceStage)});
}
function renderPractice(){
  const lesson=lessons[lessonIndex],items=currentPracticeItems(),source=items[practiceRound%items.length];
  $('practiceChapter').textContent=`${lesson.code} · ${lesson.title}`;$('practiceTitle').textContent=`${lesson.title}能力训练`;$('practiceGoal').textContent=`训练目标：${lesson.goal}`;
  $('practiceScore').textContent=`${practiceWins} / 3`;updateTrainingStepper();$('socraticBox').classList.add('hidden');
  $('practiceTag').textContent=`${lesson.code} · ${source.tag}`;
  if(practiceStage===1){
    $('practiceQuestion').textContent='你刚才为什么能这样判断？';$('practicePrompt').textContent='喵伯爵不只记录答案，还要确认你使用了哪条规律。';
    const opts=[source.explain,lesson.principle,'因为这个答案看起来最熟悉'];renderPracticeOptions(opts,0,source,true);return;
  }
  $('practiceQuestion').textContent=practiceStage===2?`迁移挑战：${source.q}`:source.q;
  $('practicePrompt').textContent=practiceStage===2?'题目结构相同，但请独立重新判断。':'先作答；如果出错，喵伯爵只追问关键条件，不会直接公布答案。';
  renderPracticeOptions(source.options||['我能解释','需要提示','暂不确定'],source.answer??0,source,false);
}
function renderPracticeOptions(options,answer,source,isReason){
  $('practiceAnswers').innerHTML=options.map((o,i)=>`<button data-practice-answer="${i}">${o}</button>`).join('');
  $('thinkingTrace').innerHTML=`<div><i class="live"></i><span>知识点</span><b>${source.error||lessons[lessonIndex].skills[0]}</b></div><div><i></i><span>判断依据</span><b>${isReason?'正在核验':'等待作答'}</b></div><div><i></i><span>迁移能力</span><b>${practiceStage===2?'正在检测':'尚未检测'}</b></div>`;
  $('practiceAnswers').querySelectorAll('button').forEach(btn=>btn.onclick=()=>{
    const picked=Number(btn.dataset.practiceAnswer);
    if(picked!==answer){
      btn.classList.add('wrong');recordMistake(source);$('socraticBox').innerHTML=`<b>喵伯爵追问</b><p>${source.hint||'你依据的关键条件是什么？先找基准、方向或距离。'}</p><small>已记录错因：${source.error||'概念条件遗漏'}</small>`;$('socraticBox').classList.remove('hidden');renderSceneStatus();renderRepairFaults();return;
    }
    btn.classList.add('correct');$('practiceAnswers').querySelectorAll('button').forEach(b=>b.disabled=true);
    if(practiceStage<2){practiceStage++;setTimeout(renderPractice,520)}else{practiceWins++;practiceRound++;practiceStage=0;addXp(15);$('socraticBox').innerHTML='<b>本轮通过</b><p>你完成了作答、解释和迁移验证。下一轮将换一个知识点。</p>';$('socraticBox').classList.remove('hidden');renderSceneStatus();setTimeout(()=>{if(practiceWins<3)renderPractice();else{$('practiceQuestion').textContent='本轮能力训练完成';$('practicePrompt').textContent='喵伯爵已把训练中暴露的错因送入漏洞清除局。';$('practiceAnswers').innerHTML='<button class="correct" id="goRepair">进入漏洞清除局 →</button>';$('goRepair').onclick=()=>switchScene('repair')}},850)}
  });
}
function faultEntries(){
  const real=Object.entries(reasons).filter(([,count])=>count>0);
  return real.length?real:[[lessons[lessonIndex].skills[0],1]];
}
function renderRepairFaults(){
  const entries=faultEntries();
  $('faultList').innerHTML=entries.map(([name,count])=>`<button data-fault="${name}" class="${repaired.has(name)?'cleared':''} ${activeFault===name?'active':''}"><i>${repaired.has(name)?'✓':'!'}</i><span><b>${name}</b><small>${repaired.has(name)?'已完成复测':`出现 ${count} 次 · 待修复`}</small></span></button>`).join('');
  $('faultList').querySelectorAll('[data-fault]').forEach(b=>b.onclick=()=>{activeFault=b.dataset.fault;repairPhase=0;renderRepair()});
}
function renderRepair(){
  renderRepairFaults();renderSceneStatus();
  document.querySelectorAll('[data-repair-phase]').forEach((el,i)=>{el.classList.toggle('active',i===repairPhase);el.classList.toggle('done',i<repairPhase)});
  if(!activeFault){$('repairTag').textContent='漏洞扫描待命';$('repairQuestion').textContent='选择一个漏洞，开始三阶段清除';$('repairCopy').textContent='如果还没有真实错题，可以先扫描当前知识点。';$('repairAnswers').innerHTML='';$('startPreventive').classList.remove('hidden');return}
  $('startPreventive').classList.add('hidden');const lesson=lessons[lessonIndex],source=currentPracticeItems().find(s=>s.error===activeFault)||currentPracticeItems()[0];
  const titles=['当天修复：先说清错在哪里','变式验证：换一种表达还能判断吗','延迟复测：脱离提示独立完成'];
  $('repairTag').textContent=`漏洞 ${activeFault} · ${repairPhase+1}/3`;$('repairQuestion').textContent=titles[repairPhase];
  if(repairPhase===0){$('repairCopy').textContent='选择这类错误最应该先检查的条件。';renderRepairOptions([activeFault,'只看数字大小','凭上一次答案'],0,source);return}
  if(repairPhase===1){$('repairCopy').textContent=lesson.principle;renderRepairOptions([lesson.principle,'符号永远代表好坏','只要记住例题即可'],0,source);return}
  $('repairCopy').textContent=source.q;renderRepairOptions(source.options||['正确','错误','无法判断'],source.answer??0,source);
}
function renderRepairOptions(options,answer,source){
  $('repairAnswers').innerHTML=options.map((o,i)=>`<button data-repair-answer="${i}">${o}</button>`).join('');
  $('repairAnswers').querySelectorAll('button').forEach(btn=>btn.onclick=()=>{if(Number(btn.dataset.repairAnswer)!==answer){btn.classList.add('wrong');toast(source.hint||'先回到关键条件，不要背答案。');return}btn.classList.add('correct');$('repairAnswers').querySelectorAll('button').forEach(b=>b.disabled=true);if(repairPhase<2){repairPhase++;setTimeout(renderRepair,600)}else{repaired.add(activeFault);if(reasons[activeFault])reasons[activeFault]=0;addXp(25);save();renderSceneStatus();renderRepairFaults();$('repairQuestion').textContent=`“${activeFault}”已清除`;$('repairCopy').textContent='你已经通过修复、变式和复测。以后如果再次出现同类错误，系统会重新激活这个漏洞。';$('repairAnswers').innerHTML='<button class="correct" id="backExplore">返回探索新世界 →</button>';$('backExplore').onclick=()=>switchScene('explore')}});
}

function renderNav(){
  $('missionRail').innerHTML=`<div class="rail-title"><span>CHAPTER 01</span><b>零点天文台</b><small>完整调查 · ${totalSteps()}个节点</small></div>`+lessons.map((l,i)=>`<button class="mission-tab ${i===lessonIndex?'active':''} ${completed.has(i)?'done':''}" data-lesson="${i}"><i>${completed.has(i)?'✓':String(i).padStart(2,'0')}</i><span>${l.title}<small>${l.code} · ${l.steps.length}个节点</small></span></button>`).join('');
  $('mapGrid').innerHTML=lessons.map((l,i)=>`<button class="map-card ${completed.has(i)?'done':''}" data-lesson="${i}"><span>${l.code} · ${completed.has(i)?'已修复':(scores[i]?`进度 ${scores[i]}/${l.steps.length}`:'等待调查')}</span><strong>${l.title}</strong><p>${l.goal}</p><em>${completed.has(i)?'重新进入':'开始任务'} →</em></button>`).join('');
  document.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>startLesson(Number(b.dataset.lesson)));
  $('chapterProgress').textContent=`${Math.round(earnedSteps()/totalSteps()*100)}%`;
  $('mapStepCount').textContent=totalSteps();$('mapMissionCount').textContent=lessons.length;
  renderSceneStatus();
}

function renderPhasePath(){
  const current=phaseIndex(lessons[lessonIndex]);
  $('phasePath').innerHTML=PHASES.map((p,i)=>`<div class="phase-node ${i===current?'active':''} ${i<current?'done':''}"><i>${i<current?'✓':i+1}</i><span>${p}</span></div>`).join('');
}

function ambientVisual(l){
  if(l.visual==='alarm')return '<div class="scene-title"><span>ZERO POINT INCIDENT</span><b>中央系统三重警报</b></div><div class="alarm-console"><div><small>温度</small><b>3℃ / 3℃</b></div><div><small>账目</small><b>50万 / 10万</b></div><div><small>变化</small><b>7.8% / 0.7%</b></div></div>';
  if(l.visual==='thermo')return '<div class="scene-title"><span>SIGNAL CONTROL</span><b>正负信号塔</b></div><div class="ambient-thermo"><i></i><b>0℃</b><span>零上 / 零下</span></div><div class="city-readouts"><div><small>气象站</small><b>−6℃</b></div><div><small>海拔站</small><b>+124m</b></div><div><small>质量偏差</small><b>−30g</b></div></div>';
  if(l.visual==='factory')return '<div class="scene-title"><span>CALIBRATION WORKSHOP</span><b>精密质检工坊</b></div><div class="factory-gauge"><span>允许范围</span><b>39.95 — 40.05 mm</b><i>标准 40.00</i></div>';
  if(l.visual==='orbit')return '<div class="scene-title"><span>NUMBER ARCHIVE</span><b>数字档案核心</b></div><div class="data-orbits"><div class="orbit-ring one"><span>整数</span></div><div class="orbit-ring two"><span>分数</span></div><strong>有理数</strong></div>';
  if(l.visual==='track')return '<div class="scene-title"><span>COORDINATE BRIDGE</span><b>零点坐标桥</b></div><div class="ambient-track">'+Array.from({length:19},(_,i)=>`<i style="left:${i/18*100}%"><b>${i-9}</b></i>`).join('')+'<span class="track-zero">零点</span></div>';
  if(l.visual==='mirror')return '<div class="scene-title"><span>MIRROR GATE</span><b>零点镜像门</b></div><div class="portal-pair"><div>−7</div><i>0</i><div>+7</div></div>';
  if(l.visual==='distance')return '<div class="scene-title"><span>DISTANCE SCANNER</span><b>绝对值扫描舱</b></div><div class="distance-ray"><div>−6</div><span><b>距离 6</b></span><i>0</i></div>';
  if(l.visual==='balance')return '<div class="scene-title"><span>NUMBER ARENA</span><b>数字裁决场</b></div><div class="compare-arena"><div>−8<small>数轴更靠左</small></div><b>&lt;</b><div>−5<small>数轴更靠右</small></div></div>';
  return '<div class="scene-title"><span>ZERO CORE</span><b>中央零点核心</b></div><div class="core-reactor"><i>0</i><span>6套系统等待最终校准</span></div>';
}

function animateWorldFeedback(s,correct){
  const world=$('gameWorld'),stage=$('visualStage'),visual=lessons[lessonIndex].visual;
  clearTimeout(animateWorldFeedback.timer);world.querySelector('.world-reaction')?.remove();
  world.classList.remove('reaction-correct','reaction-wrong',...['alarm','thermo','factory','orbit','track','mirror','distance','balance','core'].map(x=>`reaction-${x}`));
  void world.offsetWidth;
  world.classList.add(correct?'reaction-correct':'reaction-wrong',`reaction-${visual}`);
  const title=correct?'验证成功':'条件冲突';
  const copy=correct?(s.explain||'场景已根据你的判断完成变化。'):(s.hint||'场景无法按这个条件运行，请重新观察。');
  const reaction=document.createElement('div');reaction.className=`world-reaction ${correct?'ok':'warn'}`;reaction.innerHTML=`<i>${correct?'✓':'!'}</i><div><b>${title}</b><span>${copy}</span></div>`;world.appendChild(reaction);
  if(visual==='track'){
    const track=stage.querySelector('.ambient-track');
    if(track){const demo=document.createElement('strong');demo.className='track-demo';demo.textContent=correct?'补齐单位长度：每格距离重新确定':'刻度失去统一距离';track.appendChild(demo)}
  }
  if(visual==='thermo')stage.querySelector('.ambient-thermo')?.style.setProperty('--reaction-shift',correct?'68%':'22%');
  animateWorldFeedback.timer=setTimeout(()=>{world.classList.remove('reaction-correct','reaction-wrong',`reaction-${visual}`);reaction.remove();stage.querySelector('.track-demo')?.remove()},correct?3000:1900);
}

function startLesson(i){
  lessonIndex=i;const l=lessons[i];stepIndex=Math.min(scores[i]||0,l.steps.length-1);lessonCorrect=0;lessonMistakes=0;answered=false;stepMistakes=0;
  practiceRound=0;practiceStage=0;practiceWins=0;repairPhase=0;activeFault='';
  $('mapOverlay').classList.add('hidden');$('completeOverlay').classList.add('hidden');renderNav();renderStep();
  if(activeScene==='practice')renderPractice();
  if(activeScene==='repair')renderRepair();
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderStep(){
  const l=lessons[lessonIndex],s=l.steps[stepIndex];answered=false;stepMistakes=0;
  $('missionCode').textContent=`${lessonIndex===0?'PROLOGUE':lessonIndex===lessons.length-1?'FINAL CASE':`MISSION ${String(lessonIndex).padStart(2,'0')}`} · ${l.code}`;
  $('lessonTitle').textContent=l.title;$('lessonGoal').textContent=l.goal;$('worldName').textContent=l.world;$('phaseBadge').textContent=PHASES[phaseIndex(l)];
  $('stepNumber').textContent=`${String(stepIndex+1).padStart(2,'0')} / ${String(l.steps.length).padStart(2,'0')}`;$('activityLabel').textContent=s.tag;$('questionText').textContent=s.q;$('questionCopy').textContent=s.copy||'';$('principleText').textContent=l.principle;$('xpValue').textContent=xp;
  $('feedback').classList.add('hidden');$('nextStep').classList.add('hidden');$('hintBtn').classList.remove('hidden');$('visualStage').innerHTML=ambientVisual(l);$('answerZone').innerHTML='';
  const cc=['先看哪里出现了矛盾，不要急着找公式。','动手改变条件，观察结果怎样变化。','把刚才的现象说成一条稳定规律。','现在独立完成，我会观察你的方法。','错误会暴露漏掉的条件，先定位原因。','换了情境，规律仍然要成立。','最后把多个概念串起来。'];
  $('ccBubble').textContent=cc[phaseIndex(l)];renderPhasePath();renderDiagnosis();renderActivity(s);scores[lessonIndex]=Math.max(scores[lessonIndex]||0,stepIndex);save();renderNav();
}

function renderActivity(s){
  if(s.type==='story'||s.type==='info'){
    $('answerZone').innerHTML=s.type==='info'?'<div class="concept-diagram"><div><b>观察</b><span>从现象出发</span></div><i>→</i><div><b>解释</b><span>建立数学关系</span></div><i>→</i><div><b>迁移</b><span>解决新问题</span></div></div>':'<button class="mission-start">进入现场 <span>→</span></button>';
    $('answerZone').querySelector('button')?.addEventListener('click',()=>success(s,s.type==='info'?'规律已写入天文台档案。':'任务现场已解锁。',false));
    if(s.type==='info'){const b=document.createElement('button');b.className='mission-start';b.innerHTML='我能解释这条规律 <span>→</span>';b.onclick=()=>success(s,'规律已写入天文台档案。',false);$('answerZone').appendChild(b)}
    return;
  }
  if(s.type==='range'){
    const start=0;$('answerZone').innerHTML=`<div class="range-lab"><output id="rangeOutput">${start}${s.unit||''}</output><input id="rangeInput" type="range" min="${s.min}" max="${s.max}" step="1" value="${start}" aria-label="选择位置"><div><span>${s.min}${s.unit||''}</span><b>0</b><span>+${s.max}${s.unit||''}</span></div></div><button class="submit-answer">确认位置</button>`;
    const el=$('rangeInput');el.oninput=()=>{$('rangeOutput').textContent=`${Number(el.value)>0?'+':''}${el.value}${s.unit||''}`;moveSceneMarker(Number(el.value),s.min,s.max)};$('answerZone').querySelector('.submit-answer').onclick=()=>checkValue(Number(el.value)===s.target,s);return;
  }
  if(s.type==='sort'){renderSort(s);return}
  if(s.type==='sequence'){renderSequence(s);return}
  if(s.type==='multiselect'){renderMulti(s);return}
  if(s.type==='passport'){renderPassport(s);return}
  if(s.type==='tolerance'){renderTolerance(s);return}
  if(s.type==='linebuild'){renderLineBuild(s);return}
  if(s.type==='guess'){renderGuess(s);return}
  if(s.type==='input'){
    $('answerZone').innerHTML=`<div class="input-answer"><input id="textAnswer" inputmode="decimal" autocomplete="off" placeholder="输入答案" aria-label="输入答案"><span>${s.suffix||''}</span></div><button class="submit-answer">提交答案</button>`;
    const submit=()=>checkValue(clean($('textAnswer').value)===clean(s.answer),s);$('answerZone').querySelector('.submit-answer').onclick=submit;$('textAnswer').onkeydown=e=>{if(e.key==='Enter')submit()};return;
  }
  $('answerZone').innerHTML=s.options.map((o,i)=>`<button class="answer-btn" data-answer="${i}">${o}</button>`).join('');
  $('answerZone').querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>checkChoice(Number(b.dataset.answer),b,s));
}

function moveSceneMarker(v,min,max){const stage=$('visualStage');let m=stage.querySelector('.live-marker');if(!m){m=document.createElement('div');m.className='live-marker';stage.appendChild(m)}m.style.left=`${12+((v-min)/(max-min))*76}%`;m.textContent=v>0?`+${v}`:v}

function renderSort(s){
  let i=0;$('answerZone').innerHTML=`<div class="sort-lab"><div class="sort-card" id="sortCard">${s.cards[0][0]}</div><div class="sort-count"><b id="sortCount">0</b> / ${s.cards.length} 已归档</div><div class="sort-bins">${s.bins.map(x=>`<button data-bin="${x}">${x}<small>点击归档</small></button>`).join('')}</div></div>`;
  $('answerZone').querySelectorAll('[data-bin]').forEach(btn=>btn.onclick=()=>{if(btn.dataset.bin!==s.cards[i][1]){recordMistake(s);btn.classList.add('wrong');setTimeout(()=>btn.classList.remove('wrong'),350);toast(s.hint);return}i++;$('sortCount').textContent=i;btn.classList.add('pulse');setTimeout(()=>btn.classList.remove('pulse'),350);if(i===s.cards.length)success(s,s.explain,true);else $('sortCard').textContent=s.cards[i][0]});
}

function renderSequence(s){
  const picked=[];$('answerZone').innerHTML=`<div class="sequence-lab"><div class="sequence-picked" id="sequencePicked"><span>从最小的数开始</span></div><div class="sequence-options">${s.items.map(x=>`<button data-seq="${x}">${x}</button>`).join('')}</div></div>`;
  $('answerZone').querySelectorAll('[data-seq]').forEach(btn=>btn.onclick=()=>{const next=s.order[picked.length];if(btn.dataset.seq!==next){recordMistake(s);btn.classList.add('wrong');setTimeout(()=>btn.classList.remove('wrong'),400);toast(s.hint);return}picked.push(next);btn.disabled=true;btn.classList.add('correct');$('sequencePicked').innerHTML=picked.map((x,i)=>`<b>${x}</b>${i<picked.length-1?'<i>&lt;</i>':''}`).join('');if(picked.length===s.order.length)success(s,s.explain,true)});
}

function renderMulti(s){
  const chosen=new Set();$('answerZone').innerHTML=`<div class="multi-grid">${s.options.map((o,i)=>`<button type="button" data-multi="${i}" aria-pressed="false">${o}</button>`).join('')}</div><button class="submit-answer">确认选择</button>`;
  $('answerZone').querySelectorAll('[data-multi]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.multi);chosen.has(i)?chosen.delete(i):chosen.add(i);b.setAttribute('aria-pressed',String(chosen.has(i)));b.classList.toggle('selected',chosen.has(i))});
  $('answerZone').querySelector('.submit-answer').onclick=()=>{const got=[...chosen].sort((a,b)=>a-b),want=[...s.answers].sort((a,b)=>a-b);checkValue(JSON.stringify(got)===JSON.stringify(want),s)};
}

function renderPassport(s){
  let card=0;$('answerZone').innerHTML='<div class="passport-lab"><div class="passport-number" id="passportNumber"></div><div class="passport-labels" id="passportLabels"></div><div class="passport-progress" id="passportProgress"></div></div><button class="submit-answer">核验身份</button>';
  const draw=()=>{$('passportNumber').textContent=s.cards[card][0];$('passportLabels').innerHTML=s.labels.map(x=>`<button type="button" data-label="${x}" aria-pressed="false">${x}</button>`).join('');$('passportProgress').textContent=`第 ${card+1} / ${s.cards.length} 张档案`;$('passportLabels').querySelectorAll('button').forEach(b=>b.onclick=()=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));b.classList.toggle('selected',on)})};draw();
  $('answerZone').querySelector('.submit-answer').onclick=()=>{const got=[...$('passportLabels').querySelectorAll('[aria-pressed="true"]')].map(b=>b.dataset.label).sort(),want=[...s.cards[card][1]].sort();if(JSON.stringify(got)!==JSON.stringify(want)){recordMistake(s);toast(s.hint);return}card++;if(card===s.cards.length)success(s,s.explain,true);else draw()};
}

function renderTolerance(s){
  let i=0;$('answerZone').innerHTML=`<div class="tolerance-lab"><div class="tolerance-range">合格区间 <b>${s.min} — ${s.max} mm</b></div><div class="tolerance-item" id="toleranceItem"></div><div class="tolerance-actions"><button data-pass="1">合格放行</button><button data-pass="0">不合格拦截</button></div><small id="toleranceProgress"></small></div>`;
  const draw=()=>{$('toleranceItem').textContent=`${s.items[i]} mm`;$('toleranceProgress').textContent=`第 ${i+1} / ${s.items.length} 件`};draw();
  $('answerZone').querySelectorAll('[data-pass]').forEach(b=>b.onclick=()=>{const actual=s.items[i]>=s.min&&s.items[i]<=s.max;if((b.dataset.pass==='1')!==actual){recordMistake(s);toast(s.hint);return}i++;if(i===s.items.length)success(s,s.explain,true);else draw()});
}

function renderLineBuild(s){
  const installed=new Set();$('answerZone').innerHTML=`<div class="line-builder"><div class="builder-line"><i></i></div><div>${s.parts.map(x=>`<button type="button" data-part="${x}">安装${x}</button>`).join('')}</div><small id="buildState">0 / ${s.parts.length} 已安装</small></div><button class="submit-answer">启动数轴</button>`;
  $('answerZone').querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>{installed.add(b.dataset.part);b.classList.add('selected');b.disabled=true;$('buildState').textContent=`${installed.size} / ${s.parts.length} 已安装`});
  $('answerZone').querySelector('.submit-answer').onclick=()=>checkValue(installed.size===s.parts.length,s);
}

function renderGuess(s){
  let low=-50,high=50,tries=0;$('answerZone').innerHTML='<div class="guess-lab"><div class="guess-range" id="guessRange">可能范围：−50 到 50</div><div class="input-answer"><input id="guessInput" inputmode="numeric" placeholder="输入整数"><span>次</span></div><button class="submit-answer">提交猜测</button><div class="guess-log" id="guessLog"></div></div>';
  const submit=()=>{const v=Number($('guessInput').value);if(!Number.isInteger(v)||v<low||v>high){toast(`请输入 ${low} 到 ${high} 之间的整数`);return}tries++;if(v===s.target){$('guessLog').textContent=`第${tries}次：${v}，命中！`;success(s,`${s.explain} 共猜了${tries}次。`,true);return}if(v>s.target){high=v-1;$('guessLog').textContent=`第${tries}次：${v}，大了`}else{low=v+1;$('guessLog').textContent=`第${tries}次：${v}，小了`}$('guessRange').textContent=`可能范围：${low} 到 ${high}`;$('guessInput').value=''};
  $('answerZone').querySelector('.submit-answer').onclick=submit;$('guessInput').onkeydown=e=>{if(e.key==='Enter')submit()};
}

function checkChoice(i,button,s){if(answered)return;if(i!==s.answer){recordMistake(s);button.classList.add('wrong');$('ccBubble').textContent=`这次错误更像是“${s.error||'条件判断'}”没有处理好。先根据提示修正。`;toast(s.hint);setTimeout(()=>button.classList.remove('wrong'),650);return}button.classList.add('correct');$('answerZone').querySelectorAll('[data-answer]').forEach(x=>x.disabled=true);success(s,s.explain,true)}
function checkValue(ok,s){if(answered)return;if(!ok){recordMistake(s);toast(s.hint);$('ccBubble').textContent=`先检查“${s.error||'关键条件'}”，不要靠连续猜答案。`;return}success(s,s.explain,true)}

function success(s,message,scored){
  if(answered)return;answered=true;if(scored){lessonCorrect++;addXp(stepMistakes?6:10)}else addXp(2);
  animateWorldFeedback(s,true);
  $('feedback').textContent=message;$('feedback').classList.remove('hidden');$('nextStep').classList.remove('hidden');$('hintBtn').classList.add('hidden');$('ccBubble').textContent=stepMistakes?'你找到了错误条件并完成修正。这比一次猜对更重要。':'判断成立。现在试着说明为什么，而不是只记答案。';scores[lessonIndex]=Math.max(scores[lessonIndex]||0,stepIndex+1);save();renderDiagnosis();renderNav();
}

function renderDiagnosis(){
  const l=lessons[lessonIndex],ratio=stepIndex/Math.max(1,l.steps.length-1);
  $('diagnosis').innerHTML=l.skills.map((name,i)=>{const done=ratio>=(i+1)/l.skills.length*.78||completed.has(lessonIndex),mistakes=reasons[name]||0;return `<div><i class="${done?'ok':''}"></i><span>${name}</span><b>${mistakes?`修正${mistakes}次`:done?'已记录':'观察中'}</b></div>`}).join('');
  $('sessionScore').textContent=`${lessonCorrect} / ${scoredTotal(l)}`;
}

$('nextStep').onclick=()=>{if(!answered)return;const l=lessons[lessonIndex];if(stepIndex<l.steps.length-1){stepIndex++;renderStep();window.scrollTo({top:0,behavior:'smooth'})}else completeLesson()};
function completeLesson(){
  const l=lessons[lessonIndex];completed.add(lessonIndex);scores[lessonIndex]=l.steps.length;save();renderNav();const mastery=Math.max(70,100-Math.min(30,lessonMistakes*3));
  const chapterFinished=lessonIndex===lessons.length-1&&completed.size===lessons.length;
  $('completeTitle').textContent=chapterFinished?'第一章主线调查完成':`${l.title} · 探索完成`;$('completeCopy').textContent=chapterFinished?'零点恢复程序已经具备全部条件。现在观看本章结局，确认天文台是否真正恢复。':`你完成了${l.steps.length}个互动节点。下一步由喵伯爵检查你是否真的能解释并迁移这条规律。`;$('masteryValue').textContent=`${mastery}%`;$('bossResult').textContent=mastery>=88?'稳定通过':mastery>=76?'通过待巩固':'建议重练';$('continueCourse').textContent=chapterFinished?'观看第一章结局 →':'进入 AI 能力训练场 →';$('completeOverlay').classList.remove('hidden');
}
function openChapterOutro(){
  stopCcVoice();$('completeOverlay').classList.add('hidden');$('outroOverlay').classList.remove('hidden');
  const video=$('chapterOutroVideo');video.currentTime=0;video.play().catch(()=>{});
  localStorage.setItem('yuanlai_ch1_outro_seen','1');
}
$('continueCourse').onclick=()=>{
  const chapterFinished=lessonIndex===lessons.length-1&&completed.size===lessons.length;
  if(chapterFinished){openChapterOutro();return}
  $('completeOverlay').classList.add('hidden');practiceRound=0;practiceStage=0;practiceWins=0;switchScene('practice')
};
$('replayLesson').onclick=()=>{scores[lessonIndex]=0;completed.delete(lessonIndex);save();startLesson(lessonIndex)};
$('hintBtn').onclick=()=>toast(lessons[lessonIndex].steps[stepIndex].hint||'先找基准、方向、位置或距离中哪一个条件还没有处理。');
$('openMap').onclick=()=>{$('mapOverlay').classList.remove('hidden');renderNav()};$('closeMap').onclick=()=>$('mapOverlay').classList.add('hidden');$('mapOverlay').onclick=e=>{if(e.target===$('mapOverlay'))$('mapOverlay').classList.add('hidden')};

const introSeen=localStorage.getItem('yuanlai_ch1_intro_seen')==='1';
let introReplayMode=false;
if(!introSeen)$('introOverlay').classList.remove('hidden');
$('reopenIntro').onclick=()=>{introReplayMode=true;stopCcVoice();$('introOverlay').classList.remove('hidden');$('chapterIntroVideo').currentTime=0;$('chapterIntroVideo').play().catch(()=>{})};
$('speakLesson').onclick=speakCurrentLesson;
$('enterObservatory').onclick=()=>{localStorage.setItem('yuanlai_ch1_intro_seen','1');$('chapterIntroVideo').pause();$('introOverlay').classList.add('hidden');if(!introReplayMode)startLesson(0);introReplayMode=false};
$('replayIntro').onclick=()=>{$('chapterIntroVideo').currentTime=0;$('chapterIntroVideo').play().catch(()=>{})};
$('chapterIntroVideo').addEventListener('ended',()=>{$('enterObservatory').focus()});
$('replayOutro').onclick=()=>{$('chapterOutroVideo').currentTime=0;$('chapterOutroVideo').play().catch(()=>{})};
$('reviewChapter1').onclick=()=>{$('chapterOutroVideo').pause();$('outroOverlay').classList.add('hidden');$('mapOverlay').classList.remove('hidden');renderNav()};
$('enterChapter2').onclick=()=>{localStorage.setItem('yuanlai_ch2_story_ready','1');location.href='./chapter2-advanced.html'};
$('chapterOutroVideo').addEventListener('ended',()=>{$('enterChapter2').focus()});

document.querySelectorAll('[data-scene]').forEach(button=>button.onclick=()=>switchScene(button.dataset.scene));
$('openAiTeacher').onclick=()=>{switchScene('explore');document.querySelector('.workspace')?.scrollIntoView({behavior:'smooth',block:'start'});$('ccBubble').textContent=`AI老师已切换到当前课程“${lessons[lessonIndex].title}”，会沿用本课知识点继续讲授。`};
$('practiceHint').onclick=()=>{const source=currentPracticeItems()[practiceRound%currentPracticeItems().length];$('socraticBox').innerHTML=`<b>喵伯爵提示</b><p>${source.hint||'先找出题目中的基准、方向或距离。'}</p>`;$('socraticBox').classList.remove('hidden')};
$('startPreventive').onclick=()=>{activeFault=lessons[lessonIndex].skills[0];repairPhase=0;renderRepair()};

renderNav();const firstOpen=lessons.findIndex((_,i)=>!completed.has(i));startLesson(firstOpen<0?0:firstOpen);
const sceneFromHash=()=>{const scene=location.hash.slice(1);if(['explore','practice','repair'].includes(scene))switchScene(scene)};
sceneFromHash();
window.addEventListener('hashchange',sceneFromHash);
