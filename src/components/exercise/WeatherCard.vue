<script setup>
import { computed } from "vue";
import { useConfigStore } from "@/stores/configStore";

// 1. 상위로부터 단방향 주입받을 객체 데이터 규격 검수
// computed 안에서 사용하기 위해 defineProps의 반환값을 변수에 담습니다.
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
});

// 2. 상위로 송신할 두 가지 경로의 커스텀 이벤트 식별자 등록
const emit = defineEmits(["select-card", "click-detail"]);
const configStore = useConfigStore();

// 원본 기온은 섭씨로 유지하고 화면에 표시할 값만 화씨로 변환합니다.
const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp;

  if (configStore.unit === "fahrenheit") {
    return Math.round((rawTemp * 9) / 5 + 32);
  }

  return rawTemp;
});
</script>

<template>
  <article
    class="weather-card"
    tabindex="0"
    role="button"
    :aria-label="`${cityItem.name} 날씨 카드 선택`"
    @click="emit('select-card', `${cityItem.name}이(가) 선택되었습니다.`)"
    @keydown.enter="
      emit('select-card', `${cityItem.name}이(가) 선택되었습니다.`)
    "
    @keydown.space.prevent="
      emit('select-card', `${cityItem.name}이(가) 선택되었습니다.`)
    "
  >
    <h4>{{ cityItem.name }} ({{ cityItem.status }})</h4>
    <p>현재 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
    <!-- 배지 판정은 단위가 바뀌어도 원본 섭씨 25도를 기준으로 합니다. -->
    <span v-if="cityItem.temp >= 25" class="badge hot"
      >🔥 더움 (25도 이상)</span
    >
    <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>
    <button
      type="button"
      class="btn-detail"
      @click.stop="emit('click-detail', cityItem.name, cityItem.status)"
    >
      상세보기
    </button>
  </article>
</template>

<style scoped>
.weather-card {
  position: relative;
  min-height: 132px;
  margin-bottom: 12px;
  padding: 20px 120px 20px 20px;
  border: 1px solid #dfe7f1;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 5px 16px rgb(15 23 42 / 4%);
  cursor: pointer;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;
}

.weather-card:hover,
.weather-card:focus-visible {
  border-color: #93c5fd;
  box-shadow: 0 12px 28px rgb(37 99 235 / 10%);
  transform: translateY(-2px);
}

h4 {
  margin: 0 0 6px;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 800;
}

p {
  margin: 0 0 12px;
  color: #64748b;
}

.badge {
  display: inline-flex;
  padding: 5px 10px;
  border-radius: 999px;
  color: #fff;
  font-size: 0.76rem;
  font-weight: 800;
}

.hot {
  background: linear-gradient(135deg, #fb7185, #f43f5e);
}

.cool {
  background: linear-gradient(135deg, #38bdf8, #3b82f6);
}

.btn-detail {
  position: absolute;
  top: 20px;
  right: 20px;
  min-height: 38px;
  padding: 7px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  background: #fff;
  color: #475569;
  font-size: 0.82rem;
  font-weight: 750;
  cursor: pointer;
}

.btn-detail:hover {
  border-color: #60a5fa;
  background: #eff6ff;
  color: #1d4ed8;
}

@media (max-width: 640px) {
  .weather-card {
    min-height: 0;
    padding: 18px;
  }

  .btn-detail {
    position: static;
    margin-top: 16px;
  }
}
</style>
