<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import BaseDashboardCard from "../components/exercise/BaseDashboardCard.vue";
import SearchBar from "../components/exercise/SearchBar.vue";
import WeatherCard from "../components/exercise/WeatherCard.vue";

const route = useRoute();
const router = useRouter();

// 과제 3의 부모 컴포넌트가 가지고 있던 상태와 로직을 View로 옮겼습니다.
const weatherList = ref([
  { id: "city_01", name: "서울", temp: 28, status: "맑음" },
  { id: "city_02", name: "수원", temp: 24, status: "비" },
  { id: "city_03", name: "부산", temp: 26, status: "구름" },
  { id: "city_04", name: "제주", temp: 23, status: "바람" },
]);

const searchQuery = ref("");
const selectedCityInfo = ref("카드를 클릭하거나 검색해 보세요.");

// 새로고침하거나 주소로 직접 접근했을 때 ?search= 값을 검색창에 복원합니다.
onMounted(() => {
  if (typeof route.query.search === "string") {
    searchQuery.value = route.query.search;
  }
});

// 검색어가 변경될 때 현재 주소의 query string도 함께 갱신합니다.
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  });
});

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim();

  if (!query) return weatherList.value;

  return weatherList.value.filter((item) => item.name.includes(query));
});

// 상세보기 버튼을 누른 카드의 id를 동적 경로 파라미터로 전달합니다.
const handleDetailJump = (cityId) => {
  router.push({ name: "WeatherDetail", params: { cityId } });
};
</script>

<template>
  <section class="dashboard-wrapper route-page">
    <div class="route-heading">
      <p>ROUTER PRACTICE</p>
      <h2>오늘의 지역별 날씨</h2>
      <span>도시를 검색하거나 상세 날씨를 확인해 보세요.</span>
    </div>

    <BaseDashboardCard>
      <SearchBar
        :current-query="searchQuery"
        @update-query="(value) => (searchQuery = value)"
      />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3 class="list-title">🏙️ 지역별 날씨 현황</h3>

      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="(message) => (selectedCityInfo = message)"
        @click-detail="handleDetailJump(item.id)"
      />

      <p v-if="filteredWeatherList.length === 0" class="empty-result">
        검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <div class="status-bar" role="status" aria-live="polite">
      {{ selectedCityInfo }}
    </div>
  </section>
</template>

<style scoped>
.route-heading {
  margin-bottom: 24px;
}

.route-heading p {
  margin: 0 0 4px;
  color: #2563eb;
  font-size: 0.72rem;
  font-weight: 850;
  letter-spacing: 0.15em;
}

.route-heading h2 {
  margin: 0;
  color: #172033;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 850;
  letter-spacing: -0.04em;
}

.route-heading span {
  color: #64748b;
}

.list-title {
  margin: 0 0 14px;
  color: #334155;
  font-size: 0.98rem;
  font-weight: 750;
}

.empty-result {
  margin: 0;
  padding: 28px 10px;
  color: #e11d48;
  text-align: center;
}
</style>
