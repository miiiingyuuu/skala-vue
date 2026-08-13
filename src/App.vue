<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import PracticeApp from "./PracticeApp.vue";
import ExerciseApp from "./ExerciseApp.vue";
import FinalApp from "./FinalApp.vue";

const route = useRoute();
const router = useRouter();
const MODE = "exercise";  // MODE를 excercise나 practice로 바꾸면 해당 모드로 전환됩니다.
const isFinalMode = computed(() => route.path.startsWith("/final"));

function switchMode(mode) {
  router.push(mode === "final" ? { name: "FinalWeatherHome" } : { name: "WeatherHome" });
}
</script>

<template>
  <nav class="project-mode-switch" aria-label="프로젝트 화면 전환">
    <button
      type="button"
      :class="{ active: !isFinalMode }"
      @click="switchMode('exercise')"
    >
      과제 1–6
    </button>
    <button
      type="button"
      :class="{ active: isFinalMode }"
      @click="switchMode('final')"
    >
      최종본
    </button>
  </nav>

  <FinalApp v-if="isFinalMode" />
  <PracticeApp v-else-if="MODE === 'practice'" />
  <ExerciseApp v-else />
</template>
