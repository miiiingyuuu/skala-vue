<script setup>
defineProps({
  title: { type: String, default: "" },
  icon: { type: String, default: "pi pi-sparkles" },
});
</script>

<template>
  <section class="base-dashboard-section">
    <header v-if="title"><i :class="icon"></i> {{ title }}</header>
    <!-- 부모가 원하는 날씨 콘텐츠를 주입하는 기본 Slot -->
    <slot />
  </section>
</template>
