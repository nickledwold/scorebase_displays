<template>
  <div class="cis-bodydiv">
    <div class="cis-time">{{ currentTime }}</div>

    <div class="cis-logosb">
      <img src="../assets/scorebase.png" height="25" />
    </div>

    <div class="cis-latestscorepanel">
      <div class="cis-latesttitle">LATEST SCORES</div>

      <template
        v-for="panelStatus in this.panelStatuses"
        :key="panelStatus.PanelNo"
      >
        <div
          v-if="
            panelStatus.latestScore &&
            panelStatus.latestExercise &&
            panelStatus.latestExercise.Exercise
          "
        >
          <table class="cis-panel-table">
            <tr>
              <transition name="slideup" mode="out-in">
                <td class="cis-panel" :key="panelStatus.latestScore.Discipline">
                  <img
                    :src="getImageSource(panelStatus.latestScore.Discipline)"
                    width="55"
                  />
                </td>
              </transition>
              <transition name="slideup" mode="out-in">
                <td
                  class="cis-categoryname"
                  :key="panelStatus.latestScore.Category"
                >
                  Panel {{ panelStatus.PanelNo }} |
                  {{ panelStatus.latestScore.Category }}
                </td>
              </transition>
              <transition name="slideup" mode="out-in">
                <td
                  class="cis-exerciseno"
                  :key="
                    panelStatus.latestExercise.RoundName +
                    panelStatus.latestExercise.Exercise
                  "
                >
                  {{ panelStatus.latestExercise.RoundName }} | Exercise
                  {{ panelStatus.latestExercise.Exercise }}
                </td>
              </transition>
            </tr>
          </table>

          <Transition name="slideleft" mode="out-in">
            <div :key="panelStatus.latestScore.CompetitorId">
              <table class="cis-panel-table-name">
                <tr>
                  <td
                    v-if="panelStatus.latestScore.Nation"
                    class="cis-flag"
                    rowspan="2"
                  >
                    <img
                      :src="getFlagImageSource(panelStatus.latestScore.Nation)"
                      width="30"
                    />
                  </td>
                  <td v-else class="cis-noflag" rowspan="2"></td>
                  <td class="cis-name">
                    {{
                      panelStatus.latestScore.Discipline == "TRS"
                        ? panelStatus.latestScore.Surname1.toUpperCase() +
                          ", " +
                          panelStatus.latestScore.Surname2.toUpperCase()
                        : panelStatus.latestScore.Surname1.toUpperCase() +
                          ", " +
                          panelStatus.latestScore.FirstName1
                    }}
                  </td>
                </tr>
                <tr>
                  <td class="cis-clubname">
                    {{ panelStatus.latestScore.DisplayClub }}
                  </td>
                </tr>
              </table>

              <table class="cis-scores-table">
                <tr>
                  <td class="cis-scoretable_headere">E</td>
                  <td class="cis-scoretable_header">
                    {{
                      panelStatus.latestScore.Discipline == "DMT" ||
                      panelStatus.latestScore.Discipline == "TUM"
                        ? ""
                        : "H"
                    }}
                  </td>
                  <td class="cis-scoretable_header">D</td>
                  <td class="cis-scoretable_header">
                    {{
                      panelStatus.latestScore.Discipline == "TRS"
                        ? "S"
                        : panelStatus.latestScore.Discipline == "DMT" ||
                          panelStatus.latestScore.Discipline == "TUM"
                        ? "&nbsp;"
                        : "T"
                    }}
                  </td>
                  <td class="cis-scoretable_header">P</td>
                  <td class="cis-scoretable_space">&nbsp;</td>
                  <td class="cis-scoretable_headertot">Total</td>
                  <td class="cis-scoretable_space">&nbsp;</td>
                  <td class="cis-scoretable_headerrank">Rk</td>
                </tr>

                <tr>
                  <td class="cis-scoretable_space">&nbsp;</td>
                </tr>

                <tr>
                  <td class="cis-scoretable_score">
                    {{
                      formattedNumber(panelStatus.latestExercise.Execution, 2)
                    }}
                  </td>
                  <td class="cis-scoretable_score">
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
                  <td
                    v-if="panelStatus.latestScore.Discipline == 'TUM'"
                    class="cis-scoretable_score"
                  >
                    {{
                      formattedNumber(panelStatus.latestExercise.Difficulty, 1)
                    }}<span class="cis-span3">
                      {{
                        "(+" +
                        formattedNumber(panelStatus.latestExercise.Bonus, 1) +
                        ")"
                      }}</span
                    >
                  </td>
                  <td v-else class="cis-scoretable_score">
                    {{
                      formattedNumber(panelStatus.latestExercise.Difficulty, 1)
                    }}
                  </td>
                  <td class="cis-scoretable_score">
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
                  <td class="cis-scoretable_score">
                    {{
                      panelStatus.latestExercise.Penalty > 0
                        ? "-" +
                          formattedNumber(panelStatus.latestExercise.Penalty, 1)
                        : formattedNumber(panelStatus.latestExercise.Penalty, 1)
                    }}
                  </td>
                  <td class="cis-scoretable_space">&nbsp;</td>
                  <td class="cis-scoretable_scoretot">
                    <b>{{
                      formattedNumber(panelStatus.latestExercise.Total, 2)
                    }}</b>
                  </td>
                  <td class="cis-scoretable_space">&nbsp;</td>
                  <td class="cis-scoretable_scorerank">
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
            </div>
          </Transition>
        </div>
        <div v-else>
          <table class="cis-panel-table">
            <tr>
              <td class="cis-panel">
                <img :src="getImageSource('TRA')" width="55" />
              </td>
              <td class="cis-categoryname">Panel {{ panelStatus.PanelNo }}</td>
              <td class="cis-exerciseno">Scores Coming Soon</td>
            </tr>
          </table>

          <table class="cis-panel-table-name">
            <tr>
              <td class="cis-flag" rowspan="2"></td>
              <td class="cis-name"></td>
            </tr>
            <tr>
              <td class="cis-clubname"></td>
            </tr>
          </table>

          <table class="cis-scores-table-blank">
            <tr>
              <td class="cis-scoretable_headere"></td>
              <td class="cis-scoretable_header"></td>
              <td class="cis-scoretable_header"></td>
              <td class="cis-scoretable_header"></td>
              <td class="cis-scoretable_header"></td>
              <td class="cis-scoretable_space">&nbsp;</td>
              <td class="cis-scoretable_headertot"></td>
              <td class="cis-scoretable_space">&nbsp;</td>
              <td class="cis-scoretable_headerrank"></td>
            </tr>

            <tr>
              <td class="cis-scoretable_space">&nbsp;</td>
            </tr>

            <tr>
              <td class="cis-scoretable_score"></td>
              <td class="cis-scoretable_score"></td>
              <td class="cis-scoretable_score"></td>
              <td class="cis-scoretable_score"></td>
              <td class="cis-scoretable_score"></td>
              <td class="cis-scoretable_space">&nbsp;</td>
              <td class="cis-scoretable_scoretot"><b></b></td>
              <td class="cis-scoretable_space">&nbsp;</td>
              <td class="cis-scoretable_scorerank"><b></b></td>
            </tr>
          </table>
        </div>
      </template>
    </div>

    <div class="cis-panelstatuspanel">
      <div class="cis-statustitle">Panel Status</div>

      <template
        v-for="panelStatus in this.panelStatuses"
        :key="panelStatus.PanelNo"
      >
        <div v-if="!isValueNullOrEmpty(panelStatus.NextToCompeteFirstName1)">
          <table class="cis-panel-table">
            <tr>
              <transition name="slideup" mode="out-in">
                <td
                  class="cis-panel"
                  :key="panelStatus.NextToCompeteDiscipline"
                >
                  <img
                    :src="getImageSource(panelStatus.NextToCompeteDiscipline)"
                    width="55"
                  />
                </td>
              </transition>
              <transition name="slideup" mode="out-in">
                <td
                  class="cis-categoryname"
                  :key="panelStatus.NextToCompeteCategory"
                >
                  Panel {{ panelStatus.PanelNo }} |
                  {{ panelStatus.NextToCompeteCategory }}
                </td>
              </transition>
              <td class="cis-exerciseno"></td>
            </tr>
          </table>

          <table class="cis-status-table-name">
            <tr>
              <transition name="slideup" mode="out-in">
                <td
                  v-if="panelStatus.NextToCompeteNation"
                  class="cis-flag"
                  rowspan="2"
                  :key="panelStatus.NextToCompeteNation"
                >
                  <img
                    :src="getFlagImageSource(panelStatus.NextToCompeteNation)"
                    width="30"
                  />
                </td>
                <td v-else class="cis-noflag" rowspan="2"></td>
              </transition>
              <transition name="slideup" mode="out-in">
                <td
                  class="cis-namestatus"
                  :key="
                    panelStatus.NextToCompeteSurname1 +
                    panelStatus.NextToCompeteFirstName1
                  "
                >
                  {{
                    panelStatus.NextToCompeteDiscipline == "TRS"
                      ? panelStatus.NextToCompeteSurname1.toUpperCase() +
                        ", " +
                        panelStatus.NextToCompeteSurname2.toUpperCase()
                      : panelStatus.NextToCompeteSurname1.toUpperCase() +
                        ", " +
                        panelStatus.NextToCompeteFirstName1
                  }}
                </td>
              </transition>
              <transition-group name="fade" mode="out-in">
                <td v-if="panelStatus.Status == 0" class="cis-statusheaderwait">
                  Status
                </td>
                <td v-else class="cis-statusheadergo">Status</td>
              </transition-group>
            </tr>
            <tr>
              <transition name="slideup" mode="out-in">
                <td
                  class="cis-clubnamestatus"
                  :key="panelStatus.NextToCompeteClub"
                >
                  {{ panelStatus.NextToCompeteClub }}
                </td>
              </transition>
              <transition-group name="fade" mode="out-in">
                <td v-if="panelStatus.Status == 0" class="cis-statusstatuswait">
                  UP NEXT
                </td>
                <td v-else class="cis-statusstatusgo">ON NOW</td>
              </transition-group>
            </tr>
          </table>
        </div>
        <div v-else>
          <table class="cis-panel-table">
            <tr>
              <td class="cis-panel">
                <img src="../assets/TRA.png" width="55" />
              </td>
              <td class="cis-categoryname">
                Panel {{ panelStatus.PanelNo }} | Scores Coming Soon
              </td>
              <td class="cis-exerciseno"></td>
            </tr>
          </table>
          <table class="cis-status-table-name">
            <tr>
              <td class="cis-flag" rowspan="2"></td>
              <td class="cis-namestatus"></td>
              <td class="cis-statusheadersoon"></td>
            </tr>
            <tr>
              <td class="cis-clubnamestatus"></td>
              <td class="cis-statusstatussoon"></td>
            </tr>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommentaryInformationSystem",
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
      if (!this.compareArrays(this.tempPanelStatuses, this.panelStatuses)) {
        this.panelStatuses = this.tempPanelStatuses;
      }
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
        if (!this.isValueNullOrEmpty(latestScore[totalProperty])) {
          await this.fetchCategoryRoundExercise(
            latestScore.CatId,
            exercise.exerciseNumber
          );
          tempLatestExercise = {
            Exercise: exercise.exerciseNumber,
            RoundName: this.categoryRoundExercise.RoundName,
            Execution: latestScore[`${exercise.propertyPrefix}E`],
            Difficulty: latestScore[`${exercise.propertyPrefix}D`],
            Bonus: latestScore[`${exercise.propertyPrefix}B`],
            HorizontalDisplacement: latestScore[`${exercise.propertyPrefix}HD`],
            TimeOfFlight: latestScore[`${exercise.propertyPrefix}ToF`],
            Synchronisation: latestScore[`${exercise.propertyPrefix}S`],
            Penalty: latestScore[`${exercise.propertyPrefix}Pen`],
            Total: latestScore[totalProperty],
          };
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
      if (this.isValueNullOrEmpty(discipline)) discipline = "TRA";
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
    compareArrays(array1, array2) {
      return JSON.stringify(array1) == JSON.stringify(array2);
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/cislatest.style.css";
@import "../stylesheets/videostyle.style.css";

.slideup-leave-active,
.slideup-enter-active,
.slideleft-leave-active,
.slideleft-enter-active {
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

.slideleft-enter-from {
  transform: translate(-100%, 0);
}

.slideleft-leave-to {
  transform: translate(-100%, 0);
}

.slideleft-leave-from .slideleft-enter-to {
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
