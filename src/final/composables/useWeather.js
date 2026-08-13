import { computed, ref } from "vue";
import { mockWeatherBundle } from "@/final/data/mockWeather";
import {
  fetchWeatherByCity,
  fetchWeatherByCoordinates,
} from "@/final/services/weatherApi";
import { useWeatherLocationStore } from "@/final/stores/weatherLocationStore";

const ERROR_MESSAGES = {
  CITY_NOT_FOUND: "도시를 찾지 못했어요. 도시 이름을 다시 확인해 주세요.",
  INVALID_API_KEY: "OpenWeather API 키가 올바르지 않습니다.",
  WEATHER_REQUEST_FAILED:
    "날씨 정보를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.",
};

function getBrowserPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("GEOLOCATION_UNAVAILABLE"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5 * 60 * 1000,
    });
  });
}

export function useWeather() {
  const locationStore = useWeatherLocationStore();
  const weatherPages = ref([{ ...mockWeatherBundle, source: "current" }]);
  const activeIndex = ref(0);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const infoMessage = ref("");
  const isMockData = ref(!import.meta.env.VITE_OPENWEATHER_API_KEY);
  const currentLocationLabel = ref("현재 위치");
  let infoTimer;
  let errorTimer;

  const weather = computed(
    () => weatherPages.value[activeIndex.value] ?? weatherPages.value[0],
  );
  const isCurrentPage = computed(() => weather.value.source === "current");

  function showInfoMessage(message) {
    window.clearTimeout(infoTimer);
    infoMessage.value = message;
    infoTimer = window.setTimeout(() => {
      infoMessage.value = "";
    }, 3000);
  }

  function showErrorMessage(message) {
    window.clearTimeout(errorTimer);
    errorMessage.value = message;
    errorTimer = window.setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }

  const backgroundClass = computed(() => {
    const condition = weather.value.current.condition.toLowerCase();
    if (condition.includes("thunder")) return "weather-thunder";
    if (condition.includes("snow")) return "weather-snow";
    if (condition.includes("rain") || condition.includes("drizzle"))
      return "weather-rain";
    if (condition.includes("mist") || condition.includes("fog"))
      return "weather-mist";
    if (condition.includes("clear")) return "weather-clear";
    return "weather-clouds";
  });

  async function restoreSavedLocations() {
    if (locationStore.locations.length === 0) return;

    const restored = await Promise.allSettled(
      locationStore.locations.map((location) =>
        fetchWeatherByCoordinates(
          location.lat,
          location.lon,
          location.name,
        ),
      ),
    );

    restored.forEach((result) => {
      if (result.status !== "fulfilled") return;
      const savedPage = result.value;
      const isCurrentLocation = weatherPages.value.some(
        (page) =>
          Number(page.location.coordinates.lat).toFixed(3) ===
            Number(savedPage.location.coordinates.lat).toFixed(3) &&
          Number(page.location.coordinates.lon).toFixed(3) ===
            Number(savedPage.location.coordinates.lon).toFixed(3),
      );
      if (!isCurrentLocation)
        weatherPages.value.push({ ...savedPage, source: "search" });
    });
  }

  async function initializeWeather() {
    isLoading.value = true;
    errorMessage.value = "";
    infoMessage.value = "현재 위치를 확인하고 있어요.";

    try {
      const position = await getBrowserPosition();
      const current = await fetchWeatherByCoordinates(
        position.coords.latitude,
        position.coords.longitude,
      );
      weatherPages.value = [{ ...current, source: "current" }];
      isMockData.value = false;
      showInfoMessage("현재 위치의 날씨를 불러왔습니다.");
      currentLocationLabel.value = "현재 위치";
    } catch (error) {
      try {
        const fallback = await fetchWeatherByCity("서울");
        weatherPages.value = [{ ...fallback, source: "current" }];
        showInfoMessage(
          error.message === "MISSING_API_KEY"
            ? "API 키가 없어 목업 데이터를 표시합니다."
            : "위치 권한이 없어 서울 날씨를 기본으로 표시합니다.",
        );
        currentLocationLabel.value = "기본 지역";
      } catch {
        weatherPages.value = [{ ...mockWeatherBundle, source: "current" }];
        isMockData.value = true;
        showErrorMessage(
          "현재 위치를 가져오지 못해 목업 데이터를 표시합니다.",
        );
      }
    } finally {
      await restoreSavedLocations();
      activeIndex.value = 0;
      isLoading.value = false;
    }
  }

  async function searchWeather(city) {
    const query = city.trim();
    if (!query) return { ok: false, reason: "EMPTY_QUERY" };
    errorMessage.value = "";
    infoMessage.value = "";
    isLoading.value = true;

    try {
      const result = await fetchWeatherByCity(query);
      const existingIndex = weatherPages.value.findIndex(
        (page) =>
          page.source !== "current" &&
          Number(page.location.coordinates.lat).toFixed(3) ===
            Number(result.location.coordinates.lat).toFixed(3) &&
          Number(page.location.coordinates.lon).toFixed(3) ===
            Number(result.location.coordinates.lon).toFixed(3),
      );
      if (existingIndex >= 0)
        weatherPages.value[existingIndex] = {
          ...result,
          source: weatherPages.value[existingIndex].source,
        };
      else weatherPages.value.push({ ...result, source: "search" });
      locationStore.addLocation(result.location);
      activeIndex.value =
        existingIndex >= 0 ? existingIndex : weatherPages.value.length - 1;
      showInfoMessage(`${result.location.name} 날씨를 검색했습니다.`);
      isMockData.value = false;
      return { ok: true };
    } catch (error) {
      if (error.message === "CITY_NOT_FOUND") {
        return { ok: false, reason: "CITY_NOT_FOUND" };
      }

      showErrorMessage(
        ERROR_MESSAGES[error.message] ?? ERROR_MESSAGES.WEATHER_REQUEST_FAILED,
      );
      return { ok: false, reason: error.message };
    } finally {
      isLoading.value = false;
    }
  }

  function setActiveIndex(index) {
    activeIndex.value = Math.min(
      Math.max(index, 0),
      weatherPages.value.length - 1,
    );
  }

  function nextPage() {
    if (activeIndex.value < weatherPages.value.length - 1)
      activeIndex.value += 1;
  }

  function previousPage() {
    if (activeIndex.value > 0) activeIndex.value -= 1;
  }

  function removeActivePage() {
    if (isCurrentPage.value) return;
    const removedName = weather.value.location.name;
    locationStore.removeLocation(weather.value.location);
    weatherPages.value.splice(activeIndex.value, 1);
    activeIndex.value = Math.max(0, activeIndex.value - 1);
    showInfoMessage(`${removedName} 지역을 슬라이드에서 제거했습니다.`);
  }

  return {
    weather,
    weatherPages,
    activeIndex,
    isLoading,
    errorMessage,
    infoMessage,
    isMockData,
    isCurrentPage,
    currentLocationLabel,
    backgroundClass,
    initializeWeather,
    searchWeather,
    setActiveIndex,
    nextPage,
    previousPage,
    removeActivePage,
  };
}
