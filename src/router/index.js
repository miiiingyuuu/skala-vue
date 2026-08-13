import { createRouter, createWebHistory } from "vue-router";
import WeatherHomeView from "../views/WeatherHomeView.vue";
import FinalWeatherHomeView from "../final/views/WeatherHomeView.vue";
import FinalNotFoundView from "../final/views/NotFoundView.vue";

const routes = [
  {
    path: "/",
    name: "WeatherHome",
    component: WeatherHomeView,
  },
  {
    path: "/about",
    name: "WeatherAbout",
    component: () => import("../views/WeatherAboutView.vue"),
  },
  {
    path: "/weather/:cityId",
    name: "WeatherDetail",
    component: () => import("../views/WeatherDetailView.vue"),
  },
  {
    path: "/final",
    name: "FinalWeatherHome",
    component: FinalWeatherHomeView,
  },
  {
    path: "/final/about",
    name: "FinalWeatherAbout",
    component: () => import("../final/views/WeatherAboutView.vue"),
  },
  {
    path: "/final/weather/:cityId",
    name: "FinalWeatherDetail",
    component: () => import("../final/views/WeatherDetailView.vue"),
  },
  {
    path: "/final/:pathMatch(.*)*",
    name: "FinalNotFound",
    component: FinalNotFoundView,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFoundView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
