<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import Card from "primevue/card";
import ProgressSpinner from "primevue/progressspinner";
import UnitToggler from "@/final/components/UnitToggler.vue";
import NotFoundView from "@/final/views/NotFoundView.vue";
import { fetchWeatherByCoordinates } from "@/final/services/weatherApi";
import { useConfigStore } from "@/final/stores/configStore";

const route = useRoute();
const router = useRouter();
const configStore = useConfigStore();
const cityData = ref(null);
const isLoading = ref(true);
const errorMessage = ref("");

const backgroundClass = computed(() => {
  const condition = cityData.value?.current.condition.toLowerCase() ?? "clouds";
  if (condition.includes("rain")) return "weather-rain";
  if (condition.includes("snow")) return "weather-snow";
  if (condition.includes("clear")) return "weather-clear";
  return "weather-clouds";
});

const detailRows = computed(() => {
  if (!cityData.value) return [];
  const current = cityData.value.current;
  return [
    {
      label: "체감 온도",
      value: `${configStore.convertTemperature(current.feelsLike)}${configStore.unitSymbol}`,
      icon: "pi pi-sun",
    },
    { label: "습도", value: `${current.humidity}%`, icon: "pi pi-percentage" },
    { label: "기압", value: `${current.pressure} hPa`, icon: "pi pi-gauge" },
    { label: "풍속", value: `${current.windSpeed} m/s`, icon: "pi pi-send" },
    { label: "가시거리", value: `${current.visibility} km`, icon: "pi pi-eye" },
    { label: "구름", value: `${current.clouds}%`, icon: "pi pi-cloud" },
    { label: "일출", value: current.sunrise, icon: "pi pi-arrow-up-right" },
    { label: "일몰", value: current.sunset, icon: "pi pi-arrow-down-right" },
  ];
});

onMounted(async () => {
  const [lat, lon] = String(route.params.cityId).split(",").map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    errorMessage.value = "올바르지 않은 지역 주소입니다.";
    isLoading.value = false;
    return;
  }

  try {
    cityData.value = await fetchWeatherByCoordinates(
      lat,
      lon,
      String(route.query.name ?? "상세 지역"),
    );
  } catch {
    errorMessage.value = "해당 지역의 상세 기상 정보를 불러오지 못했습니다.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <main class="weather-app route-view" :class="backgroundClass">
    <div class="weather-shell route-shell">
      <header class="route-header">
        <Button
          icon="pi pi-arrow-left"
          label="날씨로 돌아가기"
          text
          rounded
          @click="router.push({ name: 'FinalWeatherHome' })"
        />
        <UnitToggler />
      </header>

      <div v-if="isLoading" class="loading-overlay">
        <ProgressSpinner />
        <p>상세 날씨를 불러오고 있어요</p>
      </div>
      <NotFoundView
        v-else-if="errorMessage"
        embedded
        :search-term="String(route.query.name ?? '')"
        @reset="router.push({ name: 'FinalWeatherHome' })"
      />

      <template v-else-if="cityData">
        <section class="detail-hero">
          <p>
            <i class="pi pi-map-marker"></i> {{ cityData.location.name }},
            {{ cityData.location.country }}
          </p>
          <strong
            >{{ configStore.convertTemperature(cityData.current.temperature)
            }}{{ configStore.unitSymbol }}</strong
          >
          <h1>{{ cityData.current.description }}</h1>
          <span
            >최고 {{ configStore.convertTemperature(cityData.current.maximum)
            }}{{ configStore.unitSymbol }} · 최저
            {{ configStore.convertTemperature(cityData.current.minimum)
            }}{{ configStore.unitSymbol }}</span
          >
        </section>

        <section class="detail-grid">
          <Card
            v-for="row in detailRows"
            :key="row.label"
            class="glass-card detail-card"
          >
            <template #content>
              <span><i :class="row.icon"></i> {{ row.label }}</span>
              <strong>{{ row.value }}</strong>
            </template>
          </Card>
        </section>
      </template>
    </div>
  </main>
</template>
