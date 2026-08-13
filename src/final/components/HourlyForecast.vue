<script setup>
import Card from "primevue/card";
import { useConfigStore } from "@/final/stores/configStore";

const configStore = useConfigStore();

defineProps({
  items: { type: Array, required: true },
});
</script>

<template>
  <Card class="glass-card hourly-card">
    <template #title>
      <span class="section-title"><i class="pi pi-clock"></i> 시간별 예보</span>
    </template>
    <template #content>
      <div class="hourly-scroll">
        <article v-for="item in items" :key="item.time" class="hour-item">
          <span>{{ item.time }}</span>
          <img v-if="item.iconUrl" :src="item.iconUrl" alt="" />
          <i v-else class="pi pi-cloud"></i>
          <small
            class="precipitation"
            :class="{ empty: item.precipitation <= 0 }"
          >
            <template v-if="item.precipitation > 0"
              >{{ item.precipitation }}%</template
            >
          </small>
          <strong>
            {{ configStore.convertTemperature(item.temperature)
            }}{{ configStore.unitSymbol }}
          </strong>
        </article>
      </div>
    </template>
  </Card>
</template>
