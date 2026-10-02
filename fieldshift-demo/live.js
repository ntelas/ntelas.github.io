(function(){
'use strict';
var state=window.__FS12_SOUND__||{enabled:true};
var AC=window.AudioContext||window.webkitAudioContext;
var ctx=null,out=null,limiter=null,bus=null,generation=0;
var lastScore=0,lastSpawnAt=0,swipeStart=null;
function destroyAudio(){var old=ctx;ctx=out=limiter=bus=null;if(old){try{old.onstatechange=null}catch(e){}try{if(old.state!=='closed')old.close()}catch(e){}}}
function buildAudio(force){if(force)destroyAudio();if(ctx&&ctx.state!=='closed')return true;if(!AC)return false;try{
  ctx=new AC({latencyHint:'interactive'});generation++;
  bus=ctx.createGain();out=ctx.createGain();limiter=ctx.createDynamicsCompressor();
  bus.gain.value=1.08;out.gain.value=1.0;
  limiter.threshold.value=-7;limiter.knee.value=8;limiter.ratio.value=12;limiter.attack.value=.0015;limiter.release.value=.11;
  bus.connect(out);out.connect(limiter);limiter.connect(ctx.destination);
  return true;
}catch(e){destroyAudio();return false}}
function ensureAudio(done){if(!state.enabled){done&&done(false);return}if(!buildAudio(false)){done&&done(false);return}if(ctx.state==='running'){done&&done(true);return}var current=ctx;try{
  var p=current.resume();Promise.resolve(p).then(function(){if(current!==ctx){done&&done(false);return}if(current.state==='running'){done&&done(true);return}buildAudio(true);try{Promise.resolve(ctx.resume()).then(function(){done&&done(ctx&&ctx.state==='running')}).catch(function(){done&&done(false)})}catch(e){done&&done(false)}}).catch(function(){buildAudio(true);done&&done(false)})
}catch(e){buildAudio(true);done&&done(false)}}
function tone(f,d,type,v,delay,f2){if(!ctx||ctx.state!=='running'||!bus)return;var o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+(delay||0),peak=Math.max(.001,Math.min(.38,v||.1));o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(Math.max(20,f2),t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(bus);o.start(t);o.stop(t+d+.02)}
function chord(freqs,dur,vol,delay){for(var i=0;i<freqs.length;i++)tone(freqs[i],dur,'sine',vol*(i===0?1:.82),(delay||0)+i*.006)}
function playNow(name){if(!state.enabled||!ctx||ctx.state!=='running')return;
  if(name==='tap'){tone(480,.028,'sine',.07);tone(760,.018,'sine',.035,.012);}
  else if(name==='start'){tone(290,.06,'triangle',.15,0,410);tone(495,.10,'sine',.13,.035,620);tone(740,.11,'sine',.08,.07,880);}
  else if(name==='swipe'){tone(155,.038,'triangle',.13,0,250);tone(330,.034,'sine',.09,.015,470);tone(620,.022,'sine',.045,.034,760);}
  else if(name==='blocked'){tone(135,.045,'triangle',.15,0,92);tone(78,.055,'sine',.08,.012,66);}
  else if(name==='spawn'){tone(240,.045,'sine',.11,0,340);tone(510,.035,'sine',.065,.02,610);}
  else if(name==='clear'){tone(330,.055,'triangle',.18,0,470);tone(530,.07,'sine',.18,.018,700);tone(820,.085,'sine',.12,.045,1040);}
  else if(name==='combo'){tone(390,.05,'triangle',.20,0,540);tone(620,.065,'sine',.19,.018,790);tone(880,.085,'sine',.17,.042,1120);tone(1260,.09,'sine',.10,.07,1440);}
  else if(name==='bigclear'){tone(250,.055,'triangle',.22,0,390);chord([520,660,825],.11,.16,.028);tone(1100,.12,'sine',.15,.07,1500);tone(1650,.08,'sine',.08,.11,1900);}
  else if(name==='milestone'){tone(330,.07,'triangle',.17);tone(495,.09,'sine',.17,.045);tone(660,.11,'sine',.16,.09);tone(990,.15,'sine',.12,.145);}
  else if(name==='gameover'){tone(300,.09,'triangle',.15,0,240);tone(210,.13,'triangle',.13,.07,165);tone(145,.20,'sine',.10,.16,100);}
  else if(name==='rewind'){tone(850,.06,'sine',.16,0,650);tone(620,.07,'sine',.15,.035,470);tone(420,.09,'sine',.13,.075,300);tone(260,.12,'triangle',.08,.115,190);}
}
function play(name){if(!state.enabled)return;if(ctx&&ctx.state==='running'){playNow(name);return}ensureAudio(function(ok){if(ok)playNow(name)})}
function recover(){if(!state.enabled)return;ensureAudio()}

/* Prime audio on touch-down, then fire the swipe sound in capture phase before game resolution. */
document.addEventListener('touchstart',function(e){recover();var a=document.getElementById('gestureArea');if(a&&a.contains(e.target)&&e.changedTouches&&e.changedTouches.length){var t=e.changedTouches[0];swipeStart={x:t.clientX,y:t.clientY}}},{capture:true,passive:true});
document.addEventListener('pointerdown',recover,{capture:true,passive:true});
var area=document.getElementById('gestureArea');
if(area){
  area.addEventListener('touchend',function(e){if(!swipeStart||!e.changedTouches||!e.changedTouches.length)return;var t=e.changedTouches[0],dx=t.clientX-swipeStart.x,dy=t.clientY-swipeStart.y;swipeStart=null;if(Math.sqrt(dx*dx+dy*dy)>=24)play('swipe')},{capture:true,passive:true});
  var mx=0,my=0,md=false;area.addEventListener('mousedown',function(e){mx=e.clientX;my=e.clientY;md=true;recover()},{capture:true});window.addEventListener('mouseup',function(e){if(!md)return;md=false;var dx=e.clientX-mx,dy=e.clientY-my;if(Math.sqrt(dx*dx+dy*dy)>=24)play('swipe')},{capture:true});
}
window.addEventListener('pageshow',recover);document.addEventListener('visibilitychange',function(){if(!document.hidden)recover()});

document.addEventListener('fs12soundtoggle',function(e){state.enabled=!!(e.detail&&e.detail.enabled);var b=document.getElementById('soundToggle');if(b)b.classList.toggle('on',state.enabled);if(state.enabled){ensureAudio(function(ok){if(ok)playNow('start')})}else destroyAudio()});
var soundToggle=document.getElementById('soundToggle');if(soundToggle){soundToggle.classList.toggle('on',state.enabled);new MutationObserver(function(){soundToggle.classList.toggle('on',state.enabled)}).observe(soundToggle,{attributes:true,attributeFilter:['class']})}
var musicToggle=document.getElementById('musicToggle');if(musicToggle){var row=musicToggle.closest('.setting');if(row)row.style.display='none'}

/* Secondary event accents. These trigger on the same DOM update as the visual result. */
var board=document.getElementById('board');if(board)new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){if(ms[i].attributeName==='class'&&board.classList.contains('shake')){play('blocked');break}}}).observe(board,{attributes:true,attributeFilter:['class']});
var score=document.getElementById('score');if(score){lastScore=Number(score.textContent)||0;new MutationObserver(function(){var n=Number(score.textContent)||0;if(n>lastScore){var toast=document.getElementById('toast'),text=toast?toast.textContent:'';if(text.indexOf('COMBO')>=0)play('combo');else if((n-lastScore)>=50)play('bigclear');else play('clear')}lastScore=n}).observe(score,{childList:true,characterData:true,subtree:true})}
var grid=document.getElementById('grid');if(grid)new MutationObserver(function(){if(grid.querySelector('.piece.spawn')){var now=Date.now();if(now-lastSpawnAt>45){lastSpawnAt=now;play('spawn')}}}).observe(grid,{childList:true,subtree:true});
var result=document.getElementById('resultModal');if(result)new MutationObserver(function(){if(result.classList.contains('show'))play('gameover')}).observe(result,{attributes:true,attributeFilter:['class']});
var milestone=document.getElementById('milestone');if(milestone)new MutationObserver(function(){if(milestone.classList.contains('show'))play('milestone')}).observe(milestone,{attributes:true,attributeFilter:['class']});
var game=document.getElementById('game');if(game)new MutationObserver(function(){if(game.classList.contains('show')){lastScore=0;play('start')}}).observe(game,{attributes:true,attributeFilter:['class']});
var rewind=document.getElementById('rewindBtn');if(rewind)rewind.addEventListener('click',function(){play('rewind')});
var buttons=document.querySelectorAll('button');for(var i=0;i<buttons.length;i++)buttons[i].addEventListener('click',function(){if(this.id!=='soundToggle'&&this.id!=='rewindBtn')play('tap')});

/* HUD synchronization */
var runGoal=document.getElementById('runGoal'),topGoal=document.getElementById('topGoal');
function syncGoal(){if(!runGoal||!topGoal)return;var m=(runGoal.textContent||'').match(/(\d+\s*\/\s*\d+)/);topGoal.textContent=m?m[1].replace(/\s/g,''):'0/15'}
if(runGoal&&topGoal){syncGoal();new MutationObserver(syncGoal).observe(runGoal,{childList:true,characterData:true,subtree:true})}
var modeBadge=document.getElementById('modeBadge');var playBtn=document.getElementById('playBtn'),dailyBtn=document.getElementById('dailyBtn');if(playBtn)playBtn.addEventListener('click',function(){if(modeBadge)modeBadge.textContent='CLASSIC'});if(dailyBtn)dailyBtn.addEventListener('click',function(){if(modeBadge)modeBadge.textContent='DAILY • HARD'});
})();
