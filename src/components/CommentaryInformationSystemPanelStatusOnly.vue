<template>
  <div class="cis-bodydiv">
    <div class="cis-time">{{ currentTime }}</div>

    <div class="cis-logosb">
      <img src="../assets/scorebase.png" height="25" />
    </div>

    <div class="cis-panelstatuspanel-left">
      <div class="cis-statustitle">Panel Status</div>

      <template v-for="panelStatus in firstHalf" :key="panelStatus.PanelNo">
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

              <td class="cis-namestatus">
                <transition name="slideup" mode="out-in">
                  <div
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
                  </div>
                </transition>
              </td>
              <transition-group name="fade" mode="out-in">
                <td
                  v-show="panelStatus.Status == 0"
                  class="cis-statusheaderwait"
                >
                  Status
                </td>
                <td v-show="panelStatus.Status == 1" class="cis-statusheadergo">
                  Status
                </td>
              </transition-group>
            </tr>
            <tr>
              <td class="cis-clubnamestatus">
                <transition name="slideup" mode="out-in">
                  <div :key="panelStatus.NextToCompeteClub">
                    {{ panelStatus.NextToCompeteClub }}
                  </div>
                </transition>
              </td>
              <transition-group name="fade" mode="out-in">
                <td
                  v-show="panelStatus.Status == 0"
                  class="cis-statusstatuswait"
                >
                  UP NEXT
                </td>
                <td v-show="panelStatus.Status == 1" class="cis-statusstatusgo">
                  ON NOW
                </td>
              </transition-group>
            </tr>
            <tr>
              <td class="latestspacer" colspan="3"></td>
            </tr>
            <tr>
              <transition name="slideup" mode="out-in">
                <td
                  v-if="panelStatus.NextToCompeteNation"
                  class="cis-flaglatest"
                  rowspan="2"
                  :key="panelStatus.NextToCompeteNation"
                >
                  <img
                    :src="getFlagImageSource(panelStatus.NextToCompeteNation)"
                    width="30"
                  />
                </td>
                <td v-else class="cis-noflaglast" rowspan="2"></td>
              </transition>
              <td class="cis-namestatuslast">
                <transition name="slideup" mode="out-in">
                  <div :key="getLastToCompeteKey(panelStatus)">
                    {{ getLastToCompeteText(panelStatus) }}
                  </div>
                </transition>
              </td>
              <td class="cis-statusstatuslast" rowspan="2">Previously On</td>
            </tr>
            <tr>
              <td class="cis-clubnamestatuslast">
                <transition name="slideup" mode="out-in">
                  <div :key="panelStatus.LastToCompeteClub">
                    {{ panelStatus.LastToCompeteClub }}
                  </div>
                </transition>
              </td>
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
                Panel {{ panelStatus.PanelNo }} | Status Coming Soon
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
            <tr>
              <td class="cis-latestspacer" colspan="3"></td>
            </tr>
            <tr>
              <td class="cis-noflaglast" rowspan="2"></td>
              <td class="cis-namestatuslast"></td>
              <td class="cis-statusstatuslast" rowspan="2"></td>
            </tr>
            <tr>
              <td class="cis-clubnamestatuslast"></td>
            </tr>
          </table>
        </div>
      </template>
    </div>

    <div class="cis-panelstatuspanel">
      <div class="cis-statustitle">Panel Status</div>

      <template v-for="panelStatus in secondHalf" :key="panelStatus.PanelNo">
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
              <td class="cis-namestatus">
                <transition name="slideup" mode="out-in">
                  <div
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
                  </div>
                </transition>
              </td>
              <transition-group name="fade" mode="out-in">
                <td
                  v-show="panelStatus.Status == 0"
                  class="cis-statusheaderwait"
                >
                  Status
                </td>
                <td v-show="panelStatus.Status == 1" class="cis-statusheadergo">
                  Status
                </td>
              </transition-group>
            </tr>
            <tr>
              <td class="cis-clubnamestatus">
                <transition name="slideup" mode="out-in">
                  <div :key="panelStatus.NextToCompeteClub">
                    {{ panelStatus.NextToCompeteClub }}
                  </div>
                </transition>
              </td>
              <transition-group name="fade" mode="out-in">
                <td
                  v-show="panelStatus.Status == 0"
                  class="cis-statusstatuswait"
                >
                  UP NEXT
                </td>
                <td v-show="panelStatus.Status == 1" class="cis-statusstatusgo">
                  ON NOW
                </td>
              </transition-group>
            </tr>
            <tr>
              <td class="latestspacer" colspan="3"></td>
            </tr>
            <tr>
              <transition name="slideup" mode="out-in">
                <td
                  v-if="panelStatus.NextToCompeteNation"
                  class="cis-flaglatest"
                  rowspan="2"
                  :key="panelStatus.NextToCompeteNation"
                >
                  <img
                    :src="getFlagImageSource(panelStatus.NextToCompeteNation)"
                    width="30"
                  />
                </td>
                <td v-else class="cis-noflaglast" rowspan="2"></td>
              </transition>
              <td class="cis-namestatuslast">
                <transition name="slideup" mode="out-in">
                  <div :key="getLastToCompeteKey(panelStatus)">
                    {{ getLastToCompeteText(panelStatus) }}
                  </div>
                </transition>
              </td>
              <td class="cis-statusstatuslast" rowspan="2">Previously On</td>
            </tr>
            <tr>
              <td class="cis-clubnamestatuslast">
                <transition name="slideup" mode="out-in">
                  <div :key="panelStatus.LastToCompeteClub">
                    {{ panelStatus.LastToCompeteClub }}
                  </div>
                </transition>
              </td>
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
                Panel {{ panelStatus.PanelNo }} | Status Coming Soon
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
            <tr>
              <td class="cis-latestspacer" colspan="3"></td>
            </tr>
            <tr>
              <td class="cis-noflaglast" rowspan="2"></td>
              <td class="cis-namestatuslast"></td>
              <td class="cis-statusstatuslast" rowspan="2"></td>
            </tr>
            <tr>
              <td class="cis-clubnamestatuslast"></td>
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
  computed: {
    firstHalf() {
      const midpoint = Math.ceil(this.panelStatuses.length / 2);
      return this.panelStatuses.slice(0, midpoint);
    },
    secondHalf() {
      const midpoint = Math.ceil(this.panelStatuses.length / 2);
      return this.panelStatuses.slice(midpoint);
    },
  },
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
    }, 60000);
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
      if (!this.compareArrays(this.tempPanelStatuses, this.panelStatuses)) {
        this.panelStatuses = this.tempPanelStatuses;
      }
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
      if (countryCode == undefined || countryCode == "") countryCode = "GBR";
      if (countryCode.includes("/")) {
        countryCode = countryCode.split("/")[0];
      }
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
    getLastToCompeteKey(panelStatus) {
      const surname1 = panelStatus.LastToCompeteSurname1 || "unknown";
      const firstName1 = panelStatus.LastToCompeteFirstName1 || "unknown";
      return surname1 + firstName1;
    },
    getLastToCompeteText(panelStatus) {
      const surname1 = panelStatus.LastToCompeteSurname1 || "";
      const firstName1 = panelStatus.LastToCompeteFirstName1 || "";
      const surname2 = panelStatus.LastToCompeteSurname2 || "";

      if (panelStatus.LastToCompeteDiscipline === "TRS") {
        return [surname1, surname2]
          .filter((name) => name)
          .map((name) => name.toUpperCase())
          .join(", ");
      } else {
        return [surname1, firstName1]
          .filter((name) => name)
          .map((name) => name.toUpperCase())
          .join(", ");
      }
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
