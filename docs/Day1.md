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

