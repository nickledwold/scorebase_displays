<template>
  <div>
    <video id="myVideo" playsinline autoplay muted loop>
      <source src="../assets/panelvideo.mp4" type="video/mp4" />
    </video>

    <transition-group name="slide">
      <div key="panelStatus" class="overlay" v-show="!showLatestScore">
        <transition-group name="fade">
          <div
            v-if="
              this.panelStatus &&
              !isValueNullOrEmpty(this.panelStatus.NextToCompeteCategory)
            "
          >
            <transition-group name="fade">
              <div
                v-if="this.panelStatus.Status === 0"
                class="panel-holding-next"
              >
                UP NEXT
              </div>
              <div
                v-if="this.panelStatus.Status === 1"
                class="panel-holding-on"
              >
                ON NOW
              </div>
            </transition-group>
            <div class="panel-namebg1">
              <transition name="slideleft" mode="out-in">
                <div
                  v-if="this.panelStatus.NextToCompeteDiscipline === 'TRS'"
                  :key="syncNameTransitionKey"
                >
                  <div class="panel-holding-name1trs">
                    {{ this.panelStatus.NextToCompeteSurname1 }}
                  </div>
                  <div class="panel-holding-name2trs">
                    {{ this.panelStatus.NextToCompeteSurname2 }}
                  </div>
                </div>
                <div v-else :key="nameTransitionKey">
                  <div class="panel-holding-surname">
                    {{ this.panelStatus.NextToCompeteSurname1 }}
                  </div>
                  <div class="panel-holding-forename">
                    {{ this.panelStatus.NextToCompeteFirstName1 }}
                  </div>
                </div>
              </transition>
              <transition name="slideleft" mode="out-in">
                <div class="panel-holding-club" :key="clubTransitionKey">
                  {{ this.panelStatus.NextToCompeteClub }}
                </div>
              </transition>
            </div>
            <transition name="flip" mode="out-in">
              <div
                v-if="this.panelStatus.NextToCompeteNation != undefined"
                class="panel-holding-flag"
                :key="competitorTransitionKey"
              >
                <img
                  v-if="this.panelStatus.NextToCompeteNation"
                  :src="
                    getFlagImageSource(this.panelStatus.NextToCompeteNation)
                  "
                  width="90"
                />
              </div>
            </transition>
            <div class="panel-catbg1">
              <transition name="slide" mode="out-in">
                <div
                  class="panel-holding-category"
                  :key="categoryTransitionKey"
                >
                  <img
                    v-if="this.panelStatus.NextToCompeteDiscipline"
                    :src="
                      getImageSource(this.panelStatus.NextToCompeteDiscipline)
                    "
                    height="120"
                    style="
                      padding-right: 10px;
                      padding-bottom: 10px;
                      vertical-align: middle;
                    "
                  />
                  {{ this.panelStatus.NextToCompeteCategory }}
                </div>
              </transition>
            </div>
            <div class="panel-statuslabel">Status</div>
            <transition-group name="fade">
              <div
                v-if="this.panelStatus.Status === 0"
                class="panel-holding-statuswait"
              >
                WAIT
              </div>
              <div
                v-if="this.panelStatus.Status === 1"
                class="panel-holding-statusgo"
              >
                GO
              </div>
            </transition-group>
          </div>
          <div
            v-else-if="
              this.panelStatus.NextToCompeteCategory === null ||
              this.panelStatus.NextToCompeteCategory === ''
            "
          >
            <div class="panel-holding-empty">
              <img
                src="../assets/bglogoholding.png"
                width="1300"
                style="margin-top: 4%"
              />
            </div>
          </div>
        </transition-group>
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
              <td
                v-if="
                  this.latestScore.Discipline === 'TUM' ||
                  this.latestScore.Discipline === 'TRA'
                "
                class="panel-scoretable_score2"
              >
                {{ formattedNumber(this.latestExercise.Difficulty, 1)
                }}<span class="panel-span3">
                  {{
                    "   (+" +
                    formattedNumber(this.latestExercise.Bonus, 1) +
                    ")"
                  }}</span
                >
              </td>
              <td v-else class="panel-scoretable_score">
                {{ formattedNumber(this.latestExercise.Difficulty, 1) }}
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
        :key="showLatestScore ? 'latestScore' : 'panelStatus'"
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
export default {
  name: "PanelComponent",
  computed: {
    panelNumber() {
      return this.$route.params.panelNumber;
    },
    clubTransitionKey() {
      return this.panelStatus.NextToCompeteClub || "no-club";
    },
    categoryTransitionKey() {
      return this.panelStatus.NextToCompeteCategory || "no-category";
    },
    syncNameTransitionKey() {
      return (
        this.panelStatus.NextToCompeteSurname1 +
          this.panelStatus.NextToCompeteSurname2 || "no-name"
      );
    },
    nameTransitionKey() {
      return (
        this.panelStatus.NextToCompeteFirstName1 +
          this.panelStatus.NextToCompeteSurname1 || "no-name"
      );
    },
    nationTransitionKey() {
      return this.panelStatus.NextToCompeteNation || "no-nation";
    },
    competitorTransitionKey() {
      return (
        this.panelStatus.NextToCompeteFirstName1 +
          this.panelStatus.NextToCompeteFirstName2 +
          this.panelStatus.NextToCompeteSurname1 +
          this.panelStatus.NextToCompeteSurname2 +
          this.panelStatus.NextToCompeteClub || "no-competitor"
      );
    },
  },
  data() {
    return {
      currentTime: "12:00",
      panelStatus: {},
      latestScore: {},
      categoryRoundExercise: {},
      latestExercise: {},
      latestCategory: {},
      showLatestScore: false,
      latestTimestamp: new Date(),
    };
  },
  created() {
    this.updateTime();
    this.fetchPanelStatus();
    this.fetchLatestScores();
    setInterval(() => {
      this.updateTime();
      this.fetchPanelStatus();
      this.fetchLatestScores();
    }, 1000);
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
    fetchPanelStatus() {
      fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/panelStatus?panelNumber=" +
          this.panelNumber
      )
        .then((response) => response.json())
        .then((data) => {
          this.panelStatus = data[0];
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
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/latestScore?panelNumber=" +
          this.panelNumber
      )
        .then((response) => response.json())
        .then(async (data) => {
          this.latestScore = data[0];
          const latestScoreTimestamp = new Date(
            this.latestScore.LastUpdatedTimestamp
          );
          const lastRecordedTimestamp = new Date(this.latestTimestamp);
          if (
            this.latestTimestamp === null ||
            latestScoreTimestamp > lastRecordedTimestamp
          ) {
            this.latestTimestamp = this.latestScore.LastUpdatedTimestamp;
            this.latestExercise = await this.getLatestExerciseFromLatestScore();
            await this.fetchCategory();
            this.showLatestScore = true;
            setTimeout(() => (this.showLatestScore = false), 9000);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
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
      if (countryCode === undefined) countryCode = "GBR";
      return require(`@/assets/${countryCode}.png`);
    },
    getImageSource(discipline) {
      if (discipline == undefined) discipline = "TRA";
      return require(`@/assets/${discipline}.png`);
    },
    isValueNullOrEmpty(value) {
      return (value == null || value == "" || value == undefined) && value != 0;
    },
    formattedNumber(numberAsString, decimalPlaces) {
      let parsedNumber = parseFloat(numberAsString);
      parsedNumber = isNaN(parsedNumber) ? 0 : parsedNumber;
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
