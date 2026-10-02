<template>
  <div class="results-body">
    <div class="results-background">
      <div class="results-container">
        <ResultsHeader />
        <EventBanner
          :event-name="eventInfo.EventName"
          :subtitle="roundName ? `START LIST - ${roundName}` : 'START LIST'"
        />
        <div class="results-roundstatus"></div>
        <div class="results-bannercat">
          <table>
            <tbody>
              <tr>
                <td>
                  {{ this.categoryData.Discipline }}
                  {{ this.categoryData.Category }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <input
          type="search"
          class="results-search"
          id="myInput"
          v-model="searchParam"
          placeholder="Search by name, club"
        />

        <div>
          <table class="results-top-name">
            <tbody>
              <tr>
                <td class="results-scores-pos-header">No</td>
                <td class="results-scores-name-startlist-header">Competitor</td>
                <td class="results-scores-flight-header">Flight</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Loader v-if="loadingStartLists" />
        <div
          v-else
          v-for="result in filteredResults"
          :key="result.CompetitorId"
          id="containerdiv"
        >
          <div class="result" id="resultdiv">
            <table class="results-top-name">
              <tbody>
                <tr class="results-name">
                  <td rowspan="2" class="results-scores-pos">
                    {{ result.RunningOrderNumber }}
                  </td>
                  <td class="results-scores-name-startlist">
                    {{ result.fullNameReversed }}
                  </td>
                  <td rowspan="2" class="results-scores-flight">
                    {{ result.FlightNumber }}
                  </td>
                </tr>
                <tr class="results-name">
                  <td class="results-scores-club">
                    {{ result.DisplayClub }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="padding"></div>
      </div>
    </div>
    <ResultsFooter />
  </div>
</template>

<script>
import { fetchWithRetry } from "../apiUtils";
import Loader from "./shared/Loader.vue";
import ResultsHeader from "./shared/ResultsHeader.vue";
import EventBanner from "./shared/EventBanner.vue";
import ResultsFooter from "./shared/ResultsFooter.vue";

export default {
  name: "OnlineStartLists",
  components: {
    Loader,
    ResultsHeader,
    EventBanner,
    ResultsFooter,
  },
  computed: {
    catId() {
      return this.$route.params.catId;
    },
    event() {
      return this.$route.params.event;
    },
    roundName() {
      return this.$route.params.roundName;
    },
    filteredResults() {
      return this.searchParam == ""
        ? this.resultsData
        : this.resultsData.filter(
            (result) =>
              result.FullName.toUpperCase().includes(
                this.searchParam.toUpperCase()
              ) ||
              result.fullNameReversed
                .toUpperCase()
                .includes(this.searchParam.toUpperCase()) ||
              result.DisplayClub.toUpperCase().includes(
                this.searchParam.toUpperCase()
              )
          );
    },
  },
  data() {
    return {
      categoryData: {},
      currentRoundName: "",
      resultsData: {},
      searchParam: "",
      mediansVisible: {},
      roundFilterString: "",
      eventInfo: {},
      loadingStartLists: true,
    };
  },
  created() {
    this.fetchEventInfo();
    this.fetchCategory();
  },
  methods: {
    updateTitle() {
      document.title = this.roundName
        ? this.categoryData.Discipline +
          " " +
          this.categoryData.Category +
          " - " +
          this.roundName +
          " Start List"
        : this.categoryData.Discipline +
          " " +
          this.categoryData.Category +
          " - " +
          "Start List";
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
    },
    async fetchCategory() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        `/api/categories?catId=${this.catId}`;

      try {
        const data = await fetchWithRetry(url);
        this.categoryData = data[0];
        this.updateTitle();
        if (this.roundName) {
          this.currentRoundName = this.roundName;
        } else {
          await this.fetchRounds();
        }
        this.fetchResults();
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    },
    async fetchRounds() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        `/api/rounds?catId=${this.catId}`;

      try {
        const data = await fetchWithRetry(url);
        this.currentRoundName = data[0].RoundName;
      } catch (error) {
        console.error("Error fetching rounds:", error);
      }
    },
    async fetchResults() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        `/api/roundStartListCompetitors?catId=${this.catId}&roundName=${this.currentRoundName}`;

      try {
        const tempData = await fetchWithRetry(url);
        this.resultsData = tempData.map((x, i) => {
          let fullName =
            this.categoryData.Discipline == "TRS"
              ? x.Surname1 + ", " + x.Surname2
              : x.FirstName1 + " " + x.Surname1;
          let fullNameReversed =
            this.categoryData.Discipline == "TRS"
              ? x.Surname2.toUpperCase() + ", " + x.Surname1.toUpperCase()
              : x.Surname1.toUpperCase() + " " + x.FirstName1;
          x.FullName = fullName;
          x.fullNameReversed = fullNameReversed;
          x.RunningOrderNumber = x.StartNo == 999 ? "R" : i + 1;
          return x;
        });
        this.loadingStartLists = false;
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/results.style.css";
</style>
