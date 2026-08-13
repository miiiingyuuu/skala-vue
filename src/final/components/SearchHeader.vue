<script setup>
import { ref, watch } from "vue";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Tag from "primevue/tag";
import UnitToggler from "@/final/components/UnitToggler.vue";

const props = defineProps({
  isLoading: { type: Boolean, default: false },
  isMockData: { type: Boolean, default: false },
  initialQuery: { type: String, default: "" },
});

const emit = defineEmits(["search"]);
const query = ref(props.initialQuery);
const appBaseUrl = import.meta.env.BASE_URL;

watch(
  () => props.initialQuery,
  (value) => {
    query.value = value;
  },
);

function submitSearch() {
  if (!query.value.trim()) return;
  emit("search", query.value);
}
</script>

<template>
  <header class="search-header">
    <div class="brand">
      <img
        class="brand-logo"
        :src="`${appBaseUrl}weather-message-logo.png`"
        alt="Weather Message 로고"
      />
      <div>
        <strong>Weather Message</strong>
        <span>Weather anywhere</span>
      </div>
    </div>

    <form class="search-form" @submit.prevent="submitSearch">
      <span class="search-input-wrap">
        <i class="pi pi-search"></i>
        <InputText
          v-model="query"
          aria-label="도시 검색"
          placeholder="도시를 검색하세요."
        />
      </span>
      <Button
        type="submit"
        icon="pi pi-arrow-right"
        rounded
        :loading="isLoading"
        aria-label="검색"
      />
    </form>

    <div class="header-actions">
      <Tag v-if="isMockData" value="DEMO" severity="secondary" rounded />
      <UnitToggler />
    </div>
  </header>
</template>
