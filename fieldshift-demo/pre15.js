(function(){
'use strict';
try{
  var s=JSON.parse(localStorage.getItem('fs-settings')||'{}')||{};
  s.sound=false;s.music=false;
  localStorage.setItem('fs-settings',JSON.stringify(s));
}catch(e){}
var enabled=true;
try{enabled=localStorage.getItem('fs15-sound')!=='0'}catch(e){}
window.__FS15_SOUND__={enabled:enabled};
function onSoundToggle(e){
  var t=e.target&&e.target.closest?e.target.closest('#soundToggle'):null;
  if(!t)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  enabled=!enabled;window.__FS15_SOUND__.enabled=enabled;
  try{localStorage.setItem('fs15-sound',enabled?'1':'0')}catch(err){}
  t.classList.toggle('on',enabled);
  document.dispatchEvent(new CustomEvent('fs15soundtoggle',{detail:{enabled:enabled}}));
}
function onMusicToggle(e){
  var t=e.target&&e.target.closest?e.target.closest('#musicToggle'):null;
  if(!t)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  t.classList.remove('on');
}
document.addEventListener('click',onSoundToggle,true);
document.addEventListener('click',onMusicToggle,true);
})();