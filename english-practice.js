(function(){
const params=new URLSearchParams(location.search);if(!/^eng7/.test(params.get('book')||''))return;
const samples=[
[/见面问候|问候语|greet people/i,'Good morning, Ms Gao. How are you?','早上好，高老师。你好吗？',['GOOD','MORNING','GAO']],
[/开启对话|start a conversation/i,"Hi, I’m Leo. What’s your name?",'你好，我是Leo。你叫什么名字？',['LEO','WHAT','NAME']],
[/字母|名称音|姓名拼写|26 letters/i,'How do you spell your name? L-E-O.','你的名字怎么拼写？L-E-O。',['HOW','SPELL','NAME','L-E-O']],
[/物品归属|拥有|What do you have/i,'I have a bottle, an eraser and two keys in my schoolbag.','我的书包里有一个水瓶、一块橡皮和两把钥匙。',['HAVE','BOTTLE','ERASER','TWO','KEYS']],
[/位置表达|整理物品|Where do you put/i,'The red hat is on the bed, and the keys are under the desk.','红帽子在床上，钥匙在书桌下面。',['RED','HAT','ON','KEYS','UNDER']],
[/元音辨音|元音字母|Pronunciation: vowels/i,'Listen and compare: bag, desk, six, box, cup.','听一听并比较：bag、desk、six、box、cup。',['BAG','DESK','SIX','BOX','CUP']],
[/庭院观察|What is fun in a yard/i,'What are those? They are apple trees. How many can you see?','那些是什么？它们是苹果树。你能看到多少棵？',['WHAT','THOSE','APPLE','TREES','HOW','MANY']],
[/农场介绍|What is fun on a farm/i,'His uncle has fifteen ducks, seven cows and six sheep on the farm.','他的叔叔在农场有十五只鸭、七头牛和六只羊。',['FIFTEEN','DUCKS','SEVEN','COWS','SIX','SHEEP']],
[/指示代词|this\/that\/these\/those/i,'This is a rabbit, and those are horses near the tree.','这是一只兔子，那些是树旁的马。',['THIS','RABBIT','THOSE','HORSES','TREE']],
[/初次认识|个人信息|How do we get to know/i,"What class are you in, and who’s your class teacher?",'你在哪个班？你的班主任是谁？',['WHAT','CLASS','WHO’S','CLASS','TEACHER']],
[/朋友资料|交友帖|new friend/i,"I like music too, and I’d like to be your friend.",'我也喜欢音乐，我愿意成为你的朋友。',['LIKE','MUSIC','TOO','LIKE','FRIEND']],
[/一般现在时 be|am\/is\/are|Simple present: be/i,"I’m from China, she’s from Singapore, and we’re good friends.",'我来自中国，她来自新加坡，我们是好朋友。',['CHINA','SHE’S','SINGAPORE','WE’RE','FRIENDS']],
[/家庭关系|家庭树|What is your family like/i,"This is my aunt, and her son is my cousin.",'这是我的阿姨，她的儿子是我的表兄弟。',['THIS','AUNT','SON','COUSIN']],
[/家庭特点|行动和共同经历|What do you like about your family/i,"My sister is helpful because she always listens to me.",'我的姐姐很乐于助人，因为她总是认真听我说话。',['SISTER','HELPFUL','BECAUSE','ALWAYS','LISTENS']],
[/一般现在时 do\/does|名词所有格|Simple present: do/i,"Does your brother play chess, and is this your father’s board?",'你哥哥下国际象棋吗？这是你爸爸的棋盘吗？',['DOES','BROTHER','PLAY','FATHER’S','BOARD']],
[/校园与教室定位|校园方位|What is your school like/i,'The student centre is between the library and the gym.','学生活动中心在图书馆和体育馆之间。',['STUDENT','CENTRE','BETWEEN','LIBRARY','GYM']],
[/校园邮件|地点—位置—活动—理由|What fun things do you do at school/i,'The dining hall is across from the sports field, and Peter likes the food there.','餐厅在运动场对面，Peter喜欢那里的食物。',['DINING','HALL','ACROSS','SPORTS','FIELD','LIKES','FOOD']],
[/There be|校园导览|prepositions/i,"There are some trees in front of the sports field, but there aren’t any lockers.",'运动场前有一些树，但教室里没有储物柜。',['THERE','TREES','IN','FRONT','SPORTS','FIELD','AREN’T','LOCKERS']],
[/学科偏好|采访与转述|Why do you like this subject/i,"My favourite subject is history because it’s interesting to learn about the past.",'我最喜欢历史，因为了解过去很有趣。',['FAVOURITE','HISTORY','BECAUSE','INTERESTING','PAST']],
[/跨学科学习价值|人物帖子|What can you learn from different subjects/i,'In maths, we learn to work out problems, and I want to be a scientist.','在数学课上，我们学习解决问题，我将来想成为科学家。',['MATHS','LEARN','WORK','OUT','PROBLEMS','SCIENTIST']],
[/并列连词|and、but、because|Conjunctions/i,"Biology is difficult but important, and I like it because the class is exciting.",'生物虽然难却很重要，我喜欢它，因为课堂很有趣。',['BIOLOGY','DIFFICULT','BUT','IMPORTANT','BECAUSE','EXCITING']],
[/选择学校社团|兴趣、已有能力|How do you choose a school club/i,"I want to join the music club because I can sing, and I’d like to learn the guitar.",'我想加入音乐社团，因为我会唱歌，也想学习吉他。',['WANT','JOIN','MUSIC','BECAUSE','SING','LEARN','GUITAR']],
[/读取社团广告|申请邮件|What can you learn from school clubs/i,"I’m interested in the book club, and I’d love to read more and share my ideas.",'我对读书社感兴趣，想阅读更多并分享自己的想法。',['INTERESTED','BOOK','CLUB','LOVE','READ','SHARE','IDEAS']],
[/情态动词 can|can句型|Modal verbs/i,"Leo can build models but can’t program, so Mia can help him.",'Leo会搭模型但不会编程，所以Mia可以帮助他。',['LEO','CAN','BUILD','MODELS','CAN’T','PROGRAM','MIA','HELP']],
[/读时钟|学校日作息|How do you spend your school day/i,'What time do you get up? I get up at a quarter to seven.','你几点起床？我六点四十五起床。',['WHAT','TIME','GET','UP','QUARTER','SEVEN']],
[/不同地区的日常作息|Timo|How different are people’s daily routines/i,"Timo’s school starts at nine, and he reads with his parents after dinner.",'Timo的学校九点开始上课，晚饭后他和父母一起阅读。',['TIMO’S','SCHOOL','STARTS','NINE','READS','PARENTS','DINNER']],
[/时间表达、Wh问句|句子重音|Sentence stress/i,'What time does Tom go to bed? He goes to bed at half past nine.','Tom几点睡觉？他九点半睡觉。',['WHAT','TIME','TOM','GO','BED','HALF','PAST','NINE']],
[/生日日期、邀请和购物|How do we celebrate birthdays/i,'When is Helen’s birthday? It’s on 3rd December.','Helen的生日是什么时候？是12月3日。',['WHEN','HELEN’S','BIRTHDAY','3RD','DECEMBER']],
[/读生日帖并写有理由的回复|How do you make your birthday meaningful/i,'I take a family photo because it helps me remember our time together.','我拍一张家庭合照，因为它能帮我记住我们一起度过的时光。',['TAKE','FAMILY','PHOTO','BECAUSE','REMEMBER','TOGETHER']],
[/序数词、日期与疑问词|Ordinal numbers/i,'My birthday is on 11th July, and hers is on 23rd July.','我的生日是7月11日，她的生日是7月23日。',['BIRTHDAY','11TH','JULY','HERS','23RD','JULY']],
[/Hello|conversation|know each other/i,'Hello, my name is Leo. Nice to meet you.','你好，我叫Leo。很高兴认识你。',['NAME','NICE','MEET']],
[/tidy|things|put/i,'I put my books on the desk and my bag under the chair.','我把书放在桌上，把书包放在椅子下面。',['BOOKS','DESK','BAG','CHAIR']],
[/school|yard|farm/i,'There is a science lab next to the library.','科学实验室在图书馆旁边。',['SCIENCE','LAB','NEXT','LIBRARY']],
[/family/i,'My family always listens to and supports one another.','我的家人总是互相倾听和支持。',['FAMILY','LISTENS','SUPPORTS']],
[/subject/i,'Physics is my favourite subject because experiments help me understand the world.','物理是我最喜欢的学科，因为实验帮助我理解世界。',['PHYSICS','FAVOURITE','EXPERIMENTS','WORLD']],
[/club/i,'I can design a model and explain how it works.','我能设计一个模型并解释它如何工作。',['DESIGN','MODEL','EXPLAIN','WORKS']],
[/day|routine|birthday|special/i,'I usually get up at seven, but yesterday I got up at eight.','我通常七点起床，但昨天八点才起床。',['USUALLY','SEVEN','YESTERDAY','EIGHT']],
[/animal/i,'Elephants are strong, intelligent, and important to their ecosystems.','大象强壮、聪明，对生态系统非常重要。',['ELEPHANTS','STRONG','INTELLIGENT','ECOSYSTEMS']],
[/rule|order/i,'You must follow the rules and keep the laboratory safe.','你必须遵守规则并保证实验室安全。',['MUST','RULES','LABORATORY','SAFE']],
[/fit|sport|exercise/i,'I exercise three times a week to keep fit.','我每周锻炼三次来保持健康。',['EXERCISE','THREE','WEEK','FIT']],
[/eat|food/i,'We need some vegetables, but we do not need much sugar.','我们需要一些蔬菜，但不需要太多糖。',['VEGETABLES','NOT','MUCH','SUGAR']],
[/weather|rain|shine/i,'It is raining now, so we are staying inside.','现在正在下雨，所以我们待在室内。',['RAINING','NOW','STAYING','INSIDE']],
[/story|Once|past/i,'The scientist observed the light and recorded what happened.','这位科学家观察光线，并记录了发生的事情。',['SCIENTIST','OBSERVED','LIGHT','RECORDED']]
];
const pick=title=>samples.find(x=>x[0].test(title))||['','I can describe the idea clearly and give one example.','我能清楚地描述这个概念并举出一个例子。',['DESCRIBE','CLEARLY','GIVE','EXAMPLE']];
let recorder,chunks=[],audioUrl='',lastTitle='';
function render(){const root=document.getElementById('englishPractice'),title=document.getElementById('sectionTitle')?.textContent||'';if(title===lastTitle&&root.childElementCount)return;lastTitle=title;const s=pick(title),words=s[1].replace(/[.,!?]/g,'').split(' ');root.hidden=false;root.innerHTML=`<div class="english-lab-head"><div><small>英语听说练习</small><h3>听懂意思，再练重音和表达</h3></div><span>录音仅保存在本设备，不上传</span></div><p class="practice-sentence">${words.map(w=>`<button data-word="${w.toUpperCase()}">${w}</button>`).join(' ')}</p><p class="translation">${s[2]}</p><div class="practice-tools"><button id="stressBtn">显示句子重音</button><button id="demoVoice">▶ 听喵伯爵讲本步</button><button id="recordBtn">● 开始录音</button><button id="playBtn" disabled>▶ 回放录音</button></div><div class="record-status" id="recordStatus">先理解整句，再录制自己的版本。</div><div class="self-check"><label><input type="checkbox"> 重读关键词</label><label><input type="checkbox"> 意群之间有停顿</label><label><input type="checkbox"> 语法准确</label><label><input type="checkbox"> 表达完整</label></div>`;
root.querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>b.classList.toggle('selected'));
document.getElementById('stressBtn').onclick=()=>root.querySelectorAll('[data-word]').forEach(b=>b.classList.toggle('stress',s[3].includes(b.dataset.word)));
document.getElementById('demoVoice').onclick=()=>document.querySelector('.voice button')?.click();
document.getElementById('recordBtn').onclick=record;
document.getElementById('playBtn').onclick=()=>{if(audioUrl)new Audio(audioUrl).play()};
}
async function record(){const btn=document.getElementById('recordBtn'),status=document.getElementById('recordStatus');if(recorder?.state==='recording'){recorder.stop();btn.textContent='● 重新录音';return}try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>chunks.push(e.data);recorder.onstop=()=>{if(audioUrl)URL.revokeObjectURL(audioUrl);audioUrl=URL.createObjectURL(new Blob(chunks,{type:recorder.mimeType}));document.getElementById('playBtn').disabled=false;status.textContent='录音完成。回放后按四项标准自检；录音不会上传。';stream.getTracks().forEach(t=>t.stop())};recorder.start();btn.textContent='■ 停止录音';status.textContent='正在录音……读完整句子后点击停止。'}catch(e){status.textContent='没有获得麦克风权限。请允许浏览器使用麦克风后重试。'}}
const title=document.getElementById('sectionTitle');new MutationObserver(render).observe(title,{childList:true,subtree:true});render();
})();
