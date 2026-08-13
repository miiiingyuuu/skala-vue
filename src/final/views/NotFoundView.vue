<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";

const props = defineProps({
  embedded: { type: Boolean, default: false },
  searchTerm: { type: String, default: "" },
});
const emit = defineEmits(["reset"]);
const route = useRoute();
const router = useRouter();
const searchedCity = computed(() =>
  props.searchTerm ||
  (typeof route.query.search === "string" ? route.query.search : ""),
);

function goHome() {
  if (props.embedded) {
    emit("reset");
    return;
  }
  router.push({ name: "FinalWeatherHome" });
}
</script>

<template>
  <main
    :class="[
      embedded ? 'not-found-card' : 'weather-app weather-mist route-view',
      'not-found-page',
    ]"
  >
    <section>
      <span>404</span>
      <h1>이 하늘은 찾을 수 없어요.</h1>
      <p v-if="searchedCity">
        ‘{{ searchedCity }}’에 해당하는 도시를 찾지 못했습니다.
      </p>
      <p v-else>요청한 주소가 존재하지 않거나 이동되었습니다.</p>
      <Button
        label="날씨 홈으로 이동"
        icon="pi pi-home"
        @click="goHome"
      />
    </section>
  </main>
</template>
