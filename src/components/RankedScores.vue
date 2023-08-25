<template>
  <div>
    <video id="myVideo" playsinline autoplay muted loop>
      <source src="../assets/rankvideo.mp4" type="video/mp4" />
    </video>
    <div id="displayrank" class="overlay">
      <div class="time">
        {{ currentTime }}
      </div>
      <div class="logos">
        <img src="../assets/bg.png" height="50" />
      </div>

      <transition-group name="fade">
        <div v-if="categories.length == 0" class="splash"></div>
        <div v-else>
          <table class="banner">
            <tr>
              <td class="comp-group-icon">
                <transition name="fade" mode="out-in">
                  <img
                    :src="disciplineImageSource"
                    :key="disciplineTransitionKey"
                    width="150"
                  />
                </transition>
              </td>
              <transition name="slideup" mode="out-in">
                <td class="comp-group" :key="categoryTransitionKey">
                  {{ this.currentCategory.Category }}
                </td>
              </transition>
            </tr>
          </table>
          <div class="round">
            <transition name="slideup" mode="out-in">
              <td :key="roundTransitionKey">{{ currentRound }}</td>
            </transition>
          </div>
          <transition name="slideright" mode="out-in">
            <table class="scores-table" :key="tableTransitionKey">
              <tr class="header-row">
                <th
                  style="
                    text-align: center;
                    font-family: Gotham Book, sans-serif;
                    padding-left: 10;
                  "
                >
                  Rank
                </th>
                <th
                  style="
                    text-align: left;
                    font-family: Gotham Book, sans-serif;
                    padding-left: 15;
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
                      ? this.latestRound + " Total"
                      : this.latestRound
                  }}
                </th>
              </tr>
              <template
                v-for="competitor in this.competitors"
                :key="competitor"
              >
                <transition-group name="list" tag="tbody" mode="out-in">
                  <tr class="scores-row" :key="competitor">
                    <td rowspan="2" class="scores-pos-0">
                      {{
                        isValueNullOrEmpty(competitor.ZeroRank)
                          ? "-"
                          : this.currentCategory.CompType == 0
                          ? competitor.DisplayZeroRank
                          : competitor.DisplayCumulativeRank
                      }}
                    </td>
                    <td rowspan="2" class="scores-flag">
                      <img
                        :src="getFlagImageSource(competitor.Nation)"
                        width="40"
                      />
                    </td>
                    <td
                      v-if="currentCategory.Discipline == 'TRS'"
                      class="scores-name"
                    >
                      {{ competitor.Surname1.toUpperCase() }},
                      {{ competitor.Surname2.toUpperCase() }}
                    </td>
                    <td v-else class="scores-name">
                      {{ competitor.Surname1.toUpperCase() }}
                      {{ competitor.FirstName1 }}
                    </td>
                    <template
                      v-for="exercise in this.roundExercises"
                      :key="exercise.ExerciseNumber"
                    >
                      <td
                        v-if="this.exercisesInLatestRound > 1"
                        class="scores-tri-set-Tot"
                        rowspan="2"
                      >
                        <b>{{
                          isValueNullOrEmpty(competitor.Exercises) ||
                          competitor.Exercises.length < exercise.ExerciseNumber
                            ? "-"
                            : formattedNumber(
                                competitor.Exercises[
                                  exercise.ExerciseNumber - 1
                                ].Total,
                                2
                              )
                        }}</b>
                      </td>
                    </template>
                    <td
                      v-show="!noScores"
                      class="scores-tri-fin-Totb"
                      rowspan="2"
                    >
                      <b>{{
                        isValueNullOrEmpty(competitor.Exercises)
                          ? "-"
                          : formattedNumber(
                              competitor.Exercises[0].TotalScore,
                              2
                            )
                      }}</b>
                    </td>
                  </tr>

                  <tr class="scores-row">
                    <td class="scores-club">{{ competitor.DisplayClub }}</td>
                  </tr>

                  <tr class="space-row"></tr>
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
    updateTime() {
      var currentDate = new Date();
      var hours = currentDate.getHours().toString().padStart(2, "0");
      var minutes = currentDate.getMinutes().toString().padStart(2, "0");
      var currentTime = hours + ":" + minutes;
      this.currentTime = currentTime;
    },
    async fetchDisplayCategories() {
      await fetch("http://localhost:3000/api/displayCategories")
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
      if (this.isValueNullOrEmpty(this.latestRound) && this.rounds.length > 0) {
        if (this.exerciseNumbers.length > 0) {
          this.latestRound = this.exerciseNumbers.slice(-1)[0].RoundName;
        } else {
          this.latestRound = this.rounds[0].RoundName;
        }
      }
      this.exercisesInLatestRound = this.rounds.filter(
        (item) => item.RoundName == this.latestRound
      )[0].NumberOfExercises;

      let tempRound = this.latestRound;
      if (this.latestRound.charAt(0).toUpperCase() == "Q") {
        if (this.countRoundsStartingWithLetter("Q") == 1) {
          tempRound = tempRound.slice(0, -1);
        }
        this.currentRound = tempRound.replace("Q", "Qualification ");
      }
      if (this.latestRound.charAt(0).toUpperCase() == "F") {
        if (this.countRoundsStartingWithLetter("F") == 1) {
          tempRound = tempRound.slice(0, -1);
        }
        this.currentRound = tempRound.replace("F", "Final ");
      }
      this.getExercisesForLatestRound();
      await this.fetchCompetitors();
      if (this.competitorsWithRanks.length == 0) {
        await this.fetchQualifyingStartList();
        this.noScores = true;
      } else {
        await this.populateCompetitorExercises();
        if (!this.compareArrays(this.competitors, this.competitorsWithRanks)) {
          this.competitors = this.competitorsWithRanks;
        }
        this.noScores = false;
      }
    },
    async fetchExerciseNumbers() {
      await fetch(
        "http://localhost:3000/api/exerciseNumbers?catId=" +
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
      this.latestRound =
        this.exerciseNumbers[this.exerciseNumbers.length - 1].RoundName;
    },
    async fetchCompetitorExercises(competitorId) {
      let tempData;
      await fetch(
        "http://localhost:3000/api/competitorRoundTotal?competitorId=" +
          competitorId
      )
        .then((response) => response.json())
        .then((data) => {
          tempData = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      tempData = tempData.filter((item) => item.RoundName == this.latestRound);
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
        "http://localhost:3000/api/competitorRanks?catId=" +
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
    async fetchQualifyingStartList() {
      await fetch(
        "http://localhost:3000/api/qualifyingStartList?catId=" +
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
    async fetchRounds() {
      await fetch(
        "http://localhost:3000/api/rounds?catId=" + this.currentCategory.CatId
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
        (item) => item.RoundName == this.latestRound
      );
      if (!this.compareArrays(newArray, this.roundExercises))
        this.roundExercises = newArray;
    },
    getFlagImageSource(countryCode) {
      if (countryCode == undefined) countryCode = "GBR";
      return require(`@/assets/${countryCode}.png`);
    },
    formattedNumber(numberAsString, decimalPlaces) {
      const parsedNumber = parseFloat(numberAsString);
      return parsedNumber.toFixed(decimalPlaces);
    },
    compareArrays(array1, array2) {
      return JSON.stringify(array1) == JSON.stringify(array2);
    },
  },
};
</script>

<style>
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
