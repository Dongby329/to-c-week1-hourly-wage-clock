
// Auth
var CU=sessionStorage.getItem('wageClock_currentUser');
if(!CU) location.href='login.html';
function uk(k){return'wageClock_'+CU+'_'+k;}
function ld(k,d){try{var v=localStorage.getItem(uk(k));return v?JSON.parse(v):d;}catch(e){return d;}}
function sd(k,v){localStorage.setItem(uk(k),JSON.stringify(v));}
function go(u){location.href=u;}
function logout(){sessionStorage.removeItem('wageClock_currentUser');location.href='login.html';}

// Settings
var S=ld('settings',{
  monthlySalary:15000,workingDays:22,workStart:'09:00',workEnd:'18:00',
  dailySalary:15000/22,workHours:9,perSecondRate:(15000/22)/9/3600,
  workDaysOfWeek:[true,true,true,true,true,false,false],
  scheduleType:'dual',satWorkThisWeek:false,
  overtimeSettings:{mode:'rate',multiplier:1.5,customAmount:50,customUnit:'hour'}
});
if(!S.overtimeSettings)S.overtimeSettings={mode:'rate',multiplier:1.5,customAmount:50,customUnit:'hour'};

// Holidays
var HD={'2026-01-01':'New Year','2026-04-05':'Qingming','2026-05-01':'Labor Day','2026-05-31':'Dragon Boat','2026-09-25':'Mid-Autumn','2026-10-01':'National Day'};
var MW=['2026-02-14','2026-04-26','2026-05-09','2026-09-20','2026-09-27','2026-10-10'];

// State
var state='before',raf=null,acc=0,base=0,otAmt=0,cd=0,otStartT=null;

function gWS(){var p=S.workStart.split(':').map(Number);var d=new Date();d.setHours(p[0],p[1],0,0);return d;}
function gWE(){var p=S.workEnd.split(':').map(Number);var d=new Date();d.setHours(p[0],p[1],0,0);return d;}
function gWSecs(){return(gWE()-gWS())/1000;}
function otRate(){
  var o=S.overtimeSettings;
  if(o.mode==='persecond')return S.perSecondRate;
  if(o.mode==='custom'){if(o.customUnit==='once')return 0;if(o.customUnit==='hour')return(o.customAmount||0)/3600;return o.customAmount||0;}
  return S.perSecondRate*(o.multiplier||1.5);
}
function otLabel(){
  var o=S.overtimeSettings;
  if(o.mode==='persecond')return'1x rate';
  if(o.mode==='custom'){if(o.customUnit==='once')return'flat '+(o.customAmount||0);if(o.customUnit==='hour')return(o.customAmount||0)+'/hr';return(o.customAmount||0)+'/sec';}
  return (o.multiplier||1.5)+'x OT';
}

function isRest(){
  var t=new Date(),ds=t.toISOString().slice(0,10),dow=t.getDay();
  if(MW.indexOf(ds)>=0)return false;
  if(HD[ds])return{rest:true,reason:HD[ds],type:'holiday'};
  var idx=dow===0?6:dow-1;
  if(!S.workDaysOfWeek[idx])return{rest:true,reason:'weekend',type:'weekend'};
  return false;
}

function setState(s){
  state=s;if(raf){cancelAnimationFrame(raf);raf=null;}
  var c=document.getElementById('clock');c.className=s;
  if(s==='rest')showRest();else if(s==='before')showBefore();
  else if(s==='working')showWorking();else if(s==='after')showAfter();
  else if(s==='overtime')startOT();
}

function updatePill(s){
  var p=document.getElementById('pill');p.className='pill '+s;
}
function showRest(){
  updatePill('rest');document.getElementById('st').textContent='day off';
  document.getElementById('ml1').textContent='rest day';document.getElementById('ml2').textContent='';
  document.getElementById('amount').textContent='0.00';document.getElementById('lbl').textContent='paused';
  document.getElementById('otActs').style.display='none';
  document.getElementById('bd').style.display='none';
}
function showBefore(){
  updatePill('before');document.getElementById('st').textContent='waiting';
  document.getElementById('ml1').textContent='work starts in';document.getElementById('otActs').style.display='none';
  document.getElementById('bd').style.display='none';acc=0;base=0;otAmt=0;
  var now=new Date(),start=gWS();if(now>=start)start.setDate(start.getDate()+1);
  cd=Math.floor((start-now)/1000);if(cd<0)cd=5535;
  updateCD();animCD();
  document.getElementById('amount').textContent='0.00';document.getElementById('lbl').textContent='today';
  
}
function showWorking(){
  updatePill('working');document.getElementById('st').textContent='earning';
  document.getElementById('otActs').style.display='none';document.getElementById('bd').style.display='none';
  var now=new Date(),start=gWS(),end=gWE();
  var elapsed=Math.max(0,(now-start)/1000),total=gWSecs();
  base=Math.min(elapsed,Math.max(0,total))*S.perSecondRate;otAmt=0;acc=base;
  var eh=Math.floor(elapsed/3600),em=Math.floor((elapsed%3600)/60);
  document.getElementById('ml1').textContent=eh+'h '+em+'m worked today';document.getElementById('ml2').textContent='';
  setTimeout(function(){document.getElementById('ml1').textContent='';},4000);
  updateDisp();animWork();
  document.getElementById('lbl').textContent='earning · live';
}
function showAfter(){
  updatePill('after');document.getElementById('st').textContent='done';
  document.getElementById('ml1').textContent='';document.getElementById('ml2').textContent='';
  document.getElementById('bd').style.display='none';
  base=S.dailySalary;otAmt=0;acc=base;
  document.getElementById('amount').textContent=acc.toFixed(2);
  document.getElementById('lbl').textContent='today · completed';
  
  document.getElementById('otActs').style.display='block';
  document.getElementById('otStart').style.display='inline-block';
  document.getElementById('otStop').style.display='none';
  document.getElementById('otLabel').textContent='OT: '+otLabel();
  sd('earnings_'+new Date().toISOString().slice(0,10),base);
}
function startOT(){
  updatePill('overtime');document.getElementById('st').textContent='overtime';
  document.getElementById('ml1').textContent='';document.getElementById('ml2').textContent='';
  if(base<S.dailySalary)base=S.dailySalary;
  if(!otStartT)otStartT=new Date();
  acc=base+otAmt;updateDisp();updateBD();
  document.getElementById('bd').style.display='block';
  document.getElementById('lbl').textContent='base + ot · live';
  
  document.getElementById('otActs').style.display='block';
  document.getElementById('otStart').style.display='none';
  document.getElementById('otStop').style.display='inline-block';
  document.getElementById('otLabel').textContent='OT: '+otLabel();
  if(raf)cancelAnimationFrame(raf);
  animOT();document.getElementById('clock').className='overtime';state='overtime';
}
function stopOT(){
  if(otStartT){otAmt+=(new Date()-otStartT)/1000*otRate();}
  otStartT=null;acc=base+otAmt;
  document.getElementById('amount').textContent=acc.toFixed(2);
  document.getElementById('lbl').textContent='total · completed';
  updateBD();document.getElementById('bd').style.display='block';
  
  document.getElementById('otStart').style.display='inline-block';
  document.getElementById('otStart').textContent='resume overtime';
  document.getElementById('otStop').style.display='none';
  if(raf){cancelAnimationFrame(raf);raf=null;}
  sd('earnings_'+new Date().toISOString().slice(0,10),acc);
}

// Animations
function animCD(){
  var t=function(){cd--;
    if(cd<=0){setState('working');return;}
    updateCD();raf=requestAnimationFrame(function(){setTimeout(t,1000);});};
  raf=requestAnimationFrame(function(){setTimeout(t,1000);});
}
function updateCD(){
  var h=Math.floor(cd/3600),m=Math.floor((cd%3600)/60),s=cd%60;
  document.getElementById('ml2').textContent=[h,m,s].map(function(x){return String(x).padStart(2,'0');}).join(':');
}
function animWork(){
  var lt=Date.now();
  var t=function(){
    var now=Date.now(),delta=(now-lt)/1000;lt=now;
    var rem=S.dailySalary-base;
    if(rem>0.001){var add=Math.min(delta*S.perSecondRate,rem);base+=add;}
    acc=base+otAmt;updateDisp();
    if(base>=S.dailySalary-0.001){setState('after');return;}
    raf=requestAnimationFrame(t);
  };
  raf=requestAnimationFrame(t);
}
function animOT(){
  var lt=Date.now();otStartT=new Date();
  var t=function(){
    var now=Date.now();otAmt+=(now-lt)/1000*otRate();lt=now;
    acc=base+otAmt;updateDisp();updateBD();
    raf=requestAnimationFrame(t);
  };
  raf=requestAnimationFrame(t);
}
function updateDisp(){document.getElementById('amount').textContent=acc.toFixed(2);}
function updateBD(){
  document.getElementById('bdBase').textContent='¥'+base.toFixed(2);
  document.getElementById('bdOT').textContent='¥'+otAmt.toFixed(2);
}

// Init
(function(){
  var r=isRest();
  if(r){setState('rest');return;}
  var now=new Date(),start=gWS(),end=gWE();
  if(now<start)setState('before');
  else if(now>end)setState('after');
  else setState('working');
})();

// DotGrid
(function(){
  var cv=document.getElementById('bg'),ctx=cv.getContext('2d');
  var DS=3,G=28,P=120,RS=0.08,FR=0.88,W=0,H=0,dots=[];
  var pt={x:-999,y:-999,px:0,py:0,vx:0,vy:0};
  function build(){
    var r=cv.parentNode.getBoundingClientRect();W=r.width;H=r.height;
    var dpr=devicePixelRatio||1;cv.width=W*dpr;cv.height=H*dpr;
    cv.style.width=W+'px';cv.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
    var cell=DS+G,cols=Math.floor(W/cell),rows=Math.floor(H/cell);
    var gW=cell*cols,gH=cell*rows,ox=(W-gW)/2+DS/2,oy=(H-gH)/2+DS/2;
    dots=[];for(var r=0;r<rows;r++)for(var c=0;c<cols;c++)dots.push({cx:ox+c*cell,cy:oy+r*cell,x:0,y:0,vx:0,vy:0});
  }
  function draw(){
    ctx.clearRect(0,0,W,H);var psq=P*P;
    for(var i=0;i<dots.length;i++){
      var d=dots[i],ox=d.cx+d.x,oy=d.cy+d.y,dx=d.cx-pt.x,dy=d.cy-pt.y,dsq=dx*dx+dy*dy;
      var a=0.1;if(dsq<psq){var t=1-Math.sqrt(dsq)/P;a=0.1+t*0.45;}
      ctx.beginPath();ctx.arc(ox,oy,DS/2,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,'+a.toFixed(2)+')';ctx.fill();
    }
  }
  function upd(){
    pt.vx+=(pt.x-pt.px-pt.vx)*0.3;pt.vy+=(pt.y-pt.py-pt.vy)*0.3;pt.px=pt.x;pt.py=pt.y;
    var spd=Math.hypot(pt.vx,pt.vy);
    for(var i=0;i<dots.length;i++){
      var d=dots[i],dx=d.cx-pt.x,dy=d.cy-pt.y,dist=Math.hypot(dx,dy);
      if(dist<P&&spd>5){var f=(1-dist/P)*spd*0.015;d.vx+=(dx/dist)*f;d.vy+=(dy/dist)*f;}
      d.vx+=(0-d.x)*RS;d.vy+=(0-d.y)*RS;d.vx*=FR;d.vy*=FR;d.x+=d.vx;d.y+=d.vy;
    }
  }
  function tick(){upd();draw();requestAnimationFrame(tick);}
  function mv(e){var r=cv.getBoundingClientRect();pt.x=e.clientX-r.left;pt.y=e.clientY-r.top;}
  function cl(e){var r=cv.getBoundingClientRect(),cx=e.clientX-r.left,cy=e.clientY-r.top;
    for(var i=0;i<dots.length;i++){var d=dots[i],dist=Math.hypot(d.cx-cx,d.cy-cy);
    if(dist<200){var f=(1-dist/200)*12;d.vx+=(d.cx-cx)/dist*f;d.vy+=(d.cy-cy)/dist*f;}}}
  setTimeout(function(){build();requestAnimationFrame(tick);},100);
  window.addEventListener('resize',build);window.addEventListener('mousemove',mv,{passive:true});window.addEventListener('click',cl);
})();
