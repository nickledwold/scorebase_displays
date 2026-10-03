<template>
  <div class="qr-page">
    <header class="qr-header">
      <img class="qr-logo" src="../assets/logo.png" />
    </header>

    <div v-if="loading" class="loading-spinner">
      <div class="spinner"></div>
    </div>
    <div v-else-if="loadingError" class="qr-error">{{ loadingError }}</div>
    <div v-else-if="!qrCodes.length" class="qr-error">
      No QR codes available.
    </div>
    <div v-else ref="grid" class="qr-grid" :style="gridStyle">
      <div
        v-for="code in qrCodes"
        :key="code.panel"
        class="qr-card"
        :class="{ 'qr-card--changed': changedPanels.includes(code.panel) }"
      >
        <div class="qr-canvas-holder">
          <canvas v-if="code.qrCodeUrl" :data-panel="code.panel"></canvas>
          <div v-else class="qr-placeholder">No QR code</div>
        </div>
        <!-- Always three lines, padded with a non-breaking space, so every card's
             label block is the same height for layoutCards(). -->
        <div class="qr-card-text">
          <div class="qr-name">{{ nameLine(code) }}</div>
          <div class="qr-club">{{ clubLine(code) }}</div>
          <div class="qr-category">{{ categoryLine(code) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
import { fetchWithRetry } from "../apiUtils";
import qrLogoSrc from "../assets/icon.png";

// Rendered at a fixed pixel size so the codes stay crisp when scaled up by CSS
// on a display wall, or when printed as signage.
const QR_PIXEL_SIZE = 900;
// Share of the code covered by the centre icon. Level H error correction
// tolerates ~30% damage, so a quarter of the width stays comfortably readable.
const LOGO_SCALE = 0.24;
// How often the page asks the API which competitor each panel is showing.
const POLL_INTERVAL_MS = 2000;
// How long a card stays highlighted after its competitor or QR code changes.
// Matches the qr-card-changed animation duration in the stylesheet.
const CHANGE_HIGHLIGHT_MS = 3000;

// Everything shown on a card, so any difference counts as a change.
function codeSignature(code) {
  return JSON.stringify([code.competitorId, code.qrCodeUrl, code.competitor]);
}

// Non-breaking space, so an empty label line still takes up its full height.
const EMPTY_LINE = String.fromCharCode(160);

// Decoded once and shared by every code on the page. Resolves to null if the
// icon cannot be loaded, so a plain QR code is still rendered.
let logoPromise = null;
function loadLogo() {
  if (!logoPromise) {
    logoPromise = new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => {
        console.error("Error loading QR centre logo");
        resolve(null);
      };
      image.src = qrLogoSrc;
    });
  }
  return logoPromise;
}

// The icon artwork is far larger than the space it is drawn into, and a single
// big reduction makes canvas aliasing chew up its thin strokes. Halving down to
// roughly the target size first keeps the outline and the "+" clean. Results are
// cached because every code on the page draws the icon at the same size.
const scaledLogos = new Map();
function scaleLogo(logo, targetWidth, targetHeight) {
  const cacheKey = `${targetWidth}x${targetHeight}`;
  if (scaledLogos.has(cacheKey)) {
    return scaledLogos.get(cacheKey);
  }

  let source = logo;
  let width = logo.width;
  let height = logo.height;

  while (width > targetWidth * 2 && height > targetHeight * 2) {
    width = Math.max(Math.round(width / 2), targetWidth);
    height = Math.max(Math.round(height / 2), targetHeight);

    const step = document.createElement("canvas");
    step.width = width;
    step.height = height;
    const stepContext = step.getContext("2d");
    stepContext.imageSmoothingEnabled = true;
    stepContext.imageSmoothingQuality = "high";
    stepContext.drawImage(source, 0, 0, width, height);
    source = step;
  }

  scaledLogos.set(cacheKey, source);
  return source;
}

export default {
  name: "QrCodesComponent",
  data() {
    return {
      qrCodes: [],
      loading: true,
      loadingError: "",
      qrBoxSize: 0,
      changedPanels: [],
      intervalId: null,
      isFetching: false,
    };
  },
  computed: {
    panelNumber() {
      return this.$route.params.panelNumber || this.$route.query.panelNumber;
    },
    // Lay the cards out in a single row up to four codes, then wrap into a
    // balanced grid so everything still fits on one screen.
    columns() {
      return Math.min(this.qrCodes.length || 1, 4);
    },
    rows() {
      return Math.ceil((this.qrCodes.length || 1) / this.columns);
    },
    gridStyle() {
      return {
        "--columns": this.columns,
        "--rows": this.rows,
        "--qr-box": this.qrBoxSize ? `${this.qrBoxSize}px` : null,
      };
    },
  },
  watch: {
    panelNumber() {
      this.clearHighlights();
      this.qrCodes = [];
      this.fetchQrCodes(true);
    },
  },
  created() {
    this.highlightTimers = {};
    this.requestId = 0;
    this.fetchQrCodes(true);
    this.intervalId = setInterval(() => {
      this.fetchQrCodes();
    }, POLL_INTERVAL_MS);
  },
  mounted() {
    window.addEventListener("resize", this.scheduleLayout);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
    this.clearHighlights();
    window.removeEventListener("resize", this.scheduleLayout);
  },
  methods: {
    // With no competitor matched the card falls back to the panel number.
    nameLine(code) {
      return code.competitor ? code.competitor.name : `Panel ${code.panel}`;
    },
    clubLine(code) {
      return (code.competitor && code.competitor.club) || EMPTY_LINE;
    },
    categoryLine(code) {
      if (!code.competitor) {
        return EMPTY_LINE;
      }
      return (
        [code.competitor.discipline, code.competitor.category]
          .filter((part) => part)
          .join(" ") || EMPTY_LINE
      );
    },
    scheduleLayout() {
      window.requestAnimationFrame(this.layoutCards);
    },
    // Sizes each code from whichever of the two cell dimensions binds first, so
    // the card hugs the code instead of leaving a band of empty white.
    layoutCards() {
      const grid = this.$refs.grid;
      const card = grid && grid.querySelector(".qr-card");
      if (!card) {
        return;
      }

      const gridStyles = window.getComputedStyle(grid);
      const columnGap = parseFloat(gridStyles.columnGap) || 0;
      const rowGap = parseFloat(gridStyles.rowGap) || 0;
      const gridRect = grid.getBoundingClientRect();
      const cellWidth =
        (gridRect.width - columnGap * (this.columns - 1)) / this.columns;
      const cellHeight =
        (gridRect.height - rowGap * (this.rows - 1)) / this.rows;

      const cardStyles = window.getComputedStyle(card);
      const paddingX =
        parseFloat(cardStyles.paddingLeft) +
        parseFloat(cardStyles.paddingRight);
      const paddingY =
        parseFloat(cardStyles.paddingTop) +
        parseFloat(cardStyles.paddingBottom);

      // The labels never wrap, so their height does not depend on the width we
      // are about to choose and can be measured up front.
      const text = card.querySelector(".qr-card-text");
      const textHeight = text ? text.getBoundingClientRect().height : 0;

      this.qrBoxSize = Math.max(
        0,
        Math.floor(
          Math.min(cellWidth - paddingX, cellHeight - paddingY - textHeight)
        )
      );
    },
    // The initial fetch shows the spinner and retries; polls run silently, skip
    // a tick while a request is still in flight, and leave retrying to the
    // next tick so a slow API never stacks requests up.
    async fetchQrCodes(initial = false) {
      if (!initial && this.isFetching) {
        return;
      }
      const requestId = ++this.requestId;
      this.isFetching = true;
      if (initial) {
        this.loading = true;
        this.loadingError = "";
      }

      let url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        "/api/qrCodes";

      if (this.panelNumber) {
        url += "?panelNumber=" + encodeURIComponent(this.panelNumber);
      }

      try {
        const data = await fetchWithRetry(url, initial ? 3 : 0);
        // A newer request (e.g. after the panel number changed) owns the page.
        if (requestId !== this.requestId) {
          return;
        }
        // Without a panelNumber the API returns { qrCodes: [...] }, with one it
        // returns a single QR code object.
        const incoming = Array.isArray(data?.qrCodes) ? data.qrCodes : [data];

        // Nothing on screen yet (first load, or recovering from a failed one),
        // so there is nothing to compare against or highlight.
        const firstLoad = initial || !this.qrCodes.length;
        const previous = new Map(
          this.qrCodes.map((code) => [code.panel, codeSignature(code)])
        );
        const changedPanels = firstLoad
          ? []
          : incoming
              .filter(
                (code) => previous.get(code.panel) !== codeSignature(code)
              )
              .map((code) => code.panel);
        const panelsChanged =
          incoming.length !== this.qrCodes.length ||
          incoming.some((code) => !previous.has(code.panel));

        this.loading = false;
        this.loadingError = "";
        if (!firstLoad && !panelsChanged && !changedPanels.length) {
          return;
        }

        this.qrCodes = incoming;
        await this.$nextTick();
        this.layoutCards();
        // Cards keep their DOM (keyed by panel), so only changed codes need
        // redrawing; everything is drawn on the first load.
        await this.renderQrCodes(firstLoad ? null : new Set(changedPanels));
        changedPanels.forEach((panel) => this.highlightPanel(panel));
      } catch (error) {
        if (requestId !== this.requestId) {
          return;
        }
        this.loading = false;
        // Keep showing the last good codes while polling recovers.
        if (!this.qrCodes.length) {
          this.loadingError = "Error loading QR codes, retrying...";
        }
        console.error("Error fetching QR codes:", error);
      } finally {
        if (requestId === this.requestId) {
          this.isFetching = false;
        }
      }
    },
    // Restarts the highlight animation if the card is already highlighted, so
    // back-to-back changes are each visible.
    async highlightPanel(panel) {
      clearTimeout(this.highlightTimers[panel]);
      if (this.changedPanels.includes(panel)) {
        this.changedPanels = this.changedPanels.filter((p) => p !== panel);
        await this.$nextTick();
        await new Promise((resolve) => window.requestAnimationFrame(resolve));
      }
      this.changedPanels = [...this.changedPanels, panel];
      this.highlightTimers[panel] = setTimeout(() => {
        this.changedPanels = this.changedPanels.filter((p) => p !== panel);
        delete this.highlightTimers[panel];
      }, CHANGE_HIGHLIGHT_MS);
    },
    clearHighlights() {
      Object.values(this.highlightTimers || {}).forEach(clearTimeout);
      this.highlightTimers = {};
      this.changedPanels = [];
    },
    // Draws the codes for the given panels, or for every panel when null.
    async renderQrCodes(panels = null) {
      const logo = await loadLogo();
      const grid = this.$refs.grid;

      await Promise.all(
        this.qrCodes.map(async (code) => {
          if (panels && !panels.has(code?.panel)) {
            return;
          }
          // Only codes with a URL get a canvas, so look each one up by panel
          // rather than by position.
          const canvas =
            grid && grid.querySelector(`canvas[data-panel="${code?.panel}"]`);
          if (!canvas || !code?.qrCodeUrl) {
            return;
          }
          try {
            await QRCode.toCanvas(canvas, code.qrCodeUrl, {
              errorCorrectionLevel: "H",
              width: QR_PIXEL_SIZE,
              margin: 2,
              color: { dark: "#000000", light: "#ffffff" },
            });
            if (logo) {
              this.drawLogo(canvas, logo);
            }
            // qrcode pins the canvas to its render size with inline styles,
            // which would override the stylesheet and overflow the card. The
            // backing store stays at QR_PIXEL_SIZE; only the layout size is
            // handed back to CSS.
            canvas.style.removeProperty("width");
            canvas.style.removeProperty("height");
          } catch (error) {
            console.error("Error rendering QR code for", code.qrCodeUrl, error);
          }
        })
      );
    },
    drawLogo(canvas, logo) {
      const context = canvas.getContext("2d");
      const badgeSize = Math.round(canvas.width * LOGO_SCALE);
      const padding = Math.round(badgeSize * 0.12);
      const badgeX = Math.round((canvas.width - badgeSize) / 2);
      const badgeY = Math.round((canvas.height - badgeSize) / 2);

      // A white badge keeps the icon clear of the surrounding modules so
      // scanners never mistake the icon for part of the code.
      context.fillStyle = "#ffffff";
      this.traceRoundedRect(
        context,
        badgeX,
        badgeY,
        badgeSize,
        badgeSize,
        badgeSize * 0.18
      );
      context.fill();

      const logoSize = badgeSize - padding * 2;
      const scale = Math.min(logoSize / logo.width, logoSize / logo.height);
      const drawWidth = Math.round(logo.width * scale);
      const drawHeight = Math.round(logo.height * scale);

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(
        scaleLogo(logo, drawWidth, drawHeight),
        badgeX + Math.round((badgeSize - drawWidth) / 2),
        badgeY + Math.round((badgeSize - drawHeight) / 2),
        drawWidth,
        drawHeight
      );
    },
    traceRoundedRect(context, x, y, width, height, radius) {
      const r = Math.min(radius, width / 2, height / 2);
      context.beginPath();
      context.moveTo(x + r, y);
      context.arcTo(x + width, y, x + width, y + height, r);
      context.arcTo(x + width, y + height, x, y + height, r);
      context.arcTo(x, y + height, x, y, r);
      context.arcTo(x, y, x + width, y, r);
      context.closePath();
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/panel.style.css";

/* The whole page is sized to the viewport: nothing scrolls, and the codes grow
   or shrink to fill whatever space is left over by the header. */
.qr-page {
  /* Fixed rather than 100vh so the global #app margin cannot push the page
     out of the viewport and introduce a scrollbar. */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  padding: 2vh 2vw;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #000000;
}

.qr-header {
  flex: 0 0 auto;
  text-align: center;
  margin-bottom: 2vh;
}

.qr-logo {
  height: 5vh;
  max-width: 60vw;
  object-fit: contain;
}

.qr-title {
  font-family: Gotham Bold;
  font-size: clamp(18px, 3.2vh, 44px);
  color: #ffffff;
  text-transform: uppercase;
  margin-top: 1vh;
}

.qr-grid {
  flex: 1 1 auto;
  min-height: 0;
  display: grid;
  /* minmax(0, 1fr) rather than 1fr: a plain fr track has a min-content floor,
     which the full-size canvas would force open and blow the grid out past
     the viewport. */
  grid-template-columns: repeat(var(--columns, 1), minmax(0, 1fr));
  grid-template-rows: repeat(var(--rows, 1), minmax(0, 1fr));
  gap: 2vh 2vw;
  justify-items: center;
}

.qr-card {
  --card-pad: 18px;
  background-color: #ffffff;
  border-radius: 20px;
  padding: var(--card-pad);
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-direction: column;
  /* Width follows the measured code size so the card hugs its contents. */
  width: calc(var(--qr-box, 200px) + var(--card-pad) * 2);
  max-width: 100%;
  align-self: center;
  justify-self: center;
}

/* Flagged for CHANGE_HIGHLIGHT_MS after the panel's competitor or QR code
   changes: a ring that pulses and fades out, while the new content fades in. */
.qr-card--changed {
  animation: qr-card-changed 3s ease-out;
}

.qr-card--changed .qr-canvas-holder,
.qr-card--changed .qr-card-text {
  animation: qr-content-in 0.6s ease-out;
}

@keyframes qr-card-changed {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 196, 0, 1), 0 0 0 0 rgba(255, 196, 0, 0.6);
    transform: scale(1);
  }
  10% {
    box-shadow: 0 0 0 8px rgba(255, 196, 0, 1),
      0 0 40px 14px rgba(255, 196, 0, 0.6);
    transform: scale(1.03);
  }
  25% {
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(255, 196, 0, 1),
      0 0 28px 8px rgba(255, 196, 0, 0.4);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 196, 0, 0), 0 0 0 0 rgba(255, 196, 0, 0);
  }
}

@keyframes qr-content-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.qr-canvas-holder {
  width: var(--qr-box, 200px);
  height: var(--qr-box, 200px);
  max-width: 100%;
}

/* object-fit keeps the square code centred whichever way the box is limited. */
.qr-canvas-holder canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.qr-name {
  font-family: Gotham Bold;
  font-size: clamp(14px, 2.6vh, 32px);
  color: #1c1c1c;
  text-transform: uppercase;
  margin-top: 0.8vh;
}

.qr-club {
  font-family: Gotham Book;
  font-size: clamp(11px, 1.6vh, 18px);
  color: #2b2b2b;
  margin-top: 0.5vh;
}

.qr-category {
  font-family: Gotham Book;
  font-size: clamp(11px, 1.6vh, 18px);
  color: #6b6b6b;
  margin-top: 0.4vh;
}

.qr-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #c8c8c8;
  border-radius: 12px;
  box-sizing: border-box;
  font-family: Gotham Book;
  font-size: clamp(12px, 2vh, 24px);
  color: #9a9a9a;
}

/* Kept to one line each so the label block has a fixed height, which is what
   lets layoutCards() measure it before choosing a code size. */
.qr-card-text {
  flex: 0 0 auto;
}

.qr-name,
.qr-club,
.qr-category {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.qr-error {
  font-family: Gotham Book;
  font-size: 28px;
  color: #ffffff;
  text-align: center;
  margin-top: 60px;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media print {
  .qr-page {
    background-color: #ffffff;
    position: static;
    height: auto;
    overflow: visible;
  }
  .qr-title {
    color: #000000;
  }
  .qr-logo {
    filter: invert(1);
  }
  .qr-card {
    page-break-inside: avoid;
  }
}
</style>
