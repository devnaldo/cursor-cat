// Cursor Cat Content Script
(function() {
  'use strict';
  
  // Prevent multiple instances if script runs multiple times
  if (document.getElementById('cursor-cat')) {
    return;
  }

  // Cat states
  const CAT_STATES = {
    FOLLOWING: 'following',
    IDLE: 'idle',
    SLEEPING: 'sleeping',
    SHOWING_HEART: 'showing_heart'
  };

  // Configuration
  const CONFIG = {
    idleDelay: 800, // Milliseconds to wait before going idle
    sleepDelay: 2000, // Milliseconds to wait before sleeping
    heartDelay: 3000, // Milliseconds to wait before showing heart
    heartDuration: 2000, // How long to show the heart
    followOffset: { x: 15, y: 15 }, // Offset from cursor
    heartOffset: { x: -8, y: -25 } // Offset from cat for heart position
  };

  // Create pixel art data URLs for the cat animations
  const SPRITES = {
    following: createCatSprite('following'),
    idle: createCatSprite('idle'),
    sleeping: createCatSprite('sleeping')
  };

  const HEART_SPRITE = createHeartSprite();

  let cat, heart;
  let currentState = CAT_STATES.FOLLOWING;
  let mouseX = 0, mouseY = 0;
  let idleTimer, sleepTimer, heartTimer;
  let animationFrame;

  // Initialize the cat
  function init() {
    createCatElements();
    startFollowing();
    setupEventListeners();
  }

  function createCatElements() {
    // Create the cat
    cat = document.createElement('img');
    cat.id = 'cursor-cat';
    cat.src = SPRITES.following;
    cat.draggable = false;
    
    // Create the heart
    heart = document.createElement('img');
    heart.id = 'cursor-cat-heart';
    heart.src = HEART_SPRITE;
    heart.draggable = false;
    
    // Add to page
    document.body.appendChild(cat);
    document.body.appendChild(heart);
  }

  function setupEventListeners() {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
  }

  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (currentState !== CAT_STATES.FOLLOWING) {
      startFollowing();
    }
    
    clearTimers();
    idleTimer = setTimeout(startIdleSequence, CONFIG.idleDelay);
    
    updateCatPosition();
  }

  function handleMouseEnter() {
    if (cat) cat.style.opacity = '1';
    if (heart) heart.style.opacity = '0';
  }

  function handleMouseLeave() {
    // Optionally hide cat when mouse leaves window
    // if (cat) cat.style.opacity = '0.5';
  }

  function updateCatPosition() {
    if (!cat) return;
    
    const x = mouseX + CONFIG.followOffset.x;
    const y = mouseY + CONFIG.followOffset.y;
    
    cat.style.transform = `translate(${x}px, ${y}px)`;
    
    // Update heart position too
    if (heart) {
      const heartX = mouseX + CONFIG.followOffset.x + CONFIG.heartOffset.x;
      const heartY = mouseY + CONFIG.followOffset.y + CONFIG.heartOffset.y;
      heart.style.transform = `translate(${heartX}px, ${heartY}px)`;
    }
  }

  function startFollowing() {
    currentState = CAT_STATES.FOLLOWING;
    if (cat) cat.src = SPRITES.following;
    if (heart) heart.classList.remove('show');
  }

  function startIdleSequence() {
    currentState = CAT_STATES.IDLE;
    if (cat) cat.src = SPRITES.idle;
    
    sleepTimer = setTimeout(startSleeping, CONFIG.sleepDelay);
  }

  function startSleeping() {
    currentState = CAT_STATES.SLEEPING;
    if (cat) cat.src = SPRITES.sleeping;
    
    heartTimer = setTimeout(showHeart, CONFIG.heartDelay);
  }

  function showHeart() {
    currentState = CAT_STATES.SHOWING_HEART;
    if (heart) {
      heart.classList.add('show');
      
      // Hide heart after duration
      setTimeout(() => {
        if (heart && currentState === CAT_STATES.SHOWING_HEART) {
          heart.classList.remove('show');
        }
      }, CONFIG.heartDuration);
    }
  }

  function clearTimers() {
    clearTimeout(idleTimer);
    clearTimeout(sleepTimer);
    clearTimeout(heartTimer);
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  }

  // Create simple pixel art sprites as data URLs
  function createCatSprite(state) {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Simple white pixel cat with black outline
    ctx.fillStyle = '#000000'; // Black outline
    ctx.fillRect(8, 8, 16, 16); // Body outline
    ctx.fillRect(6, 6, 4, 4); // Left ear outline
    ctx.fillRect(22, 6, 4, 4); // Right ear outline
    ctx.fillRect(4, 20, 4, 8); // Left leg outline
    ctx.fillRect(24, 20, 4, 8); // Right leg outline
    ctx.fillRect(24, 12, 6, 4); // Tail outline
    
    ctx.fillStyle = '#FFFFFF'; // White fill
    ctx.fillRect(9, 9, 14, 14); // Body
    ctx.fillRect(7, 7, 2, 2); // Left ear
    ctx.fillRect(23, 7, 2, 2); // Right ear
    ctx.fillRect(5, 21, 2, 6); // Left leg
    ctx.fillRect(25, 21, 2, 6); // Right leg
    ctx.fillRect(25, 13, 4, 2); // Tail
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(12, 12, 1, 1); // Left eye
    ctx.fillRect(19, 12, 1, 1); // Right eye
    
    // Different poses for different states
    if (state === 'sleeping') {
      // Sleeping pose - body lower
      ctx.clearRect(0, 0, 32, 32);
      ctx.fillStyle = '#000000';
      ctx.fillRect(6, 16, 20, 8); // Body outline (lower)
      ctx.fillRect(4, 14, 4, 4); // Left ear outline
      ctx.fillRect(24, 14, 4, 4); // Right ear outline
      ctx.fillRect(26, 18, 6, 4); // Tail
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(7, 17, 18, 6); // Body
      ctx.fillRect(5, 15, 2, 2); // Left ear
      ctx.fillRect(25, 15, 2, 2); // Right ear
      ctx.fillRect(27, 19, 4, 2); // Tail
      
      // Closed eyes (sleeping)
      ctx.fillStyle = '#000000';
      ctx.fillRect(11, 18, 2, 1); // Left closed eye
      ctx.fillRect(19, 18, 2, 1); // Right closed eye
    }
    
    return canvas.toDataURL();
  }

  function createHeartSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    
    // Simple pixel heart
    ctx.fillStyle = '#FF69B4'; // Pink heart
    
    // Heart shape using pixels
    const heartPixels = [
      [4,2], [5,2], [6,2], [9,2], [10,2], [11,2],
      [3,3], [4,3], [5,3], [6,3], [7,3], [8,3], [9,3], [10,3], [11,3], [12,3],
      [2,4], [3,4], [4,4], [5,4], [6,4], [7,4], [8,4], [9,4], [10,4], [11,4], [12,4], [13,4],
      [2,5], [3,5], [4,5], [5,5], [6,5], [7,5], [8,5], [9,5], [10,5], [11,5], [12,5], [13,5],
      [3,6], [4,6], [5,6], [6,6], [7,6], [8,6], [9,6], [10,6], [11,6], [12,6],
      [4,7], [5,7], [6,7], [7,7], [8,7], [9,7], [10,7], [11,7],
      [5,8], [6,8], [7,8], [8,8], [9,8], [10,8],
      [6,9], [7,9], [8,9], [9,9],
      [7,10], [8,10]
    ];
    
    heartPixels.forEach(([x, y]) => {
      ctx.fillRect(x, y, 1, 1);
    });
    
    return canvas.toDataURL();
  }

  // Cleanup function
  function cleanup() {
    clearTimers();
    if (cat) cat.remove();
    if (heart) heart.remove();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseenter', handleMouseEnter);
    document.removeEventListener('mouseleave', handleMouseLeave);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);

})();