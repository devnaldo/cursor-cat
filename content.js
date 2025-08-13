// Simple Cursor Cat Test
console.log("Cursor Cat extension loaded!");

// Prevent multiple instances
if (document.getElementById('cursor-cat')) {
  console.log("Cat already exists, skipping...");
} else {
  console.log("Creating new cat...");
  
  // Create a simple test cat
  const cat = document.createElement('div');
  cat.id = 'cursor-cat';
  cat.innerHTML = '🐱';
  cat.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    font-size: 24px;
    pointer-events: none;
    z-index: 999999;
    transform: translate(100px, 100px);
  `;
  
  document.body.appendChild(cat);
  console.log("Cat created and added to page!");
  
  // Simple mouse following
  document.addEventListener('mousemove', function(e) {
    cat.style.transform = `translate(${e.clientX + 10}px, ${e.clientY + 10}px)`;
  });
  
  console.log("Mouse listener added!");
}