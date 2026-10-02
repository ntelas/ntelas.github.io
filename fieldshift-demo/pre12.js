(function(){
'use strict';
/* Disable Build 11 WebAudio before its engine loads. Build 12 owns audio separately. */
try{
  var s=JSON.parse(localStorage.getItem('fs-settings')||'{}')||{};
  s.sound=false;
  s.music=false;
  localStorage.setItem('fs-settings',JSON.stringify(s));
}catch(e){}

var externalSound=true;
try{externalSound=localStorage.getItem('fs12-sound')!=='0'}catch(e){}
window.__FS12_SOUND__={enabled:externalSound};

function ownSoundToggle(e){
  var t=e.target&&e.target.closest?e.target.closest('#soundToggle'):null;
  if(!t)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  externalSound=!externalSound;
  window.__FS12_SOUND__.enabled=externalSound;
  try{localStorage.setItem('fs12-sound',externalSound?'1':'0')}catch(err){}
  t.classList.toggle('on',externalSound);
  document.dispatchEvent(new CustomEvent('fs12soundtoggle',{detail:{enabled:externalSound}}));
}
function ownMusicToggle(e){
  var t=e.target&&e.target.closest?e.target.closest('#musicToggle'):null;
  if(!t)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  t.classList.remove('on');
}
document.addEventListener('click',ownSoundToggle,true);
document.addEventListener('click',ownMusicToggle,true);
})();