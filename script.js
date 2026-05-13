const canvas = document.querySelector("#signal-canvas");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const backToTop = document.querySelector(".back-to-top");
const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

let width = 0;
let height = 0;
let particles = [];

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(38, Math.min(76, Math.floor(width / 18)));
  particles = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.34,
    vy: (Math.random() - 0.5) * 0.34,
    r: index % 5 === 0 ? 2.1 : 1.35,
  }));
}

function drawNetwork() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach((point) => {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < 0 || point.x > width) point.vx *= -1;
    if (point.y < 0 || point.y > height) point.vy *= -1;
  });

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < 145) {
        const opacity = (1 - distance / 145) * 0.24;
        ctx.strokeStyle = `rgba(56, 232, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  particles.forEach((point, index) => {
    ctx.fillStyle = index % 7 === 0 ? "rgba(184, 255, 77, 0.9)" : "rgba(244, 247, 239, 0.62)";
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    ctx.fill();
  });

  if (!reduceMotion.matches) {
    requestAnimationFrame(drawNetwork);
  }
}

resizeCanvas();
drawNetwork();

window.addEventListener("resize", resizeCanvas);

function updateBackToTop() {
  backToTop.classList.toggle("is-visible", window.scrollY > 420);
}

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

function closeNavigation() {
  siteHeader.classList.remove("is-nav-open");
  navToggle.classList.remove("is-open");
  navLinks.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "打开导航");
}

function toggleNavigation() {
  const isOpen = navToggle.classList.toggle("is-open");
  siteHeader.classList.toggle("is-nav-open", isOpen);
  navLinks.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
}

navToggle.addEventListener("click", toggleNavigation);

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    closeNavigation();
  }
});
