// --- 1. SETUP ---
const container = document.createElement('div');
container.id = 'cursor-cat-container';

const cat = document.createElement('div');
cat.id = 'cursor-cat';

const sleepBubble = document.createElement('div');
sleepBubble.id = 'sleep-bubble';

container.appendChild(sleepBubble);
container.appendChild(cat);
document.body.appendChild(container);

// --- 2. STATE MANAGEMENT ---
let containerX = 0, containerY = 0;
let cursorX = 0, cursorY = 0;
let idleTimeout;

// Set the initial state to sleeping
container.classList.add('sleeping');
cat.classList.add('sleeping');

// --- 3. CURSOR TRACKING ---
window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;

    // Wake the cat up if it's sleeping
    if (container.classList.contains('sleeping')) {
        container.classList.remove('sleeping');
        cat.classList.remove('sleeping');
        container.classList.add('active');
        cat.classList.add('active');
    }

    // Reset the timer to go to sleep
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
        // Go to sleep after 250ms of inactivity
        container.classList.remove('active');
        cat.classList.remove('active');
        container.classList.add('sleeping');
        cat.classList.add('sleeping');
    }, 250); 
});

// --- 4. MOVEMENT LOOP ---
function followCursor() {
    // Use easing for smooth, natural movement
    const speed = 0.17;
    containerX += (cursorX - containerX) * speed;
    containerY += (cursorY - containerY) * speed;
    
    // Flip the cat sprite based on direction
    if (cursorX > containerX) {
        cat.style.transform = 'translateX(-50%) scaleX(1)'; // Face right
    } else {
        cat.style.transform = 'translateX(-50%) scaleX(-1)'; // Face left
    }
    
    // Center the container on the cursor
    container.style.left = (containerX - container.offsetWidth / 2) + 'px';
    container.style.top = (containerY - container.offsetHeight / 2) + 'px';

    requestAnimationFrame(followCursor);
}

// --- 5. START ---
followCursor();