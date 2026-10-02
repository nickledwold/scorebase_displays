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
                {{ this.eventInfo.EventName }}
              </td>
            </tr>
            <tr>
              <td class="results-bannerlive">RESULTS</td>
            </tr>
          </table>
        </div>

        <div
          class="results-roundstatus"
          v-if="this.resultsData && this.resultsData.length > 0"
        >
          <table cellspacing="0" align="center">
            <tr>
              <template
                v-for="(round, index) in getRoundsForAllCompetitors()"
                :key="round"
              >
                <td class="roundstatusround">
                  {{ this.categoryRounds.length == 1 ? `STATUS` : round }}
                </td>
                <td
                  v-if="index !== getRoundsForAllCompetitors().length - 1"
                  class="spacer"
                ></td>
              </template>
            </tr>
            <template
              v-for="(round, index) in getRoundsForAllCompetitors()"
              :key="round"
            >
              <td :class="getRoundStatusClass(round)">
                {{ getRoundStatusString(round) }}
              </td>
              <td
                v-if="index !== getRoundsForAllCompetitors().length - 1"
                class="spacer"
              ></td>
            </template>
          </table>
        </div>

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

        <div v-if="this.categoryRounds.length > 1" class="results-filterBtns">
          <div class="results-btnfilterimg">
            <img src="../assets/filter.png" width="20" />
          </div>
          <button
            id="mybutton"
            class="results-btn"
            :class="{ active: this.roundFilterString === '' }"
            @click="updateRoundFilter('')"
          >
            All
          </button>
          <button
            class="results-btn"
            :class="{ active: this.roundFilterString === 'Q' }"
            @click="updateRoundFilter('Q')"
          >
            Q
          </button>
          <button
            class="results-btn"
            :class="{ active: this.roundFilterString === 'F' }"
            @click="updateRoundFilter('F')"
          >
            F
          </button>
        </div>

        <div
          v-for="result in filteredResults"
          :key="result.CompetitorId"
          id="containerdiv"
        >
          <CompetitorResultCard
            :result="result"
            :discipline="categoryData.Discipline"
            :event-short-name="eventInfo.EventShortName"
            :no-results="noResults"
            :position="positionFor(result)"
            :category-rounds-count="categoryRounds.length"
            :comp-type="result.CompType"
            :round-label="getRoundName"
            :round-filter="roundFilter"
            :show-qualification="combined"
          />
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
import CompetitorResultCard from "./results/CompetitorResultCard.vue";

export default {
  name: "OnlineResults",
  components: { CompetitorResultCard },
  props: {
    combined: { type: Boolean, default: false },
  },
  computed: {
    catId() {
      return this.$route.params.catId;
    },
    event() {
      return this.$route.params.event;
    },
    discipline() {
      return this.$route.params.discipline;
    },
    group() {
      return this.$route.params.group;
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
      resultsData: {},
      searchParam: "",
      noResults: false,
      categoryRounds: {},
      roundFilterString: "",
      eventInfo: {},
    };
  },
  created() {
    this.fetchEventInfo();
    if (this.combined) {
      this.fetchCombinedResults();
    } else {
      this.fetchCategory();
    }
  },
  methods: {
    async fetchCombinedResults() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        `/api/combinedResults?discipline=${encodeURIComponent(
          this.discipline
        )}&group=${encodeURIComponent(this.group)}`;

      this.categoryData = {
        Discipline: this.discipline,
        Category: this.group,
        CompType: 0,
      };
      try {
        const data = await fetchWithRetry(url);
        const group = data && data.length > 0 ? data[0] : null;
        if (!group) {
          this.resultsData = [];
          return;
        }
        const roundName =
          group.competitors?.[0]?.Exercises?.[0]?.RoundName ?? "Q1";
        this.categoryRounds = [{ RoundName: roundName, SignedOff: 1 }];
        this.resultsData = group.competitors.map((x, i) => {
          x.FullName =
            this.discipline == "TRS"
              ? x.Surname1 + ", " + x.Surname2
              : x.FirstName1 + " " + x.Surname1;
          x.fullNameReversed =
            this.discipline == "TRS"
              ? (x.Surname2 || "").toUpperCase() +
                ", " +
                (x.Surname1 || "").toUpperCase()
              : (x.Surname1 || "").toUpperCase() + " " + x.FirstName1;
          x.Rank = x.DisplayRank;
          x.RunningOrderNumber = i + 1;
          // Surface the combined total/rank through the existing round total/rank tables.
          x.RoundTotals = [
            {
              Round: roundName,
              RoundTotal: x.CombinedTotal,
              RoundRank: x.DisplayRank,
            },
          ];
          return x;
        });
      } catch (error) {
        console.error("Error fetching combined results:", error);
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
        await this.fetchRounds();
        this.fetchResults();
      } catch (error) {
        console.error("Error fetching category:", error);
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
    },
    async fetchResults() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        `/api/onlineResults?catId=${this.catId}&compType=${this.categoryData.CompType}`;

      try {
        const tempData = await fetchWithRetry(url);
        let competitorsWithScores = tempData.filter(
          (competitor) => competitor.Exercises.length > 0
        );

        if (competitorsWithScores.length == 0) {
          this.noResults = true;
          tempData.sort((a, b) => {
            if (a.Q1Flight < b.Q1Flight) return -1;
            if (a.Q1Flight > b.Q1Flight) return 1;
            if (a.Q1StartNo < b.Q1StartNo) return -1;
            if (a.Q1StartNo > b.Q1StartNo) return 1;
            return 0;
          });
        } else {
          this.noResults = false;
        }

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
          x.Rank =
            this.categoryData.CompType == 0
              ? x.DisplayZeroRank
              : x.DisplayCumulativeRank;
          x.RunningOrderNumber = i + 1;
          return x;
        });
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    },
    async fetchRounds() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        `/api/rounds?catId=${this.categoryData.CatId}`;

      try {
        const data = await fetchWithRetry(url);
        this.categoryRounds = data;
      } catch (error) {
        console.error("Error fetching rounds:", error);
      }
    },
    roundFilter(round) {
      if (this.roundFilterString == "") return true;
      if (this.roundFilterString == round[0]) return true;
      return false;
    },
    updateRoundFilter(roundFilter) {
      this.roundFilterString = roundFilter;
    },
    getRoundsForAllCompetitors() {
      const roundData = [];
      if (!this.resultsData || this.resultsData.length == 0) return roundData;
      this.resultsData.forEach((competitor) => {
        competitor.Exercises.forEach((exercise) => {
          const round = {
            RoundName: exercise.RoundName,
            RoundOrder: exercise.RoundOrder,
          };
          roundData.push(round);
        });
      });
      const sortedRoundData = roundData.sort(
        (a, b) => a.RoundOrder - b.RoundOrder
      );
      const uniqueRoundNamesSet = new Set(
        sortedRoundData.map((round) => round.RoundName)
      );
      const uniqueSortedRoundNames = Array.from(uniqueRoundNamesSet);
      return uniqueSortedRoundNames;
    },
    getRoundName(round) {
      if (this.categoryRounds.length == 1) return "";
      if (round[0] == "Q") {
        let qualificationRounds = this.categoryRounds.filter(
          (round) => round.RoundName[0] == "Q"
        );
        return qualificationRounds.length > 1
          ? "Qualification " + round[1]
          : "Qualification";
      }
      if (round[0] == "F") {
        let finalRounds = this.categoryRounds.filter(
          (round) => round.RoundName[0] == "F"
        );
        return finalRounds.length > 1 ? "Final " + round[1] : "Final";
      }
    },
    getRoundStatusClass(round) {
      let categoryRound = this.categoryRounds.filter(
        (item) => item.RoundName == round
      )[0];
      if (!categoryRound) return "roundstatusprovisional";
      return categoryRound.SignedOff == 1
        ? "roundstatusofficial"
        : "roundstatusprovisional";
    },
    getRoundStatusString(round) {
      let categoryRound = this.categoryRounds.filter(
        (item) => item.RoundName == round
      )[0];
      if (!categoryRound) return "Provisional";
      return categoryRound.SignedOff == 1 ? "Official" : "Provisional";
    },
    updateTitle() {
      document.title =
        this.categoryData.Discipline +
        " " +
        this.categoryData.Category +
        " - Live Results";
    },
    positionFor(result) {
      if (this.noResults) return result.RunningOrderNumber;
      return result.Rank ? result.Rank : result.RunningOrderNumber;
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/results.style.css";
</style>
