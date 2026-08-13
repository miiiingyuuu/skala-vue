<script setup>
import { useRouter } from "vue-router";
import Button from "primevue/button";
import Card from "primevue/card";

const router = useRouter();
const features = [
  [
    "pi pi-map-marker",
    "현재 위치",
    "브라우저 위치 권한으로 첫 화면의 날씨를 불러옵니다.",
  ],
  [
    "pi pi-images",
    "지역 슬라이드",
    "검색한 지역을 슬라이드에 추가하고 좌우 스와이프로 전환합니다.",
  ],
  [
    "pi pi-cloud",
    "OpenWeather",
    "Axios로 현재 날씨와 5일 예보를 실시간 조회합니다.",
  ],
  [
    "pi pi-mobile",
    "반응형 UI",
    "PrimeVue와 동적 배경으로 모바일에서도 자연스럽게 표시합니다.",
  ],
];
</script>

<template>
  <main class="weather-app weather-clouds route-view">
    <div class="weather-shell route-shell about-page">
      <p class="route-eyebrow">ABOUT THE PROJECT</p>
      <h1>Weather Message</h1>
      <p class="about-lead">
        Vue 3 실습에서 배운 반응성, 컴포넌트 통신, Router와 Pinia를 실제 날씨
        서비스로 연결한 최종 발표 프로젝트입니다.
      </p>

      <section class="about-grid">
        <Card
          v-for="feature in features"
          :key="feature[1]"
          class="glass-card about-card"
        >
          <template #content>
            <i :class="feature[0]"></i>
            <h2>{{ feature[1] }}</h2>
            <p>{{ feature[2] }}</p>
          </template>
        </Card>
      </section>

      <Button
        label="날씨 대시보드로 이동"
        icon="pi pi-arrow-left"
        @click="router.push({ name: 'FinalWeatherHome' })"
      />
    </div>
  </main>
</template>
