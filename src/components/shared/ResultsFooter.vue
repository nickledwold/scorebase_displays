<template>
  <div class="results-footer">
    &copy; + SCOREBASE {{ currentYear }}
    <br />
  </div>
</template>

<script>
export default {
  name: "ResultsFooter",
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
};
</script>

<style scoped>
@import "../../stylesheets/results.style.css";
</style>
