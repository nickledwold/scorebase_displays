import { createRouter, createWebHistory } from "vue-router";
import Panel from "./components/Panel.vue";
import RankedScores from "./components/RankedScores.vue";

const routerInstance = createRouter({
  history: createWebHistory(),
  routes: [
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
