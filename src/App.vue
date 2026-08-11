<script setup>
import PracticeApp from "./PracticeApp.vue";
import ExerciseApp from "./ExerciseApp.vue";

// 'practice' 또는 'exercise'로 변경하여 실행할 화면을 선택합니다.
const MODE = "exercise";
</script>

<template>
  <PracticeApp v-if="MODE === 'practice'" />
  <ExerciseApp v-else-if="MODE === 'exercise'" />
</template>
