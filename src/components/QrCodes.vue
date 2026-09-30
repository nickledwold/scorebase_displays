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
      <div v-for="code in qrCodes" :key="code.panel" class="qr-card">
        <div class="qr-canvas-holder">
          <canvas></canvas>
        </div>
        <div class="qr-card-text">
          <div class="qr-name">{{ code.name }}</div>
          <div class="qr-description">{{ code.description }}</div>
          <div class="qr-url">{{ code.url }}</div>
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
      this.fetchQrCodes();
    },
  },
  created() {
    this.fetchQrCodes();
  },
  mounted() {
    window.addEventListener("resize", this.scheduleLayout);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.scheduleLayout);
  },
  methods: {
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
    async fetchQrCodes() {
      this.loading = true;
      this.loadingError = "";

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
        const data = await fetchWithRetry(url);
        // Without a panelNumber the API returns { qrCodes: [...] }, with one it
        // returns a single QR code object.
        this.qrCodes = Array.isArray(data?.qrCodes) ? data.qrCodes : [data];
        this.loading = false;
        await this.$nextTick();
        this.layoutCards();
        await this.renderQrCodes();
      } catch (error) {
        this.loadingError = "Error loading QR codes, please refresh the page.";
        this.loading = false;
        console.error("Error fetching QR codes:", error);
      }
    },
    async renderQrCodes() {
      const logo = await loadLogo();
      // Queried from the DOM rather than held in a ref array so the canvases
      // always line up with the codes in v-for order.
      const canvases = this.$refs.grid
        ? this.$refs.grid.querySelectorAll("canvas")
        : [];

      await Promise.all(
        this.qrCodes.map(async (code, index) => {
          const canvas = canvases[index];
          if (!canvas || !code?.url) {
            return;
          }
          try {
            await QRCode.toCanvas(canvas, code.url, {
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
            console.error("Error rendering QR code for", code.url, error);
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

.qr-description {
  font-family: Gotham Book;
  font-size: clamp(11px, 1.6vh, 18px);
  color: #2b2b2b;
  margin-top: 0.5vh;
}

.qr-url {
  font-family: Gotham Light;
  font-size: clamp(9px, 1.3vh, 15px);
  color: #6b6b6b;
  margin-top: 0.6vh;
}

/* Kept to one line each so the label block has a fixed height, which is what
   lets layoutCards() measure it before choosing a code size. */
.qr-card-text {
  flex: 0 0 auto;
}

.qr-name,
.qr-description,
.qr-url {
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
