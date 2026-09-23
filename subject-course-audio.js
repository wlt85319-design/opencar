(()=>{
  const voiceSection=document.querySelector('.voice');
  const button=voiceSection?.querySelector('button');
  if(!button)return;

  let audio=new Audio();
  audio.preload='metadata';
  const supportedBooks=new Set(['math7a','math7b','eng7a','eng7b','phy8a','phy8b']);
  const pad=value=>String(value).padStart(2,'0');

  function currentSource(){
    const ready=supportedBooks.has(book?.id)&&unit>=0&&section>=0&&stage>=0&&stage<8;
    if(!ready)return '';
    const path='./audio/'+book.id+'/u'+pad(unit+1)+'/s'+pad(section+1)+'/p'+pad(stage+1)+'.opus';
    // Starter Unit 1 now uses language-tagged narration: Chinese teaching and
    // English models share one male voice, but use their correct phonemizers.
    if(book.id==='eng7a'&&unit===0)return path+'?voice=bilingual-1';
    return (book.id==='eng7a'&&unit<9)||(book.id==='eng7b'&&unit<8)?path+'?curriculum=82':path;
  }

  function sync(){
    const src=currentSource();
    if(!src){
      audio.pause();
      button.disabled=true;
      button.textContent='暂无对应语音';
      return;
    }
    if(audio.dataset.src!==src){
      audio.pause();
      button.disabled=false;
      button.textContent='▶ 播放本步讲解';
      return;
    }
    button.disabled=false;
    button.textContent=audio.paused?'▶ 播放本步讲解':'❚❚ 暂停讲解';
  }

  button.addEventListener('click',async()=>{
    // Resolve click intent against the current stage, not a late pause event
    // from the clip that belonged to the previous stage.
    const src=currentSource();
    const sameClip=audio.dataset.src===src;
    if(sameClip&&!audio.paused){
      audio.pause();
      sync();
      return;
    }
    if(!sameClip){
      audio.pause();
      audio=new Audio(src);
      audio.preload='metadata';
      audio.dataset.src=src;
      bindAudioEvents(audio);
    }
    try{await audio.play()}catch(error){if(error?.name!=='AbortError')console.error('Audio playback failed',error)}
    sync();
  });

  function bindAudioEvents(player){
    player.addEventListener('play',sync);
    player.addEventListener('pause',sync);
    player.addEventListener('ended',sync);
  }
  bindAudioEvents(audio);
  new MutationObserver(sync).observe(document.querySelector('.lesson'),{subtree:true,childList:true,characterData:true});
  sync();
})();
