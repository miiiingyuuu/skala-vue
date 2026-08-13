import { computed, ref } from "vue";
import { defineStore } from "pinia";

// 날씨 화면 전체에서 공유하는 단위 설정 저장소입니다.
// setup store 문법으로 state, getter, action을 각각 선언합니다.
export const useConfigStore = defineStore("config", () => {
  // state: 원본 날씨 데이터의 단위인 섭씨를 초기값으로 사용합니다.
  const unit = ref("celsius");

  // getter: 현재 단위에 맞는 기호를 반응형으로 계산합니다.
  const unitSymbol = computed(() => (unit.value === "celsius" ? "°C" : "°F"));

  // action: 섭씨와 화씨를 서로 전환합니다.
  function toggleUnit() {
    unit.value = unit.value === "celsius" ? "fahrenheit" : "celsius";
  }

  return { unit, unitSymbol, toggleUnit };
});
