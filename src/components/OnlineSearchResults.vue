<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
  />
  <div class="results-body">
    <div class="results-background">
      <div class="results-container">
        <ResultsHeader />
        <EventBanner :event-name="eventInfo.EventName" subtitle="RESULTS" />
        <Loader v-if="loadingResults" />
        <div
          v-else
          v-for="category in visibleCategorizedResults"
          :key="category"
          id="containerdiv1"
        >
          <br />
          <div class="results-bannercat">
            <table>
              <tbody>
                <tr>
                  <td>
                    <a
                      :href="`/online/results/${category[0].CatId}`"
                      class="custom-link"
                    >
                      {{ category[0].Category.Discipline }}
                      {{ category[0].Category.Category }}
                      <i class="fas fa-link icon-small"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-for="result in category"
            :key="result.CompetitorId"
            id="containerdiv"
          >
            <CompetitorResultCard
              :result="result"
              :discipline="category[0].Category.Discipline"
              :event-short-name="eventInfo.EventShortName"
              :no-results="noResults"
              :position="result.Rank || null"
              :category-rounds-count="categoryRoundsFor(category).length"
              :comp-type="category[0].Category.CompType"
              :round-label="(round) => roundLabelFor(category, round)"
            />
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
import CompetitorResultCard from "./results/CompetitorResultCard.vue";

export default {
  name: "OnlineSearchResults",
  computed: {
    searchTerm() {
      return this.$route.query.searchTerm;
    },
    visibleCategorizedResults() {
      let remaining = this.visibleCompetitors;
      const limited = {};
      for (const catId of Object.keys(this.resultsData)) {
        if (remaining <= 0) break;
        const slice = this.resultsData[catId].slice(0, remaining);
        if (slice.length > 0) {
          limited[catId] = slice;
          remaining -= slice.length;
        }
      }
      return limited;
    },
  },
  data() {
    return {
      resultsData: {},
      noResults: false,
      eventInfo: {},
      visibleCompetitors: 15,
      loadingResults: true,
    };
  },
  components: {
    Loader,
    ResultsHeader,
    EventBanner,
    ResultsFooter,
    CompetitorResultCard,
  },
  created() {
    this.updateTitle();
    this.fetchEventInfo();
    this.fetchResults();
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        this.visibleCompetitors += 10;
      }
    },
    updateTitle() {
      document.title = this.searchTerm
        ? `${this.searchTerm} - Results`
        : "Search Results";
    },
    categoryRoundsFor(category) {
      const rounds = new Set();
      category.forEach((result) => {
        result.Exercises?.forEach((ex) => rounds.add(ex.RoundName));
      });
      return Array.from(rounds);
    },
    roundLabelFor(category, round) {
      const rounds = this.categoryRoundsFor(category);
      if (rounds.length === 1) return "";
      if (round[0] === "Q") {
        const qRounds = rounds.filter((r) => r[0] === "Q");
        return qRounds.length > 1
          ? "Qualification " + round[1]
          : "Qualification";
      }
      if (round[0] === "F") {
        const fRounds = rounds.filter((r) => r[0] === "F");
        return fRounds.length > 1 ? "Final " + round[1] : "Final";
      }
      return "";
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
    groupBy(array, field) {
      return array.reduce((result, currentValue) => {
        // Get the field value
        const key = currentValue[field];

        // If the key doesn't exist in the result object, create an array for it
        if (!result[key]) {
          result[key] = [];
        }

        // Push the current object into the appropriate group
        result[key].push(currentValue);

        return result;
      }, {}); // Initial value is an empty object
    },
    async fetchResults() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        `/api/searchResults?searchTerm=${encodeURIComponent(
          this.searchTerm || ""
        )}`;
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

        let resultsDataUngrouped = tempData.map((x) => {
          let fullName =
            x.Category.Discipline == "TRS"
              ? x.Surname1 + ", " + x.Surname2
              : x.FirstName1 + " " + x.Surname1;
          let fullNameReversed =
            x.Category.Discipline == "TRS"
              ? x.Surname2.toUpperCase() + ", " + x.Surname1.toUpperCase()
              : x.Surname1.toUpperCase() + " " + x.FirstName1;
          x.FullName = fullName;
          x.fullNameReversed = fullNameReversed;
          x.Rank =
            x.Category.CompType == 0
              ? x.DisplayZeroRank
              : x.DisplayCumulativeRank;
          //x.RunningOrderNumber = i + 1;
          return x;
        });
        resultsDataUngrouped.sort((a, b) => {
          // Sort by Category.No first
          let categoryComparison = a.Category.No - b.Category.No;
          if (categoryComparison !== 0) {
            return categoryComparison;
          }

          // If Category.No is the same, sort by Rank
          if (a.Rank === null && b.Rank === null) {
            return 0; // Both are null, they are considered equal
          }
          if (a.Rank === null) {
            return 1; // a should come after b
          }
          if (b.Rank === null) {
            return -1; // b should come after a
          }
          return a.Rank - b.Rank;
        });

        this.resultsData = this.groupBy(resultsDataUngrouped, "CatId");
        this.loadingResults = false;
      } catch (error) {
        console.error("Error fetching results:", error);
        this.loadingResults = false;
      }
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/results.style.css";

.custom-link {
  color: white;
  text-decoration: underline;
  display: inline-flex;
  align-items: center;
}

.custom-link .icon-small {
  margin-left: 5px;
  font-size: 0.6em; /* Adjust the size as needed */
  text-decoration: none;
}

.custom-link i {
  margin-left: 5px;
}

.custom-link:hover {
  text-decoration: underline;
  color: #00bfff;
}
</style>
