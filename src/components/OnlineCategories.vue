<template>
  <div class="online-html-class">
    <div class="w3-light-grey">
      <div class="w3-content">
        <header style="padding-top: 20px" class="w3-container w3-center">
          <a class="online-a" href="/"
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
      <center>
        <div
          class="w3-card-4 w3-margin w3-white"
          style="max-width: 800px"
        ></div>
        <div class="w3-card-4 w3-margin w3-grey" style="max-width: 800px">
          <a
            class="online-a"
            :class="{
              'bold-font': resultsOrStartLists == 'Results',
              'light-font': resultsOrStartLists != 'Results',
            }"
            @click="changeResultsOrStartListsOption('Results')"
            >LIVE RESULTS</a
          >
          <span style="font-family: Gotham Light"> / </span>
          <a
            class="online-a"
            :class="{
              'bold-font': resultsOrStartLists == 'Start Lists',
              'light-font': resultsOrStartLists != 'Start Lists',
            }"
            @click="changeResultsOrStartListsOption('Start Lists')"
            >START LISTS</a
          >
        </div>

        <div class="w0-container" style="max-width: 800px">
          <div class="online-tabs">
            <div v-if="loadingCategories" class="loading-spinner">
              <div class="spinner"></div>
            </div>
            <div v-else>
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

              <div v-if="resultsOrStartLists == 'Results'">
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
                    <div>
                      <transition name="collapse" mode="out-in">
                        <div v-if="tab.active" :key="tab.label">
                          <div
                            v-for="category in filteredCategories(tab.label)"
                            :key="category.CatId"
                          >
                            <a
                              class="online-a"
                              :href="`online/results/${category.CatId}`"
                              >{{ category.Category }}</a
                            >
                            <br />
                          </div>
                          <div class="padding"></div>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="resultsOrStartLists == 'Start Lists'">
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
                    <div v-if="loadingStartLists" class="loading-spinner">
                      <div class="spinner"></div>
                    </div>
                    <div v-else>
                      <transition name="collapse" mode="out-in">
                        <div v-if="tab.active" :key="tab.label">
                          <div
                            v-for="round in filteredStartLists(tab.label)"
                            :key="round.CategoryId"
                          >
                            <a
                              v-if="round.NumberOfRounds == 1"
                              class="online-a"
                              :href="`online/startlists/${round.CategoryId}`"
                              >{{ round.Category }}</a
                            >
                            <a
                              v-else
                              class="online-a"
                              :href="`online/startlists/${round.CategoryId}/${round.RoundName}`"
                              >{{ round.Category + " - " + round.RoundName }}</a
                            >
                            <br />
                          </div>
                          <div class="padding"></div>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="online-footer">+ SCOREBASE {{ currentYear }}</div>
      </center>
    </div>
  </div>
</template>

<script>
import { fetchWithRetry } from "../apiUtils";
export default {
  name: "OnlineCategories",
  data() {
    return {
      currentYear: new Date().getFullYear(),
      categories: [],
      startListRounds: [],
      resultsOrStartLists: "Results",
      loadingCategories: true,
      loadingStartLists: true,
      loadingError: "",
      tabs: [],
    };
  },
  computed: {
    event() {
      return this.$route.params.event;
    },
    filteredCategories() {
      return (tabLabel) => {
        return this.categories.filter(
          (category) => category.Discipline === tabLabel
        );
      };
    },
    filteredStartLists() {
      return (tabLabel) => {
        return this.startListRounds.filter(
          (round) => round.Discipline === tabLabel
        );
      };
    },
    filteredTabs: function () {
      return this.tabs.filter((tab) => tab.active);
    },
  },
  created() {
    this.fetchCategories();
    this.fetchStartListRounds();
  },
  methods: {
    async fetchCategories() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        "/api/categories";

      try {
        const data = await fetchWithRetry(url);
        this.categories = data;
        this.loadingCategories = false;
        const disciplineSet = new Set();
        for (const item of this.categories) {
          disciplineSet.add(item.Discipline);
        }
        let uniqueDisciplines = Array.from(disciplineSet);
        if (uniqueDisciplines.some((discipline) => discipline === "TRA")) {
          this.tabs.push({
            label: "TRA",
            active: true,
            title: "Individual Trampoline",
          });
        }
        if (uniqueDisciplines.some((discipline) => discipline === "TRS")) {
          this.tabs.push({
            label: "TRS",
            active: false,
            title: "Synchronised Trampoline",
          });
        }
        if (uniqueDisciplines.some((discipline) => discipline === "DMT")) {
          this.tabs.push({
            label: "DMT",
            active: false,
            title: "Double Mini-Trampoline",
          });
        }
        if (uniqueDisciplines.some((discipline) => discipline === "TUM")) {
          this.tabs.push({ label: "TUM", active: false, title: "Tumbling" });
        }
      } catch (error) {
        this.loadingError =
          "Error loading Categories, please refresh the page.";
        console.error("Error fetching categories:", error);
      }
    },
    async fetchStartListRounds() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        "/api/startListRounds";

      try {
        const data = await fetchWithRetry(url);
        this.startListRounds = data;
        this.loadingStartLists = false;
      } catch (error) {
        this.loadingError =
          "Error loading Start Lists, please refresh the page.";
        console.error("Error fetching start list rounds:", error);
      }
    },
    selectTab(index) {
      this.tabs.forEach((tab, tabIndex) => {
        tab.active = tabIndex === index;
      });
    },
    changeResultsOrStartListsOption(option) {
      this.resultsOrStartLists = option;
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/online-categories.style.css";

.collapse-enter-active,
.collapse-leave-active {
  transition: 1s;
}
.collapse-enter,
.collapse-leave-to {
  max-height: 0;
  overflow: hidden;
}

.bold-font {
  font-family: Gotham Bold;
}

.light-font {
  font-family: Gotham Light;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
