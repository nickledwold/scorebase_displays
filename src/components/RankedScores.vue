<template>
  <RankedScoresBase
    :categories-endpoint="'/api/displayCategories'"
    :poll-interval="2000"
    :rotation-interval="rotationInterval"
    :enable-slide-transitions="true"
  />
</template>

<script>
import RankedScoresBase from "./RankedScoresBase.vue";

export default {
  name: "RankedScores",
  components: { RankedScoresBase },
  computed: {
    rotationInterval() {
      const seconds = Number(this.$route.query.interval);
      return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 8000;
    },
  },
};
</script>
