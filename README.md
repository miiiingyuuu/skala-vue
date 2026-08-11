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
const message = 'Welcome to Skala-Vue'
</script>

<template>
  <p>{{ message }}</p>
  <p>{{ message.toUpperCase() }}</p>
</template>
```

일반 변수는 값이 바뀌어도 화면 갱신을 유발하지 않습니다. `ref()`로 만든 반응형 값은 변경 시 Vue가 이를 감지하여 DOM을 다시 렌더링합니다. `<script setup>`의 JavaScript에서는 `.value`로 접근하지만, 템플릿에서는 자동으로 언래핑되므로 `.value`를 생략합니다.

```vue
<script setup>
import { ref } from 'vue'

let normalCount = 0
const vueCount = ref(0)
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

| 디렉티브 | 학습 내용 | 실습 예시 |
| --- | --- | --- |
| `v-html` | 문자열을 HTML로 해석하여 출력 | HTML 스타일 적용, 사용자 입력 출력 |
| `v-text` | 요소의 텍스트 콘텐츠 설정 | HTML 태그를 해석하지 않고 문자열 그대로 출력 |
| `v-bind` / `:` | HTML 속성을 데이터와 동적으로 연결 | 링크, 이미지, `disabled`, 클래스, 스타일 |
| `v-model` | 폼 입력값과 상태를 양방향 연결 | 메시지, 점수, 박스 너비 입력 |
| `v-if` / `v-else-if` / `v-else` | 조건에 따라 요소를 생성하거나 제거 | 로그인 상태, 점수별 학점 표시 |
| `v-show` | 요소는 유지하고 CSS `display`만 변경 | 상자 표시 여부 토글 |
| `v-for` | 배열이나 객체를 반복 렌더링 | 과일 목록, 사용자 정보, 상품 목록 |

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
const id = 'user-profile-card'
const src = 'https://vuejs.org/images/logo.png'
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

| 디렉티브 | 역할 | 실습 내용 |
| --- | --- | --- |
| `v-pre` | Vue 컴파일을 건너뜀 | `{{ message }}`를 보간하지 않고 그대로 출력 |
| `v-cloak` | Vue가 마운트되기 전 템플릿 노출 방지 | `[v-cloak] { display: none; }`과 함께 사용 |
| `v-once` | 최초 한 번만 렌더링 | 이후 반응형 상태가 바뀌어도 표시값 유지 |
| `v-memo` | 의존성 배열이 바뀔 때만 영역 갱신 | 특정 상태를 기준으로 렌더링 최적화 |

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

| 수식어 | 역할 | 사용 예시 |
| --- | --- | --- |
| `.prevent` | 브라우저 기본 동작 방지 | 링크 이동, 폼 제출 방지 |
| `.stop` | 이벤트 버블링 차단 | 자식 버튼 클릭이 부모 카드로 전달되는 것 방지 |

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

| 폼 요소 | 연결되는 데이터 |
| --- | --- |
| `input`, `textarea` | 문자열 |
| 단일 checkbox | Boolean |
| 다중 checkbox | 선택값 배열 |
| radio | 선택된 하나의 값 |
| select | 선택된 option의 값 |

#### `v-model` 수식어

| 수식어 | 동작 |
| --- | --- |
| `.lazy` | `input` 대신 `change` 시점에 값 반영 |
| `.number` | 입력값을 가능한 경우 Number로 변환 |
| `.trim` | 문자열 앞뒤 공백 제거 |

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

| API | 목적 | 반환값 | 실행 시점 | 이번 과제 |
| --- | --- | --- | --- | --- |
| `computed` | 파생 상태 계산 | 계산된 반응형 값 | 의존성이 바뀌고 값이 필요할 때 | 검색된 도시 목록 |
| `watch` | 특정 상태 변경 후 부수 효과 실행 | 없음 | 지정한 값이 변경된 후 | 선택 문구 로그 |
| `watchEffect` | 의존성을 자동 추적해 부수 효과 실행 | 없음 | 즉시 실행 후 의존성 변경 시 | 검색어 로그 |

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
