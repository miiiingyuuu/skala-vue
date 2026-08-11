<script setup>
import { ref } from "vue";

// 각 도시의 id는 v-for로 만든 카드를 구분하는 :key로 사용
const weatherList = ref([
  { id: "city_01", name: "서울", temp: 28, status: "맑음" },
  { id: "city_02", name: "수원", temp: 24, status: "비" },
  { id: "city_03", name: "부산", temp: 26, status: "구름" },
  { id: "city_04", name: "제주", temp: 23, status: "바람" },
]);

// 검색창에 입력한 글자와 화면 하단 상태바에 표시할 문구
const searchQuery = ref("");
const selectedCityInfo = ref("카드를 클릭하거나 검색해 보세요.");

// window 객체는 템플릿에서 직접 사용하지 않고 script의 함수 안에서 사용
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`);
};
</script>

<template>
  <section class="dashboard-wrapper">
    <h1>🌤️ 과제 1: 날씨 (Mockup)</h1>
    <hr />

    <section class="search-box">
      <h3>🔍 도시 검색</h3>

      <!--
        v-model을 직접 사용하지 않고 양방향 바인딩의 동작을 나누어 작성
        :value는 데이터를 입력창에 표시하고, @input은 입력값을 데이터에 저장함
      -->
      <input
        id="city-search"
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

      <!-- 날씨 데이터의 개수만큼 카드를 만들고 고유 id를 :key로 지정 -->
      <article
        v-for="item in weatherList"
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

        <!-- 25도를 기준으로 두 배지 중 하나만 화면에 만듭니다. -->
        <span v-if="item.temp >= 25" class="badge hot"
          >🔥 더움 (25도 이상)</span
        >
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

        <!-- .stop은 상세보기 버튼의 클릭이 부모 카드까지 전달되는 것을 막습니다. -->
        <button
          type="button"
          class="btn-detail"
          @click.stop="showDetail(item.name, item.status)"
        >
          상세보기
        </button>
      </article>
    </section>

    <!-- 카드를 클릭하면 선택된 도시 안내 문구로 변경됩니다. -->
    <div class="status-bar" role="status" aria-live="polite">
      {{ selectedCityInfo }}
    </div>
  </section>
</template>
