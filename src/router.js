import { createRouter, createWebHistory } from "vue-router";
import Panel from "./components/Panel.vue";

const routerInstance = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/panel/:panelNumber",
      component: Panel,
      name: "Panel",
      meta: { title: "Panel Display" },
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
