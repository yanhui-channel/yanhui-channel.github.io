const topbar = document.querySelector(".topbar");
const scrollSentinel = document.querySelector(".scroll-sentinel");
const signalName = document.querySelector(".signal-name");
const signalVisual = document.querySelector("[data-signal-visual]");
const systemMap = document.querySelector(".system-map");
const signalCopy = document.querySelector("[data-signal-copy]");
const signalCaption = document.querySelector("[data-signal-caption]");
const signalNodes = document.querySelectorAll("[data-signal-node]");
const systemCoreLabel = document.querySelector(".system-core span");
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

if (signalVisual && systemMap) {
  signalVisual.addEventListener("pointermove", (event) => {
    const rect = signalVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const clampedX = Math.min(1, Math.max(0, x));
    const clampedY = Math.min(1, Math.max(0, y));

    systemMap.style.setProperty("--stage-x", `${clampedX * 100}%`);
    systemMap.style.setProperty("--stage-y", `${clampedY * 100}%`);
    signalVisual.style.setProperty("--tilt-x", `${(0.5 - clampedY) * 5}deg`);
    signalVisual.style.setProperty("--tilt-y", `${(clampedX - 0.5) * 7}deg`);
  });

  signalVisual.addEventListener("pointerleave", () => {
    signalVisual.style.setProperty("--tilt-x", "0deg");
    signalVisual.style.setProperty("--tilt-y", "0deg");
  });
}

signalNodes.forEach((node) => {
  node.addEventListener("click", () => {
    signalNodes.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-pressed", "false");
    });

    node.classList.add("is-active");
    node.setAttribute("aria-pressed", "true");

    if (signalCopy) signalCopy.textContent = node.dataset.title || "";
    if (signalCaption) signalCaption.textContent = node.dataset.caption || "";
    if (systemCoreLabel) systemCoreLabel.textContent = node.dataset.signalNode || "yanhui";

    broadcastVisual();
  });

  node.addEventListener("pointerenter", broadcastVisual);
});

broadcastTriggers.forEach((trigger) => {
  trigger.addEventListener("pointerenter", broadcastVisual);
  trigger.addEventListener("focusin", broadcastVisual);
});
