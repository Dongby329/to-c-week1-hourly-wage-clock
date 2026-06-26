/**
 * TargetCursor v1.0 — vanilla JS port from React Bits
 * Custom cursor with spinning corners, target snapping, and parallax.
 * Dependencies: GSAP (gsap.min.js)
 * Usage: initTargetCursor({ targetSelector: '.cursor-target' })
 */
(function(global){
'use strict';

// ── Helpers ─────────────────────────────────────────────
function getContainingBlock(el){
  var node = el && el.parentElement;
  while(node && node !== document.documentElement){
    var style = getComputedStyle(node);
    if(
      style.transform !== 'none' ||
      style.perspective !== 'none' ||
      style.filter !== 'none' ||
      style.willChange.indexOf('transform') !== -1 ||
      style.willChange.indexOf('perspective') !== -1 ||
      style.willChange.indexOf('filter') !== -1 ||
      /paint|layout|strict|content/.test(style.contain)
    ){
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

function getContainingBlockOffset(block){
  if(!block) return { x: 0, y: 0 };
  var rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
}

function isMobileDevice(){
  if(typeof window === 'undefined') return false;
  var hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  var small = window.innerWidth <= 768;
  var ua = (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase();
  var mobileRE = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return (hasTouch && small) || mobileRE.test(ua);
}

// ── Public API ───────────────────────────────────────────
global.initTargetCursor = function(config){
  config = config || {};

  if(isMobileDevice()) return null;

  var targetSelector   = config.targetSelector   || '.cursor-target';
  var spinDuration     = config.spinDuration     || 2;
  var hideDefaultCursor = config.hideDefaultCursor !== false;
  var hoverDuration    = config.hoverDuration    || 0.2;
  var parallaxOn       = config.parallaxOn !== false;
  var cursorColor      = config.cursorColor      || '#ffffff';
  var cursorColorOnTarget = config.cursorColorOnTarget || null;

  var CONSTANTS = { borderWidth: 3, cornerSize: 12 };

  // ── Build DOM ────────────────────────────────────────
  var wrapper = document.createElement('div');
  wrapper.className = 'target-cursor-wrapper';

  var dot = document.createElement('div');
  dot.className = 'target-cursor-dot';
  dot.style.backgroundColor = cursorColor;
  wrapper.appendChild(dot);

  // Click ripple (the only addition to v1.0)
  var ripple = document.createElement('div');
  ripple.className = 'target-cursor-ripple';
  wrapper.appendChild(ripple);

  var positions = ['corner-tl','corner-tr','corner-br','corner-bl'];
  var corners = [];
  for(var i = 0; i < 4; i++){
    var c = document.createElement('div');
    c.className = 'target-cursor-corner ' + positions[i];
    c.style.borderColor = cursorColor;
    wrapper.appendChild(c);
    corners.push(c);
  }

  document.body.appendChild(wrapper);

  // ── State ─────────────────────────────────────────────
  var containingBlock = getContainingBlock(wrapper);
  var activeTarget = null;
  var currentLeaveHandler = null;
  var resumeTimeout = null;
  var targetCornerPositions = null;
  var isActive = false;
  var activeStrengthHolder = { current: 0 };
  var spinTl = null;
  var originalCursor = document.body.style.cursor;

  function getOffset(){ return getContainingBlockOffset(containingBlock); }

  // ── Spin timeline ─────────────────────────────────────
  function createSpinTimeline(){
    if(spinTl){ spinTl.kill(); }
    spinTl = gsap.timeline({ repeat: -1 })
      .to(wrapper, { rotation: '+=360', duration: spinDuration, ease: 'none' });
  }

  // ── Move cursor ───────────────────────────────────────
  function moveCursor(x, y){
    var off = getOffset();
    gsap.set(wrapper, {
      x: x - off.x,
      y: y - off.y
    });
  }

  // ── Parallax ticker ───────────────────────────────────
  function tickerFn(){
    if(!targetCornerPositions || !wrapper) return;
    var strength = activeStrengthHolder.current;
    if(strength === 0) return;

    var cursorX = gsap.getProperty(wrapper, 'x');
    var cursorY = gsap.getProperty(wrapper, 'y');

    for(var i = 0; i < 4; i++){
      var corner = corners[i];
      var currentX = gsap.getProperty(corner, 'x');
      var currentY = gsap.getProperty(corner, 'y');

      var targetX = targetCornerPositions[i].x - cursorX;
      var targetY = targetCornerPositions[i].y - cursorY;

      var finalX = currentX + (targetX - currentX) * strength;
      var finalY = currentY + (targetY - currentY) * strength;

      var dur = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;

      gsap.to(corner, {
        x: finalX, y: finalY,
        duration: dur,
        ease: dur === 0 ? 'none' : 'power1.out',
        overwrite: 'auto'
      });
    }
  }

  // ── Cleanup target ────────────────────────────────────
  function cleanupTarget(target){
    if(currentLeaveHandler){
      target.removeEventListener('mouseleave', currentLeaveHandler);
    }
    currentLeaveHandler = null;
  }

  // ── Init position ─────────────────────────────────────
  var initOff = getOffset();
  gsap.set(wrapper, {
    xPercent: -50,
    yPercent: -50,
    x: window.innerWidth / 2 - initOff.x,
    y: window.innerHeight / 2 - initOff.y
  });

  createSpinTimeline();

  // ── Global handlers ───────────────────────────────────
  function moveHandler(e){ moveCursor(e.clientX, e.clientY); }
  window.addEventListener('mousemove', moveHandler);

  function scrollHandler(){
    if(!activeTarget || !wrapper) return;
    var off = getOffset();
    var mouseX = gsap.getProperty(wrapper, 'x') + off.x;
    var mouseY = gsap.getProperty(wrapper, 'y') + off.y;
    var elUnder = document.elementFromPoint(mouseX, mouseY);
    var stillOver = elUnder && (elUnder === activeTarget || elUnder.closest(targetSelector) === activeTarget);
    if(!stillOver && currentLeaveHandler){
      currentLeaveHandler();
    }
  }
  window.addEventListener('scroll', scrollHandler, { passive: true });

  function mouseDownHandler(){
    gsap.to(dot, { scale: 0.7, duration: 0.3 });
    gsap.to(wrapper, { scale: 0.9, duration: 0.2 });
    // Click ripple (only addition)
    gsap.killTweensOf(ripple);
    gsap.set(ripple, { width: 0, height: 0, opacity: 1, borderWidth: 1 });
    gsap.to(ripple, { width: 36, height: 36, borderWidth: 0, opacity: 0, duration: 0.5, ease: 'power2.out' });
  }
  function mouseUpHandler(){
    gsap.to(dot, { scale: 1, duration: 0.3 });
    gsap.to(wrapper, { scale: 1, duration: 0.2 });
  }
  window.addEventListener('mousedown', mouseDownHandler);
  window.addEventListener('mouseup', mouseUpHandler);

  // ── Target enter ──────────────────────────────────────
  function enterHandler(e){
    // Find closest matching target
    var el = e.target;
    var target = null;
    while(el && el !== document.body){
      if(el.matches && el.matches(targetSelector)){ target = el; break; }
      el = el.parentElement;
    }
    if(!target || !wrapper || !corners.length) return;
    if(activeTarget === target) return;

    if(activeTarget){ cleanupTarget(activeTarget); }
    if(resumeTimeout){ clearTimeout(resumeTimeout); resumeTimeout = null; }

    activeTarget = target;

    // Kill corner tweens
    for(var i = 0; i < corners.length; i++){
      gsap.killTweensOf(corners[i], 'x,y');
    }

    // Stop spin
    gsap.killTweensOf(wrapper, 'rotation');
    if(spinTl){ spinTl.pause(); }
    gsap.set(wrapper, { rotation: 0 });

    // Color transition
    if(cursorColorOnTarget){
      gsap.to(corners, { borderColor: cursorColorOnTarget, duration: 0.15, ease: 'power2.out' });
      gsap.to(dot, { backgroundColor: cursorColorOnTarget, duration: 0.15, ease: 'power2.out' });
    }

    var rect = target.getBoundingClientRect();
    var bw = CONSTANTS.borderWidth;
    var cs = CONSTANTS.cornerSize;
    var off = getOffset();
    var cursorX = gsap.getProperty(wrapper, 'x');
    var cursorY = gsap.getProperty(wrapper, 'y');

    targetCornerPositions = [
      { x: rect.left - bw - off.x,         y: rect.top - bw - off.y },
      { x: rect.right + bw - cs - off.x,   y: rect.top - bw - off.y },
      { x: rect.right + bw - cs - off.x,   y: rect.bottom + bw - cs - off.y },
      { x: rect.left - bw - off.x,         y: rect.bottom + bw - cs - off.y }
    ];

    isActive = true;
    gsap.ticker.add(tickerFn);

    gsap.to(activeStrengthHolder, {
      current: 1,
      duration: hoverDuration,
      ease: 'power2.out'
    });

    for(var j = 0; j < corners.length; j++){
      gsap.to(corners[j], {
        x: targetCornerPositions[j].x - cursorX,
        y: targetCornerPositions[j].y - cursorY,
        duration: 0.2,
        ease: 'power2.out'
      });
    }

    // ── Leave handler ────────────────────────────────
    var leaveHandler = function(){
      gsap.ticker.remove(tickerFn);
      isActive = false;
      targetCornerPositions = null;
      gsap.set(activeStrengthHolder, { current: 0, overwrite: true });
      activeTarget = null;

      if(cursorColorOnTarget){
        gsap.to(corners, { borderColor: cursorColor, duration: 0.15, ease: 'power2.out' });
        gsap.to(dot, { backgroundColor: cursorColor, duration: 0.15, ease: 'power2.out' });
      }

      // Animate corners back to center
      for(var k = 0; k < corners.length; k++){
        gsap.killTweensOf(corners[k], 'x,y');
      }

      var cs2 = CONSTANTS.cornerSize;
      var homePositions = [
        { x: -cs2 * 1.5, y: -cs2 * 1.5 },
        { x:  cs2 * 0.5, y: -cs2 * 1.5 },
        { x:  cs2 * 0.5, y:  cs2 * 0.5 },
        { x: -cs2 * 1.5, y:  cs2 * 0.5 }
      ];

      var tl = gsap.timeline();
      for(var m = 0; m < corners.length; m++){
        tl.to(corners[m], {
          x: homePositions[m].x,
          y: homePositions[m].y,
          duration: 0.3,
          ease: 'power3.out'
        }, 0);
      }

      // Resume spin after short delay
      resumeTimeout = setTimeout(function(){
        if(!activeTarget && wrapper && spinTl){
          var curRot = gsap.getProperty(wrapper, 'rotation');
          var normRot = curRot % 360;
          spinTl.kill();
          spinTl = gsap.timeline({ repeat: -1 })
            .to(wrapper, { rotation: '+=360', duration: spinDuration, ease: 'none' });
          gsap.to(wrapper, {
            rotation: normRot + 360,
            duration: spinDuration * (1 - normRot / 360),
            ease: 'none',
            onComplete: function(){ if(spinTl) spinTl.restart(); }
          });
        }
        resumeTimeout = null;
      }, 50);

      cleanupTarget(target);
    };

    currentLeaveHandler = leaveHandler;
    target.addEventListener('mouseleave', leaveHandler);
  }

  window.addEventListener('mouseover', enterHandler, { passive: true });

  function resizeHandler(){
    containingBlock = getContainingBlock(wrapper);
  }
  window.addEventListener('resize', resizeHandler);

  // ── Hide default cursor ───────────────────────────────
  if(hideDefaultCursor){
    document.body.style.cursor = 'none';
  }

  // ── Destroy / return ──────────────────────────────────
  function destroy(){
    gsap.ticker.remove(tickerFn);
    window.removeEventListener('mousemove', moveHandler);
    window.removeEventListener('mouseover', enterHandler);
    window.removeEventListener('scroll', scrollHandler);
    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('mousedown', mouseDownHandler);
    window.removeEventListener('mouseup', mouseUpHandler);
    if(activeTarget){ cleanupTarget(activeTarget); }
    if(spinTl){ spinTl.kill(); }
    if(hideDefaultCursor && document.body.style.cursor === 'none'){
      document.body.style.cursor = originalCursor;
    }
    if(wrapper && wrapper.parentNode){
      wrapper.parentNode.removeChild(wrapper);
    }
    isActive = false;
    targetCornerPositions = null;
    activeStrengthHolder.current = 0;
  }

  return {
    wrapper: wrapper,
    destroy: destroy
  };
};

})(window);
