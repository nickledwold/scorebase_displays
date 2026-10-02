<template>
  <div>
    <div class="results-eventlogo">
      <br />
      <img src="../../assets/bgcolour.png" height="40" />
    </div>
    <div class="results-banner">
      <table>
        <tbody>
          <tr>
            <td class="results-eventtitle">{{ eventName }}</td>
          </tr>
          <tr>
            <td class="results-bannerlive">{{ subtitle }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventBanner",
  props: {
    eventName: { type: String, default: "" },
    subtitle: { type: String, default: "" },
  },
};
</script>

<style scoped>
@import "../../stylesheets/results.style.css";
</style>
