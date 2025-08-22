(function () {
    const PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    function getPreloaderElement() {
      return (
        document.getElementById("preloader") ||
        document.querySelector(".preloader") ||
        document.querySelector("[data-preloader]")
      );
    }
    function isExcluded(img) {
      try {
        if (!img || img.nodeType !== 1) return true;
        if (!img.isConnected) return true;
        if (img.closest("header") || img.closest("footer")) return true;
        const pre = getPreloaderElement();
        if (pre && pre.contains(img)) return true;
        if (img.hasAttribute("data-no-lazy")) return true;
        return false;
      } catch (e) {
        return true;
      }
    }
    function applyLazyBlur(img, observer) {
      try {
        if (!img || isExcluded(img) || img.dataset.lazyHandled) return;
        const realSrc = img.getAttribute("src");
        if (!realSrc || realSrc === PLACEHOLDER) return;
        img.setAttribute("data-src", realSrc);
        img.setAttribute("loading", "lazy");
        img.removeAttribute("src");
        img.src = PLACEHOLDER;
        img.classList.add("lazy-blur");
        img.dataset.lazyHandled = "1";
        observer.observe(img);
      } catch (e) {
        console.error("applyLazyBlur error", e);
      }
    }
    function initLazyBlur() {
      if (!document.getElementById("lazy-blur-style")) {
        const style = document.createElement("style");
        style.id = "lazy-blur-style";
        style.innerHTML = `
          img.lazy-blur {
            filter: blur(12px);
            opacity: 0.75;
            transition: filter .75s ease, opacity .75s ease;
          }
          img.lazy-blur.loaded {
            filter: blur(0);
            opacity: 1;
          }
        `;
        document.head.appendChild(style);
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const img = entry.target;
            const real = img.getAttribute("data-src");
            if (real) {
              const tmp = new Image();
              tmp.src = real;
              const finish = () => {
                try {
                  img.src = real;
                  img.classList.add("loaded");
                } catch (e) {}
              };
              tmp.onload = finish;
              tmp.onerror = finish;
            }
            io.unobserve(img);
          });
        },
        { rootMargin: "50px 0px" }
      );
      document.querySelectorAll("img").forEach((img) => applyLazyBlur(img, io));
      const mo = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          if (m.type === "childList" && m.addedNodes.length) {
            m.addedNodes.forEach((node) => {
              if (node.nodeType !== 1) return;
              if (node.tagName === "IMG") {
                applyLazyBlur(node, io);
              } else if (node.querySelectorAll) {
                node.querySelectorAll("img").forEach((img) => applyLazyBlur(img, io));
              }
            });
          }
          if (
            m.type === "attributes" &&
            m.target &&
            m.target.tagName === "IMG" &&
            m.attributeName === "src"
          ) {
            const img = m.target;
            applyLazyBlur(img, io);
          }
        });
      });
      mo.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src"],
      });
      window.__lazyBlurIO__ = io;
      window.__lazyBlurMO__ = mo;
    }
    function safeHideModal(modal) {
      if (!modal) return;
      try {
        const active = document.activeElement;
        if (modal.contains(active)) {
          const trigger = document.querySelector(`[aria-controls="${modal.id}"]`) || document.body;
          if (trigger && typeof trigger.focus === "function") {
            trigger.focus({ preventScroll: true });
          }
        }
        modal.setAttribute("aria-hidden", "true");
        modal.classList.add("hidden");
      } catch (e) {
        try {
          modal.setAttribute("aria-hidden", "true");
          modal.classList.add("hidden");
        } catch (err) {}
      }
    }
    function safeOpenModal(modal, focusSelector) {
      if (!modal) return;
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      const toFocus =
        (focusSelector && modal.querySelector(focusSelector)) ||
        modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (toFocus && typeof toFocus.focus === "function") {
        toFocus.focus({ preventScroll: true });
      }
    }
    window.initLazyBlur = initLazyBlur;
    window.safeHideModal = safeHideModal;
    window.safeOpenModal = safeOpenModal;
      function startInitAfterPreloader(maxWaitMs = 1500) {
      const pre = getPreloaderElement();
      if (!pre) {
        initLazyBlur();
        return;
      }
  
      const computed = window.getComputedStyle(pre);
      if (computed.display === "none" || pre.classList.contains("hidden") || computed.visibility === "hidden") {
        initLazyBlur();
        return;
      }
      const interval = 100;
      let elapsed = 0;
      const checker = setInterval(() => {
        const cur = getPreloaderElement();
        if (!cur) {
          clearInterval(checker);
          initLazyBlur();
          return;
        }
        const curStyle = window.getComputedStyle(cur);
        if (curStyle.display === "none" || cur.classList.contains("hidden") || curStyle.visibility === "hidden") {
          clearInterval(checker);
          initLazyBlur();
          return;
        }
        elapsed += interval;
        if (elapsed >= maxWaitMs) {
          clearInterval(checker);
          initLazyBlur();
        }
      }, interval);
    }
      if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => startInitAfterPreloader(1500), { once: true });
    } else {
      startInitAfterPreloader(1500);
    }
})();
  

document.addEventListener("DOMContentLoaded", function () {
  const preloader = document.createElement("div");
  const wrapper = document.createElement("div");
  const img = document.createElement("img");
  const page = document.querySelector(".page");
  preloader.id = "preloader";
  preloader.className = "preloader";
  wrapper.className = "preloader-wrapper";
  img.className = "preloader-logo";
  img.alt = "Loading";
  const spinner = document.createElement("div");
  spinner.className = "preloader-ring";

  preloader.style.position = "fixed";
  preloader.style.top = "0";
  preloader.style.left = "0";
  preloader.style.width = "100%";
  preloader.style.height = "100%";
  preloader.style.background = "rgba(255,255,255,0)";
  preloader.style.display = "flex";
  preloader.style.alignItems = "center";
  preloader.style.justifyContent = "center";
  preloader.style.zIndex = "9999";

  wrapper.style.position = "relative";
  wrapper.style.width = "100px";
  wrapper.style.height = "100px";
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";

  img.src = "imgs/TarfBg.png";
  img.style.width = "95px";
  img.style.height = "95px";
  img.style.boxShadow = "0 0 20px rgb(57, 59, 101)";
  img.style.borderRadius = "50%";
  img.style.zIndex = "2";

  spinner.style.position = "absolute";
  spinner.style.width = "100%";
  spinner.style.height = "100%";
  spinner.style.border = "5px solid #ddd";
  spinner.style.borderTop = "5px solid #393B65";
  spinner.style.borderRadius = "50%";
  spinner.style.animation = "spin 1s linear infinite";
  spinner.style.zIndex = "1";

  wrapper.appendChild(spinner);
  wrapper.appendChild(img);
  preloader.appendChild(wrapper);
  document.body.appendChild(preloader);

  document.body.style.overflow = "hidden";

  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  if (page) {
    page.style.filter = "blur(12px)";
  }
  const preventScroll = (e) => e.preventDefault();
  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("touchmove", preventScroll, { passive: false });
  window.addEventListener("keydown", preventScroll, { passive: false });
  setTimeout(() => {
    preloader.style.display = "none";
    document.body.style.overflow = "auto";
    if (page) {
      page.style.filter = "none";
    }
    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);
    window.removeEventListener("keydown", preventScroll);
  }, 1500);
});