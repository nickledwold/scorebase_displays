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
        <div class="wblue-content">
          {{ this.eventInfo.EventName }}
        </div>
      </header>
      <div style="max-width: 800px; margin: 0 auto">
        <div
          class="w3-card-4 w3-margin w3-white"
          style="max-width: 800px"
        ></div>
        <div
          class="w3-card-4 w3-margin w3-grey results-list-toggle"
          style="max-width: 800px"
        >
          <a
            class="online-a results-list-toggle-option"
            :class="{
              'bold-font': resultsOrStartLists == 'Results',
              'light-font': resultsOrStartLists != 'Results',
            }"
            @click="changeResultsOrStartListsOption('Results')"
            >RESULTS</a
          >
          <span
            class="results-list-toggle-separator"
            style="font-family: Gotham Light"
          >
            /
          </span>
          <a
            class="online-a results-list-toggle-option"
            :class="{
              'bold-font': resultsOrStartLists == 'Start Lists',
              'light-font': resultsOrStartLists != 'Start Lists',
            }"
            @click="changeResultsOrStartListsOption('Start Lists')"
            >START LISTS</a
          >
          <template v-if="hasCombinedResults">
            <span
              class="results-list-toggle-separator"
              style="font-family: Gotham Light"
            >
              /
            </span>
            <a
              class="online-a results-list-toggle-option"
              :class="{
                'bold-font': resultsOrStartLists == 'British Qualification',
                'light-font': resultsOrStartLists != 'British Qualification',
              }"
              @click="changeResultsOrStartListsOption('British Qualification')"
              >BRITISH QUALIFICATION</a
            >
          </template>
        </div>

        <div class="w0-container" style="max-width: 800px">
          <div class="online-tabs">
            <Loader v-if="loadingCategories" />
            <div v-else>
              <ul class="online-tab-links">
                <li
                  v-for="(tab, index) in tabs"
                  :key="index"
                  :class="{ active: tab.active }"
                  @click="selectTab(index)"
                >
                  <a v-if="tab.label !== 'Search'">{{ tab.label }}</a>
                  <a v-else-if="resultsOrStartLists === 'Results'">
                    <img
                      src="../assets/search.png"
                      width="20"
                      height="20"
                      class="centered-image"
                    />
                  </a>
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
                    <div v-if="tab.label == 'Search'">
                      <div class="search-container">
                        <input
                          type="search"
                          class="online-search"
                          id="myInput"
                          v-model="searchParam"
                          placeholder="Search by name, club"
                        />
                        <a
                          class="online-search-btn"
                          :href="`/online/resultSearch?searchTerm=${encodeURIComponent(
                            searchParam
                          )}`"
                        >
                          Search
                        </a>
                      </div>
                      <!--<transition name="expand">-->
                      <div v-if="searchParam">
                        <h3 v-if="filteredClubSuggestions.length > 0">Clubs</h3>
                        <div
                          v-for="suggestion in filteredClubSuggestions"
                          :key="suggestion"
                          @click="selectSuggestion(suggestion)"
                        >
                          <span class="suggestions">
                            {{ suggestion }}
                          </span>
                        </div>
                        <h3 v-if="filteredNameSuggestions.length > 0">
                          Competitors
                        </h3>
                        <div
                          v-for="suggestion in filteredNameSuggestions"
                          :key="suggestion"
                          @click="selectSuggestion(suggestion)"
                        >
                          <span class="suggestions">
                            {{ suggestion }}
                          </span>
                        </div>
                      </div>
                      <!--</transition>-->
                    </div>
                    <div v-else>
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
                    <Loader v-if="loadingStartLists" />
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
              <div v-else-if="resultsOrStartLists == 'British Qualification'">
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
                          v-for="combinedGroup in filteredCombinedGroups(
                            tab.label
                          )"
                          :key="combinedGroup.groupName"
                        >
                          <a
                            class="online-a"
                            :href="`online/britishqualification/${combinedGroup.discipline}/${combinedGroup.groupName}`"
                            >{{ combinedGroup.groupName }}</a
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

        <div class="online-footer">+ SCOREBASE {{ currentYear }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchWithRetry } from "../apiUtils";
import Loader from "./shared/Loader.vue";
const localStorageKey = "activeTab";

export default {
  name: "OnlineCategories",
  components: {
    Loader,
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      categories: [],
      startListRounds: [],
      combinedGroups: [],
      resultsOrStartLists: "Results",
      loadingCategories: true,
      loadingStartLists: true,
      loadingError: "",
      tabs: [],
      competitors: [],
      clubs: [],
      eventInfo: {},
      searchParam: "",
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
    hasCombinedResults() {
      return this.combinedGroups.length > 0;
    },
    filteredCombinedGroups() {
      return (tabLabel) => {
        return this.combinedGroups.filter(
          (group) => group.discipline === tabLabel
        );
      };
    },
    filteredNameSuggestions() {
      return this.competitors.filter((suggestion) =>
        suggestion.toLowerCase().includes(this.searchParam.toLowerCase())
      );
    },
    filteredClubSuggestions() {
      return this.clubs.filter((suggestion) =>
        suggestion.toLowerCase().includes(this.searchParam.toLowerCase())
      );
    },
    filteredTabs: function () {
      return this.tabs.filter((tab) => tab.active);
    },
  },
  created() {
    this.fetchEventInfo();
    this.fetchCategories();
    this.fetchStartListRounds();
    this.fetchCombinedGroups();
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
        this.tabs.push({
          label: "Search",
          active: false,
          title: "Search",
        });
        const storedDiscipline = localStorage.getItem(localStorageKey);
        if (storedDiscipline !== null) {
          let tabIndex = this.getIndexOfTab(storedDiscipline);
          this.selectTab(tabIndex === -1 ? 0 : tabIndex);
        }
      } catch (error) {
        this.loadingError =
          "Error loading Categories, please refresh the page.";
        console.error("Error fetching categories:", error);
      }
    },
    async fetchEventInfo() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        "/api/eventInfo";
      try {
        const data = await fetchWithRetry(url);
        this.eventInfo = data[0];
      } catch (error) {
        console.error("Error fetching event info: ", error);
      }
      this.updateTitle();
    },
    updateTitle() {
      document.title = "SCOREBASE - " + this.eventInfo.EventName;
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
    async fetchCombinedGroups() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        "/api/combinedResults";

      try {
        const data = await fetchWithRetry(url);
        // Only the discipline/group identity is needed to build the selector.
        this.combinedGroups = (data || []).map((group) => ({
          discipline: group.discipline,
          groupName: group.groupName,
        }));
      } catch (error) {
        // Endpoint returns [] for non-NAGF events; treat any error as "none".
        this.combinedGroups = [];
        console.error("Error fetching combined groups:", error);
      }
    },
    async fetchCompetitorData() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        "/api/competitorNamesAndClubs";
      try {
        const data = await fetchWithRetry(url);
        let competitorsSet = new Set();
        let clubsSet = new Set();
        data.forEach((item) => {
          if (item.competitorone.trim() !== "") {
            competitorsSet.add(item.competitorone.trim());
          }
          if (item.competitortwo.trim() !== "") {
            competitorsSet.add(item.competitortwo.trim());
          }
          clubsSet.add(item.Club.trim());
        });
        this.competitors = Array.from(competitorsSet);
        this.clubs = Array.from(clubsSet);
      } catch (error) {
        console.error("Error fetching competitor names and clubs: ", error);
      }
    },
    selectTab(index) {
      this.tabs.forEach((tab, tabIndex) => {
        tab.active = tabIndex === index;
        if (tabIndex === index)
          localStorage.setItem(localStorageKey, tab.label);
      });
      if (this.tabs[index].label === "Search") {
        this.fetchCompetitorData();
      }
    },
    getIndexOfTab(discipline) {
      return this.tabs.findIndex((tab) => tab.label === discipline);
    },
    changeResultsOrStartListsOption(option) {
      this.resultsOrStartLists = option;
    },
    selectSuggestion(suggestion) {
      this.searchParam = suggestion;
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

.centered-image {
  vertical-align: middle;
}

.results-list-toggle {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 10px;
}

.results-list-toggle-option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 6px 10px;
  border-radius: 3px;
  border: none;
  color: #151515;
  letter-spacing: 0.02em;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.15s ease, border-color 0.15s ease,
    box-shadow 0.15s ease, color 0.15s ease;
}

.results-list-toggle-option.light-font {
  background-color: #dddddd;
  color: #111111;
}

.results-list-toggle-option.bold-font {
  background-color: #1d1d1d;
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.results-list-toggle-option.light-font:hover {
  color: #111111 !important;
}

.results-list-toggle-option.bold-font:hover {
  color: #ffffff !important;
}

@media (hover: hover) and (pointer: fine) {
  .results-list-toggle-option.light-font:hover {
    background-color: #cfcfcf;
  }

  .results-list-toggle-option.bold-font:hover {
    background-color: #2c2c2c;
  }
}

.results-list-toggle-option:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #1d1d1d;
}

.results-list-toggle-separator {
  color: rgba(255, 255, 255, 0.7);
}

.search-container {
  justify-content: space-between;
  align-items: center;
}

.suggestions {
  padding: 5px; /* Adjust as needed */
  border-radius: 5px;
}

.suggestions:hover {
  background-color: #f5f5f5; /* Or any color you prefer */
}
</style>
