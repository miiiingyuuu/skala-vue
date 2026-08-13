import "./assets/main.css";
import "element-plus/dist/index.css";
import "primeicons/primeicons.css";
import "./final/assets/final.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: { darkModeSelector: ".weather-dark", cssLayer: false },
  },
  ripple: true,
});

app.mount("#app");
