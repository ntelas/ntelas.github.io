(function(){
'use strict';
/* Core Build 11 audio is intentionally disabled. Build 14 owns sound. */
try{
  var s=JSON.parse(localStorage.getItem('fs-settings')||'{}')||{};
  s.sound=false;s.music=false;
  localStorage.setItem('fs-settings',JSON.stringify(s));
}catch(e){}
var enabled=true;
try{enabled=localStorage.getItem('fs14-sound')!=='0'}catch(e){}
window.__FS14_SOUND__={enabled:enabled};
function soundToggle(e){
  var t=e.target&&e.target.closest?e.target.closest('#soundToggle'):null;
  if(!t)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  enabled=!enabled;window.__FS14_SOUND__.enabled=enabled;
  try{localStorage.setItem('fs14-sound',enabled?'1':'0')}catch(err){}
  t.classList.toggle('on',enabled);
  document.dispatchEvent(new CustomEvent('fs14soundtoggle',{detail:{enabled:enabled}}));
}
function musicToggle(e){
  var t=e.target&&e.target.closest?e.target.closest('#musicToggle'):null;
  if(!t)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  t.classList.remove('on');
}
document.addEventListener('click',soundToggle,true);
document.addEventListener('click',musicToggle,true);
})();
