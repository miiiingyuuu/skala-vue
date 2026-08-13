# Weather Message — SKALA Vue.js

Vue.js 기본 문법부터 Composition API, 컴포넌트 통신, Vue Router, Pinia, Axios, 외부 UI Library와 배포까지 단계별로 학습하며 완성한 날씨 애플리케이션입니다.

기존 과제 1~6과 최종 발표용 날씨 서비스를 한 프로젝트에 통합했으며, 화면 오른쪽 아래의 토글을 이용해 두 결과물을 전환할 수 있습니다.

## 배포 주소

<https://miiiingyuuu.github.io/skala-vue/>

## 주요 기능

- OpenWeather API 기반 현재 날씨와 5일 예보 조회
- 브라우저 위치 권한을 이용한 현재 지역 날씨 표시
- 도시 검색 및 URL query 검색 상태 복원
- 검색한 지역을 Pinia와 브라우저 저장소에 보관
- 저장된 지역을 슬라이드 형태로 전환·삭제
- 섭씨·화씨 단위 전환
- 지역별 상세 기상 정보와 잘못된 지역 처리
- 날씨 상태에 따른 동적 배경
- 외부 명언 API를 이용한 무작위 명언 표시
- 반응형 화면과 로딩·오류·빈 결과 Feedback
- 과제 1~6과 Final 화면 전환

## 기술 스택

| 분류 | 기술 |
| --- | --- |
| Core | Vue 3, JavaScript, Vite |
| 상태 관리 | Pinia |
| Routing | Vue Router |
| HTTP | Axios |
| UI | PrimeVue, Element Plus, PrimeIcons |
| API | OpenWeather API, Korean Advice API |
| 품질 관리 | ESLint, Oxlint, Prettier |
| 배포 | GitHub Pages, gh-pages |

## 실행 방법

### 요구 사항

- Node.js 22 권장
- npm
- OpenWeather API 키

### 설치 및 실행

```bash
git clone https://github.com/miiiingyuuu/skala-vue.git
cd skala-vue
npm install
```

프로젝트 루트에 `.env.local`을 만들고 다음 환경변수를 설정합니다.

```text
VITE_OPENWEATHER_API_KEY=발급받은_API_키
```

개발 서버를 실행합니다.

```bash
npm run dev
```

### 검사와 빌드

```bash
npm run lint
npm run build
npm run preview
```

GitHub Pages에 배포할 때는 다음 명령을 사용합니다.

```bash
npm run deploy
```

## 화면 구성

| 화면 | URL | 설명 |
| --- | --- | --- |
| 과제 1~6 | `/` | Vue 기본 문법부터 Router·Pinia·Axios까지 진행한 과제 |
| 최종본 | `/final` | OpenWeather와 외부 UI Library를 적용한 발표용 날씨 앱 |
| 서비스 소개 | `/final/about` | 최종 앱의 기능과 기술 소개 |
| 상세 날씨 | `/final/weather/:cityId` | 선택한 지역의 상세 기상 정보 |

## Day별 학습 내용

### Day 1 — Vue 기본 문법과 디렉티브

- Vue 프로젝트와 SFC 구조
- 보간법과 반응형 상태
- `v-html`, `v-text`, `v-bind`
- `v-if`, `v-show`, `v-for`, `key`

[Day 1 상세 기록](./docs/Day1.md)

### Day 2 — 이벤트, 폼과 Composition API

- `v-on`과 이벤트 수식어
- `v-model`과 폼 입력
- `ref`, `reactive`, `computed`
- `watch`, `watchEffect`
- 날씨 Mockup과 실시간 검색 필터

[Day 2 상세 기록](./docs/Day2.md)

### Day 3 — 컴포넌트, Router와 Pinia

- Lifecycle Hooks
- Props, Emits, Slot
- 컴포넌트 역할 분리
- Vue Router와 동적 경로
- Pinia 전역 상태와 날씨 단위 전환

[Day 3 상세 기록](./docs/Day3.md)

### Day 4 — Axios, UI Library와 배포

- Axios 비동기 통신과 CRUD
- API 응답 데이터 매핑
- loading, error, empty 상태 처리
- Element Plus와 PrimeVue
- 환경변수와 API 키 관리
- Vite 프로덕션 빌드와 GitHub Pages 배포

[Day 4 상세 기록](./docs/Day4.md)

## 프로젝트 구조

```text
skala-vue/
├── docs/
│   ├── Day1.md                   # Vue 기본 문법과 디렉티브
│   ├── Day2.md                   # 이벤트, 폼과 Composition API
│   ├── Day3.md                   # 컴포넌트, Router와 Pinia
│   ├── Day4.md                   # Axios, UI Library와 배포
│   └── ProjectGuide.md           # 통합 실행과 배포 구조
├── public/                       # 파비콘과 정적 이미지
├── src/
│   ├── components/
│   │   ├── practices/            # 문법별 실습 컴포넌트
│   │   ├── exercise/             # 과제용 컴포넌트
│   │   └── library/              # Axios·Element Plus 실습
│   ├── final/                    # 최종 발표용 날씨 앱
│   │   ├── components/
│   │   ├── composables/
│   │   ├── services/
│   │   ├── stores/
│   │   └── views/
│   ├── router/
│   ├── stores/
│   ├── views/
│   ├── App.vue
│   ├── ExerciseApp.vue
│   └── FinalApp.vue
├── package.json
└── vite.config.js
```

## 학습 스냅샷

각 날짜에 새로 배운 내용만 담은 최상위 컴포넌트 스냅샷입니다.

- [`App.vue.Day1`](./src/App.vue.Day1)
- [`App.vue.Day2`](./src/App.vue.Day2)
- [`App.vue.Day3`](./src/App.vue.Day3)
- [`App.vue.Day4`](./src/App.vue.Day4)

## 참고 사항

- `.env.local`과 실제 API 키는 Git 저장소에 포함하지 않습니다.
- Vite의 `VITE_` 환경변수는 최종 브라우저 번들에서 확인할 수 있으므로, 운영 환경에서는 API 제공자의 도메인 제한이나 백엔드 프록시를 고려해야 합니다.
- GitHub Pages의 프로젝트 경로에 맞춰 Vite와 Vue Router의 base를 `/skala-vue/`로 설정했습니다.
