<template>
  <div>
    <video id="myVideo" playsinline autoplay muted loop>
      <source src="../assets/panelvideo.mp4" type="video/mp4" />
    </video>
    <transition-group name="slide">
      <div key="panelStatus" class="overlay" v-show="!showLatestScore">
        <div class="holding-panel">Panel {{ panelNumber }}</div>
        <div class="holding-time">{{ currentTime }}</div>
        <transition-group name="fade">
          <div
            v-if="
              this.panelStatus &&
              !isValueNullOrEmpty(this.panelStatus.NextToCompeteCategory)
            "
          >
            <transition-group name="fade">
              <div v-if="this.panelStatus.Status === 0" class="holding-next">
                UP NEXT
              </div>
              <div v-if="this.panelStatus.Status === 1" class="holding-on">
                ON NOW
              </div>
            </transition-group>
            <div class="namebg1">
              <transition name="slide" mode="out-in">
                <div
                  v-if="this.panelStatus.NextToCompeteDiscipline === 'TRS'"
                  :key="syncNameTransitionKey"
                >
                  <div class="holding-name1trs">
                    {{ this.panelStatus.NextToCompeteSurname1 }}
                  </div>
                  <div class="holding-name2trs">
                    {{ this.panelStatus.NextToCompeteSurname2 }}
                  </div>
                </div>
                <div v-else :key="nameTransitionKey">
                  <div class="holding-surname">
                    {{ this.panelStatus.NextToCompeteSurname1 }}
                  </div>
                  <div class="holding-forename">
                    {{ this.panelStatus.NextToCompeteFirstName1 }}
                  </div>
                </div>
              </transition>
              <transition name="slide" mode="out-in">
                <div class="holding-club" :key="clubTransitionKey">
                  {{ this.panelStatus.NextToCompeteClub }}
                </div>
              </transition>
            </div>
            <transition name="slide" mode="out-in">
              <div
                v-if="this.panelStatus.NextToCompeteNation != undefined"
                class="holding-flag"
                :key="nationTransitionKey"
              >
                <img
                  :src="getImageSource(this.panelStatus.NextToCompeteNation)"
                  width="70"
                />
              </div>
            </transition>
            <div class="catbg1">
              <transition name="slide" mode="out-in">
                <div class="holding-category" :key="categoryTransitionKey">
                  {{ this.panelStatus.NextToCompeteCategory }}
                </div>
              </transition>
            </div>
            <div class="statuslabel">Status</div>
            <transition-group name="fade">
              <div
                v-if="this.panelStatus.Status === 0"
                class="holding-statuswait"
              >
                WAIT
              </div>
              <div
                v-if="this.panelStatus.Status === 1"
                class="holding-statusgo"
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
            <div class="splash"></div>
          </div>
        </transition-group>
      </div>
      <div key="latestScore" class="overlay" v-show="showLatestScore">
        <div v-if="this.latestScore && this.latestExercise">
          <div class="latestnameclub">
            <table>
              <tr>
                <td class="name1" colspan="2">
                  {{ this.latestScore.FirstName1 }}
                </td>
              </tr>
              <tr>
                <td class="name2" colspan="2">
                  {{ this.latestScore.Surname1 }}
                </td>
              </tr>
              <tr>
                <td class="latestflag">
                  <img
                    :src="getImageSource(this.latestScore.Nation)"
                    width="60"
                  />
                </td>
                <td class="clubname">{{ this.latestScore.Club }}</td>
              </tr>
            </table>
          </div>
          <table class="scoretable">
            <tr
              v-if="
                this.latestScore.Discipline === 'DMT' ||
                this.latestScore.Discipline === 'TUM'
              "
            >
              <td class="scoretable_headerblank"></td>
              <td class="scoretable_scoreblank"></td>
            </tr>
            <tr>
              <td colspan="2" class="Exercise">
                {{ this.latestExercise.RoundName }} | Exercise
                {{ this.latestExercise.Exercise }}
              </td>
            </tr>
            <tr>
              <td class="scoretable_header">E</td>
              <td class="scoretable_score">
                {{ formattedNumber(this.latestExercise.Execution, 2) }}
              </td>
            </tr>
            <tr
              v-if="
                this.latestScore.Discipline === 'TRA' ||
                this.latestScore.Discipline === 'TRS'
              "
            >
              <td class="scoretable_header">H</td>
              <td class="scoretable_score">
                {{
                  formattedNumber(this.latestExercise.HorizontalDisplacement, 2)
                }}
              </td>
            </tr>
            <tr>
              <td class="scoretable_header">D</td>
              <td class="scoretable_score">
                {{ formattedNumber(this.latestExercise.Difficulty, 1) }}
              </td>
            </tr>
            <tr v-if="this.latestScore.Discipline === 'TRS'">
              <td class="scoretable_header">S</td>
              <td class="scoretable_score">
                {{ formattedNumber(this.latestExercise.Synchronisation, 2) }}
              </td>
            </tr>
            <tr v-else-if="this.latestScore.Discipline === 'TRA'">
              <td class="scoretable_header">T</td>
              <td class="scoretable_score">
                {{ formattedNumber(this.latestExercise.TimeOfFlight, 2) }}
              </td>
            </tr>
            <tr>
              <td class="scoretable_headerpen">P</td>
              <td
                v-if="this.latestExercise.Penalty > 0"
                class="scoretable_scorepen"
              >
                -{{ formattedNumber(this.latestExercise.Penalty, 1) }}
              </td>
              <td v-else class="scoretable_scorepen">
                {{ formattedNumber(this.latestExercise.Penalty, 1) }}
              </td>
            </tr>
            <tr
              v-if="
                this.latestScore.Discipline === 'DMT' ||
                this.latestScore.Discipline === 'TUM'
              "
            >
              <td class="scoretable_headerblank"></td>
              <td class="scoretable_scoreblank"></td>
            </tr>
          </table>
          <table class="scoretabletotal">
            <tr>
              <td class="scoretabletotal_header">Exercise Total</td>
            </tr>
            <tr>
              <td class="scoretabletotal_score">
                {{ formattedNumber(this.latestExercise.Total, 2) }}
              </td>
            </tr>
          </table>
          <table class="ranktable">
            <tr>
              <td class="ranktable_header">Rank</td>
              <td class="ranktable_number">
                {{ this.latestScore.DisplayCumulativeRank }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </transition-group>
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
      return this.panelStatus.NextToCompeteSurname1 || "no-name";
    },
    nameTransitionKey() {
      return this.panelStatus.NextToCompeteFirstName1 || "no-name";
    },
    nationTransitionKey() {
      return this.panelStatus.NextToCompeteNation || "no-nation";
    },
  },
  data() {
    return {
      currentTime: "12:00",
      panelStatus: {},
      latestScore: {},
      categoryRoundExercise: {},
      latestExercise: {},
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
    updateTime() {
      var currentDate = new Date();
      var hours = currentDate.getHours().toString().padStart(2, "0");
      var minutes = currentDate.getMinutes().toString().padStart(2, "0");
      var currentTime = hours + ":" + minutes;
      this.currentTime = currentTime;
    },
    fetchPanelStatus() {
      fetch(
        "http://localhost:3000/api/panelStatus?panelNumber=" + this.panelNumber
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
        "http://localhost:3000/api/categoryRoundExercises?catId=" +
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
    async fetchLatestScores() {
      await fetch(
        "http://localhost:3000/api/latestScore?panelNumber=" + this.panelNumber
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
            console.log(this.latestScore);
            console.log(this.latestExercise);
            this.showLatestScore = true;
            setTimeout(() => (this.showLatestScore = false), 4000);
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
    getImageSource(countryCode) {
      if (countryCode === undefined) countryCode = "GBR";
      return require(`@/assets/${countryCode}.png`);
    },
    isValueNullOrEmpty(value) {
      return value === null || value === "";
    },
    formattedNumber(numberAsString, decimalPlaces) {
      const parsedNumber = parseFloat(numberAsString);
      return parsedNumber.toFixed(decimalPlaces);
    },
  },
};
</script>

<style>
@import "../stylesheets/panel.style.css";
@import "../stylesheets/videostyle.style.css";

.slide-leave-active,
.slide-enter-active {
  transition: 1s;
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
</style>
