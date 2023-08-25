import { createRouter, createWebHistory } from "vue-router";
import Panel from "./components/Panel.vue";
import RankedScores from "./components/RankedScores.vue";
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
