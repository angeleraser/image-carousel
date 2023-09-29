function timer({ durationMs, callback, intervalMs = 100 }) {
  let totalMs = 0;

  const interval = setInterval(() => {
    totalMs += intervalMs;
    callback?.();
    if (totalMs >= durationMs) {
      clearInterval(interval);
    }
  }, intervalMs);

  return interval;
}

export class CarouselComponent {
  constructor({ images = [], intervalMs = 1000, size = 480 }) {
    this.images = images;
    this.invtervalMs = intervalMs;
    this.size = size;
    this.computedSize = size;
    this.currentXtranslation = 0;

    this.root = this.createRoot();
  }

  createRoot() {
    const root = document.createElement("div");

    root.classList.add("carousel");
    root.style.maxWidth = `${this.size}px`;
    root.style.setProperty("--carousel-size", `${this.size}px`);

    const slidesHtml = this.images.map((img) => {
      return `
        <div class="carousel-slide-item">
          <img
            src="${img.src}"
            alt="${img.alt}"
            class="carousel-slide-img"
          />
        </div>
      `;
    });

    root.innerHTML = `
    <div class="carousel-slides">
      ${slidesHtml.join("")}
    </div>
    <div class="carousel-controls">
      <button data-control="prev" class="carousel-control-btn">Prev</button>
      <button data-control="next" class="carousel-control-btn">Next</button>
    </div>
    `;

    root.addEventListener("click", ({ target: { dataset } }) => {
      if (dataset.control === "prev") this.showPrevSlide();
      if (dataset.control === "next") this.showNextSlide();
    });

    window.addEventListener("resize", () => {
      this.computedSize = this.root.getBoundingClientRect().width;
      this.root.style.setProperty("--carousel-size", `${this.computedSize}px`);
    });

    return root;
  }

  init() {
    timer({
      durationMs: Infinity,
      intervalMs: this.invtervalMs,
      callback: () => this.showNextSlide(),
    });
  }

  showNextSlide() {
    const slidesContainer = this.root.querySelector(".carousel-slides");
    this.currentXtranslation += this.computedSize;

    if (this.currentXtranslation >= this.computedSize * this.images.length) {
      this.currentXtranslation = 0;
    }

    slidesContainer.style.transform = `translateX(-${this.currentXtranslation}px)`;
  }

  showPrevSlide() {
    const slidesContainer = this.root.querySelector(".carousel-slides");
    this.currentXtranslation -= this.computedSize;

    if (this.currentXtranslation <= 0) {
      this.currentXtranslation = this.computedSize * (this.images.length - 1);
    }

    slidesContainer.style.transform = `translateX(-${this.currentXtranslation}px)`;
  }
}
