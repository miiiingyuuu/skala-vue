import { ref } from "vue";
import { defineStore } from "pinia";

const STORAGE_KEY = "weather-message:searched-locations";

function loadLocations() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(saved)) return [];

    return saved.filter(
      (location) =>
        typeof location?.name === "string" &&
        Number.isFinite(Number(location?.lat)) &&
        Number.isFinite(Number(location?.lon)),
    );
  } catch {
    return [];
  }
}

export const useWeatherLocationStore = defineStore(
  "final-weather-locations",
  () => {
    // API 응답 전체가 아닌 재조회에 필요한 최소 정보만 영구 저장합니다.
    const locations = ref(loadLocations());

    function persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locations.value));
    }

    function addLocation(location) {
      const next = {
        name: location.name,
        lat: Number(location.coordinates.lat),
        lon: Number(location.coordinates.lon),
      };
      const index = locations.value.findIndex(
        (item) =>
          item.lat.toFixed(3) === next.lat.toFixed(3) &&
          item.lon.toFixed(3) === next.lon.toFixed(3),
      );

      if (index >= 0) locations.value[index] = next;
      else locations.value.push(next);
      persist();
    }

    function removeLocation(location) {
      const lat = Number(location.coordinates.lat).toFixed(3);
      const lon = Number(location.coordinates.lon).toFixed(3);
      locations.value = locations.value.filter(
        (item) =>
          item.lat.toFixed(3) !== lat || item.lon.toFixed(3) !== lon,
      );
      persist();
    }

    return { locations, addLocation, removeLocation };
  },
);
