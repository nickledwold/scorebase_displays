<template>
  <div>
    <video id="myVideo" playsinline autoplay muted loop>
      <source src="../assets/Panel2025.webm" type="video/mp4" />
    </video>

    <transition-group name="slide">
      <div key="idle" class="overlay" v-show="!showLatestScore">
        <div class="panel-holding-empty">
          <img
            src="../assets/bglogoholding.png"
            width="1300"
            style="margin-top: 7%"
          />
        </div>
      </div>
      <div key="latestScore" class="overlay" v-show="showLatestScore">
        <div v-if="this.latestScore && this.latestExercise">
          <div class="panel-latestflag">
            <img
              v-if="this.latestScore.Nation"
              :src="getFlagImageSource(this.latestScore.Nation)"
              width="110"
            />
          </div>
          <div
            class="panel-latestnameclub"
            v-if="this.latestScore.Discipline === 'TRS'"
          >
            <table>
              <tr>
                <td class="panel-name1trs">{{ this.latestScore.Surname1 }}</td>
              </tr>
              <tr>
                <td class="panel-name2trs">{{ this.latestScore.Surname2 }}</td>
              </tr>
              <tr>
                <td class="panel-clubname">{{ this.latestScore.Club }}</td>
              </tr>
            </table>
          </div>
          <div class="panel-latestnameclub" v-else>
            <table>
              <tr>
                <td class="panel-name1">{{ this.latestScore.Surname1 }}</td>
              </tr>
              <tr>
                <td class="panel-name2">{{ this.latestScore.FirstName1 }}</td>
              </tr>
              <tr>
                <td class="panel-clubname">{{ this.latestScore.Club }}</td>
              </tr>
            </table>
          </div>
          <table class="panel-scoretable">
            <tr>
              <td colspan="7" class="panel-Exercise">
                <span class="panel-span2">{{
                  this.latestExercise.RoundName
                }}</span>
                | Exercise
                {{ this.latestExercise.Exercise }}
              </td>
            </tr>

            <tr>
              <template v-if="this.latestScore.Discipline === 'TRA'">
                <td class="panel-scoretable_header4">E</td>
                <td class="panel-scoretable_header4">H</td>
                <td class="panel-scoretable_header3">D</td>
                <td class="panel-scoretable_header4">T</td>
                <td class="panel-scoretable_headerpen">P</td>
              </template>
              <template v-if="this.latestScore.Discipline === 'TRS'">
                <td class="panel-scoretable_header">E</td>
                <td class="panel-scoretable_header">H</td>
                <td class="panel-scoretable_header">D</td>
                <td class="panel-scoretable_header">S</td>
                <td class="panel-scoretable_headerpen">P</td>
              </template>
              <template v-if="this.latestScore.Discipline === 'DMT'">
                <td class="panel-scoretable_header2">E</td>
                <td class="panel-scoretable_header2">D</td>
                <td class="panel-scoretable_headerpen2">P</td>
              </template>
              <template v-if="this.latestScore.Discipline === 'TUM'">
                <td class="panel-scoretable_header3">E</td>
                <td class="panel-scoretable_header3">D</td>
                <td class="panel-scoretable_headerpen3">P</td>
              </template>
              <td class="panel-scoretable_headerblank"></td>
              <td class="panel-scoretable_headertotal">Total</td>
              <td
                v-if="
                  this.latestScore.Discipline === 'DMT' ||
                  this.latestScore.Discipline === 'TUM'
                "
                class="panel-scoretable_headerblank"
              ></td>
            </tr>

            <tr>
              <td class="panel-scoretable_score">
                {{ formattedNumber(this.latestExercise.Execution, 2) }}
              </td>
              <td
                v-if="
                  this.latestScore.Discipline === 'TRA' ||
                  this.latestScore.Discipline === 'TRS'
                "
                class="panel-scoretable_score"
              >
                {{
                  formattedNumber(this.latestExercise.HorizontalDisplacement, 2)
                }}
              </td>
              <td class="panel-scoretable_score">
                {{
                  formattedNumber2(
                    this.latestExercise.Difficulty,
                    this.latestExercise.Bonus,
                    1
                  )
                }}
              </td>
              <td
                v-if="this.latestScore.Discipline == 'TRS'"
                class="panel-scoretable_score"
              >
                {{ formattedNumber(this.latestExercise.Synchronisation, 2) }}
              </td>
              <td
                v-if="this.latestScore.Discipline == 'TRA'"
                class="panel-scoretable_score"
              >
                {{ formattedNumber(this.latestExercise.TimeOfFlight, 2) }}
              </td>
              <td
                v-if="this.latestExercise.Penalty > 0"
                class="panel-scoretable_scorepen"
              >
                -{{ formattedNumber(this.latestExercise.Penalty, 1) }}
              </td>
              <td v-else class="panel-scoretable_scorepen">
                {{ formattedNumber(this.latestExercise.Penalty, 1) }}
              </td>
              <td class="panel-scoretable_scoreblank"></td>
              <td class="panel-scoretable_scoretotal">
                {{ formattedNumber(this.latestExercise.Total, 2) }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </transition-group>
    <transition name="slideleft" mode="out-in">
      <div
        :key="showLatestScore ? 'latestScore' : 'idle'"
        class="transition-container"
      >
        <div v-if="!showLatestScore" class="panel-holding-panel-title">
          Panel {{ panelNumber }}<span class="panel-span"> | </span>
        </div>
        <div v-if="!showLatestScore" class="panel-holding-time">
          {{ currentTime }}
        </div>
        <div v-if="showLatestScore" class="panel-ranktable">
          <table>
            <tr>
              <td class="panel-ranktable_header">Rank</td>
              <td
                v-if="latestCategory.CompType === 0 && latestScore.F1Total > 0"
                class="panel-ranktable_number"
              >
                {{ latestScore.DisplayZeroRank }}
              </td>
              <td v-else class="panel-ranktable_number">
                {{ latestScore.DisplayCumulativeRank }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// How long a score stays on screen before reverting to the idle overlay
const SCORE_DISPLAY_DURATION_MS = 5 * 60 * 1000;

export default {
  name: "PanelLatestScoreComponent",
  computed: {
    panelNumber() {
      return this.$route.params.panelNumber;
    },
  },
  data() {
    return {
      currentTime: "12:00",
      latestScore: {},
      categoryRoundExercise: {},
      latestExercise: {},
      latestCategory: {},
      showLatestScore: false,
      latestTimestamp: null,
      scoreShownUntil: 0,
      isFetchingScore: false,
      intervalId: null,
    };
  },
  created() {
    this.updateTime();
    this.fetchLatestScores();
    this.intervalId = setInterval(() => {
      this.updateTime();
      this.fetchLatestScores();
      if (this.showLatestScore && Date.now() >= this.scoreShownUntil) {
        this.showLatestScore = false;
      }
    }, 1000);
  },
  unmounted() {
    clearInterval(this.intervalId);
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
    async fetchCategoryRoundExercise(catId, currentExercise) {
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/categoryRoundExercises?catId=" +
          catId +
          "&exerciseNumber=" +
          currentExercise
      )
        .then((response) => response.json())
        .then((data) => {
          this.categoryRoundExercise = data[0];
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    async fetchCategory() {
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/categories?catId=" +
          this.latestScore.CatId
      )
        .then((response) => response.json())
        .then((data) => {
          this.latestCategory = data[0];
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    async fetchLatestScores() {
      if (this.isFetchingScore) return;
      this.isFetchingScore = true;
      try {
        const response = await fetch(
          "http://" +
            process.env.VUE_APP_API_IP_ADDRESS +
            ":" +
            process.env.VUE_APP_API_PORT +
            "/api/latestScore?panelNumber=" +
            this.panelNumber
        );
        const data = await response.json();
        const score = data[0];
        if (!score || !score.LastUpdatedTimestamp) return;

        const scoreTimestamp = new Date(score.LastUpdatedTimestamp);
        let shownUntil = null;
        if (this.latestTimestamp === null) {
          // First poll: only show the score if it was updated recently
          const scoreExpiry =
            scoreTimestamp.getTime() + SCORE_DISPLAY_DURATION_MS;
          if (scoreExpiry > Date.now()) {
            shownUntil = Math.min(
              scoreExpiry,
              Date.now() + SCORE_DISPLAY_DURATION_MS
            );
          }
        } else if (scoreTimestamp > this.latestTimestamp) {
          shownUntil = Date.now() + SCORE_DISPLAY_DURATION_MS;
        }
        this.latestTimestamp = scoreTimestamp;

        if (shownUntil === null) {
          // Keep rank etc. current for the score already on screen
          if (this.showLatestScore) this.latestScore = score;
          return;
        }

        this.latestScore = score;
        this.latestExercise = await this.getLatestExerciseFromLatestScore();
        await this.fetchCategory();
        this.scoreShownUntil = shownUntil;
        this.showLatestScore = true;
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.isFetchingScore = false;
      }
    },
    async getLatestExerciseFromLatestScore() {
      const exercises = [
        { exerciseNumber: 5, propertyPrefix: "Ex5" },
        { exerciseNumber: 4, propertyPrefix: "Ex4" },
        { exerciseNumber: 3, propertyPrefix: "Ex3" },
        { exerciseNumber: 2, propertyPrefix: "Ex2" },
        { exerciseNumber: 1, propertyPrefix: "Ex1" },
      ];

      let tempLatestExercise = {};

      for (const exercise of exercises) {
        if (!exercise) continue;
        const totalProperty = `${exercise.propertyPrefix}Total`;
        if (!this.isValueNullOrEmpty(this.latestScore[totalProperty])) {
          await this.fetchCategoryRoundExercise(
            this.latestScore.CatId,
            exercise.exerciseNumber
          );
          tempLatestExercise = {
            Exercise: exercise.exerciseNumber,
            RoundName: this.categoryRoundExercise.RoundName,
            Execution: this.latestScore[`${exercise.propertyPrefix}E`],
            Difficulty: this.latestScore[`${exercise.propertyPrefix}D`],
            Bonus: this.latestScore[`${exercise.propertyPrefix}B`],
            HorizontalDisplacement:
              this.latestScore[`${exercise.propertyPrefix}HD`],
            TimeOfFlight: this.latestScore[`${exercise.propertyPrefix}ToF`],
            Synchronisation: this.latestScore[`${exercise.propertyPrefix}S`],
            Penalty: this.latestScore[`${exercise.propertyPrefix}Pen`],
            Total: this.latestScore[totalProperty],
          };
          break;
        }
      }

      return tempLatestExercise;
    },
    getFlagImageSource(countryCode) {
      if (countryCode == undefined || countryCode == "") countryCode = "GBR";
      if (countryCode.includes("/")) {
        countryCode = countryCode.split("/")[0];
      }
      return require(`@/assets/${countryCode}.png`);
    },
    isValueNullOrEmpty(value) {
      return (value == null || value == "" || value == undefined) && value != 0;
    },
    formattedNumber(numberAsString, decimalPlaces) {
      let parsedNumber = parseFloat(numberAsString);
      parsedNumber = isNaN(parsedNumber) ? 0 : parsedNumber;
      return parsedNumber.toFixed(decimalPlaces);
    },
    formattedNumber2(firstNumberAsString, secondNumberAsString, decimalPlaces) {
      let parsedNumber = parseFloat(firstNumberAsString);
      let parsedNumber2 = parseFloat(secondNumberAsString);
      parsedNumber = isNaN(parsedNumber) ? 0 : parsedNumber;
      parsedNumber2 = isNaN(parsedNumber2) ? 0 : parsedNumber2;
      parsedNumber = parsedNumber + parsedNumber2;
      return parsedNumber.toFixed(decimalPlaces);
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/panel.style.css";
@import "../stylesheets/videostyle.style.css";

.slide-leave-active,
.slide-enter-active {
  transition: 0.5s;
}
.slide-enter-from {
  transform: translate(100%, 0);
}

.slide-leave-to {
  transform: translate(-100%, 0);
}

.slide-leave-from .slide-enter-to {
  transform: translate(-100%, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slideleft-enter-active,
.slideleft-leave-active {
  transition: 0.5s;
}

.slideleft-enter-from,
.slideleft-leave-to {
  transform: translateX(-100%);
}
.slideright-enter-active,
.slideright-leave-active {
  transition: 1s;
}

.slideright-enter-from,
.slideright-leave-to {
  transform: translateX(150%);
}

.flip-enter-active,
.flip-leave-active {
  transition: 0.5s;
}

.flip-enter-from,
.flip-leave-to {
  transform: rotateY(90deg);
}
</style>
