(function(global){
  const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
  const position=(n,min=-9,max=9)=>5+(clamp(n,min,max)-min)/(max-min)*90;
  function axis({min=-9,max=9,points=[],segments=[],className=''}){
    const ticks=Array.from({length:max-min+1},(_,i)=>i+min).map(n=>`<i class="mirror-tick ${n===0?'zero':''}" style="left:${position(n,min,max)}%"><b>${n}</b></i>`).join('');
    const dots=points.map(p=>`<div class="mirror-point ${p.color||'blue'} ${p.pulse?'pulse-point':''}" style="left:${position(p.value,min,max)}%"><em>${p.label??(p.value>0?'+':'')+p.value}</em></div>`).join('');
    const bands=segments.map(s=>`<div class="distance-band ${s.color||'right-band'}" style="left:${Math.min(position(s.from,min,max),position(s.to,min,max))}%;width:${Math.abs(position(s.to,min,max)-position(s.from,min,max))}%"><span>${s.label||''}</span></div>`).join('');
    return `<div class="mirror-lab ${className}"><div class="mirror-axis"><span class="axis-arrow left">←</span><span class="axis-arrow right">→</span>${ticks}${bands}${dots}</div></div>`;
  }
  function mirrorLine(value=4,animated=false){return axis({points:[{value,color:'blue'},{value:-value,color:'orange'}],segments:[{from:-Math.abs(value),to:0,color:'left-band'},{from:0,to:Math.abs(value),color:'right-band'}],className:animated?'teaching':''})}
  function distanceLine(value=-6){return axis({points:[{value,color:'orange'},{value:0,label:'0',color:'origin-point'}],segments:[{from:value,to:0,color:'distance-measure',label:`距离 ${Math.abs(value)}`}],className:'absolute-axis'})}
  global.TeachingCore={axis,mirrorLine,distanceLine,position,clamp};
})(window);
