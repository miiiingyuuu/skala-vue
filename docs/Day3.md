## Day 3. 컴포넌트 통신, Router와 Pinia

Day 3에서는 하나의 파일에 있던 날씨 화면을 여러 컴포넌트로 분리하고, 부모와 자식 사이의 데이터 흐름을 실습했습니다. 이어서 Vue Router로 화면을 URL과 연결하고 Pinia로 여러 화면이 공유하는 날씨 단위 상태를 관리했습니다.

### 1. 컴포넌트와 생명주기 훅

컴포넌트는 화면과 로직을 재사용 가능한 단위로 나누는 방법입니다. 부모 컴포넌트가 자식을 조립하고, 각 자식은 맡은 역할에 집중하도록 구성했습니다.

Vue 컴포넌트는 생성되어 화면에 연결되고, 상태 변화에 따라 갱신된 뒤 화면에서 제거되는 생명주기를 가집니다.

| 훅                | 실행 시점                         | 주요 용도                     |
| ----------------- | --------------------------------- | ----------------------------- |
| `onBeforeMount`   | DOM에 연결되기 직전               | 마운트 전 상태 확인           |
| `onMounted`       | DOM에 연결된 직후                 | 초기 데이터 요청, DOM 접근    |
| `onBeforeUpdate`  | 반응형 변경이 DOM에 반영되기 직전 | 갱신 전 상태 확인             |
| `onUpdated`       | DOM 갱신이 끝난 직후              | 갱신된 DOM을 이용한 후속 처리 |
| `onBeforeUnmount` | 컴포넌트 제거 직전                | 종료 전 정리 준비             |
| `onUnmounted`     | 컴포넌트 제거 직후                | 타이머와 이벤트 리스너 해제   |

```vue
<script setup>
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  console.log("컴포넌트가 화면에 연결되었습니다.");
});

onUnmounted(() => {
  console.log("컴포넌트가 화면에서 제거되었습니다.");
});
</script>
```

생명주기 훅은 컴포넌트 최상위의 `<script setup>`에서 등록해야 합니다. 특히 타이머나 전역 이벤트를 만들었다면 `onUnmounted`에서 해제해 불필요한 동작과 메모리 누수를 방지해야 합니다.

### 2. Props와 Emits

Vue 컴포넌트의 기본 데이터 흐름은 다음과 같습니다.

```text
부모 상태 ── props ──▶ 자식 컴포넌트
부모 함수 ◀─ emits ── 자식의 사용자 이벤트
```

- `props`: 부모가 자식에게 데이터를 내려주는 단방향 통신
- `emits`: 자식이 부모에게 사건과 값을 알려주는 상향 통신
- 자식은 전달받은 prop을 직접 수정하지 않고 이벤트로 변경을 요청합니다.

```vue
<!-- 부모 -->
<SearchBar
  :current-query="searchQuery"
  @update-query="(value) => (searchQuery = value)"
/>
```

```vue
<!-- 자식 SearchBar.vue -->
<script setup>
defineProps({
  currentQuery: { type: String, default: "" },
});

const emit = defineEmits(["update-query"]);
</script>

<template>
  <input
    :value="currentQuery"
    @input="emit('update-query', $event.target.value)"
  />
</template>
```

`WeatherCard.vue`에서는 도시 객체를 prop으로 받고, 카드 선택과 상세보기라는 서로 다른 사건을 emit으로 부모에게 전달했습니다. 상세보기 버튼에는 `@click.stop`을 사용해 버튼 클릭이 카드 클릭으로 버블링되지 않도록 했습니다.

### 3. Slot과 컴포넌트 조합

Slot은 부모가 자식 컴포넌트의 특정 위치에 템플릿 콘텐츠를 전달하는 기능입니다. 데이터 전달이 중심인 prop과 달리, slot은 화면 구조를 유연하게 조합할 때 사용합니다.

#### 기본 슬롯

```vue
<!-- BaseDashboardCard.vue -->
<template>
  <section class="base-dashboard-card">
    <slot />
  </section>
</template>
```

```vue
<BaseDashboardCard>
  <h3>지역별 날씨 현황</h3>
  <WeatherCard />
</BaseDashboardCard>
```

#### 이름 있는 슬롯과 범위 슬롯

- 이름 있는 슬롯은 `#header`, `#footer`처럼 여러 삽입 위치를 구분합니다.
- 범위 슬롯은 자식이 가진 값을 slot props로 부모 템플릿에 공개합니다.

```vue
<template #header>
  <h3>카드 제목</h3>
</template>

<template #default="{ item }">
  <p>{{ item.name }}</p>
</template>
```

### 4. 과제 3 — 날씨 화면 컴포넌트 분리

기존 `WeatherComposition.vue`의 기능을 다음 역할로 나누었습니다.

| 컴포넌트                | 역할                             | 통신 방식                                |
| ----------------------- | -------------------------------- | ---------------------------------------- |
| `WeatherParent.vue`     | 상태와 검색 로직 소유, 자식 조립 | props 전달, emits 수신                   |
| `BaseDashboardCard.vue` | 공통 카드 레이아웃               | 기본 slot                                |
| `SearchBar.vue`         | 검색어 표시와 입력               | `currentQuery` prop, `update-query` emit |
| `WeatherCard.vue`       | 도시 한 곳의 날씨 표시           | `cityItem` prop, 두 종류의 emit          |

부모가 반응형 상태와 계산 로직의 소유권을 유지하고, 자식은 표시와 사용자 입력 전달에 집중합니다. 이 구조는 한 컴포넌트가 너무 많은 책임을 갖는 것을 줄이고 각 부분을 재사용하기 쉽게 만듭니다.

### 5. Vue Router

Vue Router는 URL과 Vue 컴포넌트를 연결합니다. `main.js`에서 라우터를 플러그인으로 등록하고, `routes` 배열에 각 주소와 화면을 정의했습니다.

```js
const routes = [
  { path: "/", name: "WeatherHome", component: WeatherHomeView },
  {
    path: "/about",
    name: "WeatherAbout",
    component: () => import("../views/WeatherAboutView.vue"),
  },
  {
    path: "/weather/:cityId",
    name: "WeatherDetail",
    component: () => import("../views/WeatherDetailView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFoundView.vue"),
  },
];
```

#### 주요 Router 기능

| 기능           | 역할                              | 사용 예시                              |
| -------------- | --------------------------------- | -------------------------------------- |
| `<RouterLink>` | 새로고침 없이 선언적으로 이동     | `<RouterLink to="/about">`             |
| `<RouterView>` | 현재 URL과 일치하는 View 렌더링   | 앱 레이아웃 내부에 한 번 배치          |
| `useRouter()`  | 코드에서 다른 주소로 이동         | `router.push({ name: 'WeatherHome' })` |
| `useRoute()`   | 현재 URL의 params와 query 읽기    | `route.params.cityId`                  |
| 동적 파라미터  | URL의 일부를 데이터 식별자로 사용 | `/weather/:cityId`                     |
| Catch-all 경로 | 일치하는 주소가 없을 때 처리      | `/:pathMatch(.*)*`                     |

#### Params와 Query

- Params는 `/weather/city_01`처럼 경로의 일부이며 특정 도시를 식별했습니다.
- Query는 `/?search=부산`처럼 부가 상태를 주소에 기록하며 검색어를 복원하는 데 사용했습니다.

```js
router.push({
  name: "WeatherDetail",
  params: { cityId: item.id },
});

router.push({
  path: route.path,
  query: { search: newQuery || undefined },
});
```

라우트 이름으로 이동하면 나중에 URL 구조가 바뀌더라도 호출부의 변경을 줄일 수 있습니다. 검색어가 비어 있을 때 `undefined`를 전달하면 불필요한 query를 주소에서 제거할 수 있습니다.

### 6. 과제 4 — Router 날씨 서비스

라우터 과제에서는 날씨 화면을 View 단위로 분리했습니다.

- `WeatherHomeView.vue`: 검색, 목록 출력, query 동기화, 상세 화면 이동
- `WeatherDetailView.vue`: `cityId`에 맞는 상세 기상 데이터 출력
- `WeatherAboutView.vue`: 서비스 소개 정적 화면
- `NotFoundView.vue`: 정의되지 않은 경로의 안내 화면
- `ExerciseApp.vue`: 내비게이션과 하나의 `<RouterView>` 제공

상세 데이터 유무는 `v-if / v-else`로 구분하고, 존재하지 않는 도시 ID에는 안내 문구를 보여줍니다. `RouterView`는 같은 위치에 현재 경로의 View 하나를 교체해 렌더링하므로 앱의 화면 영역마다 하나만 배치했습니다.

### 7. Pinia 전역 상태 관리

Props와 emits는 가까운 부모·자식 사이의 통신에 적합하지만, 내비게이션과 목록·상세 View처럼 멀리 떨어진 여러 컴포넌트가 같은 값을 사용하면 전달 단계가 많아질 수 있습니다. Pinia store는 이런 공유 상태를 컴포넌트 밖에서 관리합니다.

```js
// stores/configStore.js
export const useConfigStore = defineStore("config", () => {
  const unit = ref("celsius");

  const unitSymbol = computed(() => (unit.value === "celsius" ? "°C" : "°F"));

  function toggleUnit() {
    unit.value = unit.value === "celsius" ? "fahrenheit" : "celsius";
  }

  return { unit, unitSymbol, toggleUnit };
});
```

| Store 구성 | 역할                               | 이번 과제      |
| ---------- | ---------------------------------- | -------------- |
| State      | 여러 컴포넌트가 공유하는 원본 상태 | `unit`         |
| Getter     | State에서 계산한 파생 상태         | `unitSymbol`   |
| Action     | State를 변경하는 동작              | `toggleUnit()` |

Pinia는 애플리케이션 생성 시 한 번 등록합니다.

```js
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
```

### 8. 과제 5 — 섭씨·화씨 단위 전환

`UnitToggler.vue`에서 `configStore.toggleUnit` action을 호출하면 같은 store를 사용하는 목록 카드와 상세 화면이 함께 갱신됩니다.

```js
const configStore = useConfigStore();

const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp;

  if (configStore.unit === "fahrenheit") {
    return Math.round((rawTemp * 9) / 5 + 32);
  }

  return rawTemp;
});
```

원본 데이터는 섭씨로 유지하고 화면에 표시할 값만 화씨로 변환했습니다. 따라서 더움/선선함 배지는 표시 단위와 관계없이 원본 조건인 `cityItem.temp >= 25`를 계속 사용합니다. 원본과 표시용 파생 값을 구분하면 단위 변경 때문에 비즈니스 규칙이 흔들리는 문제를 막을 수 있습니다.

### 9. Day 3 실습 파일

```text
src/
├── App.vue.Day3
├── ExerciseApp.vue
├── PracticeApp.vue
├── main.js
├── router/
│   └── index.js
├── stores/
│   └── configStore.js
├── components/
│   ├── practices/component/
│   │   ├── LifecycleHookExampleParent.vue
│   │   ├── LifecycleHookExampleChild.vue
│   │   ├── PropsEmitsParent.vue
│   │   ├── PropsEmitsChild.vue
│   │   ├── SlotDefaultParent.vue
│   │   ├── SlotDefaultChild.vue
│   │   ├── SlotNamedParent.vue
│   │   ├── SlotNamedChild.vue
│   │   ├── SlotScopedParent.vue
│   │   └── SlotScopedChild.vue
│   └── exercise/
│       ├── WeatherParent.vue
│       ├── BaseDashboardCard.vue
│       ├── SearchBar.vue
│       ├── WeatherCard.vue
│       └── UnitToggler.vue
└── views/
    ├── WeatherHomeView.vue
    ├── WeatherDetailView.vue
    ├── WeatherAboutView.vue
    └── NotFoundView.vue
```

### Day 3 핵심 정리

1. 생명주기 훅으로 컴포넌트가 연결·갱신·제거되는 시점에 필요한 작업을 실행할 수 있습니다.
2. 부모는 props로 데이터를 내려주고 자식은 emits로 사용자 사건을 알려 단방향 데이터 흐름을 유지합니다.
3. Slot은 공통 레이아웃 안에 부모가 원하는 템플릿을 삽입하여 컴포넌트를 유연하게 조합합니다.
4. 컴포넌트별 책임을 분리하면 기능을 이해하고 재사용하며 수정하기 쉬워집니다.
5. Vue Router는 URL을 View와 연결하고 params, query, 동적 경로 및 404 처리를 제공합니다.
6. Pinia는 서로 멀리 떨어진 컴포넌트가 공유하는 상태와 변경 로직을 store에 모읍니다.
7. 원본 상태와 화면 표시용 `computed` 값을 분리하면 단위 변환 같은 UI 요구사항을 안전하게 적용할 수 있습니다.

