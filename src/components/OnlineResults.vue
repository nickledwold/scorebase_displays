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
            <a href="/online"><img src="../assets/back.png" height="15" /></a>
          </td>
          <td class="results-selector">
            <a class="online-a" href="/online">Category Selector</a>
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
              <td class="results-bannerlive">RESULTS</td>
            </tr>
          </table>
        </div>

        <div class="results-roundstatus">
          <table cellspacing="0" align="center">
            <tr>
              <td class="roundstatusroundofficial">Q1</td>
              <td class="spacer"></td>
              <td class="roundstatusroundprovisional">F1</td>
            </tr>
            <td class="roundstatusofficial">Official</td>
            <td class="spacer"></td>
            <td class="roundstatusprovisional">Provisional</td>
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

        <div class="results-filterBtns">
          <div class="results-btnfilterimg">
            <img src="../assets/filter.png" width="20" />
          </div>
          <button id="mybutton" class="results-btn active" onclick="">
            All
          </button>
          <button class="results-btn" onclick="">Q</button>
          <button class="results-btn" onclick="">F</button>
        </div>

        <div
          v-for="result in filteredResults"
          :key="result.CompetitorId"
          id="containerdiv"
        >
          <div class="result" id="resultdiv">
            <table class="results-top-name">
              <tr class="results-name">
                <td rowspan="2" class="results-scores-pos">
                  {{
                    this.noResults
                      ? result.RunningOrderNumber
                      : result.Rank
                      ? result.Rank
                      : result.RunningOrderNumber
                  }}
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
            <div v-if="!noResults && result.Exercises.length > 0">
              <div
                v-for="round in getRoundsForCompetitor(result.Exercises)"
                :key="round"
              >
                <table class="results-scores-table">
                  <tr class="results-headers">
                    <th class="results-scores-routine2">Exercise</th>
                    <th class="results-scores-routine3" colspan="2">E</th>
                    <th
                      v-if="
                        this.categoryData.Discipline == 'TRA' ||
                        this.categoryData.Discipline == 'TRS'
                      "
                      class="results-scores-routine3"
                    >
                      H
                    </th>
                    <th class="results-scores-routine3">D</th>
                    <th
                      v-if="
                        this.categoryData.Discipline == 'TRA' ||
                        this.categoryData.Discipline == 'TRS'
                      "
                      class="results-scores-routine3"
                    >
                      {{ this.categoryData.Discipline == "TRS" ? "S" : "T" }}
                    </th>
                    <th class="results-scores-routine3">Pen</th>
                    <th class="results-scores-routine3">Total</th>
                    <th class="results-scores-routine3">Rank</th>
                    <th class="results-scores-routinevid">Video</th>
                  </tr>
                  <template
                    v-for="exercise in result.Exercises.filter(
                      (exercise) => exercise.RoundName == round
                    )"
                    :key="exercise.ExerciseNumber"
                  >
                    <tr>
                      <td class="results-scores-routine">
                        {{ exercise.ExerciseNumber }}
                      </td>
                      <td class="results-scores-tri-set-E">
                        {{ formattedNumber(exercise.Execution, 2) }}
                      </td>
                      <td class="results-scores-median-select">
                        <label
                          :id="
                            expand +
                            exercise.ExerciseNumber +
                            exercise.CompetitorId
                          "
                          @click="
                            toggleMedians(
                              exercise.ExerciseNumber,
                              exercise.CompetitorId
                            )
                          "
                          >[+]</label
                        >
                      </td>
                      <td
                        v-if="
                          this.categoryData.Discipline == 'TRA' ||
                          this.categoryData.Discipline == 'TRS'
                        "
                        class="results-scores-tri-set-H"
                      >
                        {{
                          formattedNumber(exercise.HorizontalDisplacement, 2)
                        }}
                      </td>
                      <td class="results-scores-tri-set-D">
                        {{ formattedNumber(exercise.Difficulty, 1) }}
                      </td>
                      <td
                        v-if="
                          this.categoryData.Discipline == 'TRA' ||
                          this.categoryData.Discipline == 'TRS'
                        "
                        class="results-scores-tri-set-ToF"
                      >
                        {{
                          this.categoryData.Discipline == "TRS"
                            ? formattedNumber(exercise.Synchronisation, 2)
                            : formattedNumber(exercise.TimeOfFlight, 2)
                        }}
                      </td>
                      <td class="results-scores-tri-set-P">
                        {{
                          exercise.Penalty > 0
                            ? "-" + formattedNumber(exercise.Penalty, 1)
                            : formattedNumber(exercise.Penalty, 1)
                        }}
                      </td>
                      <td class="results-scores-tri-set-Tot">
                        {{ formattedNumber(exercise.Total, 2) }}
                      </td>
                      <td class="results-scores-tri-set-Tot">
                        {{ exercise.Rank }}
                      </td>

                      <td class="results-scores-tri-vid">
                        <div class="results-box">
                          <a
                            class="results-button"
                            :href="exercise.Videos ? '#popup1' : '#'"
                            ><img
                              :src="
                                exercise.Videos
                                  ? require('@/assets/videoicon.png')
                                  : require('@/assets/NoVideo.png')
                              "
                              width="25"
                          /></a>
                        </div>
                        <div id="popup1" class="results-overlay">
                          <div class="results-popup">
                            <p>
                              {{ result.fullNameReversed }}<br />Exercise
                              {{ exercise.ExerciseNumber }}<br /><br />
                            </p>

                            <h2>SELECT ANGLE</h2>
                            <a class="close" href="#">&times;</a>
                            <div class="content">
                              <table class="angletable" cellspacing="0">
                                <tr>
                                  <td colspan="7" class="anglevideotitle">
                                    Angle 1
                                  </td>
                                </tr>
                                <tr>
                                  <td class="anglevideoname">LQ</td>
                                  <td class="anglevideoa">
                                    <a
                                      href="video/LQ/National Age Group Finals - TRS - Synchro  Women Youth 1012 - BARNES JONES - Liverpool Trampoline Gymnastics Academy - Exercise 1 - Angle 1 (931).mp4"
                                      target="_blank"
                                      ><img
                                        src="../assets/play.png"
                                        height="19"
                                    /></a>
                                  </td>
                                  <td class="anglevideob">
                                    <a
                                      href="video/LQ/National Age Group Finals - TRS - Synchro  Women Youth 1012 - BARNES JONES - Liverpool Trampoline Gymnastics Academy - Exercise 1 - Angle 1 (931).mp4"
                                      download
                                      ><img
                                        src="../assets/download.png"
                                        height="19"
                                    /></a>
                                  </td>
                                  <td class="anglespace"></td>
                                  <td class="anglevideoname">HQ</td>
                                  <td class="anglevideoa">
                                    <a
                                      href="video/HQ/National Age Group Finals - TRS - Synchro  Women Youth 1012 - BARNES JONES - Liverpool Trampoline Gymnastics Academy - Exercise 1 - Angle 1 (931).mp4"
                                      target="_blank"
                                      ><img
                                        src="../assets/play.png"
                                        height="19"
                                    /></a>
                                  </td>
                                  <td class="anglevideob">
                                    <a
                                      href="video/HQ/National Age Group Finals - TRS - Synchro  Women Youth 1012 - BARNES JONES - Liverpool Trampoline Gymnastics Academy - Exercise 1 - Angle 1 (931).mp4"
                                      download
                                      ><img
                                        src="../assets/download.png"
                                        height="19"
                                    /></a>
                                  </td>
                                </tr>

                                <tr>
                                  <td colspan="7" class="anglevideotitle">
                                    Angle 2
                                  </td>
                                </tr>
                                <tr>
                                  <td class="anglevideoname">LQ</td>
                                  <td class="anglevideoa">
                                    <a
                                      href="video/LQ/National Age Group Finals - TRS - Synchro  Women Youth 1012 - BARNES JONES - Liverpool Trampoline Gymnastics Academy - Exercise 1 - Angle 2 (931).mp4"
                                      target="_blank"
                                      ><img
                                        src="../assets/play.png"
                                        height="19"
                                    /></a>
                                  </td>
                                  <td class="anglevideob">
                                    <a
                                      href="video/LQ/National Age Group Finals - TRS - Synchro  Women Youth 1012 - BARNES JONES - Liverpool Trampoline Gymnastics Academy - Exercise 1 - Angle 2 (931).mp4"
                                      download
                                      ><img
                                        src="../assets/download.png"
                                        height="19"
                                    /></a>
                                  </td>
                                  <td class="anglespace"></td>
                                  <td class="anglevideoname">HQ</td>
                                  <td class="anglevideoa">
                                    <a
                                      href="video/HQ/National Age Group Finals - TRS - Synchro  Women Youth 1012 - BARNES JONES - Liverpool Trampoline Gymnastics Academy - Exercise 1 - Angle 2 (931).mp4"
                                      target="_blank"
                                      ><img
                                        src="../assets/play.png"
                                        height="19"
                                    /></a>
                                  </td>
                                  <td class="anglevideob">
                                    <a
                                      href="video/HQ/National Age Group Finals - TRS - Synchro  Women Youth 1012 - BARNES JONES - Liverpool Trampoline Gymnastics Academy - Exercise 1 - Angle 2 (931).mp4"
                                      download
                                      ><img
                                        src="../assets/download.png"
                                        height="19"
                                    /></a>
                                  </td>
                                </tr>
                              </table>
                              <h3>
                                High quality videos may not be immediately
                                available
                              </h3>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td
                        class="results-scores-tri-medians"
                        colspan="100%"
                        :style="
                          getMediansStyle(
                            exercise.ExerciseNumber,
                            exercise.CompetitorId
                          )
                        "
                        :id="
                          'medians' +
                          exercise.ExerciseNumber +
                          exercise.CompetitorId
                        "
                      >
                        <table class="results-median">
                          <tr>
                            <td class="results-medianheadtitle">Element</td>
                            <td class="results-medianhead">1</td>
                            <td class="results-medianhead">2</td>
                            <td class="results-medianhead">3</td>
                            <td class="results-medianhead">4</td>
                            <td class="results-medianhead">5</td>
                            <td class="results-medianhead">6</td>
                            <td class="results-medianhead">7</td>
                            <td class="results-medianhead">8</td>
                            <td class="results-medianhead">9</td>
                            <td class="results-medianhead">10</td>
                            <td class="results-medianhead">L</td>
                          </tr>
                          <tr>
                            <td class="results-medianheadtitle">Median 1</td>
                            <td class="results-medianscore">1</td>
                            <td class="results-medianscore">1</td>
                            <td class="results-medianscore">3</td>
                            <td class="results-medianscore">3</td>
                            <td class="results-medianscore">2</td>
                            <td class="results-medianscore">2</td>
                            <td class="results-medianscore">2</td>
                            <td class="results-medianscore">3</td>
                            <td class="results-medianscore">2</td>
                            <td class="results-medianscore">3</td>
                            <td class="results-medianscore">2</td>
                          </tr>
                          <tr>
                            <td class="results-medianheadtitle">Median 2</td>
                            <td class="results-medianscore">2</td>
                            <td class="results-medianscore">3</td>
                            <td class="results-medianscore">2</td>
                            <td class="results-medianscore">3</td>
                            <td class="results-medianscore">2</td>
                            <td class="results-medianscore">3</td>
                            <td class="results-medianscore">2</td>
                            <td class="results-medianscore">3</td>
                            <td class="results-medianscore">2</td>
                            <td class="results-medianscore">3</td>
                            <td class="results-medianscore">3</td>
                          </tr>
                          <tr>
                            <td class="results-medianheadtitle">Sum</td>
                            <td class="results-medianscore">4</td>
                            <td class="results-medianscore">2</td>
                            <td class="results-medianscore">5</td>
                            <td class="results-medianscore">6</td>
                            <td class="results-medianscore">3</td>
                            <td class="results-medianscore">2</td>
                            <td class="results-medianscore">4</td>
                            <td class="results-medianscore">3</td>
                            <td class="results-medianscore">4</td>
                            <td class="results-medianscore">5</td>
                            <td class="results-medianscore">6</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </template>
                </table>
                <table class="results-total-table">
                  <tr>
                    <td class="results-scores-round">
                      {{ getRoundName(round) }} Total
                    </td>
                    <td class="results-scores-tri-Tot">52.47</td>
                  </tr>
                </table>
                <table class="results-round-rank-table">
                  <tr>
                    <td class="results-scores-roundrank">Round Rank</td>
                    <td class="results-scores-roundrank-tot">1</td>
                  </tr>
                </table>
              </div>
            </div>
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
export default {
  name: "OnlineResults",
  computed: {
    catId() {
      return this.$route.params.catId;
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
      mediansVisible: {},
    };
  },
  created() {
    this.fetchCategory();
  },
  methods: {
    async fetchCategory() {
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/categories?catId=" +
          this.catId
      )
        .then((response) => response.json())
        .then((data) => {
          this.categoryData = data[0];
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      await this.fetchRounds();
      this.fetchResults();
    },
    async fetchResults() {
      let tempData;
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/onlineResults?catId=" +
          this.catId +
          "&compType=" +
          this.categoryData.CompType
      )
        .then((response) => response.json())
        .then((data) => {
          tempData = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      let competitorsWithScores = tempData.filter(
        (competitor) => competitor.Exercises.length > 0
      );
      console.log(competitorsWithScores);
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
    },
    async fetchRounds() {
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/rounds?catId=" +
          this.categoryData.CatId
      )
        .then((response) => response.json())
        .then((data) => {
          this.categoryRounds = data;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
    formattedNumber(numberAsString, decimalPlaces) {
      let parsedNumber = parseFloat(numberAsString);
      parsedNumber = isNaN(parsedNumber) ? 0 : parsedNumber;
      return parsedNumber.toFixed(decimalPlaces);
    },
    getRoundsForCompetitor(exercises) {
      const roundData = exercises.map((exercise) => ({
        RoundName: exercise.RoundName,
        RoundOrder: exercise.RoundOrder,
      }));
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
    toggleMedians(exerciseNumber, competitorId) {
      const key = "medians" + exerciseNumber + competitorId;
      this.mediansVisible[key] = !this.mediansVisible[key];
    },
    getMediansStyle(exerciseNumber, competitorId) {
      const key = "medians" + exerciseNumber + competitorId;
      return {
        display: this.mediansVisible[key] ? "table-cell" : "none",
      };
    },
    checkLinkStatus(link) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", link.url, true);

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            //do nothing if link is good
          } else {
            link.disabled = true;
          }
        }
      };

      xhr.send();
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/online.style.css";
</style>
