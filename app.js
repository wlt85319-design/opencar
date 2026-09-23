const values = Array.from({ length: 21 }, (_, i) => i - 10);
const tasks = [
  { first: 5, second: -3, result: 2, firstDirection: '右', secondDirection: '左', type: 'opposite', lesson: 'addition', transfer: { question: '−8 + (+3) = ?', options: [-11,-5,5], answer: -5, context: '这次换成负方向占优。抵消之后，剩下的方向会变吗？', explanation: '向左8格与向右3格抵消，仍剩向左5格，所以是 −5。' } },
  { first: -6, second: 4, result: -2, firstDirection: '左', secondDirection: '右', type: 'opposite', lesson: 'addition', transfer: { question: '+9 + (−4) = ?', options: [13,5,-5], answer: 5, context: '把左右方向再次交换，检验你是否真的掌握“哪边剩下”。', explanation: '向右9格与向左4格抵消，剩向右5格，所以是 +5。' } },
  { first: 3, second: 4, result: 7, firstDirection: '右', secondDirection: '右', type: 'same', lesson: 'addition', transfer: { question: '−2 + (−5) = ?', options: [-7,-3,7], answer: -7, context: '原题都向右；现在两次都向左，距离还会怎样变化？', explanation: '方向相同就累积：向左2格再向左5格，共向左7格，所以是 −7。' } },
  { first: 5, second: -3, result: 2, firstDirection: '右', secondDirection: '左', type: 'opposite', lesson: 'subtraction', subtype: 'subtract-positive', displayFirst: 5, displaySecond: 3, operator: '−', transfer: { question: '+8 − (+5) = ?', options: [13,3,-3], answer: 3, context: '位置和撤销的距离都换了：撤销一次向右运动，会往哪边退？', explanation: '减去 +5 是撤销向右5格：从 +8 向左退5格，到达 +3。' } },
  { first: -2, second: 4, result: 2, firstDirection: '左', secondDirection: '右', type: 'opposite', lesson: 'subtraction', subtype: 'subtract-negative', displayFirst: -2, displaySecond: -4, operator: '−', transfer: { question: '+1 − (−6) = ?', options: [-5,5,7], answer: 7, context: '起点换到正数一侧。撤销“向左6格”后，位置会怎样变化？', explanation: '减去 −6 是撤销向左6格，效果等于向右6格：+1 向右6格到 +7。' } },
  { first: 5, second: -2, third: 3, result: 6, firstDirection: '右', secondDirection: '左', type: 'opposite', lesson: 'mixed', expression: '+5 + (−2) + (+3)', moves: [5,-2,3], energyA: 8, energyB: -2, transfer: { question: '−4 + (+7) + (−2) = ?', options: [-13,1,5], answer: 1, context: '路线换了：先向左，再向右，最后又后退。你能在脑中走完吗？', explanation: '从0向左4格到−4，再向右7格到+3，最后向左2格，到达 +1。' } },
  { first: -3, second: 2, third: -4, result: -5, firstDirection: '左', secondDirection: '右', type: 'opposite', lesson: 'mixed', expression: '−3 − (−2) − (+4)', moves: [-3,2,-4], energyA: 2, energyB: -7, transfer: { question: '+2 − (−5) − (+3) = ?', options: [-6,4,10], answer: 4, context: '两个减号作用不同：先撤销向左，再撤销向右。', explanation: '+2−(−5)−(+3) 可看成向右2、向右5、向左3，最后到达 +4。' } },
  { first: -2, second: -2, third: -2, result: -6, firstDirection: '左', secondDirection: '左', type: 'product', lesson: 'multiplication', expression: '(+3) × (−2)', moves: [-2,-2,-2], factors: [3,-2], transfer: { question: '(−4) × (+2) = ?', options: [-8,-6,8], answer: -8, context: '因数的位置和大小都变了，先判断符号，再计算绝对值。', explanation: '负号与正号不同号，积取负号；4×2=8，所以结果是 −8。' } },
  { first: 2, second: 2, third: 2, result: 6, firstDirection: '右', secondDirection: '右', type: 'product', lesson: 'multiplication', expression: '(−3) × (−2)', moves: [2,2,2], factors: [-3,-2], transfer: { question: '(−4) × (−2) = ?', options: [-8,6,8], answer: 8, context: '这次仍是两个负数，但绝对值换了。符号规律还能迁移吗？', explanation: '两个因数同号，积取正号；4×2=8，所以结果是 +8。' } }
];
function loadCompletedTasks() {
  try { return new Set(JSON.parse(localStorage.getItem('yuanlai_completed_tasks') || '[]')); }
  catch { return new Set(); }
}
const state = { phase: 1, prediction: null, hints: 0, totalHints: 0, motionPlayed: false, taskIndex: 0, xp: 0, combo: 1, transferErrors: { addition: 0, subtraction: 0, mixed: 0, multiplication: 0 }, transferPassed: new Set(), completedTasks: loadCompletedTasks() };
const $ = (id) => document.getElementById(id);
const numberLine = $('numberLine');
const robot = $('robot');

values.forEach((value) => {
  const tick = document.createElement('span');
  tick.className = `tick${value === 0 ? ' zero' : ''}`;
  tick.classList.add(value < 0 ? 'negative' : value > 0 ? 'positive' : 'origin');
  tick.dataset.value = value;
  tick.style.left = `${((value + 10) / 20) * 100}%`;
  const point = trackPoint(value);
  tick.style.setProperty('--path-x', `${point.x}%`);
  tick.style.setProperty('--path-y', `${point.y}%`);
  tick.style.setProperty('--path-scale', `${point.scale}`);
  tick.innerHTML = `<b>${value}</b>`;
  tick.addEventListener('click', () => choosePrediction(value));
  numberLine.appendChild(tick);
});

function positionFor(value) { return 5 + ((value + 10) / 20) * 90; }
function movementX(value) {
  return $('world')?.classList.contains('bridge-stage') ? trackPoint(value).x : positionFor(value);
}
function trackPoint(value) {
  const bridge = $('world') && $('world').classList.contains('bridge-stage');
  if (bridge) {
    // Exact centres of the nineteen baked number stones: −9 through +9.
    const stones = [
      [3.3,82.6,1.11], [8.7,79.7,1.10], [14.2,76.9,1.09],
      [19.7,74.2,1.08], [25.2,71.4,1.07], [30.6,68.8,1.06],
      [35.7,66.1,1.05], [41.0,63.7,1.04], [46.4,61.2,1.03],
      [53.8,60.6,1.00], [59.3,58.0,.99], [63.7,55.7,.98],
      [68.2,53.5,.97], [72.9,51.0,.96], [77.3,48.8,.95],
      [81.7,46.5,.94], [86.1,44.4,.93], [90.5,42.4,.92],
      [94.9,40.5,.91]
    ];
    const bounded=Math.max(-9,Math.min(9,value));
    const raw=bounded+9, lower=Math.floor(raw), upper=Math.ceil(raw), mix=raw-lower;
    const a=stones[lower], b=stones[upper];
    return {x:a[0]+(b[0]-a[0])*mix,y:a[1]+(b[1]-a[1])*mix,scale:a[2]+(b[2]-a[2])*mix};
  }
  const progress = (value + 10) / 20;
  return { x: 8 + progress * 84, y: 83 - progress * 40, scale: 1.08 - progress * .22 };
}
function configureTrack() {
  const bridge = $('world').classList.contains('bridge-stage');
  document.querySelectorAll('.tick').forEach((tick) => {
    const value = Number(tick.dataset.value);
    tick.hidden = bridge && (value < -9 || value > 9);
    const point = trackPoint(value);
    tick.style.setProperty('--path-x', `${point.x}%`);
    tick.style.setProperty('--path-y', `${point.y}%`);
    tick.style.setProperty('--path-scale', `${point.scale}`);
  });
}
function signed(value) { return `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value)}`; }
function taskNow() { return tasks[state.taskIndex]; }
function taskMoves(task=taskNow()) { return task.moves || [task.first,task.second]; }
function saveCompletedTasks() {
  try { localStorage.setItem('yuanlai_completed_tasks',JSON.stringify([...state.completedTasks])); } catch {}
}
function setRobot(value, immediate = false) {
  if (immediate) robot.style.transition = 'none';
  if ($('world').classList.contains('bridge-stage')) {
    const point=trackPoint(value);
    robot.style.left=`${point.x}%`; robot.style.top=`${point.y - 22}%`; robot.style.bottom='auto';
    $('avatarSpeech').style.left=`${point.x}%`; $('avatarSpeech').style.top=`${point.y - 27}%`; $('avatarSpeech').style.bottom='auto';
  } else {
    robot.style.left = `${positionFor(value)}%`; robot.style.top=''; robot.style.bottom='104px';
    $('avatarSpeech').style.left = `${positionFor(value)}%`; $('avatarSpeech').style.top=''; $('avatarSpeech').style.bottom='200px';
  }
  $('world').classList.toggle('focus-positive', value > 0);
  $('world').classList.toggle('focus-negative', value < 0);
  $('world').style.setProperty('--camera-shift', `${value * .55}%`);
  if (immediate) requestAnimationFrame(() => robot.style.transition = '');
  numberLine.setAttribute('aria-valuenow', String(value));
}
function drawJourney(from,to,index) {
  if (!$('world').classList.contains('bridge-stage')) return;
  const layer=$('journeyLayer'), steps=Math.max(3,Math.abs(to-from)*2);
  for(let i=1;i<=steps;i++) {
    const value=from+(to-from)*(i/steps), point=trackPoint(value), paw=document.createElement('i');
    paw.className=`journey-paw leg-${index+1}`; paw.textContent=i===steps?'➜':'●';
    paw.style.left=`${point.x}%`; paw.style.top=`${point.y - 1}%`; paw.style.animationDelay=`${i*.08}s`;
    layer.appendChild(paw);
  }
}
function updateMoveSequence(active = -1, completed = -1) {
  taskMoves().forEach((move, index) => {
    const el = $(`moveStep${index + 1}`);
    if (!el) return;
    el.classList.toggle('active', index === active);
    el.classList.toggle('done', index <= completed);
    el.querySelector('span').textContent = move >= 0 ? '向前' : '向后';
    el.querySelector('b').textContent = signed(move);
  });
}
function markTrackPosition(value) {
  document.querySelectorAll('.tick').forEach(t => t.classList.toggle('reached', Number(t.dataset.value) === value));
}
function choosePrediction(value) {
  if (state.phase !== 1) return;
  state.prediction = value;
  document.querySelectorAll('.tick').forEach(t => t.classList.toggle('selected', Number(t.dataset.value) === value));
  $('predictionLabel').textContent = `我预测终点是 ${value > 0 ? '+' : ''}${value}`;
  $('submitPrediction').disabled = false;
  $('submitPrediction').innerHTML = '提交这个预测 <span>→</span>';
  setRobot(value);
  $('avatarSpeech').textContent = `我选 ${signed(value)}`;
  $('finishBeacon').style.left = `${positionFor(value)}%`;
  if ($('world').classList.contains('bridge-stage')) {
    const point=trackPoint(value); $('finishBeacon').style.left=`${point.x}%`; $('finishBeacon').style.top=`${point.y - 8}%`; $('finishBeacon').style.bottom='auto';
  }
  $('finishBeacon').classList.add('visible');
  $('finishBeacon').querySelector('span').textContent = `预测终点 ${signed(value)}`;
  const trace = $('predictionTrace');
  trace.style.left = `${Math.min(movementX(0),movementX(value))}%`;
  trace.style.width = `${Math.abs(movementX(value)-movementX(0))}%`;
  spawnRipple(value);
}

function addXp(amount) {
  state.xp += amount; $('xpValue').textContent = state.xp;
  $('comboValue').textContent = `×${state.combo}`;
}
function spawnRipple(value) {
  const ripple = document.createElement('i'); ripple.className = 'click-ripple';
  ripple.style.left = `${positionFor(value)}%`; $('world').appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}
function burst(value = taskNow().result, count = 18) {
  const layer = $('particleLayer');
  for (let i=0;i<count;i++) {
    const p=document.createElement('i'); p.className='particle';
    p.style.left=`${positionFor(value)}%`; p.style.top='55%';
    p.style.setProperty('--dx',`${(Math.random()-.5)*150}px`);
    p.style.setProperty('--dy',`${-20-Math.random()*110}px`);
    layer.appendChild(p); setTimeout(()=>p.remove(),900);
  }
}
function makeTokens(container, value) {
  container.innerHTML='';
  for(let i=0;i<Math.abs(value);i++) {
    const t=document.createElement('i'); t.className=`energy-token ${value<0?'left':'right'}`; t.textContent=value<0?'←':'→'; container.appendChild(t);
  }
}
function renderEnergy(task) {
  $('energyBoard').classList.remove('hidden');
  $('energyStatus').textContent=task.lesson==='multiplication'?'符号决定方向，绝对值决定距离':task.lesson==='mixed'?'把三步合并成左右两股方向能量':task.lesson==='subtraction'?'观察“撤销”如何改变方向':'观察两股方向能量会发生什么';
  $('energyOperator').textContent=task.lesson==='multiplication'?'合成':task.type==='same'?'累积':'抵消';
  $('energyLabelA').textContent=task.lesson==='multiplication'?`符号门 ${signed(task.factors[0])} × ${signed(task.factors[1])} → ${task.result>0?'正方向':'负方向'}`:task.lesson==='mixed'?`向右合计 ${Math.abs(task.energyA)} 格`:task.lesson==='subtraction'?`当前位置 ${signed(task.first)}`:`第一步 ${signed(task.first)} · 向${task.firstDirection}`;
  $('energyLabelB').textContent=task.lesson==='multiplication'?`距离 ${Math.abs(task.factors[0])} × ${Math.abs(task.factors[1])} = ${Math.abs(task.result)}`:task.lesson==='mixed'?`向左合计 ${Math.abs(task.energyB)} 格`:task.lesson==='subtraction'?`撤销 ${signed(task.displaySecond)} → 向${task.secondDirection}`:`第二步 ${signed(task.second)} · 向${task.secondDirection}`;
  makeTokens($('energyA'),task.lesson==='multiplication'?task.result:task.lesson==='mixed'?task.energyA:task.first); makeTokens($('energyB'),task.lesson==='multiplication'?0:task.lesson==='mixed'?task.energyB:task.second);
  $('energyResult').innerHTML='<span>?</span><small>等待抵消</small>';
}
async function resolveEnergy(task) {
  const a=[...$('energyA').children], b=[...$('energyB').children];
  if(task.lesson==='multiplication') {
    $('energyStatus').textContent=task.result>0?'同号：积朝正方向':'异号：积朝负方向';
    a.forEach((x,i)=>setTimeout(()=>x.classList.add('survivor'),i*70));
    await new Promise(r=>setTimeout(r,550));
  } else if(task.type==='opposite') {
    $('energyStatus').textContent='方向相反：一对一抵消';
    const pairs=Math.min(a.length,b.length);
    for(let i=0;i<pairs;i++) { a[a.length-1-i].classList.add('cancelled'); b[i].classList.add('cancelled'); await new Promise(r=>setTimeout(r,150)); }
    [...a,...b].filter(x=>!x.classList.contains('cancelled')).forEach(x=>x.classList.add('survivor'));
  } else {
    $('energyStatus').textContent='方向相同：能量累积';
    [...a,...b].forEach((x,i)=>setTimeout(()=>x.classList.add('survivor'),i*80));
    await new Promise(r=>setTimeout(r,550));
  }
  const resultLabel=task.lesson==='multiplication'?'积的方向与距离':task.lesson==='mixed'?'三步合并后的终点':task.lesson==='subtraction'?'撤销后的新位置':task.type==='opposite'?'抵消后剩余':'同向累积';
  $('energyResult').innerHTML=`<span>${signed(task.result)}</span><small>${resultLabel}</small>`;
  burst(task.result,12);
}
function addMessage(text, student = false) {
  const p = document.createElement('p');
  p.className = `cc-message${student ? ' student-message' : ''}`;
  p.innerHTML = text;
  $('dialogue').appendChild(p);
  $('dialogue').scrollTop = $('dialogue').scrollHeight;
}
function toast(text) {
  $('toast').textContent = text; $('toast').classList.add('show');
  setTimeout(() => $('toast').classList.remove('show'), 1700);
}
function updateStep(step) {
  state.phase = step;
  $('progressText').textContent = `0${step} / 04`;
  document.querySelectorAll('.step-list li').forEach((li, i) => {
    li.classList.toggle('active', i + 1 === step); li.classList.toggle('done', i + 1 < step);
    if (i + 1 < step) li.querySelector('i').textContent = '✓';
  });
  const guide = $('actionGuide');
  const copy = {
    1: ['①', '点击数字轨道，预测喵伯爵最后停下的位置'],
    2: ['②', `启动行动，观察喵伯爵${taskMoves().length===3?'连续三步':'两次'}运动`],
    3: ['③', `选择一个理由，解释为什么结果是 ${signed(taskNow().result)}`],
    4: ['④', '完成一道举一反三，证明你能把规律迁移到新题']
  }[step];
  $('actionNumber').textContent = copy[0]; $('actionText').textContent = copy[1];
  guide.classList.remove('attention'); requestAnimationFrame(() => guide.classList.add('attention'));
}
function markThinking(index, label, value, pass = false) {
  const rows = document.querySelectorAll('.thinking-card>div');
  rows[index].querySelector('i').className = pass ? 'pass' : 'active';
  $(label).textContent = value;
}

const campaignStages=[
  {task:0,name:'找到零点',title:'第一关：找回零点坐标',copy:'先不要计算。看清 +5 表示向右、−3 表示向左；点击石桥上的数字，预测喵伯爵最终停在哪里，再播放运动验证你的判断。',ability:'零点定位员',abilityCopy:'你能把正负号翻译成左右方向，并准确定位终点。',success:'第一枚坐标核心已复原，零点重新出现在星桥中央。'},
  {task:1,name:'穿越负区',title:'负数区域失去照明',copy:'交换方向后，原来的规律还成立吗？带喵伯爵安全穿过负数区。',ability:'负向导航员',abilityCopy:'你能在负数区域比较两段相反方向的距离。',success:'负数区域重新亮起，向左不再意味着迷路。'},
  {task:3,name:'修复方向门',title:'撤销装置发生故障',copy:'减法不是魔法。看清“撤销一次运动”究竟会让方向怎样变化。',ability:'撤销机关破解者',abilityCopy:'你能把减法理解为撤销一次运动，而不是死记符号。',success:'方向门恢复响应，减去正数的行动路线已经校准。'},
  {task:5,name:'连续星轨',title:'三枚坐标核心散落了',copy:'每一步都要从上一步的终点继续。走完三段星轨，重新点亮坐标核心。',ability:'三步轨迹规划师',abilityCopy:'你能保留中间位置，连续完成三段方向运动。',success:'三枚坐标核心连成星轨，连续运算通道已经开启。'},
  {task:6,name:'双重撤销',title:'两个减号扰乱了坐标',copy:'逐个翻译动作，不要让两个减号混在一起。找回真正的终点。',ability:'符号翻译专家',abilityCopy:'你能逐个翻译减号和括号，不被连续符号干扰。',success:'双重撤销装置已解除，混乱的符号重新各司其职。'},
  {task:7,name:'终极验证',title:'符号门最终验证',copy:'没有完整演示，靠你判断方向和距离，证明零点天文台已经修复。',ability:'零点守护者',abilityCopy:'你能把符号方向与绝对值距离分开判断并完成验证。',success:'零点天文台全部复原。你已经完成“零点失踪案”六关调查。'}
];
function currentCampaignStage(){
  const alias={2:0,4:3,8:7}[state.taskIndex] ?? state.taskIndex;
  return campaignStages.find(stage=>stage.task===alias) || campaignStages.at(-1);
}
function updateCampaign(){
  const current=currentCampaignStage(), currentIndex=campaignStages.indexOf(current);
  $('campaignProgress').textContent=currentIndex===campaignStages.length-1?'第 6 关 / 6 · BOSS':`第 ${currentIndex+1} 关 / 6`;
  document.querySelectorAll('[data-campaign-task]').forEach((node,index)=>{
    const task=Number(node.dataset.campaignTask);
    node.classList.toggle('active',task===current.task);
    node.classList.toggle('done',state.completedTasks.has(task)||index<currentIndex);
  });
}
function showMissionBriefing(){
  const stage=currentCampaignStage(), index=campaignStages.indexOf(stage);
  $('briefingCode').textContent=index===campaignStages.length-1?'BOSS · 终极验证':`CASE 0${index+1} · ${stage.name}`;
  $('briefingTitle').textContent=stage.title; $('briefingCopy').textContent=stage.copy;
  $('missionBriefing').classList.remove('hidden');
}

$('submitPrediction').addEventListener('click', () => {
  const answer = state.prediction;
  const task = taskNow();
  addMessage(`我觉得终点是 <b>${answer > 0 ? '+' : ''}${answer}</b>。`, true);
  if (answer === task.result) {
    state.combo++; addXp(10);
    markThinking(0, 'directionState', '判断正确', true);
    addMessage(`很好。你先判断出了最后仍在 <b>0 的${task.result > 0 ? '右' : '左'}边</b>。现在让${task.lesson==='mixed'?'三步':'两次'}运动真正发生，看看你的预测是否一致。`);
    $('predictPanel').classList.add('hidden'); $('observePanel').classList.remove('hidden');
    document.querySelectorAll('.tick').forEach(t => t.classList.remove('selected'));
    setRobot(0, true); $('avatarSpeech').textContent = '准备验证'; $('predictionTrace').style.width = '0'; updateStep(2);
  } else {
    state.hints++; state.totalHints++;
    markThinking(0, 'directionState', answer < 0 ? '方向混淆' : '位置偏差');
    const sumDistance = Math.abs(task.first) + Math.abs(task.second);
    const feedback = task.lesson==='multiplication'
      ? `先把乘法拆成两个判断：${task.factors[0]} 和 ${task.factors[1]} 是同号还是异号？再计算 ${Math.abs(task.factors[0])}×${Math.abs(task.factors[1])}。`
      : task.lesson==='mixed'
      ? `这是一条三步路径。先把算式翻译成 ${taskMoves(task).map(signed).join('、')} 三次运动，再按顺序找终点。`
      : Math.abs(answer) === sumDistance
      ? `你似乎把两段距离直接相加了。但第二次实际向${task.secondDirection}移动，先观察方向是否相同。`
      : answer < 0
        ? `你判断最后在左边。再比较一下：向${task.firstDirection}走了 ${Math.abs(task.first)} 格，向${task.secondDirection}走了 ${Math.abs(task.second)} 格，哪一段更长？`
        : `方向接近了，但终点位置还不对。试着先走到 ${signed(task.first)}，再从那里向${task.secondDirection}数 ${Math.abs(task.second)} 格。`;
    addMessage(feedback);
    $('world').classList.remove('shake'); requestAnimationFrame(()=>$('world').classList.add('shake'));
    state.combo=1; $('comboValue').textContent='×1';
    $('submitPrediction').disabled = true;
    $('submitPrediction').innerHTML = '重新选择后提交 <span>→</span>';
    toast('这次不算错，喵伯爵已找到一个思考线索');
    if(state.hints===2) setTimeout(()=>{
      microStep=0; renderMicroLesson(); $('microLesson').classList.remove('hidden'); $('microLessonTrigger').classList.add('hidden'); speakMicroStep();
      addMessage('你已经尝试了两次。喵伯爵不直接给答案，我们先做一个很短的方向实验，再回来挑战。');
      $('microLesson').scrollIntoView({behavior:'smooth',block:'center'});
    },500);
  }
});

$('playMotion').addEventListener('click', async () => {
  if (state.motionPlayed) return;
  state.motionPlayed = true; $('playMotion').disabled = true;
  $('playMotion').innerHTML = '正在播放，请看数轴… <span>●</span>';
  const task = taskNow();
  renderEnergy(task);
  // The submit step has already returned the character to zero. Do not reset
  // it again here: a second forced layout caused the visible flash.
  robot.classList.remove('walking','hop','facing-left');
  robot.classList.add('lesson-motion');
  const moves=taskMoves(task), traces=[$('traceOne'),$('traceTwo'),$('traceThree')];
  let position=0;
  for(let i=0;i<moves.length;i++) {
    const next=position+moves[i], trace=traces[i];
    updateMoveSequence(i, i - 1);
    // Keep the approved rear three-quarter artwork in one orientation. The
    // mirrored cane/hat image looked like a different character between legs.
    robot.classList.remove('facing-left');
    drawJourney(position,next,i);
    $('avatarSpeech').textContent=`第${['一','二','三'][i]}步：${signed(moves[i])}`;
    trace.style.left=`${Math.min(movementX(position),movementX(next))}%`;
    trace.style.width=`${Math.abs(movementX(next)-movementX(position))}%`;
    trace.classList.remove('running','reverse');
    trace.classList.toggle('reverse',next<position);
    void trace.offsetWidth; trace.classList.add('running');
    setRobot(next); position=next;
    await new Promise(r=>setTimeout(r,1620));
    markTrackPosition(position); updateMoveSequence(-1, i);
    await new Promise(r=>setTimeout(r,420));
  }
  robot.classList.remove('lesson-motion'); $('formulaResult').textContent = signed(task.result);
  $('avatarSpeech').textContent = `到站 ${signed(task.result)} ✦`;
  $('finishBeacon').querySelector('span').textContent = `真实终点 ${signed(task.result)}`;
  $('finishBeacon').classList.add('arrived');
  await resolveEnergy(task);
  markThinking(1, 'distanceState', task.lesson==='multiplication'?'分组完成':task.lesson==='mixed'?'三步贯通':task.lesson==='subtraction'?'看见撤销':'看见抵消', true);
  addMessage(task.lesson==='multiplication'
    ? `先由符号门决定方向：${task.factors[0]*task.factors[1]>0?'同号向右':'异号向左'}；再把 <b>${Math.abs(task.factors[0])} 组、每组 ${Math.abs(task.factors[1])} 格</b>合成总距离 ${Math.abs(task.result)}。`
    : task.lesson==='mixed'
    ? `依次完成三段行动：<b>${taskMoves(task).map(signed).join(' → ')}</b>，中间位置是 <b>${taskMoves(task).reduce((points,move)=>{ points.push((points.at(-1)||0)+move); return points; },[]).map(signed).join(' → ')}</b>。现在请解释为什么不能跳过中间位置。`
    : task.lesson==='subtraction'
    ? (task.subtype==='subtract-negative'
        ? `注意这次最关键的变化：撤销一次“向左 4 格”，喵伯爵反而向<b>右走 4 格</b>。这就是减去负数会改变方向。`
        : `减去正数，等于撤销向右的距离，所以喵伯爵从 ${signed(task.first)} 向<b>左走 ${Math.abs(task.second)} 格</b>。`)
    : task.type === 'same'
      ? `你看见了吗？两次都向${task.firstDirection}，距离会共同累积，最后到达 <b>${signed(task.result)}</b>。现在请你说出规律。`
      : `你看见了吗？两个相反方向先抵消，最后还剩 <b>向${task.result > 0 ? '右' : '左'} ${Math.abs(task.result)} 格</b>。但我还要确认：你理解的是画面，还是规律。`);
  $('observePanel').classList.add('hidden'); $('reasonPanel').classList.remove('hidden'); updateStep(3);
  $('reasonPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

document.querySelectorAll('[data-reason]').forEach(btn => btn.addEventListener('click', () => {
  if (btn.dataset.reason === 'correct') {
    btn.classList.add('correct');
    document.querySelectorAll('[data-reason]').forEach(b => b.disabled = true);
    markThinking(2, 'signState', '概念通过', true);
    state.combo++; addXp(30); burst(taskNow().result,24);
    document.querySelectorAll('.world-reward i').forEach((i,idx)=>{ if(idx<Math.min(3,state.taskIndex+1)) i.classList.add('earned'); });
    addMessage(taskNow().lesson==='multiplication'
      ? '对。<b>有理数乘法分两步：同号得正、异号得负；再把绝对值相乘。</b>'
      : taskNow().lesson==='mixed'
      ? '对。<b>混合运算不是同时计算：先把每一项翻译成一次有方向的运动，再从左到右连续完成。</b>'
      : taskNow().lesson==='subtraction'
      ? (taskNow().subtype==='subtract-negative'
          ? '对。<b>减去负数，就是撤销一次向左运动，因此效果等于向右运动。</b>'
          : '对。减去正数，就是撤销向右的距离，因此要向左移动。')
      : taskNow().type === 'same'
        ? '对。方向相同，距离就会累积。<b>共同朝哪个方向，结果就是什么符号。</b>'
        : '对。异号不是“背符号”，而是两个方向先抵消。<b>哪边剩下，结果就是哪个方向。</b>');
    $('reasonPanel').classList.add('hidden'); showTransfer();
  } else {
    btn.classList.add('wrong'); btn.disabled = true;
    markThinking(2, 'signState', '规则误用');
    addMessage(taskNow().lesson==='multiplication'
      ? '不要把符号和数字混在一步里。先只看两个因数是否同号，决定结果方向；再算绝对值。'
      : taskNow().lesson==='mixed'
      ? '先不要把所有符号一起看。逐项翻译：减去负数变成向右，减去正数变成向左，然后依次移动。'
      : taskNow().lesson==='subtraction'
      ? (taskNow().subtype==='subtract-negative'
          ? '先不要背“负负得正”。想象你正在撤销一段向左的运动：撤销以后，实际会朝哪边变化？'
          : '减号在这里表示撤销。撤销一段向右的距离，当前位置会向哪边变化？')
      : taskNow().type === 'same'
      ? (btn.dataset.reason === 'sum'
          ? '这次数字确实要相加，但不是因为算式里出现了“+”，而是因为两次运动方向相同。'
          : '正号不是机械保留下来的，而是因为两次运动都朝向右边。')
      : (btn.dataset.reason === 'sum'
          ? '如果把距离相加，就等于两次都向同一个方向走。但这里方向相反，应该先抵消。'
          : '符号不是机械保留下来的，而是由抵消后剩余的方向决定。'));
  }
}));

function showTransfer() {
  const transfer=taskNow().transfer;
  state.hints=0;
  $('transferContext').textContent=transfer.context;
  $('transferQuestion').textContent=transfer.question;
  $('transferFeedback').classList.add('hidden');
  $('transferFeedback').innerHTML='';
  $('transferOptions').innerHTML='';
  transfer.options.forEach(value=>{
    const button=document.createElement('button');
    button.type='button'; button.dataset.value=String(value); button.textContent=signed(value);
    button.addEventListener('click',()=>checkTransfer(button,value));
    $('transferOptions').appendChild(button);
  });
  $('transferPanel').classList.remove('hidden');
  updateStep(4);
  addMessage('规律已经看懂了。现在我换一组数字，不重播动画——试试看你能不能自己迁移。');
  $('transferPanel').scrollIntoView({behavior:'smooth',block:'nearest'});
}

function checkTransfer(button,value) {
  const task=taskNow(), transfer=task.transfer;
  if(value===transfer.answer) {
    document.querySelectorAll('#transferOptions button').forEach(b=>b.disabled=true);
    button.classList.add('correct');
    $('transferFeedback').innerHTML=`<b>迁移成功：</b>${transfer.explanation}`;
    $('transferFeedback').classList.remove('hidden');
    state.transferPassed.add(state.taskIndex); state.combo++; addXp(20); burst(transfer.answer,18);
    state.completedTasks.add(state.taskIndex); saveCompletedTasks();
    $('world').classList.add('restored'); updateCampaign();
    $('successTitle').textContent=task.lesson==='multiplication'?'你已经能分开判断积的符号和距离':task.lesson==='mixed'?'你已经能把三步运算翻译成连续运动':task.lesson==='subtraction'?'你已经能把“撤销”迁移到新算式':'你已经能把“方向规律”迁移到新算式';
    $('successCard').classList.remove('hidden');
    addMessage(`很好，这不是记住原题，而是把规律带到了新题。<b>${transfer.explanation}</b>`);
  } else {
    button.classList.add('wrong'); button.disabled=true; state.transferErrors[task.lesson]++; state.totalHints++;
    const feedback=task.lesson==='multiplication'
      ? '先遮住数字，只判断两个因数同号还是异号；确定符号后，再把绝对值相乘。'
      : task.lesson==='mixed'
      ? '先逐项翻译符号，再按从左到右的顺序走；不要跳过中间位置。'
      : task.lesson==='subtraction'
      ? (task.subtype==='subtract-negative'?'先只翻译动作：撤销“向左”，实际会向哪个方向移动？':'先只翻译动作：减去正数，就是撤销哪一个方向？')
      : (task.type==='same'?'先看方向是否相同；相同方向的距离不会抵消。':'先判断哪一个方向的距离更长，再决定结果符号。');
    $('transferFeedback').innerHTML=`<b>喵伯爵发现迁移卡点：</b>${feedback}`;
    $('transferFeedback').classList.remove('hidden');
    addMessage(feedback);
  }
}

$('hintBtn').addEventListener('click', () => {
  state.hints++; state.totalHints++;
  const task=taskNow();
  const subtractionHints=task.subtype==='subtract-negative'
    ? ['先读成一句话：撤销“向左4格”。', '撤销向左，效果会朝相反方向——向右。', '从 −2 向右走4格，会到达 +2。']
    : ['减去正数，就是撤销向右的距离。', `从 ${signed(task.first)} 开始，向左移动 ${Math.abs(task.second)} 格。`, `终点是 ${signed(task.result)}。`];
  const mixedHints=[`先把原式翻译为三次运动：${taskMoves(task).map(signed).join('、')}。`,'从0出发，每完成一步就记住新的位置。',`三步走完的终点是 ${signed(task.result)}。`];
  const multiplicationHints=[`先判断符号：两个因数${task.factors[0]*task.factors[1]>0?'同号':'异号'}。`,`再计算距离：${Math.abs(task.factors[0])}×${Math.abs(task.factors[1])}=${Math.abs(task.result)}。`,`所以终点是 ${signed(task.result)}。`];
  const hints = state.phase === 1
    ? (task.lesson==='multiplication'?multiplicationHints:task.lesson==='mixed'?mixedHints:task.lesson==='subtraction'?subtractionHints:['先只判断方向：最后会在 0 的左边还是右边？', `从 ${signed(task.first)} 开始，向${task.secondDirection}数 ${Math.abs(task.second)} 格。`, `最后会到达 ${signed(task.result)}。`])
    : state.phase === 2
      ? [task.lesson==='multiplication'?'观察每一组的距离相同，方向由符号门提前决定。':task.lesson==='mixed'?'盯住每个中间位置：下一步必须从上一步的终点继续。':'盯住喵伯爵：第一步的终点，会成为第二步的起点。']
      : state.phase === 4
        ? [task.transfer.context, task.lesson==='multiplication'?'把“符号判断”和“绝对值计算”写成两个小步骤。':task.lesson==='mixed'?'逐项翻译以后，写出每一步的中间位置。':task.lesson==='subtraction'?'先把减法翻译成“撤销一次运动”，再判断实际方向。':'先比较两个方向，再判断是抵消还是累积。', task.transfer.explanation]
        : ['比较的不是数字谁“看起来大”，而是两个方向各走了多远。'];
  addMessage(hints[Math.min(state.hints - 1, hints.length - 1)]);
});

$('nextChallenge').addEventListener('click', showCompletion);

let microStep=0;
function microLessonSteps(task=taskNow()) {
  const moves=taskMoves(task), positions=moves.reduce((list,move)=>{ list.push((list.at(-1)||0)+move); return list; },[]);
  if(task.lesson==='multiplication') return [
    {visual:`${signed(task.factors[0])} × ${signed(task.factors[1])}`,title:'先判断结果方向',copy:`两个因数${task.result>0?'同号，所以结果朝正方向':'异号，所以结果朝负方向'}。符号判断和数字计算要分开。`},
    {visual:`${Math.abs(task.factors[0])} 组 × ${Math.abs(task.factors[1])} 格`,title:'再计算总距离',copy:`把它看成 ${Math.abs(task.factors[0])} 组、每组 ${Math.abs(task.factors[1])} 格，总距离是 ${Math.abs(task.result)} 格。`},
    {visual:`方向 ＋ 距离 = ${signed(task.result)}`,title:'把方向和距离合起来',copy:`方向决定正负，距离决定绝对值，所以最终结果是 ${signed(task.result)}。`}
  ];
  return [
    {visual:'＋ →　← −',title:'符号先翻译成方向',copy:'正号表示向右运动，负号表示向左运动。先看方向，不急着计算。'},
    {visual:moves.map(signed).join('　→　'),title:'从左到右连续移动',copy:`这道题要依次完成 ${moves.length} 次运动；每一步都从上一步的终点继续。`},
    {visual:`0 → ${positions.map(signed).join(' → ')}`,title:'保留每一步的中间位置',copy:`依次到达 ${positions.map(signed).join('、')}，所以最后停在 ${signed(task.result)}。接下来请先自己预测。`}
  ];
}
function renderMicroLesson(){
  const steps=microLessonSteps(), step=steps[microStep=Math.min(microStep,steps.length-1)];
  $('microLessonTitle').textContent=taskNow().lesson==='multiplication'?'把乘法拆成方向与距离':'先把算式变成运动';
  $('microStepLabel').textContent=`第 ${microStep+1} 步 / ${steps.length}`;
  $('microStepTitle').textContent=step.title; $('microStepCopy').textContent=step.copy; $('microVisual').textContent=step.visual;
  $('microVisual').style.animation='none'; requestAnimationFrame(()=>$('microVisual').style.animation='microPulse .75s ease both');
  document.querySelectorAll('.micro-progress i').forEach((dot,index)=>dot.classList.toggle('active',index<=microStep));
  $('microPrev').disabled=microStep===0; $('microNext').innerHTML=microStep===steps.length-1?'进入任务 <span>→</span>':'继续 <span>→</span>';
}
let microLessonAudio=null;
function stopMicroSpeech(){
  if(microLessonAudio){microLessonAudio.pause();microLessonAudio.currentTime=0;microLessonAudio=null;}
  $('microSpeak').classList.remove('speaking'); $('microSpeak').textContent='🔊 听喵伯爵讲解';
}
function speakMicroStep(){
  stopMicroSpeech();
  const lesson=String(Math.min(8,state.taskIndex+1)).padStart(2,'0');
  const phase=String(Math.min(8,microStep+1)).padStart(2,'0');
  microLessonAudio=new Audio(`./audio/math7a/u02/s${lesson}/p${phase}.opus`);
  microLessonAudio.volume=.92;
  microLessonAudio.onplay=()=>{$('microSpeak').classList.add('speaking');$('microSpeak').textContent='■ 停止讲解';};
  microLessonAudio.onended=stopMicroSpeech;
  microLessonAudio.onerror=()=>{stopMicroSpeech();toast('本步讲解音频未加载，请稍后重试');};
  microLessonAudio.play().catch(()=>{stopMicroSpeech();toast('播放被系统暂停，请再次点击');});
}

function setTaskContent() {
  const task = taskNow();
  const subtraction=task.lesson==='subtraction', mixed=task.lesson==='mixed', multiplication=task.lesson==='multiplication';
  document.body.classList.remove('game-focus');
  $('world').classList.toggle('bridge-stage',state.taskIndex===5);
  configureTrack();
  $('lessonMetaTitle').textContent=multiplication?'有理数的乘法':mixed?'有理数的加减混合运算':subtraction?'有理数的减法':'有理数的加法';
  $('missionCode').textContent=multiplication?'MISSION 04':mixed?'MISSION 03':subtraction?'MISSION 02':'MISSION 01';
  $('conceptTitle').textContent=multiplication?'符号 × 距离':mixed?'翻译 × 连续运动':subtraction?'撤销 × 反向':'方向 × 距离';
  $('conceptCopy').textContent=multiplication?'符号决定积的方向，绝对值决定总距离。':mixed?'先逐项翻译符号，再从左到右连续移动。':subtraction?'减法表示撤销；撤销一个方向，等于向相反方向运动。':'把符号看作方向，把绝对值看作距离。';
  $('storyTitle').textContent=multiplication?'符号门实验':mixed?'星轨校准任务':subtraction?'撤销实验':'轨道紧急任务';
  $('storyCopy').textContent=multiplication?'两个因数先通过符号门确定方向，再把每组距离叠加起来。':mixed?'零点天文台失去坐标。带喵伯爵走完三段星轨，重新点亮终点。':subtraction?'减号不是“变魔术”。帮助喵伯爵看见一次运动被撤销后发生了什么。':'两股方向能量发生冲突。帮喵伯爵判断终点，修复零点轨道。';
  document.querySelector('.mission-label').textContent=multiplication?'乘法任务：先定方向，再算距离':mixed?'混合任务：翻译符号并连续走完':subtraction?'减法任务：撤销一次运动':state.taskIndex?'变式任务：方向交换后，规律还成立吗？':'任务：找到喵伯爵的终点';
  document.querySelector('h1').innerHTML=multiplication
    ? `先通过 <mark>符号门</mark>，<br>再完成 <mark class="cyan">${Math.abs(task.factors[0])}</mark> 组等距运动。`
    : mixed
    ? `${taskMoves(task)[0] >= 0 ? '向前' : '向后'} <mark>${Math.abs(taskMoves(task)[0])}</mark> 步，${taskMoves(task)[1] >= 0 ? '向前' : '向后'} <mark class="cyan">${Math.abs(taskMoves(task)[1])}</mark> 步，<br>再${taskMoves(task)[2] >= 0 ? '向前' : '向后'} <mark>${Math.abs(taskMoves(task)[2])}</mark> 步。`
    : subtraction
    ? (task.subtype==='subtract-negative'?`站在 <mark>−2</mark>，<br>撤销“向左 <mark class="cyan">4</mark> 格”。`:`站在 <mark>+5</mark>，<br>撤销“向右 <mark class="cyan">3</mark> 格”。`)
    : `先向${task.firstDirection}走 <mark>${Math.abs(task.first)}</mark> 格，<br>再向${task.secondDirection}走 <mark class="cyan">${Math.abs(task.second)}</mark> 格。`;
  const shownFirst=subtraction?task.displayFirst:task.first, shownSecond=subtraction?task.displaySecond:task.second;
  const operator=subtraction?task.operator:'+';
  document.querySelector('.formula').innerHTML = multiplication||mixed
    ? `<span class="positive">${task.expression}</span><b>=</b><span id="formulaResult">?</span>`
    : `<span class="${shownFirst >= 0 ? 'positive' : 'negative'}">${signed(shownFirst)}</span><b>${operator}</b><span class="${shownSecond >= 0 ? 'positive' : 'negative'}">(${signed(shownSecond)})</span><b>=</b><span id="formulaResult">?</span>`;
  $('reasonQuestion').textContent = `为什么结果是 ${signed(task.result)}？`;
  $('reasonSign').textContent = multiplication?'只计算3×2，符号可以最后随便选':mixed?'从三个数字里挑最大的绝对值，直接使用它的符号':subtraction?'看到两个负号，所以直接把它们消掉':`两个数都有符号，所以直接保留${task.result > 0 ? '正' : '负'}号`;
  $('reasonCorrect').textContent = multiplication
    ? `${task.factors[0]*task.factors[1]>0?'两个因数同号，积为正':'两个因数异号，积为负'}；${Math.abs(task.factors[0])}×${Math.abs(task.factors[1])}=${Math.abs(task.result)}`
    : mixed
    ? `先翻译成 ${taskMoves(task).map(signed).join('、')} 三次运动，再从左到右连续移动，终点是 ${signed(task.result)}`
    : subtraction
    ? (task.subtype==='subtract-negative'?'撤销向左4格，效果等于向右4格；从−2到+2':'撤销向右3格，当前位置向左退3格；从+5到+2')
    : task.type === 'same'
    ? `两次都向${task.firstDirection}，距离累积；${Math.abs(task.first)} + ${Math.abs(task.second)} = ${Math.abs(task.result)}`
    : `方向相反，先抵消；${Math.max(Math.abs(task.first), Math.abs(task.second))} 比 ${Math.min(Math.abs(task.first), Math.abs(task.second))} 大，所以剩下向${task.result > 0 ? '右' : '左'} ${Math.abs(task.result)} 格`;
  $('reasonSum').textContent = multiplication?'看到负号就一定得到负数':mixed?'把三个绝对值一次性相加，最后再猜符号':subtraction?'减法一定让数字变小':task.type === 'same'
    ? '只要看见加号，就把两个数字相加'
    : `${Math.abs(task.first)} 和 ${Math.abs(task.second)} 相加，再选择一个符号`;
  $('nextChallenge').textContent = '完成本关 →';
  updateMoveSequence();
  microStep=0; renderMicroLesson();
  updateCampaign();
}

function startTask(index) {
  state.taskIndex = index;
  $('completionOverlay').classList.add('hidden');
  setTaskContent(); resetAll(); showMissionBriefing();
  $('dialogue').innerHTML = '';
  addMessage(index===2
    ? '欢迎进入同号相加。这次两个数方向相同，先预测：距离会抵消，还是累积？'
    : index===3
      ? '现在进入减法。把减号理解成“撤销”，先判断撤销向右会让位置怎么变化。'
      : index===4
        ? '这是减法最关键的一关：撤销一次向左运动。先别背口诀，判断实际会朝哪边变化。'
        : index===5
          ? '欢迎进入加减混合运算。第一件事不是计算，而是把每一项翻译成向左或向右的运动。'
          : index===6
            ? '这次连续出现两次减法。逐个撤销，别让两个减号把方向搅在一起。'
          : index===7
            ? '现在进入乘法。先不要背口诀：把符号和距离分开判断，看看异号为什么指向负方向。'
          : index===8
            ? '这一关验证“负负得正”。两个负号不是凭空消失，而是符号门判断为同号。'
        : '我们再来一次。先判断方向，再选择终点。');
}

function showCompletion() {
  const stage=currentCampaignStage(), stageIndex=campaignStages.indexOf(stage), next=campaignStages[stageIndex+1];
  $('completionTitle').textContent = stageIndex===campaignStages.length-1?'零点失踪案 · 全部通关':`CASE 0${stageIndex+1} · 调查完成`;
  $('completionIntro').textContent = stage.success;
  $('completionFeedback').textContent = `本关完成了预测、运动验证、理由解释和举一反三。累计使用提示 ${state.totalHints} 次；喵伯爵已记录你的方向判断过程。`;
  $('abilityName').textContent=stage.ability; $('abilityCopy').textContent=stage.abilityCopy;
  $('nextLessonCard').innerHTML = next
    ? `<span>下一案件 · CASE 0${stageIndex+2}</span><strong>${next.title}</strong><p>${next.copy}</p>`
    : '<span>案件状态 · 已结案</span><strong>零点天文台重新运转</strong><p>六种方向能力已经全部点亮，你可以从任务地图重玩任意一关。</p>';
  $('continueLesson').innerHTML = next?'进入下一关 <span>→</span>':'重玩终极验证 <span>↻</span>';
  $('completionOverlay').classList.remove('hidden');
}

$('continueLesson').addEventListener('click', () => {
  const stage=currentCampaignStage(), next=campaignStages[campaignStages.indexOf(stage)+1];
  startTask(next?.task ?? campaignStages.at(-1).task);
});
$('reviewLesson').addEventListener('click', () => startTask(currentCampaignStage().task));

function resetAll() {
  state.phase = 1; state.prediction = null; state.hints = 0; state.motionPlayed = false;
  $('world').classList.remove('restored');
  stopMicroSpeech(); $('microLesson').classList.add('hidden'); $('microLessonTrigger').classList.remove('hidden'); microStep=0;
  setRobot(0, true); $('traceOne').style.width = '0'; $('traceTwo').style.width = '0'; $('traceThree').style.width = '0';
  [$('traceOne'),$('traceTwo'),$('traceThree')].forEach(trace=>trace.classList.remove('running','reverse'));
  $('traceOne').removeAttribute('data-label'); $('traceTwo').removeAttribute('data-label'); $('traceThree').removeAttribute('data-label');
  $('predictionTrace').style.width = '0'; $('avatarSpeech').textContent = '从 0 出发';
  $('finishBeacon').classList.remove('visible','arrived');
  $('finishBeacon').style.top=''; $('finishBeacon').style.bottom='88px';
  $('journeyLayer').innerHTML='';
  robot.classList.remove('walking','facing-left');
  updateMoveSequence(); markTrackPosition(0);
  $('energyBoard').classList.add('hidden'); $('energyA').innerHTML=''; $('energyB').innerHTML='';
  document.querySelectorAll('.tick').forEach(t => t.classList.remove('selected'));
  $('predictionLabel').textContent = '点击数轴上的位置'; $('submitPrediction').disabled = true;
  $('submitPrediction').innerHTML = '先选择终点 <span>→</span>';
  $('predictPanel').classList.remove('hidden'); $('observePanel').classList.add('hidden');
  $('reasonPanel').classList.add('hidden'); $('transferPanel').classList.add('hidden'); $('successCard').classList.add('hidden');
  $('playMotion').disabled = false; $('playMotion').innerHTML = `② 播放${taskMoves().length===3?'三步':'两次'}运动 <span>▶</span>`; $('formulaResult') && ($('formulaResult').textContent = '?');
  document.querySelectorAll('[data-reason]').forEach(b => { b.disabled = false; b.classList.remove('wrong','correct'); });
  ['directionState','distanceState','signState'].forEach((id,i) => { $(id).textContent = i ? '尚未检测' : '等待作答'; });
  document.querySelectorAll('.thinking-card i').forEach((i,idx) => i.className = idx === 0 ? 'active' : '');
  updateStep(1);
}
$('resetBtn').addEventListener('click', () => location.reload());

const fullscreenBtn=$('fullscreenBtn'), appShell=document.querySelector('.app-shell');
async function toggleLessonFullscreen(){
  if(!document.fullscreenElement){
    document.body.classList.add('lesson-fullscreen');
    try { await appShell.requestFullscreen?.(); } catch(_) {}
  } else {
    try { await document.exitFullscreen(); } catch(_) {}
    document.body.classList.remove('lesson-fullscreen');
  }
}
fullscreenBtn.addEventListener('click',toggleLessonFullscreen);
document.addEventListener('fullscreenchange',()=>{
  const active=Boolean(document.fullscreenElement);
  document.body.classList.toggle('lesson-fullscreen',active);
  fullscreenBtn.innerHTML=active?'<span>⛶</span> 退出全屏':'<span>⛶</span> 全屏';
});

function updateCatalogProgress() {
  const groups=[
    {ids:[0,1,2],text:'additionProgress',bar:'additionBar'},
    {ids:[3,4],text:'subtractionProgress',bar:'subtractionBar'},
    {ids:[5,6],text:'mixedProgress',bar:'mixedBar'},
    {ids:[7,8],text:'multiplicationProgress',bar:'multiplicationBar'}
  ];
  groups.forEach(group=>{
    const done=group.ids.filter(id=>state.completedTasks.has(id)).length;
    $(group.text).textContent=`${done} / ${group.ids.length}`;
    $(group.bar).style.width=`${done/group.ids.length*100}%`;
    $(group.bar).closest('.lesson-card').classList.toggle('completed',done===group.ids.length);
  });
}
function openCatalog() { updateCatalogProgress(); $('catalogOverlay').classList.remove('hidden'); }
function closeCatalog() { $('catalogOverlay').classList.add('hidden'); }
$('catalogBtn').addEventListener('click',()=>{ location.href='./index.html'; });
$('closeCatalog').addEventListener('click',closeCatalog);
$('catalogOverlay').addEventListener('click',e=>{ if(e.target===$('catalogOverlay')) closeCatalog(); });
document.querySelectorAll('[data-start-task]').forEach(button=>button.addEventListener('click',()=>{
  closeCatalog(); startTask(Number(button.dataset.startTask));
}));
document.querySelectorAll('[data-campaign-task]').forEach(node=>{
  node.tabIndex=0;
  node.setAttribute('role','button');
  const launch=()=>startTask(Number(node.dataset.campaignTask));
  node.addEventListener('click',launch);
  node.addEventListener('keydown',event=>{
    if(event.key==='Enter'||event.key===' '){ event.preventDefault(); launch(); }
  });
});
$('continuePath').addEventListener('click',()=>{
  const next=[0,1,2,3,4,5,6,7,8].find(index=>!state.completedTasks.has(index));
  closeCatalog(); startTask(next===undefined?7:next);
});
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!$('catalogOverlay').classList.contains('hidden')) closeCatalog(); });

numberLine.addEventListener('keydown', (e) => {
  if (!['ArrowLeft','ArrowRight'].includes(e.key) || state.phase !== 1) return;
  e.preventDefault();
  const bridge=$('world').classList.contains('bridge-stage');
  const minimum=bridge?-9:-10, maximum=bridge?9:10;
  const next = Math.max(minimum, Math.min(maximum, (state.prediction ?? 0) + (e.key === 'ArrowRight' ? 1 : -1)));
  choosePrediction(next);
});

numberLine.addEventListener('click', (e) => {
  if (state.phase !== 1) return;
  if ($('world').classList.contains('bridge-stage')) return;
  const rect = numberLine.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  choosePrediction(Math.round(ratio * 20 - 10));
});

$('microLessonTrigger').addEventListener('click',()=>{ microStep=0; renderMicroLesson(); $('microLesson').classList.remove('hidden'); $('microLessonTrigger').classList.add('hidden'); speakMicroStep(); });
$('closeMicroLesson').addEventListener('click',()=>{ stopMicroSpeech(); $('microLesson').classList.add('hidden'); $('microLessonTrigger').classList.remove('hidden'); });
$('microSpeak').addEventListener('click',()=>{ microLessonAudio&&!microLessonAudio.paused ? stopMicroSpeech() : speakMicroStep(); });
$('microPrev').addEventListener('click',()=>{ if(microStep>0){ microStep--; renderMicroLesson(); speakMicroStep(); } });
$('microNext').addEventListener('click',()=>{
  const last=microLessonSteps().length-1;
  if(microStep<last){ microStep++; renderMicroLesson(); speakMicroStep(); return; }
  stopMicroSpeech();
  $('microLesson').classList.add('hidden'); $('microLessonTrigger').classList.remove('hidden');
  $('world').scrollIntoView({behavior:'smooth',block:'center'}); $('actionGuide').classList.add('attention');
});
$('beginInvestigation').addEventListener('click',()=>{
  $('missionBriefing').classList.add('hidden');
  tone(430,.12,'triangle'); setTimeout(()=>tone(650,.16,'triangle'),130);
  $('actionGuide').classList.add('attention');
});

const caseIntroVideo=$('caseIntroVideo');
const chapterIntroVideoReady=caseIntroVideo.dataset.videoReady==='true';
function closeCaseIntro(){
  caseIntroVideo.pause();
  $('caseIntro').classList.add('hidden');
  $('caseIntro').classList.remove('playing');
  document.body.classList.remove('intro-playing');
  showMissionBriefing();
}
function playCaseIntro(){
  caseIntroVideo.pause();
  caseIntroVideo.currentTime=0;
  caseIntroVideo.muted=false;
  $('missionBriefing').classList.add('hidden');
  $('caseIntro').classList.remove('hidden','playing');
  $('introGate').classList.remove('hidden');
  $('introVideoControls').classList.add('hidden');
  $('introProgressBar').style.transform='scaleX(0)';
  $('introSound').textContent='🔊';
  $('introSound').setAttribute('aria-label','关闭声音');
  document.body.classList.add('intro-playing');
}
$('introStart').addEventListener('click',async()=>{
  if(!chapterIntroVideoReady){
    closeCaseIntro();
    return;
  }
  $('introGate').classList.add('hidden');
  $('introVideoControls').classList.remove('hidden');
  $('caseIntro').classList.add('playing');
  try { await caseIntroVideo.play(); }
  catch { caseIntroVideo.muted=true; $('introSound').textContent='🔇'; await caseIntroVideo.play(); }
});
$('introSkip').addEventListener('click',closeCaseIntro);
$('introSound').addEventListener('click',()=>{
  caseIntroVideo.muted=!caseIntroVideo.muted;
  $('introSound').textContent=caseIntroVideo.muted?'🔇':'🔊';
  $('introSound').setAttribute('aria-label',caseIntroVideo.muted?'打开声音':'关闭声音');
});
caseIntroVideo.addEventListener('timeupdate',()=>{
  const progress=caseIntroVideo.duration?caseIntroVideo.currentTime/caseIntroVideo.duration:0;
  $('introProgressBar').style.transform=`scaleX(${progress})`;
});
caseIntroVideo.addEventListener('ended',()=>setTimeout(closeCaseIntro,500));
caseIntroVideo.addEventListener('error',closeCaseIntro);
$('replayIntro').addEventListener('click',playCaseIntro);

setTaskContent();
resetAll();
playCaseIntro();
