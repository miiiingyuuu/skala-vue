<script setup>
import Button from "primevue/button";
import { useConfigStore } from "@/final/stores/configStore";

const configStore = useConfigStore();

defineProps({
  location: { type: Object, required: true },
  weather: { type: Object, required: true },
  isCurrent: { type: Boolean, default: false },
  currentLabel: { type: String, default: "현재 위치" },
});

const emit = defineEmits(["remove-page", "select-card", "click-detail"]);
</script>

<template>
  <section
    class="current-hero"
    role="button"
    tabindex="0"
    :aria-label="`${location.name} 날씨 카드`"
    @click="emit('select-card', `${location.name} 날씨를 선택했습니다.`)"
    @keydown.enter="
      emit('select-card', `${location.name} 날씨를 선택했습니다.`)
    "
  >
    <div class="location-row">
      <span
        ><i class="pi pi-map-marker"></i> {{ location.name }},
        {{ location.country }}</span
      >
      <span v-if="isCurrent" class="current-location-label">
        <i class="pi pi-map-marker"></i> {{ currentLabel }}
      </span>
      <Button
        v-else
        icon="pi pi-times"
        severity="secondary"
        text
        rounded
        :aria-label="`${location.name} 슬라이드 제거`"
        @click.stop="$emit('remove-page')"
      />
    </div>

    <div class="current-main">
      <div class="current-summary">
        <p class="today-label">오늘의 날씨</p>
        <strong class="temperature">
          {{ configStore.convertTemperature(weather.temperature)
          }}{{ configStore.unitSymbol }}
        </strong>
        <h1>{{ weather.description }}</h1>
        <p>
          최고 {{ configStore.convertTemperature(weather.maximum)
          }}{{ configStore.unitSymbol }} · 최저
          {{ configStore.convertTemperature(weather.minimum)
          }}{{ configStore.unitSymbol }}
        </p>

        <!-- 상세보기는 최고·최저 문구 다음의 독립된 행에 배치합니다. -->
        <Button
          class="hero-detail-button"
          label="상세 기상 정보"
          icon="pi pi-arrow-up-right"
          icon-pos="right"
          text
          rounded
          @click.stop="emit('click-detail')"
        />
      </div>

    </div>
  </section>
</template>
