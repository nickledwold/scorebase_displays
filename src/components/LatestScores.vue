<template>
  <div>
    <video id="myVideo" playsinline autoplay muted loop>
      <source src="../assets/latestvideo.mp4" type="video/mp4" />
    </video>
    <div id="displayrank" class="overlay">
      <div class="latest-time">| {{ currentTime }}</div>
      <div class="latest-logos">
        <img src="../assets/bg.png" height="60" />
      </div>

      <template
        v-for="panelStatus in this.panelStatuses"
        :key="panelStatus.PanelNo"
      >
        <div
          v-if="
            panelStatus.latestExercise && panelStatus.latestExercise.Exercise
          "
        >
          <transition name="slideup" mode="out-in">
            <div
              class="latest-categoryname"
              :key="panelStatus.latestScore.Category"
            >
              <span style="font-family: Gotham Light"
                >Panel {{ panelStatus.PanelNo }} |</span
              >
              {{ panelStatus.latestScore.Category }}
            </div>
          </transition>

          <transition name="slideup" mode="out-in">
            <div
              class="latest-exerciseno"
              :key="panelStatus.latestExercise.Exercise"
            >
              {{ panelStatus.latestExercise.RoundName }} | Exercise
              {{ panelStatus.latestExercise.Exercise }}
            </div>
          </transition>

          <transition name="slide" mode="out-in">
            <table
              class="latest-panel-table"
              :key="panelStatus.latestScore.CompetitorId"
            >
              <tr>
                <td class="latest-panel" rowspan="2">
                  <img
                    :src="getImageSource(panelStatus.latestScore.Discipline)"
                    width="159"
                  />
                </td>
                <td class="latest-name">
                  {{
                    panelStatus.latestScore.Discipline == "TRS"
                      ? panelStatus.latestScore.Surname1.toUpperCase() +
                        ", " +
                        panelStatus.latestScore.Surname2.toUpperCase()
                      : panelStatus.latestScore.Surname1.toUpperCase() +
                        " " +
                        panelStatus.latestScore.FirstName1
                  }}
                </td>
                <td class="latest-flag" rowspan="1">
                  <img
                    v-if="panelStatus.latestScore.Nation"
                    :src="getFlagImageSource(panelStatus.latestScore.Nation)"
                    width="40"
                  />
                </td>
              </tr>

              <tr>
                <td class="latest-clubname">
                  {{ panelStatus.latestScore.DisplayClub }}
                </td>
              </tr>
            </table>
          </transition>
          <Transition name="slide" mode="out-in">
            <table
              class="latest-scores-table"
              :key="panelStatus.latestScore.CompetitorId"
            >
              <tr>
                <td class="latest-scoretable_headere">E</td>
                <td class="latest-scoretable_header">
                  {{
                    panelStatus.latestScore.Discipline == "DMT" ||
                    panelStatus.latestScore.Discipline == "TUM"
                      ? ""
                      : "H"
                  }}
                </td>
                <td class="latest-scoretable_header">D</td>
                <td class="latest-scoretable_header">
                  {{
                    panelStatus.latestScore.Discipline == "TRS"
                      ? "S"
                      : panelStatus.latestScore.Discipline == "DMT" ||
                        panelStatus.latestScore.Discipline == "TUM"
                      ? "&nbsp;"
                      : "T"
                  }}
                </td>
                <td class="latest-scoretable_header">P</td>
                <td class="latest-scoretable_space">&nbsp;</td>
                <td class="latest-scoretable_headertot">Total</td>
                <td class="latest-scoretable_space">&nbsp;</td>
                <td class="latest-scoretable_headerrank">Rk</td>
              </tr>

              <tr>
                <td class="latest-scoretable_space">&nbsp;</td>
              </tr>

              <tr>
                <td class="latest-scoretable_score">
                  {{ formattedNumber(panelStatus.latestExercise.Execution, 2) }}
                </td>
                <td class="latest-scoretable_score">
                  {{
                    panelStatus.latestScore.Discipline == "DMT" ||
                    panelStatus.latestScore.Discipline == "TUM"
                      ? "&nbsp;"
                      : formattedNumber(
                          panelStatus.latestExercise.HorizontalDisplacement,
                          2
                        )
                  }}
                </td>
                <td class="latest-scoretable_score">
                  {{
                    formattedNumber2(
                      panelStatus.latestExercise.Difficulty,
                      panelStatus.latestExercise.Bonus,
                      1
                    )
                  }}
                </td>
                <td class="latest-scoretable_score">
                  {{
                    panelStatus.latestScore.Discipline == "TRS"
                      ? formattedNumber(
                          panelStatus.latestExercise.Synchronisation,
                          2
                        )
                      : panelStatus.latestScore.Discipline == "DMT" ||
                        panelStatus.latestScore.Discipline == "TUM"
                      ? "&nbsp;"
                      : formattedNumber(
                          panelStatus.latestExercise.TimeOfFlight,
                          2
                        )
                  }}
                </td>
                <td class="latest-scoretable_score">
                  {{
                    panelStatus.latestExercise.Penalty > 0
                      ? "-" +
                        formattedNumber(panelStatus.latestExercise.Penalty, 1)
                      : formattedNumber(panelStatus.latestExercise.Penalty, 1)
                  }}
                </td>
                <td class="latest-scoretable_space">&nbsp;</td>
                <td class="latest-scoretable_scoretot">
                  <b>{{
                    formattedNumber(panelStatus.latestExercise.Total, 2)
                  }}</b>
                </td>
                <td class="latest-scoretable_space">&nbsp;</td>
                <td class="latest-scoretable_scorerank">
                  <b>{{
                    !panelStatus.latestScore.ZeroRank
                      ? "-"
                      : panelStatus.latestCategory.CompType == 0
                      ? panelStatus.latestScore.DisplayZeroRank
                      : panelStatus.latestScore.DisplayCumulativeRank
                  }}</b>
                </td>
              </tr>
            </table>
          </Transition>
        </div>
        <div v-else>
          <div class="latest-categoryname">
            <span style="font-family: Gotham Light"
              >Panel {{ panelStatus.PanelNo }}</span
            >
          </div>

          <table class="latest-comingsoon-table">
            <tr>
              <td class="latest-comingsoon-cell">Scores Coming Soon</td>
            </tr>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "LatestScoresComponent",
  computed: {},
  data() {
    return {
      currentTime: "12:00",
      panelStatuses: [],
      tempPanelStatuses: [],
    };
  },
  created() {
    this.updateTime();
    this.fetchPanelData();
    setInterval(() => {
      this.updateTime();
      this.fetchPanelData();
    }, 1000);
    setTimeout(() => {
      location.reload();
    }, 300000);
  },
  methods: {
    async fetchPanelData() {
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/panelStatus"
      )
        .then((response) => response.json())
        .then((data) => {
          this.tempPanelStatuses = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      for (let index = 0; index < this.panelStatuses.length; index++) {
        this.tempPanelStatuses[index].latestScore =
          await this.fetchLatestScoreForPanel(
            this.tempPanelStatuses[index].PanelNo
          );
        this.tempPanelStatuses[index].latestExercise =
          await this.getLatestExerciseFromLatestScore(
            this.tempPanelStatuses[index].latestScore
          );
        this.tempPanelStatuses[index].latestCategory = await this.fetchCategory(
          this.tempPanelStatuses[index].latestScore.CatId
        );
      }
      this.panelStatuses = this.tempPanelStatuses;
    },
    async fetchCategory(catId) {
      let tempData;
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/categories?catId=" +
          catId
      )
        .then((response) => response.json())
        .then((data) => {
          tempData = data[0];
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      return tempData;
    },
    async fetchLatestScoreForPanel(panelNumber) {
      let tempData;
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/latestScore?panelNumber=" +
          panelNumber
      )
        .then((response) => response.json())
        .then((data) => {
          tempData = data[0];
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      return tempData;
    },
    async getLatestExerciseFromLatestScore(latestScore) {
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
        if (
          latestScore &&
          typeof latestScore === "object" &&
          !this.isValueNullOrEmpty(latestScore[totalProperty])
        ) {
          try {
            await this.fetchCategoryRoundExercise(
              latestScore.CatId,
              exercise.exerciseNumber
            );
            tempLatestExercise = {
              Exercise: exercise.exerciseNumber,
              RoundName: this.categoryRoundExercise?.RoundName ?? "",
              Execution: latestScore[`${exercise.propertyPrefix}E`] ?? null,
              Difficulty: latestScore[`${exercise.propertyPrefix}D`] ?? null,
              Bonus: latestScore[`${exercise.propertyPrefix}B`] ?? null,
              HorizontalDisplacement:
                latestScore[`${exercise.propertyPrefix}HD`] ?? null,
              TimeOfFlight:
                latestScore[`${exercise.propertyPrefix}ToF`] ?? null,
              Synchronisation:
                latestScore[`${exercise.propertyPrefix}S`] ?? null,
              Penalty: latestScore[`${exercise.propertyPrefix}Pen`] ?? null,
              Total: latestScore[totalProperty] ?? null,
            };
          } catch (error) {
            console.error("Error fetching category round exercise:", error);
          }
          break;
        }
      }

      return tempLatestExercise;
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
    getImageSource(discipline) {
      if (discipline == undefined) discipline = "TRA";
      return require(`@/assets/${discipline}.png`);
    },
    isValueNullOrEmpty(value) {
      return (value == null || value == "" || value == undefined) && value != 0;
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
    formattedNumber2(firstNumberAsString, secondNumberAsString, decimalPlaces) {
      let parsedNumber = parseFloat(firstNumberAsString);
      let parsedNumber2 = parseFloat(secondNumberAsString);
      parsedNumber = isNaN(parsedNumber) ? 0 : parsedNumber;
      parsedNumber2 = isNaN(parsedNumber2) ? 0 : parsedNumber2;
      parsedNumber = parsedNumber + parsedNumber2;
      return parsedNumber.toFixed(decimalPlaces);
    },
    compareArrays(array1, array2) {
      return JSON.stringify(array1) == JSON.stringify(array2);
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/displaylatest.style.css";
@import "../stylesheets/videostyle.style.css";

.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}
.slide-enter-from {
  transform: translate(-250%, 0);
}

.slide-leave-to {
  transform: translate(250%, 0);
}

.slide-leave-from .slide-enter-to {
  transform: translate(250%, 0);
}

.slideup-leave-active,
.slideup-enter-active {
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
</style>
