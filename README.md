# SKALA Vue.js 실습

Vue 3와 Vite를 사용해 프론트엔드의 반응성과 주요 디렉티브를 학습하는 프로젝트입니다.

## 실행 방법

### 요구 사항

- Node.js `^20.19.0` 또는 `>=22.12.0`
- npm

### 설치 및 실행

```sh
npm install
npm run dev
```

그 밖의 명령어는 다음과 같습니다.

```sh
npm run build    # 배포용 빌드
npm run preview  # 빌드 결과 미리 보기
npm run lint     # 코드 검사 및 자동 수정
npm run format   # src 디렉터리 코드 포맷팅
```

## Day 1. Vue 기본 문법과 디렉티브

### 1. 개발 환경과 컴포넌트

- Vue 3의 Composition API와 `<script setup>` 문법을 사용했습니다.
- 화면을 기능별 `.vue` 파일로 분리하고 `App.vue`에서 import해 조립했습니다.
- Vue 애플리케이션은 `main.js`의 `createApp(App).mount('#app')`를 통해 시작됩니다.
- 프로젝트에는 상태 관리용 Pinia와 페이지 이동용 Vue Router가 등록되어 있습니다.

Vue의 SFC(Single-File Component)는 한 파일 안에서 로직, 화면, 스타일을 구분합니다.

```vue
<script setup>
// JavaScript 로직
</script>

<template>
  <!-- 화면 구조 -->
</template>

<style scoped>
/* 현재 컴포넌트에만 적용할 스타일 */
</style>
```

### 2. 템플릿 보간법과 반응성

`{{ }}` 보간법으로 변수뿐 아니라 문자열 메서드나 간단한 JavaScript 표현식도 화면에 출력했습니다.

```vue
<script setup>
const message = "Welcome to Skala-Vue";
</script>

<template>
  <p>{{ message }}</p>
  <p>{{ message.toUpperCase() }}</p>
</template>
```

일반 변수는 값이 바뀌어도 화면 갱신을 유발하지 않습니다. `ref()`로 만든 반응형 값은 변경 시 Vue가 이를 감지하여 DOM을 다시 렌더링합니다. `<script setup>`의 JavaScript에서는 `.value`로 접근하지만, 템플릿에서는 자동으로 언래핑되므로 `.value`를 생략합니다.

```vue
<script setup>
import { ref } from "vue";

let normalCount = 0;
const vueCount = ref(0);
</script>

<template>
  <button @click="normalCount++">일반 변수: {{ normalCount }}</button>
  <button @click="vueCount++">반응형 변수: {{ vueCount }}</button>
</template>
```

### 3. 이벤트와 양방향 바인딩

- `v-on:click`의 단축 문법인 `@click`으로 클릭 이벤트를 처리했습니다.
- `v-model`로 입력 요소의 값과 반응형 상태를 양방향으로 연결했습니다.
- 이벤트에서 상태를 변경하면 연결된 화면도 즉시 갱신됩니다.

```vue
<input v-model="score" type="number" />
<button @click="isLogged = !isLogged">로그인 상태 변경</button>
```

### 4. 주요 디렉티브

| 디렉티브                        | 학습 내용                            | 실습 예시                                    |
| ------------------------------- | ------------------------------------ | -------------------------------------------- |
| `v-html`                        | 문자열을 HTML로 해석하여 출력        | HTML 스타일 적용, 사용자 입력 출력           |
| `v-text`                        | 요소의 텍스트 콘텐츠 설정            | HTML 태그를 해석하지 않고 문자열 그대로 출력 |
| `v-bind` / `:`                  | HTML 속성을 데이터와 동적으로 연결   | 링크, 이미지, `disabled`, 클래스, 스타일     |
| `v-model`                       | 폼 입력값과 상태를 양방향 연결       | 메시지, 점수, 박스 너비 입력                 |
| `v-if` / `v-else-if` / `v-else` | 조건에 따라 요소를 생성하거나 제거   | 로그인 상태, 점수별 학점 표시                |
| `v-show`                        | 요소는 유지하고 CSS `display`만 변경 | 상자 표시 여부 토글                          |
| `v-for`                         | 배열이나 객체를 반복 렌더링          | 과일 목록, 사용자 정보, 상품 목록            |

#### `v-html`과 `v-text`

`v-html`은 문자열 안의 태그를 실제 HTML로 렌더링하지만, `v-text`와 보간법은 문자열을 일반 텍스트로 출력합니다.

외부 입력이나 사용자가 작성한 값을 검증 없이 `v-html`에 전달하면 악성 스크립트가 삽입되는 XSS 취약점이 생길 수 있습니다. 따라서 `v-html`에는 신뢰할 수 있거나 안전하게 정제된 데이터만 사용해야 합니다.

#### `v-bind` 클래스·스타일 바인딩

`v-bind`의 단축 문법 `:`을 사용해 속성을 동적으로 제어했습니다. 클래스와 스타일에는 객체 또는 배열 형식을 사용할 수 있습니다.

```vue
<p :class="{ 'text-danger': isWarning }">경고 상태</p>
<div :class="[themeClass, isWarning ? 'border-red' : 'border-gray']"></div>
<div :style="[baseBoxStyle, { width: boxWidth + 'px' }]"></div>
```

속성 이름과 변수 이름이 같다면 Vue 3.4 이상의 단축 문법도 사용할 수 있습니다.

```vue
<script setup>
const id = "user-profile-card";
const src = "https://vuejs.org/images/logo.png";
</script>

<template>
  <div :id>
    <img :src alt="Vue 로고" />
  </div>
</template>
```

#### `v-if`와 `v-show`의 차이

- `v-if`는 조건이 거짓이면 DOM에서 요소를 제거합니다. 조건 변경이 드문 경우에 적합합니다.
- `v-show`는 DOM 요소를 유지하고 `display: none`만 적용합니다. 자주 보였다 숨겨지는 UI에 적합합니다.

#### `v-for`와 `key`

배열은 `(item, index) in items`, 객체는 `(value, key, index) in object` 형태로 순회했습니다. 각 항목에는 Vue가 요소를 안정적으로 추적할 수 있도록 고유한 `:key`를 지정합니다. 데이터에 고유 ID가 있다면 배열 인덱스보다 ID를 사용하는 것이 좋습니다.

```vue
<li v-for="(item, index) in items" :key="item.id">
  [{{ index }}] {{ item.name }}
</li>
```

### 5. Day 1 실습 파일

```text
src/
├── App.vue
└── components/practices/basic/
    ├── SampleOne.vue
    ├── SampleTwo.vue
    ├── V-Html-Directive.vue
    ├── V-Html-XSS.vue
    ├── V-Text.vue
    ├── V-Bind.vue
    ├── V-Bind-Advanced.vue
    ├── V-Bind-Dynamic.vue
    ├── V-Bind-Short.vue
    ├── V-If.vue
    ├── V-Show.vue
    └── V-For.vue
```

### Day 1 핵심 정리

1. Vue 화면은 작은 컴포넌트로 나누고 조합할 수 있습니다.
2. `ref()`는 값의 변경을 화면에 반영하는 반응성을 제공합니다.
3. 보간법과 디렉티브를 사용하면 DOM을 직접 조작하지 않고 데이터를 화면에 표현할 수 있습니다.
4. `v-bind`, `v-model`, 이벤트 처리로 상태와 UI를 연결할 수 있습니다.
5. 조건부·반복 렌더링에서는 상황에 맞는 디렉티브와 안정적인 `key`를 선택해야 합니다.
6. `v-html` 사용 시에는 XSS 보안을 반드시 고려해야 합니다.

## Day 2. 이벤트, 폼 바인딩과 Composition API

Day 2에서는 Vue의 추가 디렉티브와 이벤트·폼 처리 방법을 익히고, 날씨 목업을 만들며 `computed`, `watch`, `watchEffect`의 역할을 비교했습니다.

### 1. 실행 화면 전환

실습 화면과 과제 화면을 분리했습니다. `App.vue`의 `MODE` 값을 변경하면 원하는 화면을 확인할 수 있습니다.

```js
const MODE = "exercise";
```

- `"practice"`: 기본 문법 실습
- `"exercise"`: 날씨 과제

```text
src/
├── App.vue
├── PracticeApp.vue
├── ExerciseApp.vue
├── assets/
│   ├── practice.css
│   └── exercise.css
└── components/
    ├── practices/basic/
    └── exercise/
        ├── WeatherMockup.vue
        └── WeatherComposition.vue
```

### 2. 추가 디렉티브

| 디렉티브  | 역할                                 | 실습 내용                                   |
| --------- | ------------------------------------ | ------------------------------------------- |
| `v-pre`   | Vue 컴파일을 건너뜀                  | `{{ message }}`를 보간하지 않고 그대로 출력 |
| `v-cloak` | Vue가 마운트되기 전 템플릿 노출 방지 | `[v-cloak] { display: none; }`과 함께 사용  |
| `v-once`  | 최초 한 번만 렌더링                  | 이후 반응형 상태가 바뀌어도 표시값 유지     |
| `v-memo`  | 의존성 배열이 바뀔 때만 영역 갱신    | 특정 상태를 기준으로 렌더링 최적화          |

#### `v-pre`

```vue
<p>일반 출력: {{ message }}</p>
<p v-pre>v-pre 출력: {{ message }}</p>
```

`v-pre`가 붙은 요소와 자식 요소는 Vue 템플릿으로 컴파일되지 않습니다. Vue 문법 자체를 예시로 보여줄 때 활용할 수 있습니다.

#### `v-cloak`

```vue
<div v-cloak>{{ message }}</div>

<style scoped>
[v-cloak] {
  display: none !important;
}
</style>
```

Vue가 마운트되면 `v-cloak` 속성이 제거됩니다. CSS와 함께 사용하면 초기 로딩 과정에서 보간식이 잠깐 노출되는 현상을 막을 수 있습니다.

#### `v-once`와 `v-memo`

- `v-once`는 최초 렌더링 결과를 고정하므로 다시 갱신할 필요가 없는 콘텐츠에 사용합니다.
- `v-memo="[name]"`은 `name`이 바뀔 때만 해당 영역을 다시 렌더링합니다.
- 두 기능 모두 렌더링 최적화가 실제로 필요한 경우에 선택적으로 사용해야 합니다.

### 3. `v-on` 이벤트 처리

`v-on`의 단축 문법 `@`를 사용해 사용자 행동과 함수를 연결했습니다.

```vue
<button @click="count++">인라인 연산</button>
<button @click="showAlert">함수 호출</button>
<button @click="getWithParam('회원A', $event)">인자와 이벤트 전달</button>
```

#### 이벤트 객체

이벤트 핸들러의 첫 번째 인자로 이벤트 객체를 자동 전달받거나, `$event`를 사용해 다른 인자와 함께 전달할 수 있습니다.

```js
const getOnlyEvent = (event) => {
  position.value = `X=${event.clientX}, Y=${event.clientY}`;
};

const getWithParam = (name, event) => {
  tagName.value = `${name}: ${event.target.tagName}`;
};
```

#### 이벤트 수식어

| 수식어     | 역할                    | 사용 예시                                     |
| ---------- | ----------------------- | --------------------------------------------- |
| `.prevent` | 브라우저 기본 동작 방지 | 링크 이동, 폼 제출 방지                       |
| `.stop`    | 이벤트 버블링 차단      | 자식 버튼 클릭이 부모 카드로 전달되는 것 방지 |

```vue
<a href="https://www.naver.com" @click.prevent="handleLink">링크</a>
<button @click.stop="showDetail">상세보기</button>
```

### 4. `v-model`과 폼 처리

`v-model`은 데이터에서 입력 요소로 값을 전달하고, 입력 이벤트의 값을 다시 데이터에 저장하는 양방향 바인딩 문법입니다.

```vue
<!-- v-model 사용 -->
<input v-model="searchQuery" />

<!-- 내부 동작을 직접 표현 -->
<input
  :value="searchQuery"
  @input="(event) => (searchQuery = event.target.value)"
/>
```

한글 입력 과정을 즉시 확인하는 날씨 과제에서는 `:value`와 `@input`을 직접 나누어 사용했습니다.

#### 폼 요소별 데이터 형태

| 폼 요소             | 연결되는 데이터    |
| ------------------- | ------------------ |
| `input`, `textarea` | 문자열             |
| 단일 checkbox       | Boolean            |
| 다중 checkbox       | 선택값 배열        |
| radio               | 선택된 하나의 값   |
| select              | 선택된 option의 값 |

#### `v-model` 수식어

| 수식어    | 동작                                 |
| --------- | ------------------------------------ |
| `.lazy`   | `input` 대신 `change` 시점에 값 반영 |
| `.number` | 입력값을 가능한 경우 Number로 변환   |
| `.trim`   | 문자열 앞뒤 공백 제거                |

수식어는 `v-model.trim.number`처럼 연결해서 사용할 수도 있습니다.

### 5. 컴포넌트 스타일

`<style scoped>`를 사용하면 Vue가 고유 속성을 추가해 스타일의 적용 범위를 현재 컴포넌트 내부로 제한합니다.

```vue
<style scoped>
.title {
  color: #ff7675;
}
</style>
```

여러 컴포넌트가 함께 사용하는 디자인은 외부 CSS 파일로 분리했습니다.

```vue
<style src="./assets/practice.css"></style>
```

### 6. 과제 1 — Weather Mockup

`WeatherMockup.vue`에서는 Day 1과 Day 2의 기본 문법만 사용해 날씨 목업을 구현했습니다.

- `ref()`로 날씨 배열, 검색어, 상태바 문구 관리
- `v-for`와 고유한 `:key`로 도시 카드 반복 출력
- `v-if / v-else`로 25도 이상과 미만의 배지 구분
- `:value + @input`으로 검색어 입력 및 출력
- 카드 클릭 시 선택한 도시를 상태바에 표시
- 상세보기 버튼의 `@click.stop`으로 이벤트 버블링 차단
- `window.alert()`를 `<script setup>` 함수 안에서 호출

```vue
<article
  v-for="item in weatherList"
  :key="item.id"
  @click="selectedCityInfo = `${item.name}이(가) 선택되었습니다.`"
>
  <span v-if="item.temp >= 25" class="badge hot">🔥 더움</span>
  <span v-else class="badge cool">❄️ 선선함</span>
  <button @click.stop="showDetail(item.name, item.status)">상세보기</button>
</article>
```

### 7. 과제 2 — Composition API 날씨 검색

`WeatherComposition.vue`는 첫 번째 과제의 기능을 유지하면서 `computed`, `watch`, `watchEffect`를 추가했습니다.

#### `computed` — 파생 데이터 계산

`computed`는 기존 반응형 상태로부터 새로운 값을 계산합니다. 의존하는 값이 바뀔 때만 다시 계산되고 결과가 캐시됩니다.

```js
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim();

  if (!query) return weatherList.value;

  return weatherList.value.filter((item) => item.name.includes(query));
});
```

- 검색어가 없으면 원본 목록을 반환합니다.
- `trim()`으로 검색어 앞뒤 공백을 제거합니다.
- `filter()`는 조건에 맞는 도시로 새 배열을 만듭니다.
- `includes()`는 도시명에 검색어가 포함되는지 검사합니다.
- 화면의 `v-for`는 원본 대신 `filteredWeatherList`를 사용합니다.

#### `watch` — 지정한 상태의 변경 감시

`watch`는 감시할 반응형 대상을 직접 지정하고, 값이 변경된 후 콜백을 실행합니다.

```js
watch(selectedCityInfo, (newInfo, oldInfo) => {
  console.log(`${oldInfo} → ${newInfo}`);
});
```

이번 과제에서는 카드 선택으로 `selectedCityInfo`가 변경될 때 이전 문구와 새로운 문구를 콘솔에 기록합니다. `ref` 자체를 감시 대상으로 전달하며 `selectedCityInfo.value`를 전달하지 않는 점에 주의해야 합니다.

#### `watchEffect` — 사용한 의존성 자동 추적

`watchEffect`는 콜백 안에서 읽은 반응형 상태를 Vue가 자동으로 추적합니다.

```js
watchEffect(() => {
  console.log(`현재 검색어: ${searchQuery.value}`);
});
```

- 컴포넌트가 생성될 때 즉시 한 번 실행됩니다.
- 콜백에서 읽은 `searchQuery.value`가 바뀔 때마다 다시 실행됩니다.
- `watch`와 달리 감시 대상을 별도 인자로 지정하지 않습니다.

#### `computed`, `watch`, `watchEffect` 비교

| API           | 목적                                | 반환값           | 실행 시점                      | 이번 과제        |
| ------------- | ----------------------------------- | ---------------- | ------------------------------ | ---------------- |
| `computed`    | 파생 상태 계산                      | 계산된 반응형 값 | 의존성이 바뀌고 값이 필요할 때 | 검색된 도시 목록 |
| `watch`       | 특정 상태 변경 후 부수 효과 실행    | 없음             | 지정한 값이 변경된 후          | 선택 문구 로그   |
| `watchEffect` | 의존성을 자동 추적해 부수 효과 실행 | 없음             | 즉시 실행 후 의존성 변경 시    | 검색어 로그      |

화면에 사용할 값을 만들 때는 `computed`, 로그·API 호출처럼 화면 밖의 부수 효과를 처리할 때는 `watch` 또는 `watchEffect`를 사용합니다.

검색 결과가 없으면 조건부 렌더링으로 안내 문구를 표시합니다.

```vue
<p v-if="filteredWeatherList.length === 0">
  검색 결과와 일치하는 도시가 없습니다.
</p>
```

### 8. Day 2 실습 파일

```text
src/
├── App.vue
├── PracticeApp.vue
├── ExerciseApp.vue
├── assets/
│   ├── practice.css
│   └── exercise.css
└── components/
    ├── practices/basic/
    │   ├── V-Pre.vue
    │   ├── V-Cloak.vue
    │   ├── V-Once.vue
    │   ├── V-Memo.vue
    │   ├── V-On-EventBasic.vue
    │   ├── V-On-EventObject.vue
    │   ├── V-On-EventModifier.vue
    │   ├── V-Model-FormBasic.vue
    │   ├── V-Model-Form.vue
    │   ├── V-Model-FormModifier.vue
    │   └── StyleScoped.vue
    └── exercise/
        ├── WeatherMockup.vue
        └── WeatherComposition.vue
```

### Day 2 핵심 정리

1. `v-on`과 `$event`로 사용자 이벤트와 이벤트 객체를 처리할 수 있습니다.
2. `.prevent`, `.stop` 같은 수식어로 이벤트의 기본 동작과 전파를 제어할 수 있습니다.
3. `v-model`은 폼 요소와 데이터 사이의 양방향 바인딩을 간결하게 표현합니다.
4. `:value + @input`으로 `v-model`의 내부 동작을 직접 구현할 수 있습니다.
5. `computed`는 반응형 상태에서 파생된 값을 선언적으로 계산합니다.
6. `watch`는 특정 상태의 변경을, `watchEffect`는 콜백에서 사용한 상태를 자동 감시합니다.
7. 값 계산과 부수 효과를 구분하면 컴포넌트의 데이터 흐름을 더 쉽게 이해하고 관리할 수 있습니다.

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

## 통합 실행 구조

현재 프로젝트는 기존 과제 1~6과 최종 발표용 날씨 앱을 하나의 Vue 앱에서 실행합니다. 화면 상단의 토글로 두 모드를 전환할 수 있습니다.

| 모드 | URL | 내용 |
| --- | --- | --- |
| 과제 1–6 | `/` | 기존 `ExerciseApp.vue`의 과제 컴포넌트와 Router 실습 |
| 최종본 | `/final` | OpenWeather, Pinia, PrimeVue를 적용한 최종 날씨 앱 |

Final의 하위 경로도 기존 과제 Router와 충돌하지 않도록 분리했습니다.

```text
/final
/final/about
/final/weather/:cityId
/final/:pathMatch(.*)*
```

```text
src/
├── App.vue                 # 과제 ↔ Final 전환
├── ExerciseApp.vue         # 과제 1~6
├── FinalApp.vue            # Final 전용 RouterView
├── router/index.js         # 과제 및 Final 경로 통합
└── final/
    ├── assets/
    ├── components/
    ├── composables/
    ├── data/
    ├── services/
    ├── stores/
    └── views/
```

Final 화면은 Element Plus 기반 과제 화면과 스타일이 충돌하지 않도록 `.final-mode` 범위 안에서 동작합니다. OpenWeather API 키는 프로젝트 루트의 `.env.local`에 `VITE_OPENWEATHER_API_KEY`로 설정합니다.

## 빌드 및 배포

명령은 반드시 `skala-vue` 프로젝트 폴더에서 실행합니다.

```bash
cd /Users/pmingyu/Desktop/frontend/skala-vue
npm install
npm run build
npm run preview
```

Node.js는 `.nvmrc`에 맞춰 Node 22 사용을 권장합니다. Vite 8의 최소 조건 때문에 Node 20을 사용한다면 반드시 20.19 이상이어야 합니다.

```bash
nvm use
```

로컬에서는 `.env.example`을 참고해 `.env.local`을 만들고 API 키를 입력합니다. Vercel이나 Netlify에서는 저장소에 환경변수 파일을 올리지 않고 배포 설정에 같은 이름으로 등록합니다.

```text
VITE_OPENWEATHER_API_KEY=발급받은_API_키
```

Vue Router의 `/final/about`, `/final/weather/...` 같은 주소에서 새로고침해도 404가 발생하지 않도록 Vercel용 `vercel.json`과 Netlify용 `public/_redirects`도 포함되어 있습니다.
