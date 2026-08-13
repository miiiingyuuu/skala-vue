## Day 4. Axios, UI Library와 배포

Day 4에는 기존 날씨 과제의 구조를 유지하면서 목업 데이터를 실제 API 데이터로 교체하고, 외부 UI Library를 적용한 뒤 프로덕션 빌드와 GitHub Pages 배포까지 진행했습니다.

### 1. Axios 비동기 통신

Axios는 브라우저에서 HTTP 요청을 보내고 응답을 다루는 라이브러리입니다. `axios.get()`의 반환값은 Promise이므로 `async/await`로 응답을 기다립니다. Fetch API와 달리 JSON 응답이 이미 `response.data`에 담겨 있습니다.

```js
import axios from "axios";

const response = await axios.get(
  "https://api.openweathermap.org/data/2.5/weather",
  {
    params: {
      q: "Seoul",
      appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
      units: "metric",
      lang: "kr",
    },
  },
);

console.log(response.data);
```

`params` 객체를 사용하면 Axios가 쿼리 문자열을 안전하게 조합합니다.

| 설정 | 역할 |
| --- | --- |
| `q` | 조회할 도시 이름 |
| `appid` | OpenWeather API 키 |
| `units=metric` | 섭씨 단위로 응답 요청 |
| `lang=kr` | 날씨 설명을 한국어로 요청 |

### 2. 로딩·성공·실패 상태 처리

API 통신 중에는 요청 결과가 즉시 도착하지 않으므로 로딩 상태와 오류 상태를 반응형 데이터로 관리했습니다.

```js
const weatherData = ref(null);
const isLoading = ref(false);
const errorMessage = ref("");

const fetchWeather = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await axios.get(API_URL);
    weatherData.value = response.data;
  } catch (error) {
    errorMessage.value = "날씨 정보를 가져오지 못했습니다.";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
```

- `try`: 정상 응답을 화면 상태에 저장합니다.
- `catch`: 네트워크, 인증, 잘못된 도시 등의 오류를 처리합니다.
- `finally`: 성공 여부와 관계없이 로딩 상태를 종료합니다.
- `<template v-else>`: 로딩 이후 표시할 여러 요소를 불필요한 DOM 없이 하나의 조건으로 묶습니다.

### 3. API 응답 데이터 매핑

OpenWeather의 응답 구조와 기존 `WeatherCard`가 요구하는 구조가 다르므로, 컴포넌트를 다시 만들지 않고 응답 데이터를 화면 모델로 변환했습니다.

```js
const cityItem = {
  id: "city_01",
  name: "서울",
  temp: response.data.main.temp,
  status: response.data.weather[0].description,
};
```

`weather`는 한 지역에서 여러 기상 현상이 겹칠 수 있어 배열로 전달되며, 대표 날씨는 `weather[0]`에서 읽습니다. 목록 화면에서는 여러 도시 요청을 `Promise.all()`로 병렬 처리하여 전체 대기 시간을 줄였습니다.

### 4. Axios CRUD 실습

JSONPlaceholder API를 사용해 HTTP 메서드별 기본 동작을 연습했습니다.

| 작업 | HTTP 메서드 | Axios 사용법 |
| --- | --- | --- |
| 조회 | GET | `axios.get(url, config)` |
| 생성 | POST | `axios.post(url, payload)` |
| 수정 | PUT | `axios.put(url, payload)` |
| 삭제 | DELETE | `axios.delete(url)` |

서버 응답 후 `ref` 배열에 항목을 추가·교체·제거하면 Vue가 변경된 목록을 자동으로 다시 렌더링합니다.

### 5. Element Plus UI Library

Element Plus를 Vue 앱에 플러그인으로 등록하고 Form, Data 입력, 시스템 Feedback 컴포넌트를 실습했습니다.

```js
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

createApp(App).use(ElementPlus).mount("#app");
```

| 분류 | 사용 컴포넌트 | 실습 내용 |
| --- | --- | --- |
| Form | `ElInput`, `ElSwitch`, `ElButton` | 이메일 입력, 동의 여부와 유효성 검사 |
| Data | `ElInputNumber`, `ElRate` | 수량 제한과 별점 상태 관리 |
| Feedback | `ElMessage`, `ElMessageBox`, `ElProgress` | 알림, 확인창, 진행률 표시 |

Vue 템플릿에서 컴포넌트를 직접 사용할 때는 전역 플러그인 등록 또는 필요한 컴포넌트의 개별 import가 필요하며, Element Plus CSS도 함께 불러와야 정상적인 형태로 표시됩니다.

### 6. 최종 날씨 앱 통합

기존 Day 1~3 과제에서 사용한 Vue 문법, Composition API, 컴포넌트 통신, Router, Pinia를 유지하면서 다음 기능을 추가했습니다.

- Axios를 이용한 현재 날씨와 5일 예보 조회
- 브라우저 Geolocation을 이용한 현재 위치 날씨 표시
- 검색 지역을 Pinia와 브라우저 저장소에 보관하고 슬라이드로 전환
- 섭씨·화씨 단위 전환과 상세 날씨 화면
- URL query를 이용한 검색 상태 복원
- 로딩, API 오류, 도시 없음 상태 분기
- PrimeVue 기반 검색창, 버튼과 토글 UI
- 날씨 상태에 따른 동적 배경과 외부 명언 API

연습용 과제와 발표용 화면은 `/`와 `/final` 경로로 나누고, 최상위 토글을 통해 하나의 프로젝트에서 전환할 수 있도록 구성했습니다.

### 7. 환경변수와 API 키

API 키는 소스 코드에 직접 작성하지 않고 Git에서 제외되는 `.env.local`에 저장합니다.

```text
VITE_OPENWEATHER_API_KEY=발급받은_API_키
```

코드에서는 다음과 같이 읽습니다.

```js
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
```

`.env.example`에는 변수 이름만 남겨 다른 개발자가 필요한 설정을 알 수 있도록 했습니다. 다만 Vite의 `VITE_` 변수는 브라우저 번들에 포함되므로 완전한 비밀 저장소가 아닙니다. 실제 서비스에서는 API 제공자의 도메인 제한 또는 백엔드 프록시를 함께 고려해야 합니다.

### 8. 프로덕션 빌드와 GitHub Pages 배포

배포 전 정적 분석과 프로덕션 빌드를 실행했습니다.

```bash
npm run lint
npm run build
npm run deploy
```

GitHub Pages의 프로젝트 경로에 맞춰 Vite와 Router에 같은 base를 적용했습니다.

```js
// vite.config.js
export default defineConfig({
  base: "/skala-vue/",
});

// router/index.js
createWebHistory(import.meta.env.BASE_URL);
```

`gh-pages` 패키지는 `dist` 결과물을 원격 `gh-pages` 브랜치에 게시합니다. 또한 SPA 하위 주소를 직접 열거나 새로고침할 때 앱의 진입 파일을 제공하도록 빌드 결과에 `404.html`을 함께 생성합니다.

배포 주소: <https://miiiingyuuu.github.io/skala-vue/>

### 9. Day 4 실습 파일

```text
src/
├── App.vue.Day4
├── components/library/
│   ├── AxiosWeather.vue
│   ├── AxiosJson.vue
│   └── ElementPlus.vue
├── views/
│   ├── WeatherHomeView.vue
│   └── WeatherDetailView.vue
└── final/
    ├── components/
    ├── composables/
    ├── services/
    ├── stores/
    └── views/
```

### Day 4 핵심 정리

1. Axios는 Promise 기반으로 HTTP 요청을 처리하며 실제 응답 데이터는 `response.data`에서 읽습니다.
2. 비동기 화면은 데이터뿐 아니라 loading, error, empty 상태도 함께 설계해야 합니다.
3. API 응답을 기존 컴포넌트 규격에 맞게 매핑하면 UI 구조를 유지하면서 데이터 출처만 교체할 수 있습니다.
4. `Promise.all()`은 서로 독립적인 여러 요청을 병렬로 처리할 때 유용합니다.
5. Element Plus와 PrimeVue 같은 UI Library는 상태 로직을 대체하는 것이 아니라 일관된 입력과 Feedback UI를 제공합니다.
6. API 키는 환경변수로 분리하고 저장소에서 제외해야 하며, 브라우저 앱의 키 노출 특성도 이해해야 합니다.
7. 배포 환경에서는 Vite의 base, Router history base, 정적 자산 경로와 SPA 새로고침을 함께 점검해야 합니다.

