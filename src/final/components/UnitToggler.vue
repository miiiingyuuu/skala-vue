<script setup>
import SelectButton from "primevue/selectbutton";
import { useConfigStore } from "@/final/stores/configStore";

const configStore = useConfigStore();
const options = [
  { label: "°C", value: "celsius" },
  { label: "°F", value: "fahrenheit" },
];
</script>

<template>
  <SelectButton
    :model-value="configStore.unit"
    :options="options"
    option-label="label"
    option-value="value"
    :allow-empty="false"
    aria-label="온도 단위"
    class="unit-toggler"
    @update:model-value="configStore.setUnit"
  />
</template>
