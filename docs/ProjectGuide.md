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
