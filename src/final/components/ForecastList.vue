<script setup>
import Card from "primevue/card";
import ProgressBar from "primevue/progressbar";
import { useConfigStore } from "@/final/stores/configStore";

const configStore = useConfigStore();

defineProps({
  items: { type: Array, required: true },
});

function temperaturePosition(item) {
  const range = Math.max(item.maximum - item.minimum, 1);
  return Math.min(100, Math.max(18, 45 + range * 5));
}
</script>

<template>
  <Card class="glass-card forecast-card">
    <template #title>
      <span class="section-title"><i class="pi pi-calendar"></i> 5일 예보</span>
    </template>
    <template #content>
      <div class="forecast-list">
        <article v-for="item in items" :key="item.day" class="forecast-row">
          <strong>{{ item.day }}</strong>
          <div class="condition">
            <img v-if="item.iconUrl" :src="item.iconUrl" alt="" />
            <i v-else class="pi pi-cloud"></i>
            <span>{{ item.condition }}</span>
          </div>
          <!-- 강수확률이 없어도 빈 그리드 칸을 유지해 온도 열이 밀리지 않게 합니다. -->
          <small
            class="precipitation"
            :class="{ empty: item.precipitation <= 0 }"
          >
            <template v-if="item.precipitation > 0">
              <i class="pi pi-tint"></i> {{ item.precipitation }}%
            </template>
          </small>
          <span class="temp-low"
            >{{ configStore.convertTemperature(item.minimum) }}°</span
          >
          <ProgressBar :value="temperaturePosition(item)" :show-value="false" />
          <span>{{ configStore.convertTemperature(item.maximum) }}°</span>
        </article>
      </div>
    </template>
  </Card>
</template>
