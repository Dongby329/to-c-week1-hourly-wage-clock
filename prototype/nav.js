/**
 * PillNav v2.1 — vanilla JS port from React Bits
 * Dark theme, circle-expand hover, GSAP powered.
 * Usage: initPillNav({ active: 'clock', onLogout: fn })
 */
(function(global){
'use strict';

// ── Styles ──────────────────────────────────────────────
var STYLES = '\
.pill-nav-wrap {\
  position:fixed;top:16px;left:50%;z-index:99;\
}\
.pill-nav {\
  --nav-h:38px;--pill-pad-x:18px;--pill-gap:2px;\
  display:flex;align-items:center;box-sizing:border-box;\
  background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);\
  border-radius:9999px;padding:3px;\
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);\
}\
.pill-nav .pill-list {\
  list-style:none;display:flex;align-items:stretch;gap:var(--pill-gap);\
  margin:0;padding:0;height:var(--nav-h);\
}\
.pill-nav .pill-list > li { display:flex;height:100%; }\
.pill-nav .pill {\
  display:inline-flex;align-items:center;justify-content:center;height:100%;\
  padding:0 var(--pill-pad-x);color:rgba(255,255,255,0.5);text-decoration:none;\
  border-radius:9999px;font-weight:600;font-size:11px;line-height:1;\
  text-transform:uppercase;letter-spacing:1.2px;white-space:nowrap;\
  cursor:pointer;position:relative;overflow:hidden;background:transparent;\
  font-family:inherit;border:none;outline:none;\
  transition:color 0.2s cubic-bezier(0.4,0,0.2,1);\
}\
.pill-nav .pill:focus-visible {\
  box-shadow:0 0 0 2px rgba(245,158,11,0.5);\
}\
.pill-nav .pill .hover-circle {\
  position:absolute;left:50%;bottom:0;border-radius:50%;z-index:1;\
  display:block;pointer-events:none;will-change:transform;\
  background:rgba(255,255,255,0.92);\
}\
.pill-nav .pill .label-stack {\
  position:relative;display:inline-block;line-height:1;z-index:2;\
}\
.pill-nav .pill .pill-label {\
  position:relative;z-index:2;display:inline-block;line-height:1;\
  will-change:transform;\
}\
.pill-nav .pill .pill-label-hover {\
  position:absolute;left:0;top:0;color:#0a0a10;z-index:3;display:inline-block;\
  will-change:transform,opacity;\
}\
.pill-nav .pill.is-active { color:#fff; }\
.pill-nav .pill.is-active::after {\
  content:"";position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);\
  width:4px;height:4px;background:#f59e0b;border-radius:50%;z-index:4;\
}\
.pill-nav .sep {\
  width:1px;background:rgba(255,255,255,0.08);margin:8px 8px;align-self:stretch;flex-shrink:0;\
}\
.pill-nav .pill-account {\
  padding:0 12px !important;color:rgba(255,255,255,0.35);\
  line-height:1;display:inline-flex;align-items:center;justify-content:center;\
}\
.pill-nav .pill-account:hover { color:rgba(255,255,255,0.7); }\
';

// ── Helpers ─────────────────────────────────────────────
var _debouncers = {};
function debounce(key, fn, ms){
  if(_debouncers[key]) clearTimeout(_debouncers[key]);
  _debouncers[key] = setTimeout(fn, ms);
}

// ── Inject CSS ──────────────────────────────────────────
function injectStyles(){
  if(document.getElementById('pillnav-styles')) return;
  var s = document.createElement('style');
  s.id = 'pillnav-styles';
  s.textContent = STYLES;
  document.head.appendChild(s);
}

// ── Circle geometry ─────────────────────────────────────
function calcCircle(w, h){
  var R = ((w * w) / 4 + h * h) / (2 * h);
  var D = Math.ceil(2 * R) + 2;
  var delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
  return { D: D, delta: delta, originY: D - delta };
}

// ── Create nav ──────────────────────────────────────────
function createNav(items, activeIdx, onLogout){
  var wrap = document.createElement('div');
  wrap.className = 'pill-nav-wrap';

  var nav = document.createElement('nav');
  nav.className = 'pill-nav';
  nav.setAttribute('aria-label','Primary');

  var ul = document.createElement('ul');
  ul.className = 'pill-list';
  ul.setAttribute('role','menubar');

  var circles = [], timelines = [], activeTweens = [];

  // Build pill items
  items.forEach(function(item, i){
    var li = document.createElement('li');
    li.setAttribute('role','none');

    var a = document.createElement('a');
    a.setAttribute('role','menuitem');
    a.href = item.href;
    a.className = 'pill' + (i === activeIdx ? ' is-active' : '');
    a.setAttribute('aria-label', item.label);
    a.setAttribute('aria-current', i === activeIdx ? 'page' : 'false');

    var circle = document.createElement('span');
    circle.className = 'hover-circle';
    circle.setAttribute('aria-hidden','true');
    circles.push(circle);
    a.appendChild(circle);

    var stack = document.createElement('span');
    stack.className = 'label-stack';

    var label = document.createElement('span');
    label.className = 'pill-label';
    label.textContent = item.label;
    stack.appendChild(label);

    var hoverLabel = document.createElement('span');
    hoverLabel.className = 'pill-label-hover';
    hoverLabel.setAttribute('aria-hidden','true');
    hoverLabel.textContent = item.label;
    stack.appendChild(hoverLabel);

    a.appendChild(stack);
    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);

  // Account switch
  if(onLogout){
    var sep = document.createElement('span');
    sep.className = 'sep';
    nav.appendChild(sep);

    var accBtn = document.createElement('button');
    accBtn.className = 'pill pill-account';
    accBtn.title = 'Switch account';
    accBtn.setAttribute('aria-label','Switch account');
    accBtn.textContent = '⇄';
    accBtn.addEventListener('click', onLogout);
    nav.appendChild(accBtn);
  }

  wrap.appendChild(nav);

  // ── Layout ──────────────────────────────────────────
  var laidOut = false;

  function layout(){
    laidOut = true;
    circles.forEach(function(circle, i){
      var pill = circle.parentElement;
      if(!pill) return;
      var rect = pill.getBoundingClientRect();
      var w = rect.width, h = rect.height;
      if(w <= 0 || h <= 0) return;

      var geo = calcCircle(w, h);

      circle.style.width  = geo.D + 'px';
      circle.style.height = geo.D + 'px';
      circle.style.bottom = '-' + geo.delta + 'px';

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: '50% ' + geo.originY + 'px'
      });

      var labelEl = pill.querySelector('.pill-label');
      var hoverEl = pill.querySelector('.pill-label-hover');
      if(labelEl) gsap.set(labelEl, { y: 0 });
      if(hoverEl) gsap.set(hoverEl, { y: h + 12, opacity: 0 });

      if(timelines[i]) timelines[i].kill();
      var tl = gsap.timeline({ paused: true });
      tl.to(circle, {
        scale: 1.2, xPercent: -50, duration: 1.6,
        ease: 'power3.easeOut', overwrite:'auto'
      }, 0);
      if(labelEl) tl.to(labelEl, {
        y: -(h + 8), duration: 1.6,
        ease: 'power3.easeOut', overwrite:'auto'
      }, 0);
      if(hoverEl) tl.to(hoverEl, {
        y: 0, opacity: 1, duration: 1.6,
        ease: 'power3.easeOut', overwrite:'auto'
      }, 0);
      timelines[i] = tl;
    });
  }

  // ── Hover handlers ──────────────────────────────────
  function bindHover(){
    var pills = ul.querySelectorAll('.pill');
    pills.forEach(function(pill, i){
      if(pill._pillNavBound) return;
      pill._pillNavBound = true;

      pill.addEventListener('mouseenter', function(){
        var tl = timelines[i];
        if(!tl) return;
        if(activeTweens[i]) activeTweens[i].kill();
        activeTweens[i] = tl.tweenTo(tl.duration(), {
          duration: 0.35, ease: 'power2.easeOut', overwrite:'auto'
        });
        pill.style.color = '#0a0a10';
      });

      pill.addEventListener('mouseleave', function(){
        var tl = timelines[i];
        if(!tl) return;
        if(activeTweens[i]) activeTweens[i].kill();
        activeTweens[i] = tl.tweenTo(0, {
          duration: 0.25, ease: 'power2.easeOut', overwrite:'auto'
        });
        pill.style.color = '';
      });
    });
  }

  // ── Entrance animation ──────────────────────────────
  function animateIn(){
    if(!laidOut) layout();
    bindHover();

    // GSAP handles all transforms (including xPercent for centering)
    gsap.set(wrap, { xPercent: -50 });
    gsap.fromTo(wrap,
      { opacity: 0, y: -10, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.easeOut' }
    );

    var pills = ul.querySelectorAll('.pill');
    gsap.fromTo(pills,
      { opacity: 0, y: -4 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.easeOut', delay: 0.08 }
    );
  }

  // ── Fallback: show nav without animation ──────────────
  function showStatic(){
    wrap.style.opacity = '1';
    wrap.style.transform = 'translateX(-50%)';
    bindHover();
  }

  // ── Insert into DOM ─────────────────────────────────
  document.body.insertBefore(wrap, document.body.firstChild);

  // ── Bootstrap ───────────────────────────────────────
  function boot(){
    if(!window.gsap){
      if(!boot._retries) boot._retries = 0;
      if(boot._retries++ < 15){ setTimeout(boot, 100); return; }
      // GSAP failed after 1.5s — show without animation
      showStatic();
      return;
    }
    animateIn();
  }

  requestAnimationFrame(function(){
    requestAnimationFrame(function(){
      boot();
    });
  });

  // ── Resize (debounced) ──────────────────────────────
  window.addEventListener('resize', function(){
    debounce('pillnav', function(){
      if(laidOut) layout();
    }, 200);
  });

  // Re-layout on font load
  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(function(){
      requestAnimationFrame(function(){
        if(laidOut) layout();
      });
    }).catch(function(){});
  }

  return { wrap: wrap, layout: layout };
}

// ── Public API ───────────────────────────────────────────
global.initPillNav = function(config){
  config = config || {};
  var active = (config.active || 'clock').toLowerCase();

  var ITEMS = [
    { label: (typeof t==='function'?t('CLOCK'):'CLOCK'),    href: 'clock.html' },
    { label: (typeof t==='function'?t('CALENDAR'):'CALENDAR'), href: 'calendar.html' },
    { label: (typeof t==='function'?t('SETTINGS'):'SETTINGS'), href: 'setup.html' }
  ];

  var activeIdx = -1;
  for(var i = 0; i < ITEMS.length; i++){
    if(ITEMS[i].label.toLowerCase() === active){ activeIdx = i; break; }
  }

  injectStyles();
  return createNav(ITEMS, activeIdx, config.onLogout || null);
};

})(window);
