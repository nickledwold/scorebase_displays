<template>
  <div class="online-html-class">
    <div class="w3-light-grey">
      <div class="w3-content">
        <header style="padding-top: 20px" class="w3-container w3-center">
          <a class="online-a" href="index.html"
            ><img src="../assets/logo.png" width="250"
          /></a>
        </header>
      </div>
      <div class="online-eventlogo">
        <br />
        <img src="../assets/bgcolour.png" height="45" />
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
        <div class="online-tabs">
          <ul class="online-tab-links">
            <li
              v-for="(tab, index) in tabs"
              :key="index"
              :class="{ active: tab.active }"
              @click="selectTab(index)"
            >
              <a>{{ tab.label }}</a>
            </li>
          </ul>

          <div
            v-for="tab in filteredTabs"
            :key="tab.label"
            class="online-tab-content"
          >
            <div
              :id="tab.label"
              class="online-tab"
              :class="{ active: tab.active }"
            >
              <div class="disciplinetitle">{{ tab.title }}</div>
              <hr class="discipline" />
              <transition name="collapse" mode="out-in">
                <div v-if="tab.active" :key="tab.label">
                  <div
                    v-for="category in filteredCategories(tab.label)"
                    :key="category.CatId"
                  >
                    <a class="online-a" :href="`/online/${category.CatId}`">{{
                      category.Category
                    }}</a>
                    <br />
                  </div>
                  <div class="padding"></div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <div class="online-footer">+ SCOREBASE {{ currentYear }}</div>
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
      tabs: [
        { label: "TRA", active: true, title: "Individual Trampoline" },
        { label: "TRS", active: false, title: "Synchronised Trampoline" },
        { label: "DMT", active: false, title: "Double Mini-Trampoline" },
        { label: "TUM", active: false, title: "Tumbling" },
      ],
    };
  },
  computed: {
    filteredCategories() {
      return (tabLabel) => {
        return this.categories.filter(
          (category) => category.Discipline === tabLabel
        );
      };
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
    filteredTabs: function () {
      return this.tabs.filter((tab) => tab.active);
    },
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/categories"
      )
        .then((response) => response.json())
        .then((data) => {
          this.categories = data;
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    selectTab(index) {
      this.tabs.forEach((tab, tabIndex) => {
        tab.active = tabIndex === index;
      });
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/results.style.css";

.collapse-enter-active,
.collapse-leave-active {
  transition: 1s;
}
.collapse-enter,
.collapse-leave-to {
  max-height: 0;
  overflow: hidden;
}
</style>
