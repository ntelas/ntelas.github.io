(function(){
'use strict';

var state=window.__FS12_SOUND__||{enabled:true};
var AC=window.AudioContext||window.webkitAudioContext;
var ctx=null, master=null;
var swipeStart=null, lastScore=0, lastSpawnAt=0;

function closeAudio(){
  var c=ctx; ctx=null; master=null;
  if(c){try{if(c.state!=='closed')c.close()}catch(e){}}
}

function buildAudio(){
  if(!AC)return false;
  if(ctx&&ctx.state!=='closed')return true;
  try{
    ctx=new AC({latencyHint:'interactive'});
    master=ctx.createGain();
    master.gain.value=.58;
    master.connect(ctx.destination);
    return true;
  }catch(e){closeAudio();return false;}
}

function primeAudio(){
  if(!state.enabled)return false;
  if(!buildAudio())return false;
  try{
    if(ctx.state==='suspended')ctx.resume();
    if(ctx.state==='closed'){
      closeAudio();
      if(!buildAudio())return false;
      if(ctx.state==='suspended')ctx.resume();
    }
    return true;
  }catch(e){
    closeAudio();
    try{if(buildAudio()&&ctx.state==='suspended')ctx.resume();return !!ctx}catch(err){return false;}
  }
}

function tone(freq,dur,type,vol,delay,toFreq){
  if(!state.enabled||!ctx||ctx.state!=='running'||!master)return;
  try{
    var o=ctx.createOscillator(), g=ctx.createGain();
    var t=ctx.currentTime+(delay||0);
    o.type=type||'sine';
    o.frequency.setValueAtTime(freq,t);
    if(toFreq)o.frequency.exponentialRampToValueAtTime(Math.max(30,toFreq),t+dur);
    g.gain.setValueAtTime(.0001,t);
    g.gain.exponentialRampToValueAtTime(Math.max(.01,Math.min(.22,vol||.08)),t+.003);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.02);
  }catch(e){}
}

function playNow(name){
  if(name==='tap'){
    tone(520,.022,'sine',.045);
  }else if(name==='start'){
    tone(330,.055,'sine',.095);tone(500,.075,'sine',.075,.035);
  }else if(name==='swipe'){
    tone(185,.032,'triangle',.075,0,275);tone(360,.026,'sine',.045,.012,440);
  }else if(name==='blocked'){
    tone(125,.05,'triangle',.09,0,92);
  }else if(name==='spawn'){
    tone(300,.038,'sine',.065,0,390);
  }else if(name==='clear'){
    tone(440,.055,'sine',.12);tone(660,.075,'sine',.095,.022);
  }else if(name==='combo'){
    tone(500,.05,'sine',.13);tone(720,.065,'sine',.115,.022);tone(960,.085,'sine',.09,.048);
  }else if(name==='bigclear'){
    tone(380,.05,'triangle',.14);tone(620,.075,'sine',.13,.025);tone(900,.09,'sine',.105,.055);tone(1220,.105,'sine',.075,.085);
  }else if(name==='milestone'){
    tone(440,.07,'sine',.105);tone(660,.09,'sine',.095,.045);tone(880,.12,'sine',.085,.09);
  }else if(name==='gameover'){
    tone(260,.085,'triangle',.10,0,210);tone(180,.12,'triangle',.08,.07,135);
  }else if(name==='rewind'){
    tone(720,.055,'sine',.10,0,560);tone(500,.07,'sine',.09,.035,380);tone(340,.09,'sine',.075,.075,240);
  }
}

function play(name){
  if(!state.enabled)return;
  if(!primeAudio())return;
  if(ctx.state==='running'){
    playNow(name);
  }else{
    try{Promise.resolve(ctx.resume()).then(function(){if(ctx&&ctx.state==='running')playNow(name)}).catch(function(){})}catch(e){}
  }
}

function forceRecover(){
  if(!state.enabled)return;
  if(!ctx||ctx.state==='closed')closeAudio();
  primeAudio();
}

/* Prime synchronously on the user's touch. This is the most reliable iOS path. */
document.addEventListener('touchstart',function(e){
  forceRecover();
  var area=document.getElementById('gestureArea');
  if(area&&area.contains(e.target)&&e.changedTouches&&e.changedTouches.length){
    var t=e.changedTouches[0];swipeStart={x:t.clientX,y:t.clientY};
  }
},{capture:true,passive:true});
document.addEventListener('pointerdown',forceRecover,{capture:true,passive:true});
window.addEventListener('pageshow',forceRecover);
document.addEventListener('visibilitychange',function(){if(!document.hidden)forceRecover()});

var area=document.getElementById('gestureArea');
if(area){
  area.addEventListener('touchend',function(e){
    if(!swipeStart||!e.changedTouches||!e.changedTouches.length)return;
    var t=e.changedTouches[0],dx=t.clientX-swipeStart.x,dy=t.clientY-swipeStart.y;swipeStart=null;
    if(Math.sqrt(dx*dx+dy*dy)>=24)play('swipe');
  },{capture:true,passive:true});
  var mx=0,my=0,md=false;
  area.addEventListener('mousedown',function(e){mx=e.clientX;my=e.clientY;md=true;forceRecover()},{capture:true});
  window.addEventListener('mouseup',function(e){if(!md)return;md=false;var dx=e.clientX-mx,dy=e.clientY-my;if(Math.sqrt(dx*dx+dy*dy)>=24)play('swipe')},{capture:true});
}

document.addEventListener('fs12soundtoggle',function(e){
  state.enabled=!!(e.detail&&e.detail.enabled);
  var b=document.getElementById('soundToggle');if(b)b.classList.toggle('on',state.enabled);
  if(state.enabled){forceRecover();play('start')}else closeAudio();
});
var soundToggle=document.getElementById('soundToggle');
if(soundToggle){soundToggle.classList.toggle('on',state.enabled);new MutationObserver(function(){soundToggle.classList.toggle('on',state.enabled)}).observe(soundToggle,{attributes:true,attributeFilter:['class']})}
var musicToggle=document.getElementById('musicToggle');if(musicToggle){var row=musicToggle.closest('.setting');if(row)row.style.display='none'}

/* Secondary game-event sounds. */
var board=document.getElementById('board');
if(board)new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){if(ms[i].attributeName==='class'&&board.classList.contains('shake')){play('blocked');break}}}).observe(board,{attributes:true,attributeFilter:['class']});

var score=document.getElementById('score');
if(score){
  lastScore=Number(score.textContent)||0;
  new MutationObserver(function(){
    var n=Number(score.textContent)||0;
    if(n>lastScore){
      var toast=document.getElementById('toast'),text=toast?toast.textContent:'';
      if(text.indexOf('COMBO')>=0)play('combo');
      else if((n-lastScore)>=50)play('bigclear');
      else play('clear');
    }
    lastScore=n;
  }).observe(score,{childList:true,characterData:true,subtree:true});
}

var grid=document.getElementById('grid');
if(grid)new MutationObserver(function(){
  if(grid.querySelector('.piece.spawn')){
    var now=Date.now();if(now-lastSpawnAt>70){lastSpawnAt=now;play('spawn')}
  }
}).observe(grid,{childList:true,subtree:true});

var result=document.getElementById('resultModal');if(result)new MutationObserver(function(){if(result.classList.contains('show'))play('gameover')}).observe(result,{attributes:true,attributeFilter:['class']});
var milestone=document.getElementById('milestone');if(milestone)new MutationObserver(function(){if(milestone.classList.contains('show'))play('milestone')}).observe(milestone,{attributes:true,attributeFilter:['class']});
var game=document.getElementById('game');if(game)new MutationObserver(function(){if(game.classList.contains('show')){lastScore=0;play('start')}}).observe(game,{attributes:true,attributeFilter:['class']});
var rewind=document.getElementById('rewindBtn');if(rewind)rewind.addEventListener('click',function(){play('rewind')});

var buttons=document.querySelectorAll('button');
for(var i=0;i<buttons.length;i++)buttons[i].addEventListener('click',function(){if(this.id!=='soundToggle'&&this.id!=='rewindBtn')play('tap')});

/* HUD synchronization */
var runGoal=document.getElementById('runGoal'),topGoal=document.getElementById('topGoal');
function syncGoal(){if(!runGoal||!topGoal)return;var m=(runGoal.textContent||'').match(/(\d+\s*\/\s*\d+)/);topGoal.textContent=m?m[1].replace(/\s/g,''):'0/15'}
if(runGoal&&topGoal){syncGoal();new MutationObserver(syncGoal).observe(runGoal,{childList:true,characterData:true,subtree:true})}
var modeBadge=document.getElementById('modeBadge'),playBtn=document.getElementById('playBtn'),dailyBtn=document.getElementById('dailyBtn');
if(playBtn)playBtn.addEventListener('click',function(){if(modeBadge)modeBadge.textContent='CLASSIC'});
if(dailyBtn)dailyBtn.addEventListener('click',function(){if(modeBadge)modeBadge.textContent='DAILY • HARD'});
})();
