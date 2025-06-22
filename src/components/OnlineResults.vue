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
            <a :href="`/online`"
              ><img src="../assets/back.png" height="15"
            /></a>
          </td>
          <td class="results-selector">
            <a class="online-a" :href="`/online`">Category Selector</a>
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
                {{ this.eventInfo.EventName }}
              </td>
            </tr>
            <tr>
              <td class="results-bannerlive">RESULTS</td>
            </tr>
          </table>
        </div>

        <div
          class="results-roundstatus"
          v-if="this.resultsData && this.resultsData.length > 0"
        >
          <table cellspacing="0" align="center">
            <tr>
              <template
                v-for="(round, index) in getRoundsForAllCompetitors()"
                :key="round"
              >
                <td class="roundstatusround">
                  {{ this.categoryRounds.length == 1 ? `STATUS` : round }}
                </td>
                <td
                  v-if="index !== getRoundsForAllCompetitors().length - 1"
                  class="spacer"
                ></td>
              </template>
            </tr>
            <template
              v-for="(round, index) in getRoundsForAllCompetitors()"
              :key="round"
            >
              <td :class="getRoundStatusClass(round)">
                {{ getRoundStatusString(round) }}
              </td>
              <td
                v-if="index !== getRoundsForAllCompetitors().length - 1"
                class="spacer"
              ></td>
            </template>
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

        <div v-if="this.categoryRounds.length > 1" class="results-filterBtns">
          <div class="results-btnfilterimg">
            <img src="../assets/filter.png" width="20" />
          </div>
          <button
            id="mybutton"
            class="results-btn"
            :class="{ active: this.roundFilterString === '' }"
            @click="updateRoundFilter('')"
          >
            All
          </button>
          <button
            class="results-btn"
            :class="{ active: this.roundFilterString === 'Q' }"
            @click="updateRoundFilter('Q')"
          >
            Q
          </button>
          <button
            class="results-btn"
            :class="{ active: this.roundFilterString === 'F' }"
            @click="updateRoundFilter('F')"
          >
            F
          </button>
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
                v-show="roundFilter(round)"
              >
                <table class="results-scores-table">
                  <tr class="results-headers">
                    <th class="results-scores-routine2">Exercise</th>
                    <th class="results-scores-routine4"># Elements</th>
                    <th class="results-scores-routine3">E</th>
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
                      <td class="results-scores-routine4">
                        {{ exercise.ExerciseNumber }}
                      </td>
                      <td class="results-scores-routine">
                        {{ exercise.Elements }}
                      </td>
                      <td class="results-scores-tri-set-E">
                        {{ formattedNumber(exercise.Execution, 2) }}
                        <label
                          v-if="
                            exercise.Deductions &&
                            exercise.Deductions.length > 0
                          "
                          @click="
                            toggleMedians(
                              exercise.ExerciseNumber,
                              exercise.CompetitorId
                            )
                          "
                          >{{
                            this.getMediansLabel(
                              exercise.ExerciseNumber,
                              exercise.CompetitorId
                            )
                          }}</label
                        >
                      </td>
                      <td
                        v-if="
                          this.categoryData.Discipline == 'TRA' ||
                          this.categoryData.Discipline == 'TRS'
                        "
                        class="results-scores-tri-set-H"
                      >
                        {{ formattedNumber(exercise.HD, 2) }}
                        <label
                          v-if="
                            exercise.HDDeductions &&
                            exercise.HDDeductions.length > 0
                          "
                          @click="
                            toggleHDDeductions(
                              exercise.ExerciseNumber,
                              exercise.CompetitorId
                            )
                          "
                          >{{
                            this.getHDDeductionsLabel(
                              exercise.ExerciseNumber,
                              exercise.CompetitorId
                            )
                          }}</label
                        >
                      </td>
                      <td class="results-scores-tri-set-D">
                        {{
                          formattedNumber2(
                            exercise.Difficulty,
                            exercise.Bonus,
                            1
                          )
                        }}
                        <label
                          v-if="exercise.Bonus > 0"
                          @click="
                            toggleDifficulty(
                              exercise.ExerciseNumber,
                              exercise.CompetitorId
                            )
                          "
                          >{{
                            this.getDifficultyLabel(
                              exercise.ExerciseNumber,
                              exercise.CompetitorId
                            )
                          }}</label
                        >
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
                            ? formattedNumber(exercise.Sync, 2)
                            : formattedNumber(exercise.ToF, 2)
                        }}
                        <label
                          v-if="
                            exercise.HDDeductions &&
                            exercise.HDDeductions.length > 0
                          "
                          @click="
                            toggleTSValues(
                              exercise.ExerciseNumber,
                              exercise.CompetitorId
                            )
                          "
                          >{{
                            this.getTSValuesLabel(
                              exercise.ExerciseNumber,
                              exercise.CompetitorId
                            )
                          }}</label
                        >
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
                            @click="
                              exercise.Videos
                                ? togglePopup(
                                    exercise.CompetitorId,
                                    exercise.ExerciseNumber
                                  )
                                : null
                            "
                            ><img
                              :src="this.getVideoImageSource(exercise)"
                              width="25"
                          /></a>
                        </div>
                        <transition name="fade">
                          <div
                            v-if="
                              exercisePopups[
                                `${exercise.CompetitorId}-${exercise.ExerciseNumber}`
                              ]
                            "
                            class="results-overlay"
                          >
                            <div class="results-popup">
                              <p>
                                {{ result.fullNameReversed }}<br />Exercise
                                {{ exercise.ExerciseNumber }}<br /><br />
                              </p>

                              <h2>SELECT ANGLE</h2>
                              <a
                                class="close"
                                @click="
                                  togglePopup(
                                    exercise.CompetitorId,
                                    exercise.ExerciseNumber
                                  )
                                "
                                >&times;</a
                              >
                              <div class="content">
                                <table class="angletable" cellspacing="0">
                                  <template
                                    v-for="angle in getAnglesForExercise(
                                      exercise.Videos
                                    )"
                                    :key="angle"
                                  >
                                    <tr>
                                      <td colspan="7" class="anglevideotitle">
                                        Angle {{ angle }}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="anglevideoname">LQ</td>
                                      <template
                                        v-if="
                                          exercise.Videos.find(
                                            (x) =>
                                              x.Angle == angle &&
                                              x.Variant == 'LQ'
                                          )
                                        "
                                      >
                                        <td class="anglevideob">
                                          <a
                                            :href="
                                              getExerciseVideoLink(
                                                exercise.Videos,
                                                angle,
                                                'LQ'
                                              )
                                            "
                                            @click.prevent="
                                              downloadItem(
                                                exercise.Videos,
                                                angle,
                                                'LQ'
                                              )
                                            "
                                            ><img
                                              src="../assets/download.png"
                                              height="19"
                                          /></a>
                                        </td>
                                      </template>
                                      <template v-else>
                                        <td class="anglevideoa">
                                          <a class="disabled-link">
                                            <img
                                              src="../assets/playdisabled.png"
                                              height="19"
                                            />
                                          </a>
                                        </td>
                                        <td class="anglevideob">
                                          <a class="disabled-link"
                                            ><img
                                              src="../assets/downloaddisabled.png"
                                              height="19"
                                          /></a>
                                        </td>
                                      </template>
                                      <td class="anglespace"></td>
                                      <td class="anglevideoname">HQ</td>
                                      <template
                                        v-if="
                                          exercise.Videos.find(
                                            (x) =>
                                              x.Angle == angle &&
                                              x.Variant == 'HQ'
                                          )
                                        "
                                      >
                                        <td class="anglevideob">
                                          <a
                                            :href="
                                              getExerciseVideoLink(
                                                exercise.Videos,
                                                angle,
                                                'HQ'
                                              )
                                            "
                                            @click.prevent="
                                              downloadItem(
                                                exercise.Videos,
                                                angle,
                                                'HQ'
                                              )
                                            "
                                            ><img
                                              src="../assets/download.png"
                                              height="19"
                                          /></a>
                                        </td>
                                      </template>
                                      <template v-else>
                                        <td class="anglevideoa">
                                          <a class="disabled-link">
                                            <img
                                              src="../assets/playdisabled.png"
                                              height="19"
                                            />
                                          </a>
                                        </td>
                                        <td class="anglevideob">
                                          <a class="disabled-link"
                                            ><img
                                              src="../assets/downloaddisabled.png"
                                              height="19"
                                          /></a>
                                        </td>
                                      </template>
                                    </tr>
                                  </template>
                                </table>
                                <h3>
                                  High quality videos may not be immediately
                                  available
                                </h3>
                              </div>
                            </div>
                          </div>
                        </transition>
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
                        <span
                          colspan="100%"
                          style="
                            text-align: center;
                            font-weight: bold;
                            margin-top: 10px;
                            display: block;
                          "
                        >
                          Execution
                        </span>
                        <table class="results-median">
                          <tr>
                            <td class="results-medianheadtitle">Element</td>
                            <td
                              v-for="median in (exercise.Medians || []).filter(
                                (median) => median.MedSum != null
                              )"
                              :key="median"
                              class="results-medianhead"
                            >
                              {{ median.DeductionNumber }}
                            </td>
                          </tr>
                          <tr
                            v-for="(
                              deductions, judgeNumber
                            ) in getGroupedDeductions(exercise.Deductions)"
                            :key="judgeNumber"
                          >
                            <td class="results-medianheadtitle">
                              Judge {{ judgeNumber }}
                            </td>
                            <td
                              v-for="deduction in deductions"
                              :key="deduction.DeductionNumber"
                              class="results-medianscore"
                              :style="
                                getDeductionStyle(deduction, exercise.Medians)
                              "
                            >
                              {{ deduction.DeductionValue }}
                            </td>
                          </tr>
                          <tr>
                            <td class="results-medianheadtitle">Median 1</td>
                            <td
                              v-for="median in exercise.Medians"
                              :key="median"
                              class="results-medianscore"
                            >
                              {{ formatMedian(median.Med1) }}
                            </td>
                          </tr>
                          <tr>
                            <td class="results-medianheadtitle">Median 2</td>
                            <td
                              v-for="median in exercise.Medians"
                              :key="median"
                              class="results-medianscore"
                            >
                              {{ formatMedian(median.Med2) }}
                            </td>
                          </tr>
                          <tr>
                            <td class="results-medianheadtitle">
                              {{
                                this.categoryData.Discipline == "TRS"
                                  ? "Average"
                                  : "Sum"
                              }}
                            </td>
                            <td
                              v-for="median in exercise.Medians"
                              :key="median"
                              class="results-medianscore"
                            >
                              {{ formatMedian(median.MedSum) }}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        v-if="exercise.HDDeductions"
                        class="results-scores-tri-medians"
                        colspan="100%"
                        :style="
                          getHDDeductionsStyle(
                            exercise.ExerciseNumber,
                            exercise.CompetitorId
                          )
                        "
                        :id="
                          'hddeductions' +
                          exercise.ExerciseNumber +
                          exercise.CompetitorId
                        "
                      >
                        <span
                          colspan="100%"
                          style="
                            text-align: center;
                            font-weight: bold;
                            margin-top: 10px;
                            display: block;
                          "
                        >
                          Horizontal Displacement
                        </span>
                        <table class="results-median">
                          <tr>
                            <td class="results-medianheadtitle">Element</td>
                            <td
                              v-for="hddeduction in [
                                ...new Map(
                                  exercise.HDDeductions.filter(
                                    (hddeduction) =>
                                      hddeduction.DeductionValue != null
                                  ).map((item) => [item.DeductionNumber, item])
                                ).values(),
                              ]"
                              :key="hddeduction"
                              class="results-medianhead"
                            >
                              {{ hddeduction.DeductionNumber }}
                            </td>
                          </tr>
                          <tr
                            v-for="(
                              deductions, judgeNumber
                            ) in getGroupedDeductions(exercise.HDDeductions)"
                            :key="judgeNumber"
                          >
                            <td
                              v-if="
                                new Set(
                                  exercise.HDDeductions.map(
                                    (deduction) => deduction.JudgeNumber
                                  )
                                ).size > 1
                              "
                              class="results-medianheadtitle"
                            >
                              Gymnast {{ judgeNumber }}
                            </td>
                            <td v-else class="results-medianheadtitle">
                              Deduction
                            </td>
                            <td
                              v-for="deduction in deductions"
                              :key="deduction.DeductionNumber"
                              class="results-medianscore"
                            >
                              {{ deduction.DeductionValue }}
                            </td>
                          </tr>
                        </table>
                        <div class="svg-container">
                          <div
                            v-for="(
                              deductions, judgeNumber
                            ) in getGroupedDeductions(exercise.HDDeductions)"
                            :key="judgeNumber"
                            class="trampoline-container"
                          >
                            <!-- Background trampoline image -->
                            <img
                              src="@/assets/trampoline.png"
                              class="trampoline-image"
                              alt="Trampoline"
                            />

                            <!-- SVG overlay for data points - positioned over the active area -->
                            <svg
                              viewBox="-200 -100 400 200"
                              preserveAspectRatio="xMidYMid meet"
                              class="trampoline-svg-overlay"
                            >
                              <!-- Data points -->
                              <g
                                v-for="(point, index) in deductions"
                                :key="index"
                              >
                                <circle
                                  :cx="point.XCoordinate"
                                  :cy="-point.YCoordinate"
                                  r="8"
                                  fill="#0066cc"
                                  stroke="white"
                                  stroke-width="2"
                                  opacity="0.5"
                                />
                                <text
                                  :x="point.XCoordinate"
                                  :y="-point.YCoordinate + 3"
                                  text-anchor="middle"
                                  font-size="10"
                                  fill="white"
                                  font-weight="bold"
                                  font-family="Arial, sans-serif"
                                >
                                  {{ point.DeductionNumber }}
                                </text>
                              </g>
                            </svg>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td
                        class="results-scores-difficulty"
                        colspan="100%"
                        :style="
                          getDifficultyStyle(
                            exercise.ExerciseNumber,
                            exercise.CompetitorId
                          )
                        "
                        :id="
                          'difficulty' +
                          exercise.ExerciseNumber +
                          exercise.CompetitorId
                        "
                      >
                        <span
                          colspan="100%"
                          style="
                            text-align: center;
                            font-weight: bold;
                            margin-top: 10px;
                            display: block;
                          "
                        >
                          Difficulty
                        </span>
                        <table class="results-difficulty">
                          <tr>
                            <td class="results-medianhead">Difficulty</td>
                            <td class="results-medianhead">Bonus</td>
                          </tr>
                          <tr>
                            <td class="results-medianscore">
                              {{ formattedNumber(exercise.Difficulty, 1) }}
                            </td>
                            <td class="results-medianscore">
                              {{ formattedNumber(exercise.Bonus, 1) }}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td
                        v-if="exercise.TSValues"
                        class="results-scores-tri-medians"
                        colspan="100%"
                        :style="
                          getTSValuesStyle(
                            exercise.ExerciseNumber,
                            exercise.CompetitorId
                          )
                        "
                        :id="
                          'tsvalues' +
                          exercise.ExerciseNumber +
                          exercise.CompetitorId
                        "
                      >
                        <span
                          v-if="this.categoryData.Discipline == 'TRS'"
                          colspan="100%"
                          style="
                            text-align: center;
                            font-weight: bold;
                            margin-top: 10px;
                            display: block;
                          "
                        >
                          Synchronisation
                        </span>
                        <span
                          v-else
                          colspan="100%"
                          style="
                            text-align: center;
                            font-weight: bold;
                            margin-top: 10px;
                            display: block;
                          "
                        >
                          Time of Flight
                        </span>
                        <table class="results-median">
                          <tr>
                            <td class="results-medianheadtitle">Element</td>
                            <td
                              v-for="tsvalue in exercise.TSValues"
                              :key="tsvalue"
                              class="results-medianhead"
                            >
                              {{ tsvalue.SkillNumber }}
                            </td>
                          </tr>
                          <tr>
                            <td
                              v-if="this.categoryData.Discipline == 'TRS'"
                              class="results-medianheadtitle"
                            >
                              Sync
                            </td>
                            <td v-else class="results-medianheadtitle">Time</td>
                            <td
                              v-for="tsValue in exercise.TSValues"
                              :key="tsValue.SkillNumber"
                              class="results-medianscore"
                            >
                              {{ tsValue.Value }}
                            </td>
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
                    <td class="results-scores-tri-Tot">
                      {{
                        formattedNumber(
                          (result.RoundTotals &&
                            result.RoundTotals.filter(
                              (roundTotal) => roundTotal.Round == round
                            )[0]?.RoundTotal) ||
                            0,
                          2
                        )
                      }}
                    </td>
                  </tr>
                </table>
                <table class="results-round-rank-table">
                  <tr>
                    <td class="results-scores-roundrank">
                      {{
                        this.categoryRounds.length == 1 ? `Rank` : `Round Rank`
                      }}
                    </td>
                    <td class="results-scores-roundrank-tot">
                      {{
                        result.RoundTotals.filter(
                          (roundTotal) => roundTotal.Round == round
                        )[0].RoundRank
                      }}
                    </td>
                  </tr>
                </table>
              </div>
              <template
                v-if="
                  result.CompType == 1 &&
                  getRoundsForCompetitor(result.Exercises).length > 1
                "
              >
                <table class="results-total-table" style="margin-top: 0">
                  <tr>
                    <td class="results-scores-round">Total</td>
                    <td class="results-scores-tri-Tot">
                      {{ formattedNumber(result.TotalScore, 2) }}
                    </td>
                  </tr>
                </table>
                <table class="results-round-rank-table" style="margin-top: 0">
                  <tr>
                    <td class="results-scores-roundrank">Rank</td>
                    <td class="results-scores-roundrank-tot">
                      {{ result.DisplayCumulativeRank }}
                    </td>
                  </tr>
                </table>
              </template>
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
import { fetchWithRetry } from "../apiUtils";

export default {
  name: "OnlineResults",
  computed: {
    catId() {
      return this.$route.params.catId;
    },
    event() {
      return this.$route.params.event;
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
      difficultyVisible: {},
      hdDeductionsVisible: {},
      tsValuesVisible: {},
      roundFilterString: "",
      eventInfo: {},
      exercisePopups: {},
    };
  },
  created() {
    this.fetchEventInfo();
    this.fetchCategory();
  },
  methods: {
    togglePopup(competitorId, exerciseNumber) {
      this.exercisePopups[`${competitorId}-${exerciseNumber}`] =
        !this.exercisePopups[`${competitorId}-${exerciseNumber}`];
      console.log(this.exercisePopups);
    },
    async fetchCategory() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        `/api/categories?catId=${this.catId}`;

      try {
        const data = await fetchWithRetry(url);
        this.categoryData = data[0];
        this.updateTitle();
        await this.fetchRounds();
        this.fetchResults();
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    },
    async fetchEventInfo() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        "/api/eventInfo";
      try {
        const data = await fetchWithRetry(url);
        this.eventInfo = data[0];
      } catch (error) {
        console.error("Error fetching event info: ", error);
      }
    },
    async fetchResults() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        `/api/onlineResults?catId=${this.catId}&compType=${this.categoryData.CompType}`;

      try {
        const tempData = await fetchWithRetry(url);
        let competitorsWithScores = tempData.filter(
          (competitor) => competitor.Exercises.length > 0
        );

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
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    },
    async fetchRounds() {
      const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        `/api/rounds?catId=${this.categoryData.CatId}`;

      try {
        const data = await fetchWithRetry(url);
        this.categoryRounds = data;
      } catch (error) {
        console.error("Error fetching rounds:", error);
      }
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
    formatMedian(median) {
      let medianAsFloat = parseFloat(median);
      let medianAsInt = parseInt(median);

      medianAsFloat = isNaN(medianAsFloat) ? null : medianAsFloat;
      medianAsInt = isNaN(medianAsInt) ? null : medianAsInt;
      let returnedMedian =
        medianAsFloat == medianAsInt ? medianAsInt : medianAsFloat.toFixed(2);
      return returnedMedian;
    },
    roundFilter(round) {
      if (this.roundFilterString == "") return true;
      if (this.roundFilterString == round[0]) return true;
      return false;
    },
    updateRoundFilter(roundFilter) {
      this.roundFilterString = roundFilter;
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
    getRoundsForAllCompetitors() {
      const roundData = [];
      if (!this.resultsData || this.resultsData.length == 0) return roundData;
      this.resultsData.forEach((competitor) => {
        competitor.Exercises.forEach((exercise) => {
          const round = {
            RoundName: exercise.RoundName,
            RoundOrder: exercise.RoundOrder,
          };
          roundData.push(round);
        });
      });
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
      if (this.categoryRounds.length == 1) return "";
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
    toggleHDDeductions(exerciseNumber, competitorId) {
      const key = "hddeductions" + exerciseNumber + competitorId;
      this.hdDeductionsVisible[key] = !this.hdDeductionsVisible[key];
    },
    toggleDifficulty(exerciseNumber, competitorId) {
      const key = "difficulty" + exerciseNumber + competitorId;
      this.difficultyVisible[key] = !this.difficultyVisible[key];
    },
    toggleTSValues(exerciseNumber, competitorId) {
      const key = "tsvalues" + exerciseNumber + competitorId;
      this.tsValuesVisible[key] = !this.tsValuesVisible[key];
    },
    getMediansLabel(exerciseNumber, competitorId) {
      const key = "medians" + exerciseNumber + competitorId;
      return this.mediansVisible[key] ? "[-]" : "[+]";
    },
    getHDDeductionsLabel(exerciseNumber, competitorId) {
      const key = "hddeductions" + exerciseNumber + competitorId;
      return this.hdDeductionsVisible[key] ? "[-]" : "[+]";
    },
    getDifficultyLabel(exerciseNumber, competitorId) {
      const key = "difficulty" + exerciseNumber + competitorId;
      return this.difficultyVisible[key] ? "[-]" : "[+]";
    },
    getTSValuesLabel(exerciseNumber, competitorId) {
      const key = "tsvalues" + exerciseNumber + competitorId;
      return this.tsValuesVisible[key] ? "[-]" : "[+]";
    },
    getMediansStyle(exerciseNumber, competitorId) {
      const key = "medians" + exerciseNumber + competitorId;
      return {
        display: this.mediansVisible[key] ? "table-cell" : "none",
      };
    },
    getHDDeductionsStyle(exerciseNumber, competitorId) {
      const key = "hddeductions" + exerciseNumber + competitorId;
      return {
        display: this.hdDeductionsVisible[key] ? "table-cell" : "none",
      };
    },
    getTSValuesStyle(exerciseNumber, competitorId) {
      const key = "tsvalues" + exerciseNumber + competitorId;
      return {
        display: this.tsValuesVisible[key] ? "table-cell" : "none",
      };
    },
    getDifficultyStyle(exerciseNumber, competitorId) {
      const key = "difficulty" + exerciseNumber + competitorId;
      return {
        display: this.difficultyVisible[key] ? "table-cell" : "none",
      };
    },
    getGroupedDeductions(deductions) {
      if (!deductions) return {}; // Add this check
      return deductions.reduce((acc, deduction) => {
        if (!acc[deduction.JudgeNumber]) {
          acc[deduction.JudgeNumber] = [];
        }
        acc[deduction.JudgeNumber].push(deduction);
        return acc;
      }, {});
    },
    getRoundStatusClass(round) {
      let categoryRound = this.categoryRounds.filter(
        (item) => item.RoundName == round
      )[0];
      if (!categoryRound) return "roundstatusprovisional";
      return categoryRound.SignedOff == 1
        ? "roundstatusofficial"
        : "roundstatusprovisional";
    },
    getRoundStatusString(round) {
      let categoryRound = this.categoryRounds.filter(
        (item) => item.RoundName == round
      )[0];
      if (!categoryRound) return "Provisional";
      return categoryRound.SignedOff == 1 ? "Official" : "Provisional";
    },
    updateTitle() {
      document.title =
        this.categoryData.Discipline +
        " " +
        this.categoryData.Category +
        " - Live Results";
    },
    getVideoImageSource(exercise) {
      if (exercise.Videos) {
        return new URL("../assets/videoicon.png", import.meta.url).href;
      } else {
        return new URL("../assets/NoVideo.png", import.meta.url).href;
      }
    },
    getAnglesForExercise(videos) {
      if (!videos) return [];
      const uniqueAngles = new Set(videos.map((item) => item.Angle));
      return Array.from(uniqueAngles);
    },
    getExerciseVideoFilename(videos, angle, variant) {
      if (!videos) return "";
      var video = videos.find((x) => x.Angle == angle && x.Variant == variant);
      if (!video) return "";
      return video.Filename;
    },
    getExerciseVideoLink(videos, angle, variant) {
      return (
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        `/api/videoFile?event=${
          this.eventInfo.EventShortName
        }&fileName=${encodeURIComponent(
          this.getExerciseVideoFilename(videos, angle, variant)
        )}&variant=${variant}`
      );
    },
    downloadItem(videos, angle, variant) {
      if (!videos) return "";
      var video = videos.find((x) => x.Angle == angle && x.Variant == variant);
      if (!video) return "";
      const url = this.getExerciseVideoLink(videos, angle, variant);
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = video.Filename;
          link.click();
          URL.revokeObjectURL(link.href);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    isExerciseLinkInvalid() {
      try {
        return !this.checkFileExists();
      } catch (error) {
        console.log(error);
        return true;
      }
    },
    async checkFileExists(/*filePath*/) {
      /*const url =
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        `/api/fileExists?filePath=${filePath}`;

      try {
        const data = await fetchWithRetry(url);
        return data[0];
      } catch (error) {
        console.error("Error fetching file:", error);
      }*/
      return true;
    },
    getDeductionStyle(deduction, medians) {
      if (!medians) return ""; // Handle no median case
      if (
        !deduction ||
        (!deduction.DeductionValue && deduction.DeductionValue != 0)
      )
        return;
      let median = medians.find(
        (median) =>
          median.ExerciseNumber === deduction.ExerciseNumber &&
          median.DeductionNumber === deduction.DeductionNumber
      );
      // Check if deduction matches the median based on ExerciseNumber and DeductionNumber
      if (median) {
        const difference1 = deduction.DeductionValue - median.Med1;
        const difference2 = deduction.DeductionValue - median.Med2;
        if (Math.abs(difference1) < 1 || Math.abs(difference2) < 1) {
          return "background-color: rgb(5, 176, 80);"; // Deduction less than 1 of median
        } else if (Math.abs(difference1) < 2 || Math.abs(difference2) < 2) {
          return "background-color: rgb(255, 191, 0);"; // Deduction within 2 of median
        } else {
          return "background-color: rgb(217, 0, 2);"; // Deduction greater than 2 of median
        }
      } else {
        return ""; // Return empty string if deduction doesn't match the median
      }
    },
  },
};
</script>

<style scoped>
@import "../stylesheets/results.style.css";
.disabled-link {
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.svg-container {
  width: 100%;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.trampoline-container {
  position: relative;
  display: inline-block;
  width: 50%;
  max-width: 500px;
}

.trampoline-image {
  width: 100%;
  height: auto;
  display: block;
}

.trampoline-svg-overlay {
  position: absolute;
  top: 16%;
  left: 8%;
  width: 84%;
  height: 68%;
  pointer-events: auto;
  cursor: pointer;
}
</style>
