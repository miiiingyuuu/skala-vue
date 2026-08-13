<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import BaseDashboardSection from "@/final/components/BaseDashboardSection.vue";
import AdviceGrid from "@/final/components/AdviceGrid.vue";
import CurrentWeatherHero from "@/final/components/CurrentWeatherHero.vue";
import ForecastList from "@/final/components/ForecastList.vue";
import HourlyForecast from "@/final/components/HourlyForecast.vue";
import SearchHeader from "@/final/components/SearchHeader.vue";
import NotFoundView from "@/final/views/NotFoundView.vue";
import { useWeather } from "@/final/composables/useWeather";

const route = useRoute();
const router = useRouter();
const selectedCityInfo = ref("현재 위치 또는 검색한 지역을 선택해 보세요.");
const touchStartX = ref(0);
const notFoundCity = ref("");

const {
  weather,
  weatherPages,
  activeIndex,
  isLoading,
  errorMessage,
  infoMessage,
  isMockData,
  isCurrentPage,
  currentLocationLabel,
  backgroundClass,
  initializeWeather,
  searchWeather,
  setActiveIndex,
  nextPage,
  previousPage,
  removeActivePage,
} = useWeather();

watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.info(`[watch] ${oldInfo} → ${newInfo}`);
});

watchEffect(() => {
  console.info(`[watchEffect] 현재 표시 지역: ${weather.value.location.name}`);
});

watch(
  () => weather.value.location.name,
  (name) => {
    selectedCityInfo.value = `${name} 지역의 날씨를 보고 있습니다.`;
  },
  { immediate: true },
);

async function handleSearch(city) {
  await router.replace({
    name: "FinalWeatherHome",
    query: { search: city || undefined },
  });
  const result = await searchWeather(city);

  if (result?.reason === "CITY_NOT_FOUND") {
    notFoundCity.value = city;
    return;
  }

  if (result?.ok) notFoundCity.value = "";
}

async function resetNotFound() {
  notFoundCity.value = "";
  await router.replace({ name: "FinalWeatherHome" });
}

async function handleRemovePage() {
  removeActivePage();
  notFoundCity.value = "";
  await router.replace({ name: "FinalWeatherHome" });
}

function showDetail() {
  const { lat, lon } = weather.value.location.coordinates;
  router.push({
    name: "FinalWeatherDetail",
    params: { cityId: `${lat},${lon}` },
    query: { name: weather.value.location.name },
  });
}

function handleTouchStart(event) {
  touchStartX.value = event.changedTouches[0].clientX;
}

function handleTouchEnd(event) {
  const distance = event.changedTouches[0].clientX - touchStartX.value;
  if (Math.abs(distance) < 55) return;
  if (distance < 0) nextPage();
  else previousPage();
}

onMounted(async () => {
  await initializeWeather();
  if (typeof route.query.search === "string" && route.query.search.trim()) {
    const result = await searchWeather(route.query.search);
    if (result?.reason === "CITY_NOT_FOUND") {
      notFoundCity.value = route.query.search;
    }
  }
});
</script>

<template>
  <main
    class="weather-app"
    :class="backgroundClass"
    @touchstart.passive="handleTouchStart"
    @touchend.passive="handleTouchEnd"
  >
    <div class="weather-scene" aria-hidden="true">
      <div class="sun-glow"></div>
      <span
        v-for="index in 4"
        :key="`cloud-${index}`"
        class="animated-cloud"
        :class="`cloud-${index}`"
      ></span>
      <span
        v-for="index in 28"
        :key="`rain-${index}`"
        class="rain-drop"
        :style="{ '--i': index }"
      ></span>
      <span
        v-for="index in 22"
        :key="`snow-${index}`"
        class="snow-flake"
        :style="{ '--i': index }"
        >•</span
      >
      <div class="lightning"></div>
    </div>

    <div class="weather-shell">
      <SearchHeader
        :is-loading="isLoading"
        :is-mock-data="isMockData"
        :initial-query="
          typeof route.query.search === 'string' ? route.query.search : ''
        "
        @search="handleSearch"
      />

      <nav class="service-navigation" aria-label="서비스 메뉴">
        <RouterLink :to="{ name: 'FinalWeatherHome' }"
          ><i class="pi pi-cloud-sun"></i> 날씨</RouterLink
        >
        <RouterLink :to="{ name: 'FinalWeatherAbout' }"
          ><i class="pi pi-info-circle"></i> 서비스 소개</RouterLink
        >
      </nav>

      <Transition name="status-message" mode="out-in">
        <Message
          v-if="errorMessage"
          key="error"
          severity="warn"
          :closable="false"
          class="status-message"
          >{{ errorMessage }}</Message
        >
        <Message
          v-else-if="infoMessage"
          key="info"
          severity="info"
          :closable="false"
          class="status-message"
          >{{ infoMessage }}</Message
        >
      </Transition>

      <div v-if="isLoading" class="loading-overlay" aria-live="polite">
        <ProgressSpinner stroke-width="4" />
        <p>{{ infoMessage || "하늘을 확인하고 있어요" }}</p>
      </div>

      <template v-else>
        <NotFoundView
          v-if="notFoundCity"
          embedded
          :search-term="notFoundCity"
          @reset="resetNotFound"
        />

        <template v-else>
        <nav
          v-if="weatherPages.length > 1"
          class="page-navigation"
          aria-label="날씨 지역 전환"
        >
          <Button
            icon="pi pi-chevron-left"
            text
            rounded
            aria-label="이전 지역"
            :disabled="activeIndex === 0"
            @click="previousPage"
          />
          <div class="page-dots">
            <button
              v-for="(page, index) in weatherPages"
              :key="`${page.location.name}-${index}`"
              type="button"
              :class="{ active: activeIndex === index }"
              :aria-label="`${page.location.name} 날씨 보기`"
              @click="setActiveIndex(index)"
            ></button>
          </div>
          <Button
            icon="pi pi-chevron-right"
            text
            rounded
            aria-label="다음 지역"
            :disabled="activeIndex === weatherPages.length - 1"
            @click="nextPage"
          />
        </nav>

        <div
          :key="`${weather.location.name}-${activeIndex}`"
          class="weather-page"
        >
          <CurrentWeatherHero
            :location="weather.location"
            :weather="weather.current"
            :is-current="isCurrentPage"
            :current-label="currentLocationLabel"
            @select-card="selectedCityInfo = $event"
            @click-detail="showDetail"
            @remove-page="handleRemovePage"
          />

          <BaseDashboardSection>
            <HourlyForecast :items="weather.hourly" />
          </BaseDashboardSection>

          <section class="dashboard-grid">
            <ForecastList :items="weather.daily" />
            <AdviceGrid />
          </section>

          <div class="selection-status" aria-live="polite">
            <i class="pi pi-check-circle"></i> {{ selectedCityInfo }}
          </div>
        </div>
        </template>
      </template>

      <footer>
        <span>OpenWeather 기반 날씨 정보</span>
        <span>검색한 도시는 슬라이드에 추가 · X 버튼으로 제거</span>
      </footer>
    </div>
  </main>
</template>
