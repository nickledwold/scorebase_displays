<template>
  <div v-if="tsValues && tsValues.length > 0" class="ts-chart-container">
    <svg
      viewBox="0 0 280 110"
      class="ts-chart-svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <template v-if="discipline === 'TRS'">
        <line
          x1="12"
          y1="15"
          x2="268"
          y2="15"
          stroke="#ccc"
          stroke-width="0.5"
          stroke-dasharray="3,3"
        />
        <text
          x="10"
          y="18"
          text-anchor="end"
          font-size="7"
          fill="#999"
          font-family="Arial, sans-serif"
        >
          2
        </text>
        <line
          x1="12"
          y1="50"
          x2="268"
          y2="50"
          stroke="#ccc"
          stroke-width="0.5"
          stroke-dasharray="3,3"
        />
        <text
          x="10"
          y="53"
          text-anchor="end"
          font-size="7"
          fill="#999"
          font-family="Arial, sans-serif"
        >
          1
        </text>
      </template>
      <line x1="12" y1="85" x2="268" y2="85" stroke="#ccc" stroke-width="0.5" />
      <g v-for="(tsValue, index) in tsValues" :key="tsValue.SkillNumber">
        <rect
          :x="barX(index)"
          :y="barY(tsValue.Value)"
          :width="barWidth"
          :height="barHeight(tsValue.Value)"
          :fill="barColor(tsValue.Value)"
          rx="2"
        />
        <text
          :x="barX(index) + barWidth / 2"
          :y="barY(tsValue.Value) - 2"
          text-anchor="middle"
          font-size="7"
          fill="#444"
          font-family="Arial, sans-serif"
        >
          {{ tsValue.Value }}
        </text>
        <text
          :x="barX(index) + barWidth / 2"
          y="95"
          text-anchor="middle"
          font-size="8"
          fill="#666"
          font-family="Arial, sans-serif"
        >
          {{ tsValue.SkillNumber }}
        </text>
      </g>
      <text
        x="140"
        y="108"
        text-anchor="middle"
        font-size="7"
        fill="#888"
        font-family="Arial, sans-serif"
      >
        Element
      </text>
    </svg>
  </div>
</template>

<script>
export default {
  name: "TSChart",
  props: {
    tsValues: { type: Array, default: () => [] },
    discipline: { type: String, default: "" },
  },
  computed: {
    numBars() {
      return this.tsValues.length;
    },
    barWidth() {
      return (256 - (this.numBars - 1) * 3) / this.numBars;
    },
    maxValue() {
      if (this.discipline === "TRS") return 2;
      const maxVal = Math.max(
        ...this.tsValues.map((v) => parseFloat(v.Value) || 0)
      );
      return maxVal > 0 ? maxVal * 1.15 : 2;
    },
  },
  methods: {
    barX(index) {
      return 12 + index * (this.barWidth + 3);
    },
    barHeight(value) {
      const val = parseFloat(value) || 0;
      return Math.max(1, (val / this.maxValue) * 70);
    },
    barY(value) {
      return 85 - this.barHeight(value);
    },
    barColor(value) {
      if (this.discipline !== "TRS") return "#0066cc";
      const val = Math.min(2, Math.max(0, parseFloat(value) || 0));
      if (val <= 1) {
        const t = val;
        const r = Math.round(231 + (241 - 231) * t);
        const g = Math.round(76 + (196 - 76) * t);
        const b = Math.round(60 + (15 - 60) * t);
        return `rgb(${r},${g},${b})`;
      }
      const t = val - 1;
      const r = Math.round(241 + (39 - 241) * t);
      const g = Math.round(196 + (174 - 196) * t);
      const b = Math.round(15 + (96 - 15) * t);
      return `rgb(${r},${g},${b})`;
    },
  },
};
</script>

<style scoped>
.ts-chart-container {
  width: 100%;
  max-width: 400px;
  margin: 6px auto 0;
}

.ts-chart-svg {
  width: 100%;
  height: auto;
  display: block;
}
</style>
