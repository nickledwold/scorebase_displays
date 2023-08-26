import { createRouter, createWebHistory } from "vue-router";
import Panel from "./components/Panel.vue";
import RankedScores from "./components/RankedScores.vue";
import LatestScores from "./components/LatestScores.vue";
import CommentaryInformationSystem from "./components/CommentaryInformationSystem.vue";
import Home from "./components/Home.vue";

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
