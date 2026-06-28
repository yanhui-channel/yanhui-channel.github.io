const topbar = document.querySelector(".topbar");
const scrollSentinel = document.querySelector(".scroll-sentinel");
const signalName = document.querySelector(".signal-name");
const signalVisual = document.querySelector("[data-signal-visual]");
const signalField = document.querySelector(".signal-board");
const signalCopy = document.querySelector("[data-signal-copy]");
const signalCaption = document.querySelector("[data-signal-caption]");
const signalNodes = document.querySelectorAll("[data-signal-node]");
const signalLabels = document.querySelectorAll("[data-signal-label]:not([data-signal-node])");

const rippleColors = ["#ea4335", "#4285f4", "#fbbc05", "#34a853"];
let rippleIndex = 0;
let lastRippleAt = 0;

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

if (!window.location.hash) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  scrollToTop();
  window.addEventListener("pageshow", scrollToTop, { once: true });
  window.addEventListener("load", () => window.requestAnimationFrame(scrollToTop), { once: true });
}

const setTopbarState = (isScrolled) => {
  if (!topbar) return;
  topbar.toggleAttribute("data-scrolled", isScrolled);
};

const pulseField = () => {
  if (!signalVisual || prefersReducedMotion.matches) return;
  signalVisual.classList.remove("is-broadcasting");
  window.requestAnimationFrame(() => {
    signalVisual.classList.add("is-broadcasting");
  });
};

const createNameRipple = (event) => {
  if (!signalName || prefersReducedMotion.matches) return;

  const now = performance.now();
  if (now - lastRippleAt < 180) return;
  lastRippleAt = now;

  const rect = signalName.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "name-ripple";
  ripple.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
  ripple.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
  ripple.style.color = rippleColors[rippleIndex % rippleColors.length];
  rippleIndex += 1;

  signalName.appendChild(ripple);
  pulseField();
  window.setTimeout(() => ripple.remove(), 920);
};

const createSignalBurst = (node) => {
  if (!signalField || prefersReducedMotion.matches) return;

  const fieldRect = signalField.getBoundingClientRect();
  const nodeRect = node.getBoundingClientRect();
  const burst = document.createElement("span");
  burst.className = "signal-burst";
  burst.style.left = `${nodeRect.left + nodeRect.width / 2 - fieldRect.left}px`;
  burst.style.top = `${nodeRect.top + nodeRect.height / 2 - fieldRect.top}px`;
  burst.style.color = node.dataset.color || "#4285f4";

  signalField.appendChild(burst);
  window.setTimeout(() => burst.remove(), 760);
};

const activateSignal = (node) => {
  signalNodes.forEach((item) => {
    item.classList.remove("is-active");
    item.setAttribute("aria-pressed", "false");
  });

  node.classList.add("is-active");
  node.setAttribute("aria-pressed", "true");

  document.body.dataset.activeSignal = node.dataset.signalNode || "ai";
  document.body.style.setProperty("--active-signal", node.dataset.color || "#4285f4");

  if (signalCopy) signalCopy.textContent = node.dataset.title || "";
  if (signalCaption) signalCaption.textContent = node.dataset.caption || "";
  signalLabels.forEach((label) => {
    label.textContent = node.dataset.signalLabel || "AI";
  });

  createSignalBurst(node);
  pulseField();
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

signalNodes.forEach((node) => {
  node.addEventListener("click", () => activateSignal(node));
  node.addEventListener("pointerenter", pulseField);
});
