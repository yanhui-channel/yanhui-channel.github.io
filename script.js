const topbar = document.querySelector(".topbar");
const scrollSentinel = document.querySelector(".scroll-sentinel");
const signalName = document.querySelector(".signal-name");
const signalVisual = document.querySelector("[data-signal-visual]");
const broadcastTriggers = document.querySelectorAll("[data-broadcast]");

const rippleColors = ["#ea4335", "#4285f4", "#fbbc05", "#34a853"];
let rippleIndex = 0;
let lastRippleAt = 0;

const setTopbarState = (isScrolled) => {
  if (!topbar) return;
  topbar.toggleAttribute("data-scrolled", isScrolled);
};

const broadcastVisual = () => {
  if (!signalVisual) return;
  signalVisual.classList.remove("is-broadcasting");
  window.requestAnimationFrame(() => {
    signalVisual.classList.add("is-broadcasting");
  });
};

const createNameRipple = (event) => {
  if (!signalName) return;

  const now = performance.now();
  if (event.type === "pointermove" && now - lastRippleAt < 180) return;
  lastRippleAt = now;

  const rect = signalName.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "name-ripple";
  ripple.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
  ripple.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
  ripple.style.color = rippleColors[rippleIndex % rippleColors.length];
  rippleIndex += 1;

  signalName.appendChild(ripple);
  broadcastVisual();
  window.setTimeout(() => ripple.remove(), 920);
};

if (scrollSentinel && "IntersectionObserver" in window) {
  const topbarObserver = new IntersectionObserver(
    ([entry]) => setTopbarState(!entry.isIntersecting),
    { threshold: 0 }
  );
  topbarObserver.observe(scrollSentinel);
} else {
  setTopbarState(false);
}

if (signalName) {
  signalName.addEventListener("pointerenter", createNameRipple);
  signalName.addEventListener("click", createNameRipple);
}

broadcastTriggers.forEach((trigger) => {
  trigger.addEventListener("pointerenter", broadcastVisual);
  trigger.addEventListener("focusin", broadcastVisual);
});
