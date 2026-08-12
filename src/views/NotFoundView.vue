<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push({ name: "WeatherHome" });
};
</script>

<template>
  <section class="not-found-container route-page">
    <div class="error-icon">🌤️?</div>
    <p class="error-code">404</p>
    <h2>페이지를 찾을 수 없습니다.</h2>
    <p>요청하신 주소가 존재하지 않거나 아직 개발되지 않았습니다.</p>
    <button type="button" class="route-button" @click="goHome">
      날씨 메인으로 이동
    </button>
  </section>
</template>

<style scoped>
.not-found-container {
  padding: 34px 20px;
  text-align: center;
}

.error-icon {
  font-size: 3rem;
}

.error-code {
  margin: 8px 0 0;
  color: #2563eb;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.2em;
}

h2 {
  margin: 4px 0 6px;
  color: #172033;
  font-size: 1.65rem;
  font-weight: 850;
}

.not-found-container > p:last-of-type {
  margin: 0;
  color: #64748b;
}

.route-button {
  margin-top: 20px;
}
</style>
