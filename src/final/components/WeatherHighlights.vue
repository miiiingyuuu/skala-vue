<script setup>
import Card from "primevue/card";
import { useConfigStore } from "@/final/stores/configStore";

const configStore = useConfigStore();

defineProps({
  weather: { type: Object, required: true },
});

const highlights = [
  {
    key: "feelsLike",
    label: "체감 온도",
    icon: "pi pi-sun",
    type: "temperature",
  },
  { key: "humidity", label: "습도", icon: "pi pi-percentage", suffix: "%" },
  { key: "windSpeed", label: "바람", icon: "pi pi-send", suffix: "m/s" },
  { key: "visibility", label: "가시거리", icon: "pi pi-eye", suffix: "km" },
  { key: "sunrise", label: "일출", icon: "pi pi-arrow-up-right", suffix: "" },
  { key: "sunset", label: "일몰", icon: "pi pi-arrow-down-right", suffix: "" },
];

function displayValue(item, weather) {
  if (item.type === "temperature") {
    return `${configStore.convertTemperature(weather[item.key])}${configStore.unitSymbol}`;
  }
  return `${weather[item.key]}${item.suffix ?? ""}`;
}
</script>

<template>
  <section class="highlight-grid">
    <Card
      v-for="item in highlights"
      :key="item.key"
      class="glass-card highlight-card"
    >
      <template #content>
        <span><i :class="item.icon"></i> {{ item.label }}</span>
        <strong>{{ displayValue(item, weather) }}</strong>
      </template>
    </Card>
  </section>
</template>
