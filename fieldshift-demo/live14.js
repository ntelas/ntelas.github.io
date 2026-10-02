(function(){
'use strict';
var state=window.__FS14_SOUND__||{enabled:true};
var AC=window.AudioContext||window.webkitAudioContext;
var ctx=null,master=null;
function destroy(){var c=ctx;ctx=null;master=null;if(c){try{if(c.state!=='closed')c.close()}catch(e){}}}
function build(){if(!AC)return false;if(ctx&&ctx.state!=='closed')return true;try{ctx=new AC({latencyHint:'interactive'});master=ctx.createGain();master.gain.value=.72;master.connect(ctx.destination);return true}catch(e){destroy();return false}}
function unlock(){if(!state.enabled)return false;if(!ctx||ctx.state==='closed'||ctx.state==='interrupted'){destroy();if(!build())return false}try{if(ctx.state==='suspended')ctx.resume();var o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime;o.frequency.value=30;g.gain.value=.00001;o.connect(g);g.connect(master);o.start(t);o.stop(t+.008);return true}catch(e){destroy();return false}}
function tone(f,d,type,v,delay,to){if(!ctx||ctx.state!=='running'||!master||!state.enabled)return;try{var o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+(delay||0);o.type=type||'sine';o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(Math.max(30,to),t+d);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.min(.20,v||.08),t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(master);o.start(t);o.stop(t+d+.02)}catch(e){}}
function playNow(n){if(n==='tap'){tone(500,.024,'sine',.04)}else if(n==='start'){tone(330,.06,'sine',.10);tone(495,.09,'sine',.08,.035)}else if(n==='swipe'){tone(175,.035,'triangle',.085,0,270);tone(340,.028,'sine',.045,.012,430)}else if(n==='blocked'){tone(125,.05,'triangle',.095,0,90)}else if(n==='spawn'){tone(290,.04,'sine',.065,0,380)}else if(n==='clear'){tone(430,.055,'sine',.125);tone(650,.08,'sine',.10,.022)}else if(n==='combo'){tone(480,.05,'sine',.135);tone(700,.07,'sine',.12,.022);tone(940,.09,'sine',.09,.05)}else if(n==='bigclear'){tone(350,.055,'triangle',.14);tone(580,.075,'sine',.13,.025);tone(850,.10,'sine',.11,.055);tone(1160,.11,'sine',.075,.085)}else if(n==='milestone'){tone(440,.07,'sine',.105);tone(660,.10,'sine',.095,.045);tone(880,.13,'sine',.085,.09)}else if(n==='gameover'){tone(250,.09,'triangle',.10,0,205);tone(175,.13,'triangle',.08,.07,130)}else if(n==='rewind'){tone(700,.055,'sine',.10,0,550);tone(480,.07,'sine',.09,.035,360);tone(320,.09,'sine',.075,.075,230)}}
function play(n){if(!state.enabled)return;if(!unlock())return;if(ctx&&ctx.state==='running'){playNow(n);return}try{Promise.resolve(ctx.resume()).then(function(){if(ctx&&ctx.state==='running')playNow(n)}).catch(function(){})}catch(e){}}
document.addEventListener('touchstart',unlock,{capture:true,passive:true});
document.addEventListener('pointerdown',unlock,{capture:true,passive:true});
document.addEventListener('click',unlock,true);
window.addEventListener('pageshow',function(){if(state.enabled)unlock()});
document.addEventListener('visibilitychange',function(){if(!document.hidden&&state.enabled)unlock()});
document.addEventListener('fs14soundtoggle',function(e){state.enabled=!!(e.detail&&e.detail.enabled);var b=document.getElementById('soundToggle');if(b)b.classList.toggle('on',state.enabled);if(state.enabled){unlock();play('start')}else destroy()});
document.addEventListener('fs-sfx',function(e){if(e.detail&&e.detail.name)play(e.detail.name)});
var soundToggle=document.getElementById('soundToggle');if(soundToggle)soundToggle.classList.toggle('on',state.enabled);
var musicToggle=document.getElementById('musicToggle');if(musicToggle){var row=musicToggle.closest('.setting');if(row)row.style.display='none'}
var buttons=document.querySelectorAll('button');for(var i=0;i<buttons.length;i++)buttons[i].addEventListener('click',function(){if(this.id!=='soundToggle')play('tap')});
var runGoal=document.getElementById('runGoal'),topGoal=document.getElementById('topGoal');
function syncGoal(){if(!runGoal||!topGoal)return;var m=(runGoal.textContent||'').match(/(\d+\s*\/\s*\d+)/);topGoal.textContent=m?m[1].replace(/\s/g,''):'0/15'}
if(runGoal&&topGoal){syncGoal();new MutationObserver(syncGoal).observe(runGoal,{childList:true,characterData:true,subtree:true})}
var modeBadge=document.getElementById('modeBadge'),playBtn=document.getElementById('playBtn'),dailyBtn=document.getElementById('dailyBtn');if(playBtn)playBtn.addEventListener('click',function(){if(modeBadge)modeBadge.textContent='CLASSIC'});if(dailyBtn)dailyBtn.addEventListener('click',function(){if(modeBadge)modeBadge.textContent='DAILY • HARD'});
var style=document.createElement('style');style.textContent='.piece.active{filter:saturate(1.12) brightness(1.15)!important;box-shadow:inset 0 2px 5px rgba(255,255,255,.42),inset 0 -5px 9px rgba(0,0,0,.20),0 5px 12px rgba(0,0,0,.25),0 0 0 2px rgba(255,255,255,.14),0 0 10px var(--glow),0 0 18px var(--glow)!important}.piece.active:before{opacity:.20!important;inset:-7%!important;border-width:1px!important}@keyframes activePulseLive{0%,100%{filter:saturate(1.1) brightness(1.11)}50%{filter:saturate(1.16) brightness(1.20)}}';document.head.appendChild(style);
})();
