<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <section class="about-view route-page">
    <p class="eyebrow">ABOUT SERVICE</p>
    <h2>날씨 대시보드 소개</h2>
    <div class="description-box">
      <p>Vue Router 학습을 위해 만든 지역별 날씨 서비스입니다.</p>
      <ul>
        <li>검색어를 URL query string과 동기화합니다.</li>
        <li>동적 route parameter로 도시별 상세 페이지를 표시합니다.</li>
        <li>정의되지 않은 주소는 NotFound 페이지에서 처리합니다.</li>
      </ul>
    </div>
    <button type="button" class="route-button" @click="goHome">
      대시보드 홈으로 이동
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
  margin: 0 0 22px;
  color: #172033;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 850;
  letter-spacing: -0.04em;
}

.description-box {
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
  color: #475569;
}

.description-box p {
  margin: 0 0 12px;
  font-weight: 700;
}

.description-box ul {
  margin: 0;
  padding-left: 20px;
}

.route-button {
  margin-top: 18px;
}
</style>
