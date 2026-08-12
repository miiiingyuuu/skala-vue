<script setup>
import { computed, ref, watch, watchEffect } from "vue";

import BaseDashboardCard from "./BaseDashboardCard.vue";
import SearchBar from "./SearchBar.vue";
import WeatherCard from "./WeatherCard.vue";

// 각 도시의 id는 v-for로 만든 카드를 구분하는 :key로 사용
const weatherList = ref([
  { id: "city_01", name: "서울", temp: 28, status: "비" },
  { id: "city_02", name: "울산", temp: 24, status: "맑음" },
  { id: "city_03", name: "부산", temp: 26, status: "구름" },
  { id: "city_04", name: "제주", temp: 23, status: "바람" },
]);

// 검색창 입력값과 화면 하단 상태바에 표시할 문구임
const searchQuery = ref("");
const selectedCityInfo = ref("카드를 클릭하거나 검색해 보세요.");

// window 객체는 템플릿에서 직접 사용하지 않고 script의 함수 안에서 사용
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`);
};

// computed는 searchQuery 또는 weatherList가 바뀔 때 검색 결과를 다시 계산
const filteredWeatherList = computed(() => {
  // 앞뒤 공백만 입력을 제거
  const query = searchQuery.value.trim();

  if (!query) return weatherList.value;

  // 원본 배열은 유지하고 검색어가 포함된 도시만 새 배열로 반환
  return weatherList.value.filter((item) => item.name.includes(query));
});

// watch는 지정한 selectedCityInfo가 변경된 이후에만 실행됨
watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(
    `👁️ [watch 감지] 상태바 문구가 업데이트되었습니다: "${oldInfo}" → "${newInfo}"`,
  );
});

// watchEffect는 함수 안에서 읽은 searchQuery를 자동으로 추적함
watchEffect(() => {
  console.log(
    `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`,
  );
});
</script>

<template>
  <section class="dashboard-wrapper">
    <h1>🌦️ 과제 3: 컴포넌트 날씨 대시보드</h1>
    <hr />

    <!-- BaseDashboardCard의 기본 슬롯에 검색 컴포넌트를 주입합니다. -->
    <BaseDashboardCard>
      <!-- 부모의 검색어는 prop으로 내리고, 자식의 입력값은 emit으로 받습니다. -->
      <SearchBar
        :current-query="searchQuery"
        @update-query="(value) => (searchQuery = value)"
      />
    </BaseDashboardCard>

    <!-- 같은 슬롯 컴포넌트에 날씨 목록이라는 다른 콘텐츠를 주입합니다. -->
    <BaseDashboardCard>
      <h3>🏙️ 지역별 날씨 현황</h3>

      <!-- 도시 객체는 prop으로 전달하고, 선택/상세 이벤트는 부모가 처리합니다. -->
      <WeatherCard
        v-for="item in filteredWeatherList"
        :key="item.id"
        :city-item="item"
        @select-card="(message) => (selectedCityInfo = message)"
        @click-detail="showDetail"
      />

      <!-- 검색 결과가 없을 때만 부모가 안내 문구를 표시합니다. -->
      <p v-if="filteredWeatherList.length === 0" class="empty-result">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </BaseDashboardCard>

    <!-- 카드가 올린 select-card 이벤트의 결과를 부모 상태바에 반영합니다. -->
    <div class="status-bar" role="status" aria-live="polite">
      {{ selectedCityInfo }}
    </div>
  </section>
</template>

<style scoped></style>
