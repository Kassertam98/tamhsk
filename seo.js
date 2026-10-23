// Nút nghe đọc trên trang tĩnh
(function(){
  var ok='speechSynthesis' in window,vs=[];
  function pick(){try{vs=speechSynthesis.getVoices().filter(function(v){return /^zh(-|_)?(CN|Hans)?/i.test(v.lang);});}catch(e){}}
  if(ok){pick();try{speechSynthesis.onvoiceschanged=pick;}catch(e){}}
  document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('[data-say]');if(!b)return;
    if(!ok){location.href='/#w-'+encodeURIComponent(b.dataset.say);return;}
    try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(b.dataset.say);u.lang='zh-CN';u.rate=.85;if(vs[0])u.voice=vs[0];speechSynthesis.speak(u);}catch(e){}});
  document.querySelectorAll('[data-say]').forEach(function(b){if(!ok)b.title='Mở trong Tâm HSK để nghe';});
})();
