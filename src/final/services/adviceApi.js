import axios from "axios";

const adviceClient = axios.create({
  baseURL: "https://korean-advice-open-api.vercel.app/api",
  timeout: 7000,
});

const FALLBACK_ADVICES = [
  { author: "세네카", authorProfile: "철학자", message: "행운은 준비가 기회를 만날 때 생긴다." },
  { author: "공자", authorProfile: "사상가", message: "멈추지 않는 한 얼마나 천천히 가는지는 중요하지 않다." },
  { author: "헬렌 켈러", authorProfile: "작가", message: "세상은 고난으로 가득하지만 그것을 극복하는 일로도 가득하다." },
  { author: "마야 안젤루", authorProfile: "시인", message: "사람들은 당신이 건넨 감정을 오래 기억한다." },
  { author: "랄프 왈도 에머슨", authorProfile: "사상가", message: "길이 이끄는 곳이 아니라 길이 없는 곳으로 가라." },
  { author: "아리스토텔레스", authorProfile: "철학자", message: "우리가 반복해서 하는 일이 곧 우리 자신이다." },
];

export async function fetchRandomAdvice() {
  try {
    const { data } = await adviceClient.get("/advice", {
      params: { refresh: `${Date.now()}-${Math.random()}` },
    });
    return {
      author: data.author,
      authorProfile: data.authorProfile,
      message: data.message,
    };
  } catch (error) {
    console.warn("명언 API를 불러오지 못해 기본 명언을 사용합니다.", error);
    return FALLBACK_ADVICES[Math.floor(Math.random() * FALLBACK_ADVICES.length)];
  }
}
