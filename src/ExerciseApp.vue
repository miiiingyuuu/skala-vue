<script setup>
import WeatherMockup from "./components/exercise/WeatherMockup.vue";
import WeatherComposition from "./components/exercise/WeatherComposition.vue";
import WeatherParent from "./components/exercise/WeatherParent.vue";
import UnitToggler from "./components/exercise/UnitToggler.vue";
</script>

<template>
  <div class="app-container">
    <WeatherMockup />
  </div>

  <div class="app-container">
    <WeatherComposition />
  </div>

  <div class="app-container">
    <WeatherParent />
  </div>

  <div class="app-container router-exercise">
    <div class="router-title">
      <p>과제 4, 5</p>
      <h1>🌤️ Pinia 날씨 스토어</h1>
    </div>

    <nav class="navigation-bar" aria-label="날씨 서비스 메뉴">
      <div class="navigation-links">
        <RouterLink :to="{ name: 'WeatherHome' }" class="nav-item"
          >🌤️ 날씨 대시보드</RouterLink
        >
        <span class="divider" aria-hidden="true"></span>
        <RouterLink :to="{ name: 'WeatherAbout' }" class="nav-item"
          >ℹ️ 서비스 소개</RouterLink
        >
      </div>
      <UnitToggler />
    </nav>

    <main class="router-content">
      <RouterView />
    </main>
  </div>
</template>

<style src="./assets/exercise.css"></style>
