import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const weatherClient = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  timeout: 8000,
});

const geoClient = axios.create({
  baseURL: "https://api.openweathermap.org/geo/1.0",
  timeout: 8000,
});

// 발표에서 사용할 국내 주요 도시는 한글 이름만 입력해도 안정적으로 찾도록 좌표를 제공합니다.
const KOREAN_CITY_COORDINATES = {
  서울: { lat: 37.5665, lon: 126.978, name: "서울" },
  수원: { lat: 37.2636, lon: 127.0286, name: "수원" },
  부산: { lat: 35.1796, lon: 129.0756, name: "부산" },
  인천: { lat: 37.4563, lon: 126.7052, name: "인천" },
  대구: { lat: 35.8714, lon: 128.6014, name: "대구" },
  대전: { lat: 36.3504, lon: 127.3845, name: "대전" },
  광주: { lat: 35.1595, lon: 126.8526, name: "광주" },
  제주: { lat: 33.4996, lon: 126.5312, name: "제주" },
};

const iconUrl = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;

function formatLocalTime(unixSeconds, timezoneOffset = 0) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(new Date((unixSeconds + timezoneOffset) * 1000));
}

function formatHour(unixSeconds, timezoneOffset = 0) {
  return `${new Date((unixSeconds + timezoneOffset) * 1000).getUTCHours()}시`;
}

function normalizeCurrent(data) {
  return {
    location: {
      name: data.name,
      country: data.sys.country,
      coordinates: data.coord,
    },
    current: {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      minimum: Math.round(data.main.temp_min),
      maximum: Math.round(data.main.temp_max),
      description: data.weather[0].description,
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
      iconUrl: iconUrl(data.weather[0].icon),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      visibility: Math.round((data.visibility / 1000) * 10) / 10,
      windSpeed: data.wind.speed,
      clouds: data.clouds.all,
      sunrise: formatLocalTime(data.sys.sunrise, data.timezone),
      sunset: formatLocalTime(data.sys.sunset, data.timezone),
    },
    timezone: data.timezone,
  };
}

function normalizeForecast(data, timezoneOffset) {
  const hourly = data.list.slice(0, 8).map((item, index) => ({
    time: index === 0 ? "지금" : formatHour(item.dt, timezoneOffset),
    temperature: Math.round(item.main.temp),
    icon: item.weather[0].icon,
    iconUrl: iconUrl(item.weather[0].icon),
    precipitation: Math.round((item.pop ?? 0) * 100),
  }));

  const groupedByDate = Object.groupBy(data.list, (item) =>
    item.dt_txt.slice(0, 10),
  );
  const dayFormatter = new Intl.DateTimeFormat("ko-KR", {
    weekday: "short",
    timeZone: "UTC",
  });

  const daily = Object.entries(groupedByDate)
    .slice(0, 5)
    .map(([date, entries], index) => {
      const representative =
        entries.find((item) => item.dt_txt.includes("12:00:00")) ?? entries[0];
      const temperatures = entries.map((item) => item.main.temp);

      return {
        day:
          index === 0
            ? "오늘"
            : dayFormatter.format(new Date(`${date}T00:00:00Z`)),
        icon: representative.weather[0].icon,
        iconUrl: iconUrl(representative.weather[0].icon),
        condition: representative.weather[0].description,
        minimum: Math.round(Math.min(...temperatures)),
        maximum: Math.round(Math.max(...temperatures)),
        precipitation: Math.round(
          Math.max(...entries.map((item) => item.pop ?? 0)) * 100,
        ),
      };
    });

  return { hourly, daily };
}

async function resolveCoordinates(city) {
  const koreanCity = KOREAN_CITY_COORDINATES[city.trim()];
  if (koreanCity) return koreanCity;

  const response = await geoClient.get("/direct", {
    params: { q: city, limit: 1, appid: API_KEY },
  });

  const match = response.data[0];
  if (!match) throw new Error("CITY_NOT_FOUND");

  return {
    lat: match.lat,
    lon: match.lon,
    name: match.local_names?.ko ?? match.name,
  };
}

export async function fetchWeatherByCity(city) {
  if (!API_KEY) {
    throw new Error("MISSING_API_KEY");
  }

  try {
    const coordinates = await resolveCoordinates(city);
    const commonParams = {
      lat: coordinates.lat,
      lon: coordinates.lon,
      appid: API_KEY,
      units: "metric",
      lang: "kr",
    };

    const [currentResponse, forecastResponse] = await Promise.all([
      weatherClient.get("/weather", { params: commonParams }),
      weatherClient.get("/forecast", { params: commonParams }),
    ]);

    const current = normalizeCurrent(currentResponse.data);
    const forecast = normalizeForecast(forecastResponse.data, current.timezone);
    current.current.minimum = Math.min(
      forecast.daily[0]?.minimum ?? current.current.minimum,
      current.current.temperature,
    );
    current.current.maximum = Math.max(
      forecast.daily[0]?.maximum ?? current.current.maximum,
      current.current.temperature,
    );

    return {
      location: { ...current.location, name: coordinates.name },
      current: current.current,
      ...forecast,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("CITY_NOT_FOUND", { cause: error });
      }
      if (error.response?.status === 401) {
        throw new Error("INVALID_API_KEY", { cause: error });
      }
      throw new Error("WEATHER_REQUEST_FAILED", { cause: error });
    }
    throw error;
  }
}

export async function fetchWeatherByCoordinates(
  lat,
  lon,
  preferredName = "현재 위치",
) {
  if (!API_KEY) throw new Error("MISSING_API_KEY");

  try {
    const commonParams = {
      lat,
      lon,
      appid: API_KEY,
      units: "metric",
      lang: "kr",
    };
    const [currentResponse, forecastResponse] = await Promise.all([
      weatherClient.get("/weather", { params: commonParams }),
      weatherClient.get("/forecast", { params: commonParams }),
    ]);

    const current = normalizeCurrent(currentResponse.data);
    const forecast = normalizeForecast(forecastResponse.data, current.timezone);
    current.current.minimum = Math.min(
      forecast.daily[0]?.minimum ?? current.current.minimum,
      current.current.temperature,
    );
    current.current.maximum = Math.max(
      forecast.daily[0]?.maximum ?? current.current.maximum,
      current.current.temperature,
    );

    return {
      location: {
        ...current.location,
        name:
          preferredName === "현재 위치" ? current.location.name : preferredName,
      },
      current: current.current,
      ...forecast,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error("INVALID_API_KEY", { cause: error });
      }
      throw new Error("WEATHER_REQUEST_FAILED", { cause: error });
    }
    throw error;
  }
}
