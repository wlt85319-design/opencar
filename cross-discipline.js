(function(){
  const style=document.createElement('style');
  style.textContent=`
    :root{--cross:#c45a22;--cross-deep:#78320f;--cross-bg:#fff5e8;--cross-line:#efb27d}
    .portal{position:relative!important;overflow:hidden!important;background:linear-gradient(145deg,#fffaf3,var(--cross-bg))!important;border:1px solid var(--cross-line)!important;box-shadow:0 12px 28px rgba(151,75,24,.09)!important}
    .portal:before{content:"";position:absolute;left:0;top:0;bottom:0;width:5px;background:linear-gradient(#f29a4a,var(--cross))}
    .portal>span{display:inline-flex;align-items:center;gap:6px;color:var(--cross)!important;letter-spacing:.04em}
    .portal>span:before{content:"跨";display:grid;place-items:center;width:22px;height:22px;border-radius:7px;background:var(--cross);color:#fff;font-size:11px;font-weight:950}
    .portal h3{color:var(--cross-deep)!important}
    .portal p,.portal div{color:#71452f!important}
    .portal button{color:var(--cross)!important}
    .portal div{border-top-color:#efd2b8!important}
    .portal.open{box-shadow:0 14px 34px rgba(151,75,24,.16)!important}
  `;
  document.head.appendChild(style);
  document.querySelectorAll('.portal>span').forEach(el=>el.textContent='跨学科知识传送门');
  document.querySelectorAll('.portal button').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.portal')?.classList.toggle('open')));
})();
