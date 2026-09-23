(function(){
  const page=location.pathname.split('/').pop();
  if(!/chapter2-advanced|chapters-3-6/.test(page))return;
  const pad=n=>String(n).padStart(2,'0');
  const audio=new Audio();audio.preload='metadata';
  const button=document.createElement('button');button.type='button';button.className='global-voice';button.textContent='🔊 听喵伯爵讲本步';document.body.appendChild(button);
  const style=document.createElement('style');style.textContent='.global-voice{position:fixed;right:18px;top:76px;z-index:80;border:1px solid #b9c6ef;background:#17233f;color:#fff;border-radius:13px;padding:11px 15px;font-weight:850;box-shadow:0 10px 28px #17233f33}.global-voice.playing{background:#5267ff}@media(max-width:760px){.global-voice{right:10px;top:70px;padding:9px 11px;font-size:13px}}';document.head.appendChild(style);
  function source(){
    try{
      if(page.includes('chapter2-advanced'))return `./audio/math7a/u02/s${pad(current+1)}/p${pad(Math.min(8,(typeof lessonPhase2==='number'?lessonPhase2:0)+1))}.opus`;
      return `./audio/math7a/u${pad(ci+3)}/s${pad(ui+1)}/p${pad(Math.min(8,phase+1))}.opus`;
    }catch(_){return ''}
  }
  function sync(){button.classList.toggle('playing',!audio.paused);button.textContent=audio.paused?'🔊 听喵伯爵讲本步':'■ 停止讲解'}
  button.onclick=async()=>{if(!audio.paused){audio.pause();audio.currentTime=0;sync();return}const src=source();if(!src){button.textContent='语音路径未就绪';return}audio.src=src;try{await audio.play()}catch(_){button.textContent='播放失败 · 再点一次'}};
  audio.onplay=sync;audio.onpause=sync;audio.onended=sync;audio.onerror=()=>{button.classList.remove('playing');button.textContent='语音加载失败'};
})();
