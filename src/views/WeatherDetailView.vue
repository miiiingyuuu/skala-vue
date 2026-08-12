<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useConfigStore } from "@/stores/configStore";

const route = useRoute();
const router = useRouter();
const configStore = useConfigStore();

const mockDetails = {
  city_01: {
    name: "대한민국 서울특별시",
    temp: 28,
    status: "맑음",
    humidity: "55%",
    wind: "2.5m/s",
  },
  city_02: {
    name: "경기도 수원시 영통구",
    temp: 24,
    status: "비",
    humidity: "85%",
    wind: "4.1m/s",
  },
  city_03: {
    name: "부산광역시 해운대구",
    temp: 26,
    status: "구름",
    humidity: "65%",
    wind: "5.0m/s",
  },
  city_04: {
    name: "제주특별자치도 제주시",
    temp: 23,
    status: "바람",
    humidity: "70%",
    wind: "7.2m/s",
  },
};

// URL의 cityId가 바뀌면 해당 상세 데이터도 즉시 다시 계산됩니다.
const cityData = computed(() => mockDetails[route.params.cityId] ?? null);

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
      <p>요청한 도시 ID가 존재하지 않거나 아직 데이터가 준비되지 않았습니다.</p>
    </div>

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
.missing-card {
  padding: 26px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #f8fafc;
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
