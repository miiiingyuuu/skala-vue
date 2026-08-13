<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useConfigStore } from "@/stores/configStore";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const configStore = useConfigStore();

const cityData = ref(null);
const isLoading = ref(false);
const loadError = ref("");

// 라우터의 내부 ID를 API 검색용 영문명과 화면용 한글명으로 연결합니다.
const cityMapping = {
  city_01: { english: "Seoul", korean: "대한민국 서울특별시" },
  city_02: { english: "Suwon", korean: "경기도 수원시 영통구" },
  city_03: { english: "Busan", korean: "부산광역시 해운대구" },
};

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// 화면이 생성되면 URL의 도시 ID에 해당하는 상세 정보를 한 번 요청합니다.
onMounted(async () => {
  const targetCity = cityMapping[route.params.cityId];

  if (!targetCity) {
    loadError.value = "요청한 도시 ID가 존재하지 않습니다.";
    return;
  }

  isLoading.value = true;

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: targetCity.english,
        appid: API_KEY,
        units: "metric",
        lang: "kr",
      },
    });
    const raw = response.data;

    // 기존 템플릿을 유지할 수 있도록 API JSON을 화면 규격으로 역매핑합니다.
    cityData.value = {
      name: targetCity.korean,
      temp: raw.main.temp,
      status: raw.weather[0].description,
      humidity: `${raw.main.humidity}%`,
      wind: `${raw.wind.speed}m/s`,
    };
  } catch (error) {
    console.error("🔴 상세 정보 로딩 중 네트워크 에러 발생:", error);
    loadError.value = "상세 날씨 정보를 불러오는 중 오류가 발생했습니다.";
  } finally {
    isLoading.value = false;
  }
});

// 카드와 같은 전역 단위를 사용해 상세 화면의 기온도 함께 변경합니다.
const displayTemp = computed(() => {
  if (!cityData.value) return 0;

  const rawTemp = cityData.value.temp;
  if (configStore.unit === "fahrenheit") {
    return Math.round((rawTemp * 9) / 5 + 32);
  }

  return rawTemp;
});

const goHome = () => {
  router.push({ name: "WeatherHome" });
};
</script>

<template>
  <section class="detail-container route-page">
    <p class="eyebrow">WEATHER DETAIL</p>
    <h2>지역별 상세 기상 관측 정보</h2>

    <div v-if="isLoading" class="loading-card" role="status">
      🔄 데이터베이스로부터 상세 정보를 동기화하는 중입니다...
    </div>

    <template v-else>
      <div v-if="cityData" class="info-card">
        <div class="detail-title">
          <div>
            <span>지정 지역</span>
            <h3>📍 {{ cityData.name }}</h3>
          </div>
          <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
        </div>

        <dl>
          <div>
            <dt>기상 현황</dt>
            <dd>{{ cityData.status }}</dd>
          </div>
          <div>
            <dt>대기 습도</dt>
            <dd>{{ cityData.humidity }}</dd>
          </div>
          <div>
            <dt>현재 풍속</dt>
            <dd>{{ cityData.wind }}</dd>
          </div>
        </dl>
      </div>

      <div v-else class="missing-card">
        <span>🌫️</span>
        <h3>상세 데이터를 찾을 수 없습니다.</h3>
        <p>
          {{ loadError || "해당 지역의 상세 데이터 장부가 존재하지 않습니다." }}
        </p>
      </div>
    </template>

    <button type="button" class="route-button" @click="goHome">
      ← 메인 대시보드로 돌아가기
    </button>
  </section>
</template>

<style scoped>
.eyebrow {
  margin: 0 0 4px;
  color: #2563eb;
  font-size: 0.72rem;
  font-weight: 850;
  letter-spacing: 0.15em;
}

h2 {
  margin: 0 0 24px;
  color: #172033;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 850;
  letter-spacing: -0.04em;
}

.info-card,
.missing-card,
.loading-card {
  padding: 26px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #f8fafc;
}

.loading-card {
  color: #7f8c8d;
  font-weight: 750;
  text-align: center;
}

.detail-title {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 22px;
  border-bottom: 1px solid #e2e8f0;
}

.detail-title span {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 700;
}

.detail-title h3 {
  margin: 3px 0 0;
  color: #1e293b;
  font-size: 1.15rem;
  font-weight: 800;
}

.detail-title > strong {
  color: #2563eb;
  font-size: 2rem;
  font-weight: 850;
}

dl {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 20px 0 0;
}

dl div {
  padding: 14px;
  border-radius: 12px;
  background: #fff;
}

dt {
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 700;
}

dd {
  margin: 3px 0 0;
  color: #334155;
  font-weight: 800;
}

.missing-card {
  text-align: center;
}

.missing-card > span {
  font-size: 2.4rem;
}

.missing-card h3 {
  margin: 8px 0 4px;
  color: #334155;
}

.missing-card p {
  margin: 0;
  color: #64748b;
}

.route-button {
  margin-top: 18px;
}

@media (max-width: 580px) {
  .detail-title {
    align-items: flex-start;
    flex-direction: column;
  }

  dl {
    grid-template-columns: 1fr;
  }
}
</style>
