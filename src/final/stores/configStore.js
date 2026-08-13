import { computed, ref } from "vue";
import { defineStore } from "pinia";

// 이전 과제의 configStore를 최종 앱에서도 공통 단위 설정으로 활용합니다.
export const useConfigStore = defineStore("final-config", () => {
  const unit = ref("celsius");

  const unitSymbol = computed(() => (unit.value === "celsius" ? "°" : "°F"));
  const unitLabel = computed(() =>
    unit.value === "celsius" ? "섭씨" : "화씨",
  );

  function setUnit(nextUnit) {
    unit.value = nextUnit;
  }

  function toggleUnit() {
    unit.value = unit.value === "celsius" ? "fahrenheit" : "celsius";
  }

  function convertTemperature(celsius) {
    if (unit.value === "fahrenheit") {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  }

  return {
    unit,
    unitSymbol,
    unitLabel,
    setUnit,
    toggleUnit,
    convertTemperature,
  };
});
