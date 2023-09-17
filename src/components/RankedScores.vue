<template>
  <div>
    <video id="myVideo" playsinline autoplay muted loop>
      <source src="../assets/rankvideo.mp4" type="video/mp4" />
    </video>
    <div id="displayrank" class="overlay">
      <div class="ranked-time">
        {{ currentTime }}
      </div>
      <div class="ranked-logos">
        <img src="../assets/bg.png" height="50" />
      </div>

      <transition-group name="fade">
        <div v-if="categories.length == 0" class="ranked-splash"></div>
        <div v-else>
          <table class="ranked-banner">
            <tr>
              <td class="ranked-comp-group-icon">
                <transition name="fade" mode="out-in">
                  <img
                    :src="disciplineImageSource"
                    :key="disciplineTransitionKey"
                    width="150"
                  />
                </transition>
              </td>
              <transition name="slideup" mode="out-in">
                <td class="ranked-comp-group" :key="categoryTransitionKey">
                  {{ this.currentCategory.Category }}
                </td>
              </transition>
            </tr>
          </table>
          <div class="ranked-round">
            <transition name="slideup" mode="out-in">
              <td :key="roundTransitionKey">{{ currentRound }}</td>
            </transition>
          </div>
          <transition name="slideright" mode="out-in">
            <table class="ranked-scores-table" :key="tableTransitionKey">
              <tr class="ranked-header-row">
                <th
                  style="
                    text-align: center;
                    font-family: Gotham Book, sans-serif;
                    padding-left: 10px;
                    width: 120px;
                    max-width: 120px;
                  "
                >
                  Rank
                </th>
                <th
                  style="
                    text-align: left;
                    font-family: Gotham Book, sans-serif;
                    padding-left: 15px;
                  "
                  colspan="2"
                >
                  {{
                    this.currentCategory.Discipline == "TRS"
                      ? "Competitors"
                      : "Competitor"
                  }}
                </th>
                <template
                  v-for="exercise in this.roundExercises"
                  :key="exercise.ExerciseNumber"
                >
                  <th
                    v-if="this.exercisesInLatestRound > 1"
                    style="
                      text-align: center;
                      font-family: Gotham Book, sans-serif;
                    "
                  >
                    Exercise {{ exercise.ExerciseNumber }}
                  </th>
                </template>
                <th
                  v-show="!noScores"
                  style="
                    text-align: center;
                    font-family: Gotham Book, sans-serif;
                  "
                >
                  {{
                    this.currentCategory.CompType == 1
                      ? "Total"
                      : this.exercisesInLatestRound > 1
                      ? this.rankedRound + " Total"
                      : this.rankedRound
                  }}
                </th>
              </tr>
              <template
                v-for="competitor in this.competitors"
                :key="competitor"
              >
                <transition-group name="list" tag="tbody" mode="out-in">
                  <tr class="ranked-scores-row" :key="competitor">
                    <td rowspan="2" class="ranked-scores-pos-0">
                      {{
                        isValueNullOrEmpty(competitor.ZeroRank)
                          ? "-"
                          : this.currentCategory.CompType == 0
                          ? competitor.DisplayZeroRank
                          : competitor.DisplayCumulativeRank
                      }}
                    </td>
                    <td rowspan="2" class="ranked-scores-flag">
                      <img
                        :src="getFlagImageSource(competitor.Nation)"
                        width="40"
                      />
                    </td>
                    <td
                      v-if="currentCategory.Discipline == 'TRS'"
                      class="ranked-scores-name"
                    >
                      {{ competitor.Surname1.toUpperCase() }},
                      {{ competitor.Surname2.toUpperCase() }}
                    </td>
                    <td v-else class="ranked-scores-name">
                      {{ competitor.Surname1.toUpperCase() }}
                      {{ competitor.FirstName1 }}
                    </td>
                    <template
                      v-for="exercise in this.roundExercises"
                      :key="exercise.ExerciseNumber"
                    >
                      <td
                        v-if="this.exercisesInLatestRound > 1"
                        class="ranked-scores-tri-set-Tot"
                        rowspan="2"
                      >
                        <b>{{
                          isValueNullOrEmpty(competitor.Exercises) ||
                          competitor.Exercises.find(
                            (item) =>
                              item.ExerciseNumber == exercise.ExerciseNumber
                          ) == undefined
                            ? "-"
                            : formattedNumber(
                                competitor.Exercises.find(
                                  (item) =>
                                    item.ExerciseNumber ==
                                    exercise.ExerciseNumber
                                ).Total,
                                2
                              )
                        }}</b>
                      </td>
                    </template>
                    <td
                      v-show="!noScores"
                      class="ranked-scores-tri-fin-Totb"
                      rowspan="2"
                    >
                      <b>{{
                        isValueNullOrEmpty(competitor.Exercises)
                          ? "-"
                          : competitor.CompType == 1 &&
                            this.currentRound[0] == "F"
                          ? formattedNumber(
                              competitor.Exercises[0].TotalScore,
                              2
                            )
                          : formattedNumber(
                              competitor.Exercises[0].RoundTotal,
                              2
                            )
                      }}</b>
                    </td>
                  </tr>

                  <tr class="ranked-scores-row">
                    <td class="ranked-scores-club">
                      {{ competitor.DisplayClub }}
                    </td>
                  </tr>

                  <tr class="ranked-space-row"></tr>
                </transition-group>
              </template>
            </table>
          </transition>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  name: "RankedScoresComponent",
  computed: {
    disciplineImageSource() {
      return this.getImageSource(this.currentCategory.Discipline);
    },
    categoryTransitionKey() {
      return this.currentCategory.Category || "no-category";
    },
    disciplineTransitionKey() {
      return this.currentCategory.Discipline || "no-discipline";
    },
    roundTransitionKey() {
      return this.currentRound || "no-round";
    },
    tableTransitionKey() {
      return (
        this.currentCategory.Category + this.currentCategory.Discipline ||
        "no-table-definition"
      );
    },
  },
  data() {
    return {
      currentTime: "12:00",
      categories: [],
      categoryIndex: 0,
      currentCategory: {
        Discipline: undefined,
      },
      currentRound: "",
      rounds: [],
      latestRound: "",
      exercisesInLatestRound: 0,
      roundExercises: [],
      competitorsWithRanks: [],
      competitors: [],
      maxTimeInterval: 4,
      currentTimeInterval: 0,
      exerciseNumbers: {},
      noScores: true,
    };
  },
  created() {
    this.updateTime();

    setInterval(() => {
      this.updateTime();
      if (this.currentTimeInterval >= this.maxTimeInterval) {
        this.currentTimeInterval = 0;
        this.categoryIndex++;
      } else {
        this.currentTimeInterval++;
      }
      this.fetchDisplayCategories();
    }, 2000);
  },
  methods: {
    async updateTime() {
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/serverClock"
      )
        .then((response) => response.json())
        .then((data) => {
          this.currentTime = data.time;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    async fetchDisplayCategories() {
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/displayCategories"
      )
        .then((response) => response.json())
        .then((data) => {
          this.categories = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      if (this.categories.length == 0) return;
      if (this.categoryIndex >= this.categories.length) {
        this.categoryIndex = 0;
      }
      this.currentCategory = this.categories[this.categoryIndex];
      await this.fetchExerciseNumbers();
      await this.fetchRounds();
      if (this.rounds.length > 0) {
        if (this.exerciseNumbers.length > 0) {
          this.rankedRound = this.exerciseNumbers.slice(-1)[0].RoundName;
        } else {
          this.rankedRound = this.rounds[0].RoundName;
        }
      }
      this.exercisesInLatestRound = this.rounds.filter(
        (item) => item.RoundName == this.rankedRound
      )[0].NumberOfExercises;

      let tempRound = this.rankedRound;
      if (this.rankedRound.charAt(0).toUpperCase() == "Q") {
        if (this.countRoundsStartingWithLetter("Q") == 1) {
          tempRound = tempRound.slice(0, -1);
        }
        this.currentRound = tempRound.replace("Q", "Qualification ");
      }
      if (this.rankedRound.charAt(0).toUpperCase() == "F") {
        if (this.countRoundsStartingWithLetter("F") == 1) {
          tempRound = tempRound.slice(0, -1);
        }
        this.currentRound = tempRound.replace("F", "Final ");
      }
      this.getExercisesForLatestRound();
      await this.fetchCompetitors();
      if (this.competitorsWithRanks.length == 0) {
        await this.fetchQualifyingFirstEight();
        this.noScores = true;
      } else {
        await this.populateCompetitorExercises();
        let competitorIdsForRound = await this.fetchStartListForRound();
        this.competitorsWithRanks = this.competitorsWithRanks.filter(
          (competitorWithRank) => {
            return competitorIdsForRound.some(
              (competitorInStartList) =>
                competitorInStartList.CompetitorId ===
                competitorWithRank.CompetitorId
            );
          }
        );
        if (!this.compareArrays(this.competitors, this.competitorsWithRanks)) {
          this.competitors = this.competitorsWithRanks;
        }
        this.noScores = false;
      }
    },
    async fetchExerciseNumbers() {
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/exerciseNumbers?catId=" +
          this.currentCategory.CatId
      )
        .then((response) => response.json())
        .then((data) => {
          this.exerciseNumbers = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      if (this.exerciseNumbers.length == 0) return;
      this.rankedRound =
        this.exerciseNumbers[this.exerciseNumbers.length - 1].RoundName;
    },
    async fetchCompetitorExercises(competitorId) {
      let tempData;
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/competitorRoundTotal?competitorId=" +
          competitorId
      )
        .then((response) => response.json())
        .then((data) => {
          tempData = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      tempData = tempData.filter((item) => item.RoundName == this.rankedRound);
      return tempData;
    },
    async populateCompetitorExercises() {
      for (const competitor of this.competitorsWithRanks) {
        const exercises = await this.fetchCompetitorExercises(
          competitor.CompetitorId
        );
        competitor.Exercises = exercises;
      }
    },
    async fetchCompetitors() {
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/competitorRanks?catId=" +
          this.currentCategory.CatId +
          "&compType=" +
          this.currentCategory.CompType
      )
        .then((response) => response.json())
        .then((data) => {
          this.competitorsWithRanks = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    async fetchQualifyingFirstEight() {
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/qualifyingStartList?catId=" +
          this.currentCategory.CatId
      )
        .then((response) => response.json())
        .then((data) => {
          this.competitors = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    async fetchStartListForRound() {
      let tempData;
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/roundStartList?catId=" +
          this.currentCategory.CatId +
          "&roundName=" +
          this.rankedRound
      )
        .then((response) => response.json())
        .then((data) => {
          tempData = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      return tempData;
    },
    async fetchRounds() {
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/rounds?catId=" +
          this.currentCategory.CatId
      )
        .then((response) => response.json())
        .then((data) => {
          this.rounds = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    getImageSource(discipline) {
      if (discipline == undefined) discipline = "TRA";
      return require(`@/assets/${discipline}.png`);
    },
    isValueNullOrEmpty(value) {
      return value == null || value == "" || value == undefined;
    },
    countRoundsStartingWithLetter(letter) {
      let count = 0;
      if (this.rounds == undefined) return count;
      for (let i = 0; i < this.rounds.length; i++) {
        if (
          this.rounds[i].RoundName.charAt(0).toUpperCase() ==
          letter.toUpperCase()
        ) {
          count++;
        }
      }
      return count;
    },
    getExercisesForLatestRound() {
      if (this.exerciseNumbers == undefined) return [];
      let newArray = this.exerciseNumbers.filter(
        (item) => item.RoundName == this.rankedRound
      );
      if (!this.compareArrays(newArray, this.roundExercises))
        this.roundExercises = newArray;
    },
    getFlagImageSource(countryCode) {
      if (countryCode == undefined) countryCode = "GBR";
      return require(`@/assets/${countryCode}.png`);
    },
    formattedNumber(numberAsString, decimalPlaces) {
      let parsedNumber = parseFloat(numberAsString);
      parsedNumber = isNaN(parsedNumber) ? 0 : parsedNumber;
      return parsedNumber.toFixed(decimalPlaces);
    },
    compareArrays(array1, array2) {
      return JSON.stringify(array1) == JSON.stringify(array2);
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/displayrank.style.css";
@import "../stylesheets/videostyle.style.css";

.slideup-leave-active,
.slideup-enter-active,
.slideright-leave-active,
.slideright-enter-active {
  transition: 0.5s;
}
.slideup-enter-from {
  transform: translateY(5%);
  opacity: 0;
}

.slideup-leave-to {
  transform: translateY(-5%);
  opacity: 0;
}

.slideup-leave-from .slideup-enter-to {
  transform: translateY(-5%);
}

.slideright-enter-from {
  transform: translate(100%, 0);
}

.slideright-leave-to {
  transform: translate(-100%, 0);
}

.slideright-leave-from .slideright-enter-to {
  transform: translate(-100%, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
