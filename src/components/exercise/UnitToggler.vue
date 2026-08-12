<script setup>
import { useConfigStore } from "@/stores/configStore";

// 어느 화면에서 사용하더라도 동일한 전역 단위 상태를 읽습니다.
const configStore = useConfigStore();
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-label">
      날씨 단위:
      <strong aria-live="polite">
        {{ configStore.unit === "celsius" ? "섭씨(°C)" : "화씨(°F)" }}
      </strong>
    </span>

    <!-- Pinia action은 함수 자체를 이벤트 핸들러로 전달할 수 있습니다. -->
    <button
      type="button"
      class="toggle-btn"
      :aria-label="`${configStore.unit === 'celsius' ? '화씨' : '섭씨'} 단위로 변경`"
      @click="configStore.toggleUnit"
    >
      단위 변경
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.65rem;
  color: #475569;
  white-space: nowrap;
}

.unit-label {
  display: inline-flex;
  align-items: baseline;
  gap: 0.3rem;
  font-size: 0.82rem;
}

.unit-label strong {
  color: #0f172a;
  font-size: 0.86rem;
  font-weight: 800;
}

.toggle-btn {
  min-height: 2rem;
  padding: 0.4rem 0.7rem;
  border: 1px solid #0f766e;
  border-radius: 0.6rem;
  background: #0f766e;
  color: #fff;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 160ms ease,
    background-color 160ms ease,
    box-shadow 160ms ease;
}

.toggle-btn:hover {
  background: #115e59;
  box-shadow: 0 6px 14px rgb(15 118 110 / 20%);
  transform: translateY(-1px);
}

.toggle-btn:focus-visible {
  outline: 3px solid rgb(45 212 191 / 35%);
  outline-offset: 2px;
}

@media (max-width: 680px) {
  .unit-toggler {
    width: 100%;
    justify-content: space-between;
    padding-top: 0.75rem;
    border-top: 1px solid #e2e8f0;
  }
}
</style>
