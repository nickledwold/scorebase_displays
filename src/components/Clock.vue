<template>
  <div class="time-page-clock">{{ currentTime }}</div>
  <div class="logo-scorebase-clock">
    <img src="../assets/logo.png" width="600" />
  </div>
</template>

<script>
export default {
  name: "ClockComponent",
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
.time-page-clock {
  font-family: Gotham Book;
  font-size: 500px;
  color: #ffffff;
  text-align: center;
  display: flex;
  width: 100%;
  height: 100vh;
  margin: auto;
  align-items: center;
  justify-content: center;
  z-index: 99;
  background-color: #000000;
}

.logo-scorebase-clock {
  float: left;
  position: absolute;
  top: 950px;
  right: 2%;
  text-align: right;
  height: 100px;
  width: 1000px;
  color: #ffffff;
  font-family: Gotham Medium, sans-serif;
  text-transform: uppercase;
  font-size: 90px;
  z-index: 1;
}
</style>
