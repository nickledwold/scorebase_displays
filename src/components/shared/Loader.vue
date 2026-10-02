<template>
  <div class="loader-container">
    <Vue3Lottie :animationData="LoaderJSON" :loop="loop" :autoplay="autoplay" />
  </div>
</template>

<script>
import { Vue3Lottie } from "vue3-lottie";
import LoaderJSON from "../../assets/loader.json";

export default {
  name: "LoaderComponent",
  components: {
    Vue3Lottie,
  },
  props: {
    loop: {
      type: Boolean,
      default: true,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      LoaderJSON,
    };
  },
};
</script>

<style scoped>
.loader-container {
  justify-content: center;
  align-items: center;
  margin: 50px 0;
  height: 8vh;
  opacity: 0.5;
}
</style>
