<template>
  <div class="online-html-class">
    <div class="w3-light-grey">
      <div class="w3-content">
        <header style="padding-top: 20px" class="w3-container w3-center">
          <a class="online-a" href="index.html"
            ><img src="img/logo.png" width="250px"
          /></a>
        </header>
      </div>
      <div class="eventlogo">
        <br />
        <img src="img/bgcolour.png" height="45px" />
        <br />
      </div>
      <header class="wblue-container w3-center">
        <div class="wblue-content" style="max-width: 1920px">
          Jaffa Trampoline, Tumbling & DMT British Championships 2023
        </div>
      </header>

      <div class="w3-card-4 w3-margin w3-white" style="max-width: 800px"></div>
      <div class="w3-card-4 w3-margin w3-grey" style="max-width: 800px">
        LIVE RESULTS
      </div>

      <div class="w0-container" style="max-width: 800px">
        <div class="tabs">
          <ul class="tab-links">
            <li class="active"><a class="online-a" href="#TRA">TRA</a></li>
            <li><a class="online-a" href="#TRS">TRS</a></li>
            <li><a class="online-a" href="#DMT">DMT</a></li>
            <li><a class="online-a" href="#TUM">TUM</a></li>
          </ul>

          <div class="tab-content">
            <div id="TRA" class="tab active">
              <div class="disciplinetitle">Individual Trampoline</div>
              <hr class="discipline" />
              <div v-for="category in traCategories" :key="category.CatId">
                <a class="online-a" :href="`/online/${category.CatId}`">{{
                  category.Category
                }}</a
                ><br />
              </div>
            </div>

            <div id="TRS" class="tab">
              <div class="disciplinetitle">Synchronised Trampoline</div>
              <hr class="discipline" />
              <div v-for="category in trsCategories" :key="category.CatId">
                <a class="online-a" :href="`/online/${category.CatId}`">{{
                  category.Category
                }}</a
                ><br />
              </div>
            </div>

            <div id="DMT" class="tab">
              <div class="disciplinetitle">Double Mini-Trampoline</div>
              <hr class="discipline" />
              <div v-for="category in dmtCategories" :key="category.CatId">
                <a class="online-a" :href="`/online/${category.CatId}`">{{
                  category.Category
                }}</a
                ><br />
              </div>
            </div>

            <div id="TUM" class="tab">
              <div class="disciplinetitle">Tumbling</div>
              <hr class="discipline" />
              <div v-for="category in tumCategories" :key="category.CatId">
                <a class="online-a" :href="`/online/${category.CatId}`">{{
                  category.Category
                }}</a
                ><br />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer">+ SCOREBASE {{ currentYear }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OnlineCategories",
  data() {
    return {
      currentYear: new Date().getFullYear(),
      categories: [],
    };
  },
  computed: {
    traCategories() {
      return this.categories.filter(
        (category) => category.Discipline === "TRA"
      );
    },
    trsCategories() {
      return this.categories.filter(
        (category) => category.Discipline === "TRS"
      );
    },
    tumCategories() {
      return this.categories.filter(
        (category) => category.Discipline === "TUM"
      );
    },
    dmtCategories() {
      return this.categories.filter(
        (category) => category.Discipline === "DMT"
      );
    },
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      await fetch(
        "http://" + process.env.API_IP_ADDRESS + ":3000/api/categories"
      )
        .then((response) => response.json())
        .then((data) => {
          this.categories = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/results.style.css";
</style>
