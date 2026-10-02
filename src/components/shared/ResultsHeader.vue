<template>
  <table class="results-bannerhead">
    <tbody>
      <tr>
        <td class="results-scorebase">
          <img src="../../assets/scorebase.png" height="20" />
        </td>
        <td class="results-back">
          <a :href="`/online`">
            <img src="../../assets/back.png" height="15" />
          </a>
        </td>
        <td class="results-selector">
          <a class="online-a" :href="`/online`">Category Selector</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "ResultsHeader",
};
</script>

<style scoped>
@import "../../stylesheets/results.style.css";
</style>
