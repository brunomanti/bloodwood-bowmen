/* Bloodwood Bowmen: public build */
const BUILD_ID = "bloodwood-bowmen-v20260619-2059-bad-apple";
const LEVELS = [
  {name:"1. Rotten Cider Range", mode:"targets", wind:.00, targets:[{x:720,y:380,r:38,hp:3},{x:860,y:330,r:28,hp:2},{x:990,y:410,r:34,hp:3}]},
  {name:"2. Splinter Picnic", mode:"targets", wind:-.018, targets:[{x:760,y:390,r:45,hp:4},{x:940,y:300,r:28,hp:3},{x:1100,y:425,r:30,hp:3}]},
  {name:"3. Sir Prance-a-lot", mode:"duel", wind:.012, enemy:{x:980,skill:.42,hp:4,name:"Sir Prance-a-lot"}, targets:[{x:850,y:420,r:24,hp:2}]},
  {name:"4. The Marrow Meadow", mode:"duel", wind:-.026, enemy:{x:1060,skill:.64,hp:5,name:"Marrow Mary"}, targets:[{x:900,y:365,r:22,hp:2},{x:1160,y:418,r:26,hp:2}]},
  {name:"5. Professor Gobblebow", mode:"duel", wind:.032, enemy:{x:1130,skill:.84,hp:6,name:"Prof. Gobblebow"}, targets:[{x:930,y:335,r:20,hp:2}]}
];
const canvas = document.getElementById('game'), ctx = canvas.getContext('2d');
const hud = {build:el('build'), level:el('levelName'), wind:el('wind'), status:el('status')};
function el(id){return document.getElementById(id)}
const state = {level:0, zoom:1, cameraX:0, dragging:false, dragStart:null, dragNow:null, arrows:[], splats:[], particles:[], turn:'player', score:0, shots:0, last:0, pinch:null};
let dpr=1, W=0,H=0, groundY=450, player, enemy, targets=[];

const telemetry = (()=>{
  const sid = crypto.randomUUID(); const q=[];
  function rec(type,data={}){ const evt={buildId:BUILD_ID, sessionId:sid, t:new Date().toISOString(), ms:performance.now(), type, level:state.level, turn:state.turn, data}; q.push(evt); try{localStorage.setItem('bloodwood.telemetry', JSON.stringify(q.slice(-2000)))}catch{}; if(navigator.sendBeacon){ try{navigator.sendBeacon('/api/log', new Blob([JSON.stringify(evt)+'\n'],{type:'application/x-ndjson'}));}catch{}} }
  addEventListener('error', e=>rec('window.error',{message:e.message, source:e.filename, line:e.lineno, col:e.colno}));
  addEventListener('unhandledrejection', e=>rec('promise.rejection',{reason:String(e.reason)}));
  return {rec, dump(){return q.slice()}};
})();
telemetry.rec('boot',{ua:navigator.userAgent, viewport:[innerWidth,innerHeight]});
hud.build.textContent = BUILD_ID;

function resize(){dpr=Math.min(devicePixelRatio||1,2); W=innerWidth; H=innerHeight; canvas.width=W*dpr; canvas.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); groundY=Math.max(260,H*.72); telemetry.rec('resize',{W,H,dpr});}
addEventListener('resize', resize); resize();
function loadLevel(i){ const L=LEVELS[i%LEVELS.length]; state.level=i%LEVELS.length; state.arrows=[]; state.splats=[]; state.particles=[]; state.turn='player'; state.shots=0; player={x:150,y:groundY-42,hp:5,name:'You'}; enemy=L.enemy?{x:L.enemy.x,y:groundY-42,hp:L.enemy.hp,maxHp:L.enemy.hp,skill:L.enemy.skill,name:L.enemy.name}:null; targets=L.targets.map((t,k)=>({...t,maxHp:t.hp,id:'target-'+k,alive:true})); state.cameraX=0; hud.level.textContent=L.name; hud.wind.textContent=`Wind ${L.wind>0?'→':'←'} ${Math.abs(L.wind*100).toFixed(1)}`; say('Pull back from your bowman.'); telemetry.rec('level.load',{level:L});}
function say(s){hud.status.textContent=s; telemetry.rec('status',{s});}
loadLevel(0);

function wx(x){return (x-state.cameraX)*state.zoom} function wy(y){return y*state.zoom + (H-H*state.zoom)*.5} function sx(x){return x/state.zoom+state.cameraX} function sy(y){return (y-(H-H*state.zoom)*.5)/state.zoom}
function draw(){ ctx.clearRect(0,0,W,H); const L=LEVELS[state.level]; drawWorld(L); for(const t of targets) drawTarget(t); drawBowman(player,true); if(enemy) drawBowman(enemy,false); for(const a of state.arrows) drawArrow(a); for(const s of state.splats) drawSplat(s); if(state.dragging) drawAim(); requestAnimationFrame(loop); }
function drawWorld(L){ const g=wy(groundY); const grad=ctx.createLinearGradient(0,0,0,H); grad.addColorStop(0,'#84d8ff'); grad.addColorStop(.55,'#d5f4ff'); grad.addColorStop(.56,'#98d35c'); grad.addColorStop(1,'#51301f'); ctx.fillStyle=grad; ctx.fillRect(0,0,W,H); ctx.fillStyle='rgba(255,255,255,.65)'; for(let i=0;i<8;i++) blob(wx(i*240+80),wy(70+(i%3)*28),36,18); ctx.fillStyle='#6a3e22'; ctx.fillRect(0,g,W,H-g); ctx.fillStyle='#3f2718'; for(let x=-200;x<1800;x+=80){ctx.fillRect(wx(x),g-5,wx(40)-wx(0),10)} ctx.fillStyle='rgba(0,0,0,.28)'; ctx.fillRect(wx(0),g,wx(1500)-wx(0),wy(groundY+14)-g); }
function blob(x,y,w,h){ctx.beginPath();ctx.ellipse(x,y,w,h,0,0,Math.PI*2);ctx.fill()}
function drawBowman(b, isPlayer){ const x=wx(b.x), y=wy(b.y); ctx.save(); ctx.translate(x,y); if(!isPlayer) ctx.scale(-1,1); ctx.lineWidth=4; ctx.strokeStyle='#321'; ctx.fillStyle=isPlayer?'#ffe08a':'#d78cff'; blob(0,-28,18,18); ctx.fillStyle='#fff'; blob(-5,-31,3,3); blob(6,-31,3,3); ctx.fillStyle='#4b2a19'; ctx.fillRect(-12,-10,24,38); ctx.strokeStyle='#2b180f'; line(0,0,-22,32); line(0,0,24,31); line(-8,-2,-28,-13); line(8,-4,30,-18); ctx.strokeStyle='#7b3f18'; ctx.lineWidth=3; ctx.beginPath();ctx.arc(36,-18,28,-1.2,1.2);ctx.stroke(); ctx.fillStyle='#e93b4d'; for(let i=0;i<(b.hp||0);i++) blob(-28+i*9,-60,4,5); ctx.restore(); }
function line(a,b,c,d){ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(c,d);ctx.stroke()}
function drawTarget(t){ if(!t.alive)return; const x=wx(t.x), y=wy(t.y), r=t.r*state.zoom; const frac=t.hp/t.maxHp; ctx.save(); ctx.translate(x,y); ctx.rotate(Math.sin(performance.now()/500+t.x)*.04); ctx.fillStyle='#6d3a20'; ctx.fillRect(-r*.15,r*.65,r*.3,wy(groundY)-y-r*.65); ctx.fillStyle=`hsl(${20+frac*95},80%,58%)`; blob(0,0,r,r); ctx.fillStyle='#fff1b1'; blob(0,0,r*.72,r*.72); ctx.fillStyle='#e93b4d'; blob(0,0,r*.42,r*.42); ctx.strokeStyle='rgba(80,0,0,.7)'; ctx.lineWidth=2; for(let i=0;i<t.maxHp-t.hp;i++){line(-r*.7+i*r*.25,-r*.5,r*.1+i*r*.1,r*.55)} ctx.restore(); }
function drawSplat(s){ctx.globalAlpha=Math.max(0,s.life/120); ctx.fillStyle=s.color; blob(wx(s.x),wy(s.y),s.r*state.zoom,s.r*.7*state.zoom); ctx.globalAlpha=1;}
function drawArrow(a){ctx.save();ctx.translate(wx(a.x),wy(a.y));ctx.rotate(Math.atan2(a.vy,a.vx));ctx.strokeStyle='#5a2b12';ctx.lineWidth=3;line(-18,0,16,0);ctx.fillStyle='#eee';ctx.beginPath();ctx.moveTo(18,0);ctx.lineTo(8,-5);ctx.lineTo(8,5);ctx.closePath();ctx.fill();ctx.restore()}
function drawAim(){ const p=player, start={x:wx(p.x),y:wy(p.y-18)}, cur=state.dragNow; const dx=start.x-cur.x, dy=start.y-cur.y; ctx.strokeStyle='#fff6df'; ctx.setLineDash([7,7]); line(start.x,start.y,start.x+dx,start.y+dy); ctx.setLineDash([]); ctx.fillStyle='#ffd268'; blob(cur.x,cur.y,9,9); }
function loop(ts){ const dt=Math.min(32,ts-state.last||16)/16; state.last=ts; update(dt); draw(); }
requestAnimationFrame(loop);
function update(dt){ const L=LEVELS[state.level]; for(const a of state.arrows){ if(a.dead)continue; a.vx += L.wind*dt; a.vy += .32*dt; a.x += a.vx*dt; a.y += a.vy*dt; if(a.y>groundY){hitGround(a)}; for(const t of targets) if(t.alive && dist(a,t)<t.r){damageTarget(t,a); a.dead=true;} if(enemy && a.owner==='player' && Math.hypot(a.x-enemy.x,a.y-(enemy.y-22))<28){damageBowman(enemy,a); a.dead=true;} if(a.owner==='enemy' && Math.hypot(a.x-player.x,a.y-(player.y-22))<28){damageBowman(player,a); a.dead=true;} } state.arrows=state.arrows.filter(a=>!a.dead && a.x>-200 && a.x<1700 && a.y<900); for(const s of state.splats)s.life-=dt; state.splats=state.splats.filter(s=>s.life>0); if(enemy&&state.turn==='enemy'&&state.arrows.length===0)setTimeout(enemyShoot,450); }
function dist(a,t){return Math.hypot(a.x-t.x,a.y-t.y)}
function splat(x,y,n=6){ for(let i=0;i<n;i++) state.splats.push({x:x+(Math.random()-.5)*18,y:y+(Math.random()-.5)*18,r:5+Math.random()*15,life:60+Math.random()*80,color:['#e93b4d','#8b1029','#ffd268'][i%3]}); }
function damageTarget(t,a){ t.hp--; state.score+=100; splat(t.x,t.y,8); telemetry.rec('target.hit',{target:t.id,hp:t.hp,arrow:a}); if(t.hp<=0){t.alive=false; say('Target reduced to heroic jam.'); telemetry.rec('target.destroyed',{target:t.id}); checkWin();} else say(`Target wobbling: ${t.hp} chunks left.`); }
function damageBowman(b,a){ b.hp--; splat(b.x,b.y-25,10); telemetry.rec('bowman.hit',{name:b.name,hp:b.hp,arrow:a}); if(b.hp<=0){ say(b===player?'You have become decorative jam.':'Opponent popped like a pompous tomato.'); setTimeout(()=> b===player?loadLevel(state.level):nextLevel(),900);} else { say(`${b.name}: ${b.hp} hearts left.`); state.turn=b===player?'player':'enemy'; }}
function hitGround(a){a.dead=true; splat(a.x,groundY-5,3); telemetry.rec('arrow.ground',{arrow:a}); if(enemy && a.owner==='player') state.turn='enemy'; else state.turn='player';}
function checkWin(){ if(targets.every(t=>!t.alive) && !enemy) setTimeout(nextLevel,650); }
function nextLevel(){loadLevel((state.level+1)%LEVELS.length)}
function shoot(owner, vx, vy){ const b=owner==='player'?player:enemy; const a={id:crypto.randomUUID(), owner, x:b.x+(owner==='player'?35:-35), y:b.y-18, vx, vy, buildId:BUILD_ID, shot:++state.shots}; state.arrows.push(a); telemetry.rec('arrow.shot',a); }
function enemyShoot(){ if(state.turn!=='enemy'||!enemy)return; const dx=player.x-enemy.x, dy=(player.y-25)-(enemy.y-18), skill=enemy.skill; const speed=13+skill*7; const angle=Math.atan2(dy,dx)-.38+(Math.random()-.5)*(1-skill)*.8; shoot('enemy', Math.cos(angle)*speed, Math.sin(angle)*speed); state.turn='player'; say(`${enemy.name} twanged with suspicious confidence.`); }
function pointer(e){const r=canvas.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}}
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId); const p=pointer(e); telemetry.rec('pointer.down',p); const bp={x:wx(player.x),y:wy(player.y-18)}; if(Math.hypot(p.x-bp.x,p.y-bp.y)<90 && state.turn==='player'){state.dragging=true; state.dragStart=bp; state.dragNow=p;}});
canvas.addEventListener('pointermove',e=>{const p=pointer(e); if(state.dragging){state.dragNow=p; telemetry.rec('pointer.drag',p)}});
canvas.addEventListener('pointerup',e=>{const p=pointer(e); telemetry.rec('pointer.up',p); if(!state.dragging)return; const dx=state.dragStart.x-p.x, dy=state.dragStart.y-p.y; const force=Math.min(28,Math.hypot(dx,dy)/10); const ang=Math.atan2(dy,dx); shoot('player',Math.cos(ang)*force,Math.sin(ang)*force); state.dragging=false; state.turn=enemy?'enemy':'player';});
canvas.addEventListener('wheel',e=>{state.zoom=Math.max(.65,Math.min(1.7,state.zoom+(e.deltaY<0?.08:-.08))); telemetry.rec('zoom.wheel',{zoom:state.zoom});});
el('zoomIn').onclick=()=>{state.zoom=Math.min(1.7,state.zoom+.12);telemetry.rec('zoom.button',{zoom:state.zoom})}; el('zoomOut').onclick=()=>{state.zoom=Math.max(.65,state.zoom-.12);telemetry.rec('zoom.button',{zoom:state.zoom})}; el('next').onclick=nextLevel; el('logs').onclick=()=>{const blob=new Blob([JSON.stringify(telemetry.dump(),null,2)],{type:'application/json'}); const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${BUILD_ID}-telemetry.json`;a.click(); telemetry.rec('logs.download')};
window.Bloodwood={BUILD_ID, LEVELS, state, telemetry, loadLevel};
