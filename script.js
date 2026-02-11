const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Mouse
let mouse = { x: width/2, y: height/2 };
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Nodes (کارت‌ها)
const nodes = [
  { x: width/2, y: height*0.8, r: 20 },
  { x: width/2 + 450, y: height*0.6, r: 16 },
  { x: width/2 + 900, y: height*0.6, r: 16 },
  { x: width/2 + 1350, y: height*0.4, r: 12 },
  { x: width/2 + 1800, y: height*0.4, r: 12 },
];

// Particles
const particles = [];
for(let i=0;i<300;i++){
  particles.push({
    x: Math.random()*width,
    y: Math.random()*height,
    r: Math.random()*2 + 1,
    dx: (Math.random()-0.5)*1,
    dy: (Math.random()-0.5)*1
  });
}

// Animate Canvas
function animate() {
  ctx.clearRect(0,0,width,height);

  // Lines between nodes
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 2;
  for(let i=1; i<nodes.length; i++){
    const parent = nodes[Math.floor((i-1)/2)];
    ctx.beginPath();
    ctx.moveTo(nodes[i].x, nodes[i].y);
    ctx.lineTo(parent.x, parent.y);
    ctx.stroke();
  }

  // Nodes with Glow
  nodes.forEach(n => {
    const gradient = ctx.createRadialGradient(n.x,n.y,n.r*0.1,n.x,n.y,n.r);
    gradient.addColorStop(0,"rgba(255,255,255,0.95)");
    gradient.addColorStop(1,"rgba(255,255,255,0.05)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
    ctx.fill();
  });

  // Particles
  particles.forEach(p => {
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
    ctx.fill();

    // Move particles
    p.x += p.dx + (mouse.x - width/2)*0.0004;
    p.y += p.dy + (mouse.y - height/2)*0.0004;

    // Wrap around
    if(p.x<0) p.x=width;
    if(p.x>width) p.x=0;
    if(p.y<0) p.y=height;
    if(p.y>height) p.y=0;
  });

  requestAnimationFrame(animate);
}

animate();

// Scroll افقی: nodes حرکت proportional
window.addEventListener("scroll", () => {
  const scrollX = window.scrollX;
  nodes.forEach(n => {
    n.x = n.x + scrollX*0.002;
  });
});

// Entrance Animation کارت‌ها
const cards = document.querySelectorAll('.node-card');
function revealCards() {
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('visible');
    }, i*300);
  });
}
window.onload = revealCards;

// Mini-interaction: وقتی موس نزدیک کارت‌ها باشه ذرات جمع میشن
function miniInteraction() {
  particles.forEach(p => {
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 100) {
        p.dx -= dx*0.0005;
        p.dy -= dy*0.0005;
      }
    });
  });
  requestAnimationFrame(miniInteraction);
}
miniInteraction();
