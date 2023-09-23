<template>
  <div>
    <video id="myVideo" playsinline autoplay muted loop>
      <source src="../assets/panelvideo.mp4" type="video/mp4" />
    </video>
    <div class="overlay">
      <div class="panel-holding-panel-title">Panel {{ panelNumber }}</div>
      <div class="panel-holding-empty">
        <div class="time-page-clock">{{ currentTime }}</div>
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
  },
  data() {
    return {
      currentTime: "12:00",
    };
  },
  created() {
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000);
  },
  methods: {
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
          this.currentTime = data.time;
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
}
</style>
