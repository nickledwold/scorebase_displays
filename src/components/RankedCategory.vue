<template>
  <RankedScoresBase
    :categories-endpoint="`/api/categories?catId=${$route.params.catId}`"
    :poll-interval="2000"
    :enable-slide-transitions="false"
  />
</template>

<script>
import RankedScoresBase from "./RankedScoresBase.vue";

export default {
  name: "RankedCategory",
  components: { RankedScoresBase },
};
</script>
