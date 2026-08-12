<template>
  <section class="base-dashboard-card">
    <!-- 부모가 넣어 준 검색창 또는 날씨 목록이 이 위치에 렌더링됩니다. -->
    <slot></slot>
  </section>
</template>

<style scoped>
.base-dashboard-card {
  margin-bottom: 18px;
  padding: 22px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
}

@media (max-width: 640px) {
  .base-dashboard-card {
    padding: 16px;
    border-radius: 14px;
  }
}
</style>
