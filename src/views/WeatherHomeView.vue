<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

import BaseDashboardCard from "../components/exercise/BaseDashboardCard.vue";
import SearchBar from "../components/exercise/SearchBar.vue";
import WeatherCard from "../components/exercise/WeatherCard.vue";

const route = useRoute();
const router = useRouter();

// API 응답이 도착하면 기존 WeatherCard 규격의 객체들이 담깁니다.
const weatherList = ref([]);
const searchQuery = ref("");
const selectedCityInfo = ref("카드를 클릭하거나 검색해 보세요.");
const isLoading = ref(false);
const loadError = ref("");

// API 키는 저장소에 포함하지 않고 로컬 환경변수에서만 읽습니다.
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityRequests = [
  { id: "city_01", query: "Seoul", name: "서울" },
  { id: "city_02", query: "Suwon", name: "수원" },
  { id: "city_03", query: "Busan", name: "부산" },
];

// 세 도시의 요청을 병렬로 처리한 뒤 기존 자식 컴포넌트 규격으로 변환합니다.
const fetchRealtimeWeather = async () => {
  isLoading.value = true;
  loadError.value = "";

  try {
    const responses = await Promise.all(
      cityRequests.map((city) =>
        axios.get(BASE_URL, {
          params: {
            q: city.query,
            appid: API_KEY,
            units: "metric",
            lang: "kr",
          },
        }),
      ),
    );

    weatherList.value = responses.map((response, index) => ({
      id: cityRequests[index].id,
      name: cityRequests[index].name,
      temp: response.data.main.temp,
      status: response.data.weather[0].description,
    }));

    console.log("🟢 [API 통신 완료] 실시간 기상 정보:", weatherList.value);
  } catch (error) {
    console.error("🔴 날씨 API 연동 실패:", error);
    loadError.value =
      "실시간 날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
  } finally {
    isLoading.value = false;
  }
};

// 새로고침하거나 주소로 직접 접근했을 때 ?search= 값을 검색창에 복원합니다.
onMounted(async () => {
  if (typeof route.query.search === "string") {
    searchQuery.value = route.query.search;
  }

  await fetchRealtimeWeather();
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
      <h3 class="list-title">🏙️ 지역별 날씨 현황 (실시간 기상청 연동)</h3>

      <p v-if="isLoading" class="loading-message" role="status">
        🔄 글로벌 기상 위성으로부터 실시간 기상 데이터를 수신 중입니다...
      </p>

      <!-- v-else 하나로 카드 목록과 검색 결과 안내를 함께 묶습니다. -->
      <template v-else>
        <p v-if="loadError" class="error-message" role="alert">
          {{ loadError }}
        </p>

        <template v-else>
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
        </template>
      </template>
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

.loading-message,
.error-message {
  margin: 0;
  padding: 28px 10px;
  text-align: center;
  font-weight: 750;
}

.loading-message {
  color: #2563eb;
}

.error-message {
  color: #e11d48;
}
</style>
