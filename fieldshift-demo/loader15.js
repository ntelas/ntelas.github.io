(function(){
'use strict';
fetch('loader14.js?t='+Date.now(),{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('loader14 '+r.status);return r.text()}).then(function(src){
  var marker="  src=src.replace('var currentValid=hasColor(active)&&legalColor(active);','var currentValid=colorPlayable(active);');";
  var extra=marker+"\n  src=src.replace(\"function finishTurn(fromClear){\",\"function rechargeTargetColor(){var n=colorsInPlay(),best=0,bestScore=-1e9;for(var c=0;c<n;c++){var cnt=colorCount(c),mob=colorMobility(c),s=cnt*12+mob*1.5;if(cnt===2)s+=80;if(cnt>=3&&!legalColor(c))s+=65;if(cnt===0)s-=8;if(s>bestScore){bestScore=s;best=c}}return best}\\nfunction fieldRecharge(){var existing=nextPlayable(colorCursor);if(existing>=0){active=existing;colorCursor=existing;render();updateUI();locked=false;return}if(emptyCells().length<2){endGame();return}var added=[],guard=0;while(nextPlayable(colorCursor)<0&&emptyCells().length>1&&guard<6){var target=rechargeTargetColor(),id=spawnOne(target);if(id===null)break;added.push(id);guard++}var n=nextPlayable(colorCursor);if(n<0){endGame();return}active=n;colorCursor=n;showToast('FIELD RECHARGE');render(added);updateUI();emitSound('spawn');locked=false}\\nfunction finishTurn(fromClear){\");\n  src=src.replace(\"if(!currentValid){var n=nextPlayable(colorCursor);if(n<0){endGame();return}active=n;colorCursor=n}\",\"if(!currentValid){var n=nextPlayable(colorCursor);if(n<0){fieldRecharge();return}active=n;colorCursor=n}\");";
  if(src.indexOf(marker)<0)throw new Error('Build 15 jam marker missing');
  src=src.replace(marker,extra);
  src=src.replace("loadScript('live14.js?t='+Date.now())","loadScript('live15.js?t='+Date.now())");
  (0,eval)(src);
}).catch(function(err){console.error('FieldShift Build 15 failed',err);var v=document.querySelector('.version');if(v)v.textContent='BUILD ERROR • REFRESH'});
})();