<template>
  <div>
    <video id="myVideo" playsinline autoplay muted loop>
      <source src="../assets/Panel2025.webm" type="video/mp4" />
    </video>
    <div class="overlay">
      <div class="panel-holding-panel-title">Panel {{ panelNumber }}</div>
      <div class="panel-holding-empty">
        <div class="time-page-clock">
          <div
            v-for="(char, index) in timeChars"
            :key="index"
            class="time-char-container"
            :style="{ '--char-width': getCharWidth(char) }"
          >
            <div
              class="time-char time-char-current"
              :class="{ 'flip-out': animatingIndices.includes(index) }"
            >
              {{ getPreviousChar(index) }}
            </div>
            <div
              class="time-char time-char-next"
              :class="{ 'flip-in': animatingIndices.includes(index) }"
            >
              {{ char }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Clockv2Component",
  computed: {
    panelNumber() {
      return this.$route.params.panelNumber;
    },
    timeChars() {
      return this.currentTime.split("");
    },
  },
  data() {
    return {
      currentTime: "12:00",
      previousTime: "12:00",
      animatingIndices: [],
    };
  },
  created() {
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
  },
  methods: {
    getCharWidth(char) {
      return char === ":" ? "0.3em" : char === "1" ? "0.4em" : "0.65em";
    },
    getPreviousChar(index) {
      if (this.animatingIndices.includes(index)) {
        return this.previousTime[index] || "";
      }
      return this.timeChars[index];
    },

    async updateTime() {
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/serverClock"
      )
        .then((response) => response.json())
        .then((data) => {
          this.previousTime = this.currentTime;
          const newTime = data.time;

          // Find which characters have changed
          const changedIndices = [];
          for (let i = 0; i < newTime.length; i++) {
            if (
              i >= this.currentTime.length ||
              newTime[i] !== this.currentTime[i]
            ) {
              changedIndices.push(i);
            }
          }

          // Trigger animation for changed characters
          if (changedIndices.length > 0) {
            this.animatingIndices = changedIndices;

            // Remove animation class after animation completes
            setTimeout(() => {
              this.animatingIndices = [];
            }, 600); // Match animation duration
          }

          this.currentTime = newTime;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/panel.style.css";
@import "../stylesheets/videostyle.style.css";

.time-page-clock {
  font-family: Gotham Book;
  font-size: 500px;
  color: #ffffff;
  text-align: center;
  display: flex;
  width: 100%;
  margin: auto;
  align-items: center;
  justify-content: center;
  z-index: 99;
  background-color: transparent;
  position: relative;
}

/* Reserve space for widest possible time to maintain centering */
.time-page-clock::before {
  content: "88:88";
  position: absolute;
  visibility: hidden;
  font-family: inherit;
  font-size: inherit;
  letter-spacing: 0.1em; /* Adjust based on your spacing needs */
}

.time-char-container {
  position: relative;
  display: inline-block;
  perspective: 1000px;
  text-align: center;
  /* Use CSS custom property for width that can be animated */
  width: var(--char-width, 0.55em);
  min-width: 0.35em;
  /* Animate width changes smoothly */
  transition: width 0.3s ease-in-out;
}

.time-char {
  display: inline-block;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  width: 100%;
  text-align: center;
  box-sizing: border-box;
}

.time-char-current {
  position: relative;
  z-index: 2;
}

.time-char-next {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transform: rotateX(90deg);
}

.flip-out {
  animation: flip-out 0.3s ease-in-out forwards;
}

.flip-in {
  animation: flip-in 0.3s ease-in-out 0.3s forwards;
}

@keyframes flip-out {
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(-90deg);
  }
}

@keyframes flip-in {
  0% {
    transform: rotateX(90deg);
  }
  100% {
    transform: rotateX(0deg);
  }
}
</style>
