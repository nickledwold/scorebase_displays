import { createRouter, createWebHistory } from "vue-router";
import Panel from "./components/Panel.vue";
import RankedScores from "./components/RankedScores.vue";
import RankedCategory from "./components/RankedCategory.vue";
import LatestScores from "./components/LatestScores.vue";
import CommentaryInformationSystem from "./components/CommentaryInformationSystem.vue";
import CommentaryInformationSystemPanelStatusOnly from "./components/CommentaryInformationSystemPanelStatusOnly.vue";
import CommentaryInformationSystem2 from "./components/CommentaryInformationSystem2.vue";
import CommentaryInformationSystem3 from "./components/CommentaryInformationSystem3.vue";
import OnlineResults from "./components/OnlineResults.vue";
import OnlineCategories from "./components/OnlineCategories.vue";
import Clock from "./components/Clock.vue";
import Clockv2 from "./components/Clockv2.vue";
import Home from "./components/Home.vue";
import OnlineStartLists from "./components/OnlineStartLists.vue";

const routerInstance = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
      name: "Home",
      meta: { title: "Home page" },
    },
    {
      path: "/panel/:panelNumber",
      component: Panel,
      name: "Panel",
      meta: { title: "Panel Display" },
    },
    {
      path: "/ranked",
      component: RankedScores,
      name: "Ranked",
      meta: { title: "Ranked Display" },
    },
    {
      path: "/ranked/:catId",
      component: RankedCategory,
      name: "RankedCategory",
      meta: { title: "Ranked Category" },
    },
    {
      path: "/latest",
      component: LatestScores,
      name: "Latest",
      meta: { title: "Latest Display" },
    },
    {
      path: "/cis",
      component: CommentaryInformationSystem,
      name: "CommentaryInformationSystem",
      meta: { title: "Commentary Information System Display" },
    },
    {
      path: "/cisps",
      component: CommentaryInformationSystemPanelStatusOnly,
      name: "CommentaryInformationSystemPanelStatusOnly",
      meta: {
        title: "Commentary Information System Display - Panel Status Only",
      },
    },
    {
      path: "/cis2",
      component: CommentaryInformationSystem2,
      name: "CommentaryInformationSystem2",
      meta: { title: "Commentary Information System Display 2" },
    },
    {
      path: "/cis3",
      component: CommentaryInformationSystem3,
      name: "CommentaryInformationSystem3",
      meta: { title: "Commentary Information System Display 3 - auto reload" },
    },
    {
      path: "/online",
      component: OnlineCategories,
      name: "OnlineScoringCategories",
      meta: { title: "Online Scoring Categories Display" },
    },
    {
      path: "/online/results/:catId",
      component: OnlineResults,
      name: "OnlineScoringResults",
      meta: { title: "Online Scoring Results" },
    },
    {
      path: "/clock",
      component: Clock,
      name: "Clock",
      meta: { title: "Clock" },
    },
    {
      path: "/clockv2/:panelNumber",
      component: Clockv2,
      name: "Clockv2",
      meta: { title: "Clock" },
    },
    {
      path: "/online/startlists/:catId/:roundName",
      component: OnlineStartLists,
      name: "StartLists",
      meta: { title: "Online Start Lists" },
    },
    {
      path: "/online/startlists/:catId",
      component: OnlineStartLists,
      name: "StartListsNoRound",
      meta: { title: "Online Start Lists" },
    },
  ],
});

routerInstance.beforeEach((to, from, next) => {
  const defaultTitle = "SCOREBASE Displays";

  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = defaultTitle;
  }

  next();
});

export default routerInstance;
