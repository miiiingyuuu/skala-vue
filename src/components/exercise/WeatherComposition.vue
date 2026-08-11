<script setup>
import { computed, ref, watch, watchEffect } from "vue";

// 각 도시의 id는 v-for로 만든 카드를 구분하는 :key로 사용
const weatherList = ref([
  { id: "city_01", name: "서울", temp: 28, status: "맑음" },
  { id: "city_02", name: "수원", temp: 24, status: "비" },
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
    <h1>🌦️ 과제 2: 날씨 검색 (Composition)</h1>
    <hr />

    <section class="search-box">
      <h3>🔍 도시 검색</h3>

      <!--
        :value는 데이터를 입력창에 표시하고, @input은 입력값을 데이터에 저장함
      -->
      <input
        id="composition-city-search"
        type="text"
        :value="searchQuery"
        placeholder="검색할 도시 이름 입력"
        autocomplete="off"
        @input="(event) => (searchQuery = event.target.value)"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황</h3>

      <!-- computed로 필터링된 결과만 반복 출력하고 고유 id를 :key로 지정함 -->
      <article
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="weather-card"
        tabindex="0"
        role="button"
        :aria-label="`${item.name} 날씨 카드 선택`"
        @click="selectedCityInfo = `${item.name}이(가) 선택되었습니다.`"
        @keydown.enter="selectedCityInfo = `${item.name}이(가) 선택되었습니다.`"
        @keydown.space.prevent="
          selectedCityInfo = `${item.name}이(가) 선택되었습니다.`
        "
      >
        <h4>{{ item.name }} ({{ item.status }})</h4>
        <p>현재 기온: {{ item.temp }}°C</p>

        <!-- 25도를 기준으로 두 배지 중 하나만 화면에 만듦 -->
        <span v-if="item.temp >= 25" class="badge hot"
          >🔥 더움 (25도 이상)</span
        >
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <!-- .stop은 상세보기 버튼의 클릭이 부모 카드까지 전달되는 것을 막음 -->
        <button
          type="button"
          class="btn-detail"
          @click.stop="showDetail(item.name, item.status)"
        >
          상세보기
        </button>
      </article>

      <!-- computed 검색 결과가 비어 있을 때만 안내 문구를 표시함 -->
      <p v-if="filteredWeatherList.length === 0" class="empty-result">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <!-- 카드를 클릭하면 문구가 변경되고 watch가 변경 내용을 감지함 -->
    <div class="status-bar" role="status" aria-live="polite">
      {{ selectedCityInfo }}
    </div>
  </section>
</template>

<style scoped>
.empty-result {
  padding: 10px 0;
  color: #e74c3c;
  text-align: center;
}
</style>
