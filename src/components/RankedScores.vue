<template>
  <RankedScoresBase
    :categories-endpoint="'/api/displayCategories'"
    :poll-interval="2000"
    :enable-slide-transitions="true"
  />
</template>

<script>
import RankedScoresBase from "./RankedScoresBase.vue";

export default {
  name: "RankedScores",
  components: { RankedScoresBase },
};
</script>
