const themeCards = document.querySelectorAll(".theme-card");
const videos = document.querySelectorAll("video");
const siteHeader = document.querySelector(".site-header");
const siteBackgroundVideo = document.querySelector(".hero-background-video");

function setSelectedTheme(card) {
  if (!card || !siteBackgroundVideo) return;

  const selectedVideo = card.querySelector(".theme-video");
  if (!selectedVideo || !selectedVideo.dataset.video) return;

  themeCards.forEach((item) => {
    const video = item.querySelector(".theme-video");
    const isSelected = item === card;
    item.classList.toggle("is-selected", isSelected);

    if (!isSelected && video) {
      video.pause();
      item.dataset.userPaused = "false";
      item.dataset.inViewport = "false";
    }
  });

  selectedVideo.muted = true;
  selectedVideo.loop = true;
  selectedVideo.playsInline = true;
  selectedVideo.dataset.userPaused = "false";
  card.dataset.userPaused = "false";
  card.dataset.inViewport = "true";
  playVideo(selectedVideo);

  siteBackgroundVideo.style.opacity = "0";

  const onVideoReady = () => {
    requestAnimationFrame(() => {
      siteBackgroundVideo.style.opacity = "1";
    });
  };

  siteBackgroundVideo.addEventListener("loadeddata", onVideoReady, { once: true });
  siteBackgroundVideo.src = selectedVideo.dataset.video;
  siteBackgroundVideo.load();
  siteBackgroundVideo.play().catch(() => {
    // A reprodução automática pode ser bloqueada até a interação do usuário.
  });
}

videos.forEach((video) => {
  const indicator = video.parentElement.querySelector(".video-loading-indicator");
  if (!indicator) return;

  const setLoading = (isLoading) => {
    indicator.classList.toggle("is-loading", isLoading);
  };

  video.addEventListener("loadstart", () => setLoading(true));
  video.addEventListener("waiting", () => setLoading(true));
  video.addEventListener("stalled", () => setLoading(true));
  video.addEventListener("canplay", () => setLoading(false));
  video.addEventListener("playing", () => setLoading(false));
  video.addEventListener("error", () => {
    setLoading(false);
    console.error("Falha ao carregar o vídeo:", video.currentSrc || video.dataset.video);
  });
});

function updateHeaderVisibility() {
  if (!siteHeader) return;
  siteHeader.classList.toggle("is-at-top", window.scrollY <= 8);
}

updateHeaderVisibility();
window.addEventListener("scroll", updateHeaderVisibility, { passive: true });

function updateVideoButton(video) {
  const button = video.closest(".theme-card")?.querySelector(".video-toggle");
  if (!button) return;

  const isPlaying = !video.paused;
  button.setAttribute("aria-pressed", String(isPlaying));
  button.setAttribute(
    "aria-label",
    `${isPlaying ? "Pausar" : "Reproduzir"} vídeo de fundo`
  );
  button.title = isPlaying ? "Pausar vídeo de fundo" : "Reproduzir vídeo de fundo";
  button.firstElementChild.textContent = isPlaying ? "Ⅱ" : "▶";
}

function loadVideo(video) {
  if (video.hasAttribute("src")) return true;
  if (!video.dataset.video) {
    console.error("Vídeo sem caminho configurado:", video);
    return false;
  }

  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.src = video.dataset.video;
  video.load();
  return true;
}

function playVideo(video) {
  if (!loadVideo(video)) return;

  video.play().then(() => {
    updateVideoButton(video);
  }).catch((error) => {
    updateVideoButton(video);
    if (error.name === "NotAllowedError") {
      console.warn("O navegador bloqueou a reprodução automática do vídeo.", video);
    } else if (error.name !== "AbortError") {
      console.error("Não foi possível reproduzir o vídeo.", video, error);
    }
  });
}

themeCards.forEach((card) => {
  const video = card.querySelector(".theme-video");
  const button = card.querySelector(".video-toggle");

  card.dataset.userPaused = "false";
  card.dataset.inViewport = "false";
  updateVideoButton(video);

  card.addEventListener("click", (event) => {
    if (event.target.closest(".video-toggle") || event.target.closest("a")) {
      return;
    }

    setSelectedTheme(card);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedTheme(card);
    }
  });

  button.addEventListener("click", () => {
    if (video.paused) {
      card.dataset.userPaused = "false";
      playVideo(video);
    } else {
      card.dataset.userPaused = "true";
      video.pause();
      updateVideoButton(video);
    }
  });

  video.addEventListener("play", () => updateVideoButton(video));
  video.addEventListener("pause", () => updateVideoButton(video));
});

if ("IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = entry.target;
        const video = card.querySelector(".theme-video");
        card.dataset.inViewport = String(entry.isIntersecting);

        if (entry.isIntersecting) {
          if (card.dataset.userPaused !== "true") {
            playVideo(video);
          }
        } else {
          video.pause();
        }
      });
    },
    { rootMargin: "100px 0px", threshold: 0.15 }
  );

  themeCards.forEach((card) => videoObserver.observe(card));
} else {
  themeCards.forEach((card) => {
    const video = card.querySelector(".theme-video");
    loadVideo(video);
    playVideo(video);
  });
}

document.addEventListener("visibilitychange", () => {
  themeCards.forEach((card) => {
    const video = card.querySelector(".theme-video");
    if (document.hidden) {
      video.pause();
    } else if (
      card.dataset.inViewport === "true" &&
      card.dataset.userPaused !== "true"
    ) {
      playVideo(video);
    }
  });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsScrollProgressTimeline =
  "CSS" in window && CSS.supports("animation-timeline: scroll()");
const supportsViewTimeline =
  "CSS" in window && CSS.supports("animation-timeline: view()");
const root = document.documentElement;

if (!supportsScrollProgressTimeline) {
  const backgroundZoomStart = Number.parseFloat(
    getComputedStyle(root).getPropertyValue("--background-zoom-start")
  );
  const backgroundZoomEnd = Number.parseFloat(
    getComputedStyle(root).getPropertyValue("--background-zoom-end")
  );
  let progressFrame = 0;

  const updateScrollProgress = () => {
    progressFrame = 0;
    const scrollableHeight = root.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    const boundedProgress = Math.min(1, Math.max(0, progress));
    const zoom =
      backgroundZoomStart + (backgroundZoomEnd - backgroundZoomStart) * boundedProgress;
    root.style.setProperty("--scroll-progress", String(boundedProgress));
    root.style.setProperty("--background-zoom", String(zoom));
  };

  const scheduleScrollProgress = () => {
    if (!progressFrame) {
      progressFrame = window.requestAnimationFrame(updateScrollProgress);
    }
  };

  root.classList.add("scroll-progress-fallback");
  window.addEventListener("scroll", scheduleScrollProgress, { passive: true });
  window.addEventListener("resize", scheduleScrollProgress);
  updateScrollProgress();
}

if ("IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".section-heading, .category-card, .theme-card, .theme-footnote, .step-card, .closing-inner"
  );

  if (revealTargets.length > 0) {
    revealTargets.forEach((target) => target.classList.add("scroll-reveal"));
    document.body.classList.add("scroll-reveal-ready");

    if (!supportsViewTimeline || reducedMotion) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
            } else {
              entry.target.classList.remove("is-visible");
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );

      revealTargets.forEach((target) => revealObserver.observe(target));
    }
  }
}
