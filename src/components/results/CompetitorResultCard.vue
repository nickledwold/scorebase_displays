<template>
  <div class="result">
    <table class="results-top-name">
      <tbody>
        <tr class="results-name">
          <td v-if="position" rowspan="2" class="results-scores-pos">
            {{ position }}
          </td>
          <td class="results-scores-name">{{ result.fullNameReversed }}</td>
          <td
            v-if="showQualification"
            rowspan="2"
            class="results-scores-qualificationstatus"
          >
            {{ result.QualificationStatus }}
          </td>
        </tr>
        <tr class="results-name">
          <td class="results-scores-club">{{ result.DisplayClub }}</td>
        </tr>
      </tbody>
    </table>
    <div v-if="!noResults && result.Exercises.length > 0">
      <div
        v-for="round in roundsForCompetitor"
        :key="round"
        v-show="roundFilter(round)"
      >
        <table class="results-scores-table">
          <thead>
            <tr class="results-headers">
              <th class="results-scores-routine2">Exercise</th>
              <th class="results-scores-routine4"># Elements</th>
              <th class="results-scores-routine3">E</th>
              <th v-if="isTrampolineDiscipline" class="results-scores-routine3">
                H
              </th>
              <th class="results-scores-routine3">D</th>
              <th v-if="isTrampolineDiscipline" class="results-scores-routine3">
                {{ discipline === "TRS" ? "S" : "T" }}
              </th>
              <th class="results-scores-routine3">Pen</th>
              <th class="results-scores-routine3">Total</th>
              <th class="results-scores-routine3">Rank</th>
              <th class="results-scores-routinevid">Video</th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="exercise in exercisesForRound(round)"
              :key="exercise.ExerciseNumber"
            >
              <tr>
                <td class="results-scores-routine4">
                  {{ exercise.ExerciseNumber }}
                </td>
                <td class="results-scores-routine">{{ exercise.Elements }}</td>
                <td class="results-scores-tri-set-E">
                  {{ formattedNumber(exercise.Execution, 2) }}
                  <label
                    v-if="exercise.Deductions && exercise.Deductions.length > 0"
                    @click="
                      toggleMedians(
                        exercise.ExerciseNumber,
                        exercise.CompetitorId
                      )
                    "
                    >{{
                      getMediansLabel(
                        exercise.ExerciseNumber,
                        exercise.CompetitorId
                      )
                    }}</label
                  >
                </td>
                <td
                  v-if="isTrampolineDiscipline"
                  class="results-scores-tri-set-H"
                >
                  {{ formattedNumber(exercise.HD, 2) }}
                  <label
                    v-if="
                      exercise.HDDeductions && exercise.HDDeductions.length > 0
                    "
                    @click="
                      toggleHDDeductions(
                        exercise.ExerciseNumber,
                        exercise.CompetitorId
                      )
                    "
                    >{{
                      getHDDeductionsLabel(
                        exercise.ExerciseNumber,
                        exercise.CompetitorId
                      )
                    }}</label
                  >
                </td>
                <td class="results-scores-tri-set-D">
                  {{ formattedNumber2(exercise.Difficulty, exercise.Bonus, 1) }}
                  <label
                    v-if="exercise.Bonus > 0"
                    @click="
                      toggleDifficulty(
                        exercise.ExerciseNumber,
                        exercise.CompetitorId
                      )
                    "
                    >{{
                      getDifficultyLabel(
                        exercise.ExerciseNumber,
                        exercise.CompetitorId
                      )
                    }}</label
                  >
                </td>
                <td
                  v-if="isTrampolineDiscipline"
                  class="results-scores-tri-set-ToF"
                >
                  {{
                    discipline === "TRS"
                      ? formattedNumber(exercise.Sync, 2)
                      : formattedNumber(exercise.ToF, 2)
                  }}
                  <label
                    v-if="exercise.TSValues && exercise.TSValues.length > 0"
                    @click="
                      toggleTSValues(
                        exercise.ExerciseNumber,
                        exercise.CompetitorId
                      )
                    "
                    >{{
                      getTSValuesLabel(
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
                <td class="results-scores-tri-set-Tot">{{ exercise.Rank }}</td>
                <td class="results-scores-tri-vid">
                  <div class="results-box">
                    <a
                      class="results-button"
                      @click="
                        hasVideos(exercise)
                          ? togglePopup(
                              exercise.CompetitorId,
                              exercise.ExerciseNumber
                            )
                          : null
                      "
                      ><img :src="getVideoImageSource(exercise)" width="25"
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
                            <tbody>
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
                                  <template
                                    v-for="(variant, variantIndex) in [
                                      'LQ',
                                      'HQ',
                                    ]"
                                    :key="variant"
                                  >
                                    <td
                                      v-if="variantIndex > 0"
                                      class="anglespace"
                                    ></td>
                                    <td class="anglevideoname">
                                      {{ variant }}
                                    </td>
                                    <template
                                      v-if="
                                        hasVariant(
                                          exercise.Videos,
                                          angle,
                                          variant
                                        )
                                      "
                                    >
                                      <td class="anglevideob">
                                        <a
                                          :href="
                                            getExerciseVideoLink(
                                              exercise.Videos,
                                              angle,
                                              variant
                                            )
                                          "
                                          @click.prevent="
                                            downloadItem(
                                              exercise.Videos,
                                              angle,
                                              variant
                                            )
                                          "
                                          ><img
                                            src="../../assets/download.png"
                                            height="19"
                                        /></a>
                                      </td>
                                    </template>
                                    <template v-else>
                                      <td class="anglevideoa">
                                        <a class="disabled-link">
                                          <img
                                            src="../../assets/playdisabled.png"
                                            height="19"
                                          />
                                        </a>
                                      </td>
                                      <td class="anglevideob">
                                        <a class="disabled-link"
                                          ><img
                                            src="../../assets/downloaddisabled.png"
                                            height="19"
                                        /></a>
                                      </td>
                                    </template>
                                  </template>
                                </tr>
                              </template>
                            </tbody>
                          </table>
                          <h3>
                            High quality videos may not be immediately available
                          </h3>
                        </div>
                      </div>
                    </div>
                  </transition>
                </td>
              </tr>
              <transition name="slide">
                <tr
                  :key="
                    'medians' + exercise.ExerciseNumber + exercise.CompetitorId
                  "
                  v-if="
                    isMediansVisible(
                      exercise.ExerciseNumber,
                      exercise.CompetitorId
                    )
                  "
                >
                  <td
                    style="display: table-cell"
                    class="results-scores-tri-medians"
                    colspan="100%"
                  >
                    <span class="results-details-title">Execution</span>
                    <table class="results-median">
                      <tbody>
                        <tr>
                          <td class="results-medianheadtitle">Element</td>
                          <td
                            v-for="median in (exercise.Medians || []).filter(
                              (m) => m.MedSum != null
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
                            {{ discipline === "TRS" ? "Average" : "Sum" }}
                          </td>
                          <td
                            v-for="median in exercise.Medians"
                            :key="median"
                            class="results-medianscore"
                          >
                            {{ formatMedian(median.MedSum) }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </transition>
              <transition name="slide">
                <tr
                  :key="
                    'hddeductions' +
                    exercise.ExerciseNumber +
                    exercise.CompetitorId
                  "
                  v-if="
                    isHDDeductionsVisible(
                      exercise.ExerciseNumber,
                      exercise.CompetitorId
                    )
                  "
                >
                  <td
                    style="display: table-cell"
                    class="results-scores-tri-medians"
                    colspan="100%"
                  >
                    <span class="results-details-title"
                      >Horizontal Displacement</span
                    >
                    <table
                      v-if="
                        exercise.HDDeductions &&
                        exercise.HDDeductions.length > 0
                      "
                      class="results-median"
                    >
                      <tbody>
                        <tr>
                          <td class="results-medianheadtitle">Element</td>
                          <td
                            v-for="hddeduction in uniqueHDDeductions(
                              exercise.HDDeductions
                            )"
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
                            v-if="hasMultipleGymnasts(exercise.HDDeductions)"
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
                      </tbody>
                    </table>
                    <HDVisualization :hd-deductions="exercise.HDDeductions" />
                  </td>
                </tr>
              </transition>
              <transition name="slide">
                <tr
                  :key="
                    'difficulty' +
                    exercise.ExerciseNumber +
                    exercise.CompetitorId
                  "
                  v-if="
                    isDifficultyVisible(
                      exercise.ExerciseNumber,
                      exercise.CompetitorId
                    )
                  "
                >
                  <td
                    style="display: table-cell"
                    class="results-scores-difficulty"
                    colspan="100%"
                  >
                    <span class="results-details-title">Difficulty</span>
                    <table class="results-difficulty">
                      <tbody>
                        <tr>
                          <td class="results-difficultyhead">Difficulty</td>
                          <td class="results-difficultyhead">Bonus</td>
                        </tr>
                        <tr>
                          <td class="results-medianscore">
                            {{ formattedNumber(exercise.Difficulty, 1) }}
                          </td>
                          <td class="results-medianscore">
                            {{ formattedNumber(exercise.Bonus, 1) }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </transition>
              <transition name="slide">
                <tr
                  :key="
                    'tsvalues' + exercise.ExerciseNumber + exercise.CompetitorId
                  "
                  v-if="
                    isTSValuesVisible(
                      exercise.ExerciseNumber,
                      exercise.CompetitorId
                    )
                  "
                >
                  <td
                    style="display: table-cell"
                    class="results-scores-tri-medians"
                    colspan="100%"
                  >
                    <span class="results-details-title">
                      {{
                        discipline === "TRS"
                          ? "Synchronisation"
                          : "Time of Flight"
                      }}
                    </span>
                    <table
                      v-if="exercise.TSValues && exercise.TSValues.length > 0"
                      class="results-median"
                    >
                      <tbody>
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
                          <td class="results-medianheadtitle">
                            {{ discipline === "TRS" ? "Sync" : "Time" }}
                          </td>
                          <td
                            v-for="tsValue in exercise.TSValues"
                            :key="tsValue.SkillNumber"
                            class="results-medianscore"
                          >
                            {{ tsValue.Value }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <TSChart
                      :ts-values="exercise.TSValues"
                      :discipline="discipline"
                    />
                  </td>
                </tr>
              </transition>
            </template>
          </tbody>
        </table>
        <table class="results-total-table">
          <tbody>
            <tr>
              <td class="results-scores-round">
                {{ totalLabelFor(round) }}
              </td>
              <td class="results-scores-tri-Tot">
                {{ formattedNumber(roundTotalFor(round), 2) }}
              </td>
            </tr>
          </tbody>
        </table>
        <table class="results-round-rank-table">
          <tbody>
            <tr>
              <td class="results-scores-roundrank">
                {{ categoryRoundsCount === 1 ? "Rank" : "Round Rank" }}
              </td>
              <td
                v-if="result.RoundTotals && result.RoundTotals.length > 0"
                class="results-scores-roundrank-tot"
              >
                {{ roundRankFor(round) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <template v-if="compType == 1 && roundsForCompetitor.length > 1">
        <table class="results-total-table" style="margin-top: 0">
          <tbody>
            <tr>
              <td class="results-scores-round">Total</td>
              <td class="results-scores-tri-Tot">
                {{ formattedNumber(result.TotalScore, 2) }}
              </td>
            </tr>
          </tbody>
        </table>
        <table class="results-round-rank-table" style="margin-top: 0">
          <tbody>
            <tr>
              <td class="results-scores-roundrank">Rank</td>
              <td class="results-scores-roundrank-tot">
                {{ result.DisplayCumulativeRank }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
  </div>
</template>

<script>
import HDVisualization from "./HDVisualization.vue";
import TSChart from "./TSChart.vue";

export default {
  name: "CompetitorResultCard",
  components: { HDVisualization, TSChart },
  props: {
    result: { type: Object, required: true },
    discipline: { type: String, default: "" },
    eventShortName: { type: String, default: "" },
    noResults: { type: Boolean, default: false },
    position: { type: [String, Number], default: null },
    categoryRoundsCount: { type: Number, default: 1 },
    compType: { type: Number, default: 0 },
    roundLabel: { type: Function, default: () => "" },
    roundFilter: { type: Function, default: () => true },
    // Combined British qualification results: show the Q (qualified) / R (reserve) column.
    showQualification: { type: Boolean, default: false },
  },
  data() {
    return {
      mediansVisible: {},
      hdDeductionsVisible: {},
      tsValuesVisible: {},
      difficultyVisible: {},
      exercisePopups: {},
    };
  },
  computed: {
    isTrampolineDiscipline() {
      return this.discipline === "TRA" || this.discipline === "TRS";
    },
    roundsForCompetitor() {
      const roundData = this.result.Exercises.map((exercise) => ({
        RoundName: exercise.RoundName,
        RoundOrder: exercise.RoundOrder,
      }));
      const sorted = roundData.sort((a, b) => a.RoundOrder - b.RoundOrder);
      return Array.from(new Set(sorted.map((r) => r.RoundName)));
    },
  },
  methods: {
    exercisesForRound(round) {
      return this.result.Exercises.filter((e) => e.RoundName === round);
    },
    formattedNumber(value, decimalPlaces) {
      let parsed = parseFloat(value);
      parsed = isNaN(parsed) ? 0 : parsed;
      return parsed.toFixed(decimalPlaces);
    },
    formattedNumber2(a, b, decimalPlaces) {
      let pa = parseFloat(a);
      let pb = parseFloat(b);
      pa = isNaN(pa) ? 0 : pa;
      pb = isNaN(pb) ? 0 : pb;
      return (pa + pb).toFixed(decimalPlaces);
    },
    formatMedian(median) {
      const asFloat = parseFloat(median);
      const asInt = parseInt(median);
      if (isNaN(asFloat)) return null;
      return asFloat === asInt ? asInt : asFloat.toFixed(2);
    },
    totalLabelFor(round) {
      const prefix = this.roundLabel(round);
      return prefix ? `${prefix} Total` : "Total";
    },
    roundTotalFor(round) {
      return (
        this.result.RoundTotals?.filter((rt) => rt.Round === round)?.[0]
          ?.RoundTotal ?? 0
      );
    },
    roundRankFor(round) {
      return this.result.RoundTotals.filter((rt) => rt.Round === round)[0]
        ?.RoundRank;
    },
    uniqueHDDeductions(hdDeductions) {
      return [
        ...new Map(
          hdDeductions
            .filter((d) => d.DeductionValue != null)
            .map((item) => [item.DeductionNumber, item])
        ).values(),
      ];
    },
    hasMultipleGymnasts(hdDeductions) {
      return new Set(hdDeductions.map((d) => d.JudgeNumber)).size > 1;
    },
    getGroupedDeductions(deductions) {
      if (!deductions) return {};
      return deductions.reduce((acc, deduction) => {
        if (!acc[deduction.JudgeNumber]) acc[deduction.JudgeNumber] = [];
        acc[deduction.JudgeNumber].push(deduction);
        return acc;
      }, {});
    },
    getDeductionStyle(deduction, medians) {
      if (!medians) return "";
      if (
        !deduction ||
        (!deduction.DeductionValue && deduction.DeductionValue != 0)
      )
        return;
      const median = medians.find(
        (m) =>
          m.ExerciseNumber === deduction.ExerciseNumber &&
          m.DeductionNumber === deduction.DeductionNumber
      );
      if (!median) return "";
      const difference1 = Math.abs(deduction.DeductionValue - median.Med1);
      const difference2 = Math.abs(deduction.DeductionValue - median.Med2);
      if (difference1 < 1 || difference2 < 1) {
        return "background-color: rgb(5, 176, 80);"; // Within 1 of a median
      } else if (difference1 < 2 || difference2 < 2) {
        return "background-color: rgb(255, 191, 0);"; // Within 2 of a median
      }
      return "background-color: rgb(217, 0, 2);"; // 2 or more from both medians
    },
    hasVideos(exercise) {
      return !!exercise.Videos && exercise.Videos.length > 0;
    },
    getVideoImageSource(exercise) {
      return this.hasVideos(exercise)
        ? new URL("../../assets/videoicon.png", import.meta.url).href
        : new URL("../../assets/NoVideo.png", import.meta.url).href;
    },
    getAnglesForExercise(videos) {
      if (!videos) return [];
      return Array.from(new Set(videos.map((item) => item.Angle)));
    },
    findVideo(videos, angle, variant) {
      if (!videos) return null;
      return videos.find((x) => x.Angle == angle && x.Variant == variant);
    },
    hasVariant(videos, angle, variant) {
      return !!this.findVideo(videos, angle, variant);
    },
    getExerciseVideoLink(videos, angle, variant) {
      const video = this.findVideo(videos, angle, variant);
      return (
        "http://" +
        process.env.VUE_APP_API_IP_ADDRESS +
        ":" +
        process.env.VUE_APP_API_PORT +
        `/api/videoFile?event=${
          this.eventShortName
        }&fileName=${encodeURIComponent(
          video ? video.Filename : ""
        )}&variant=${variant}`
      );
    },
    downloadItem(videos, angle, variant) {
      const video = this.findVideo(videos, angle, variant);
      if (!video) return;
      fetch(this.getExerciseVideoLink(videos, angle, variant))
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
    togglePopup(competitorId, exerciseNumber) {
      const key = `${competitorId}-${exerciseNumber}`;
      this.exercisePopups[key] = !this.exercisePopups[key];
    },
    toggleMedians(exerciseNumber, competitorId) {
      const key = exerciseNumber + competitorId;
      this.mediansVisible[key] = !this.mediansVisible[key];
    },
    toggleHDDeductions(exerciseNumber, competitorId) {
      const key = exerciseNumber + competitorId;
      this.hdDeductionsVisible[key] = !this.hdDeductionsVisible[key];
    },
    toggleDifficulty(exerciseNumber, competitorId) {
      const key = exerciseNumber + competitorId;
      this.difficultyVisible[key] = !this.difficultyVisible[key];
    },
    toggleTSValues(exerciseNumber, competitorId) {
      const key = exerciseNumber + competitorId;
      this.tsValuesVisible[key] = !this.tsValuesVisible[key];
    },
    getMediansLabel(exerciseNumber, competitorId) {
      return this.mediansVisible[exerciseNumber + competitorId] ? "[-]" : "[+]";
    },
    getHDDeductionsLabel(exerciseNumber, competitorId) {
      return this.hdDeductionsVisible[exerciseNumber + competitorId]
        ? "[-]"
        : "[+]";
    },
    getDifficultyLabel(exerciseNumber, competitorId) {
      return this.difficultyVisible[exerciseNumber + competitorId]
        ? "[-]"
        : "[+]";
    },
    getTSValuesLabel(exerciseNumber, competitorId) {
      return this.tsValuesVisible[exerciseNumber + competitorId]
        ? "[-]"
        : "[+]";
    },
    isMediansVisible(exerciseNumber, competitorId) {
      return !!this.mediansVisible[exerciseNumber + competitorId];
    },
    isHDDeductionsVisible(exerciseNumber, competitorId) {
      return !!this.hdDeductionsVisible[exerciseNumber + competitorId];
    },
    isDifficultyVisible(exerciseNumber, competitorId) {
      return !!this.difficultyVisible[exerciseNumber + competitorId];
    },
    isTSValuesVisible(exerciseNumber, competitorId) {
      return !!this.tsValuesVisible[exerciseNumber + competitorId];
    },
  },
};
</script>

<style scoped>
@import "../../stylesheets/results.style.css";

.disabled-link {
  pointer-events: none;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: top;
}

.slide-enter-from,
.slide-leave-to {
  transform: scaleY(0);
  transform-origin: top;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
