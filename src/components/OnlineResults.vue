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
                  {{ result.Rank }}
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
            <div class="filterElements qualification">
              <table class="results-scores-table">
                <tr class="results-headers">
                  <th class="results-scores-routine2">Exercise</th>
                  <th class="results-scores-routine3" colspan="2">E</th>
                  <th class="results-scores-routine3">H</th>
                  <th class="results-scores-routine3">D</th>
                  <th class="results-scores-routine3">T</th>
                  <th class="results-scores-routine3">Pen</th>
                  <th class="results-scores-routine3">Total</th>
                  <th class="results-scores-routine3">Rank</th>
                  <th class="results-scores-routinevid">Video</th>
                </tr>
                <tr>
                  <td class="results-scores-routine">1</td>
                  <td class="results-scores-tri-set-E">16.80</td>
                  <td class="results-scores-median-select">
                    <label
                      id="expand$exerciseNumber$competitorid"
                      onclick="toggle(this)"
                      >[+]</label
                    >
                  </td>
                  <td class="results-scores-tri-set-H">9.90</td>
                  <td class="results-scores-tri-set-D">15.4</td>
                  <td class="results-scores-tri-set-ToF">16.57</td>
                  <td class="results-scores-tri-set-P">-0.2</td>
                  <td class="results-scores-tri-set-Tot">53.76</td>
                  <td class="results-scores-tri-set-Tot">1</td>

                  <td class="results-scores-tri-vid">
                    <div class="results-box">
                      <a class="results-button" href="#popup1"
                        ><img src="../assets/videoicon.png" width="25"
                      /></a>
                    </div>
                    <div id="popup1" class="results-overlay">
                      <div class="results-popup">
                        <p>LEDWOLD Nicholas<br />Exercise 1<br /><br /></p>

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
                                  ><img src="../assets/play.png" height="19"
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
                                  ><img src="../assets/play.png" height="19"
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
                                  ><img src="../assets/play.png" height="19"
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
                                  ><img src="../assets/play.png" height="19"
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
                            High quality videos may not be immediately available
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
                    style="display: none"
                    id="medians$exerciseNumber$competitorid"
                  >
                    <table class="results-median">
                      <tr>
                        <td class="results-medianheadtitle">Element</td>
                        <td class="results-medianhead"></td>
                      </tr>
                      <tr>
                        <td class="results-medianheadtitle">Median 1</td>
                        <td class="results-medianscore"></td>
                      </tr>
                      <tr>
                        <td class="results-medianheadtitle">Median 2</td>
                        <td class="results-medianscore"></td>
                      </tr>
                      <tr>
                        <td class="results-medianheadtitle">Sum</td>
                        <td class="results-medianscore"></td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td class="results-scores-routine">2</td>
                  <td class="results-scores-tri-set-E">14.50</td>
                  <td class="results-scores-median-select">
                    <label
                      id="expand$exerciseNumber$competitorid"
                      onclick="toggle(this)"
                      >[+]</label
                    >
                  </td>
                  <td class="results-scores-tri-set-H">9.90</td>
                  <td class="results-scores-tri-set-D">15.4</td>
                  <td class="results-scores-tri-set-ToF">16.57</td>
                  <td class="results-scores-tri-set-P">-0.2</td>
                  <td class="results-scores-tri-set-Tot">53.76</td>
                  <td class="results-scores-tri-set-Tot">1</td>

                  <td class="results-scores-tri-vid">
                    <div class="results-box">
                      <a class="results-button" href="#popup2"
                        ><img src="../assets/videoicon.png" width="25"
                      /></a>
                    </div>

                    <div id="popup2" class="results-overlay">
                      <div class="results-popup">
                        <h2>SELECT ANGLE</h2>
                        <a class="close" href="#">&times;</a>
                        <div class="content">
                          <table class="angletable">
                            <tr>
                              <td colspan="2" class="anglevideotitle">
                                Angle 1
                              </td>
                            </tr>
                            <tr>
                              <td class="anglevideo">
                                <a href="[videourl.mp4]"
                                  ><img
                                    src="../assets/videoicon.png"
                                    width="25"
                                /></a>
                              </td>
                              <td class="anglevideo">
                                <a href="[videourl.mp4]"
                                  ><img
                                    src="../assets/videoicon.png"
                                    width="25"
                                /></a>
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2" class="anglevideotitle">
                                Angle 2
                              </td>
                            </tr>
                            <tr>
                              <td class="anglevideo">
                                <a href="[videourl.mp4]"
                                  ><img
                                    src="../assets/videoicon.png"
                                    width="25"
                                /></a>
                              </td>
                              <td class="anglevideo">
                                <a href="[videourl.mp4]"
                                  ><img
                                    src="../assets/videoicon.png"
                                    width="25"
                                /></a>
                              </td>
                            </tr>
                          </table>
                          <h3>
                            High quality videos may not be immediately available
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
                    style="display: none"
                    id="medians$exerciseNumber$competitorid"
                  >
                    <table class="results-median">
                      <tr>
                        <td class="results-medianheadtitle">Element</td>
                        <td class="results-medianhead"></td>
                      </tr>
                      <tr>
                        <td class="results-medianheadtitle">Median 1</td>
                        <td class="results-medianscore"></td>
                      </tr>
                      <tr>
                        <td class="results-medianheadtitle">Median 2</td>
                        <td class="results-medianscore"></td>
                      </tr>
                      <tr>
                        <td class="results-medianheadtitle">Sum</td>
                        <td class="results-medianscore"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table class="results-total-table">
                <tr>
                  <td class="results-scores-round">Qualification Total</td>
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
      this.fetchResults();
    },
    async fetchResults() {
      let tempData;
      await fetch(
        "http://" +
          process.env.VUE_APP_API_IP_ADDRESS +
          ":" +
          process.env.VUE_APP_API_PORT +
          "/api/liveResults?catId=" +
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
      this.resultsData = tempData.map((x) => {
        let fullName =
          this.categoryData.Discipline == "TRS"
            ? x.Surname1 + " " + x.Surname2
            : x.FirstName1 + " " + x.Surname1;
        let fullNameReversed =
          this.categoryData.Discipline == "TRS"
            ? x.Surname2.toUpperCase() + " " + x.Surname1.toUpperCase()
            : x.Surname1.toUpperCase() + " " + x.FirstName1;
        x.FullName = fullName;
        x.fullNameReversed = fullNameReversed;
        x.Rank =
          this.categoryData.CompType == 0
            ? x.DisplayZeroRank
            : x.DisplayCumulativeRank;
        return x;
      });
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/online.style.css";
</style>
