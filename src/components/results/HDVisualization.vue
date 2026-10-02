<template>
  <div v-if="hasCoordinates">
    <div class="hd-step-controls">
      <button
        class="hd-step-btn"
        :disabled="!currentStep"
        aria-label="Previous element"
        @click="stepBackward"
      >
        <svg class="hd-step-arrow" viewBox="0 0 12 12" aria-hidden="true">
          <polygon points="9,1 9,11 2,6" />
        </svg>
      </button>
      <span class="hd-step-label">{{ stepLabel }}</span>
      <button
        class="hd-step-btn"
        :disabled="currentStep >= maxStep"
        aria-label="Next element"
        @click="stepForward"
      >
        <svg class="hd-step-arrow" viewBox="0 0 12 12" aria-hidden="true">
          <polygon points="3,1 3,11 10,6" />
        </svg>
      </button>
    </div>
    <div class="svg-container">
      <div
        v-for="(deductions, judgeNumber) in groupedDeductions"
        :key="judgeNumber"
        class="trampoline-container"
      >
        <img
          src="../../assets/trampoline.png"
          class="trampoline-image"
          alt="Trampoline"
        />
        <svg
          viewBox="-200 -100 400 200"
          preserveAspectRatio="xMidYMid meet"
          class="trampoline-svg-overlay"
        >
          <g
            v-for="(point, index) in deductions"
            :key="index"
            v-show="
              isPointVisible(point.DeductionNumber) &&
              !isPointHighlighted(point.DeductionNumber)
            "
          >
            <circle
              :cx="point.XCoordinate"
              :cy="-point.YCoordinate"
              r="8"
              fill="#0066cc"
              stroke="white"
              stroke-width="2"
              :opacity="pointOpacity(point.DeductionNumber)"
            />
            <text
              :x="point.XCoordinate"
              :y="-point.YCoordinate + 3"
              text-anchor="middle"
              font-size="10"
              fill="white"
              font-weight="bold"
              font-family="Arial, sans-serif"
            >
              {{ point.DeductionNumber }}
            </text>
          </g>
          <g v-if="currentPoint(deductions)">
            <circle
              class="hd-current-marker"
              :cx="currentPoint(deductions).XCoordinate"
              :cy="-currentPoint(deductions).YCoordinate"
              r="11"
              fill="#cc3300"
              stroke="white"
              stroke-width="2"
              opacity="1"
            />
            <text
              class="hd-current-marker-text"
              :x="currentPoint(deductions).XCoordinate"
              :y="-currentPoint(deductions).YCoordinate + 3"
              text-anchor="middle"
              font-size="10"
              fill="white"
              font-weight="bold"
              font-family="Arial, sans-serif"
            >
              {{ currentPoint(deductions).DeductionNumber }}
            </text>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HDVisualization",
  props: {
    hdDeductions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currentStep: null,
    };
  },
  computed: {
    hasCoordinates() {
      return (
        this.hdDeductions &&
        this.hdDeductions.some((d) => d.XCoordinate !== null)
      );
    },
    groupedDeductions() {
      if (!this.hdDeductions) return {};
      return this.hdDeductions.reduce((acc, deduction) => {
        if (!acc[deduction.JudgeNumber]) {
          acc[deduction.JudgeNumber] = [];
        }
        acc[deduction.JudgeNumber].push(deduction);
        return acc;
      }, {});
    },
    maxStep() {
      if (!this.hdDeductions || this.hdDeductions.length === 0) return 0;
      return Math.max(...this.hdDeductions.map((d) => d.DeductionNumber || 0));
    },
    stepLabel() {
      if (this.currentStep === null || this.currentStep === undefined)
        return "All Elements";
      return `Element ${this.currentStep} / ${this.maxStep}`;
    },
  },
  methods: {
    stepForward() {
      if (this.currentStep === null || this.currentStep === undefined) {
        this.currentStep = 1;
      } else if (this.currentStep < this.maxStep) {
        this.currentStep = this.currentStep + 1;
      }
    },
    stepBackward() {
      if (
        this.currentStep !== null &&
        this.currentStep !== undefined &&
        this.currentStep > 1
      ) {
        this.currentStep = this.currentStep - 1;
      } else {
        this.currentStep = null;
      }
    },
    isPointVisible(deductionNumber) {
      if (this.currentStep === null || this.currentStep === undefined)
        return true;
      return deductionNumber <= this.currentStep;
    },
    isPointHighlighted(deductionNumber) {
      if (this.currentStep === null || this.currentStep === undefined)
        return false;
      return deductionNumber === this.currentStep;
    },
    pointOpacity(deductionNumber) {
      if (this.currentStep === null || this.currentStep === undefined)
        return 0.5;
      return deductionNumber === this.currentStep ? 1.0 : 0.3;
    },
    currentPoint(deductions) {
      if (this.currentStep === null || this.currentStep === undefined)
        return null;
      return (
        deductions.find((d) => d.DeductionNumber === this.currentStep) || null
      );
    },
  },
};
</script>

<style scoped>
.svg-container {
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.trampoline-container {
  position: relative;
  display: inline-block;
  width: 50%;
  max-width: 500px;
}

.trampoline-image {
  width: 100%;
  height: auto;
  display: block;
}

.trampoline-svg-overlay {
  position: absolute;
  top: 16%;
  left: 8%;
  width: 84%;
  height: 68%;
  pointer-events: auto;
}

.hd-step-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 6px 0 8px;
}

.hd-step-btn {
  border: none;
  font-family: Gotham Medium, sans-serif;
  font-size: 12px;
  outline: none;
  border-radius: 5px;
  padding: 4px 10px;
  background-color: #e8e8e8;
  color: #000000;
  vertical-align: middle;
  min-width: 32px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.hd-step-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.hd-step-arrow {
  width: 12px;
  height: 12px;
  fill: currentColor;
  display: block;
}

.hd-step-label {
  font-family: Encode Medium, sans-serif;
  font-size: 12px;
  color: #333;
  min-width: 90px;
  text-align: center;
}

.hd-current-marker {
  transition: cx 0.55s cubic-bezier(0.4, 0, 0.2, 1),
    cy 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}

.hd-current-marker-text {
  transition: x 0.55s cubic-bezier(0.4, 0, 0.2, 1),
    y 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
</style>
