<template>
  <body class="online-body">
    <head>
      <title>TRA Senior Men - LIVE Results</title>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <div class="w3-content"></div>
      <div class="online-background"></div>
    </head>
    <table class="bannerhead">
      <td class="scorebase">
        <img src="../assets/scorebase.png" height="20px" />
      </td>
      <td class="back">
        <a href="../index.html"
          ><img src="../assets/back.png" height="15px"
        /></a>
      </td>
      <td class="online-selector">
        <a href="javascript:history.back()">Category Selector</a>
      </td>
    </table>

    <div class="online-eventlogo">
      <br />
      <img src="../assets/bgcolour.png" height="40px" />
    </div>

    <div class="online-banner">
      <table>
        <tr>
          <td class="online-eventtitle">
            Jaffa Trampoline, Tumbling & DMT British Championships 2023
          </td>
        </tr>
        <tr>
          <td class="online-bannerlive">RESULTS</td>
        </tr>
      </table>
    </div>

    <div class="online-roundstatus">
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

    <div class="online-bannercat">
      <table>
        <td>TRA Senior Men</td>
      </table>
    </div>

    <input
      type="search"
      class="search"
      id="myInput"
      onkeyup=""
      placeholder="Search by name, club"
    />

    <div class="filterBtns">
      <div class="btnfilterimg">
        <img src="../assets/filter.png" width="20px" />
      </div>
      <button id="mybutton" class="btn active" onclick="">All</button>
      <button class="btn" onclick="">Q</button>
      <button class="btn" onclick="">F</button>
    </div>

    <div class="container" id="containerdiv">
      <div class="result" id="resultdiv"></div>
    </div>
    <div class="online-footer">
      &copy; + SCOREBASE
      {{ currentYear }}
      <br />
    </div>
  </body>
</template>

<script>
export default {
  name: "OnlineResults",
  computed: {},
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
  created() {},
  methods: {},
};
</script>

<style scoped>
@import "../stylesheets/online.style.css";
</style>
