<template>
  <body class="results-body">
    <head>
      <title>
        {{ this.categoryData.Discipline }} {{ this.categoryData.Category }} -
        LIVE Results
      </title>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <div class="results-background">
      <div class="results-container">
        <table class="results-bannerhead">
          <td class="results-scorebase">
            <img src="../assets/scorebase.png" height="20" />
          </td>
          <td class="results-back">
            <a :href="`/online`"
              ><img src="../assets/back.png" height="15"
            /></a>
          </td>
          <td class="results-selector">
            <a class="online-a" :href="`/online`">Category Selector</a>
          </td>
        </table>

        <div class="results-eventlogo">
          <br />
          <img src="../assets/bgcolour.png" height="40" />
        </div>

        <div class="results-banner">
          <table>
            <tr>
              <td class="results-eventtitle">
                Jaffa Trampoline, Tumbling & DMT British Championships 2023
              </td>
            </tr>
            <tr>
              <td class="results-bannerlive">
                {{
                  this.roundName
                    ? `START LIST - ` + this.roundName
                    : `START LIST`
                }}
              </td>
            </tr>
          </table>
        </div>
        <div class="results-roundstatus"></div>
        <div class="results-bannercat">
          <table>
            <td>
              {{ this.categoryData.Discipline }}
              {{ this.categoryData.Category }}
            </td>
          </table>
        </div>

        <input
          type="search"
          class="results-search"
          id="myInput"
          v-model="searchParam"
          placeholder="Search by name, club"
        />

        <div
          v-for="result in filteredResults"
          :key="result.CompetitorId"
          id="containerdiv"
        >
          <div class="result" id="resultdiv">
            <table class="results-top-name">
              <tr class="results-name">
                <td rowspan="2" class="results-scores-pos">
                  {{ result.RunningOrderNumber }}
                </td>
                <td class="results-scores-name">
                  {{ result.fullNameReversed }}
                </td>
              </tr>
              <tr class="results-name">
                <td class="results-scores-club">
                  {{ result.DisplayClub }}
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="padding"></div>
      </div>
    </div>
    <div class="results-footer">
      &copy; + SCOREBASE
      {{ currentYear }}
      <br />
    </div>
  </body>
</template>

<script>
import { fetchWithRetry } from "../apiUtils";
export default {
  name: "OnlineStartLists",
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
      currentYear: new Date().getFullYear(),
      categoryData: {},
      currentRoundName: "",
      resultsData: {},
      searchParam: "",
      mediansVisible: {},
      roundFilterString: "",
    };
  },
  created() {
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
          x.RunningOrderNumber = i + 1;
          return x;
        });
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
