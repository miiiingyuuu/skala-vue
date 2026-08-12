<script setup>
// 1. 상위로 입력 텍스트를 전달할 커스텀 이벤트 등록 (매크로)
defineEmits(["update-query"]);

// 2. 상위로부터 현재 검색 상태 값을 수신 (한글 동기화 상태 유지용)
defineProps({
  currentQuery: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <div class="search-inner">
    <label for="component-city-search">🔍 도시 검색</label>
    <input
      id="component-city-search"
      type="text"
      :value="currentQuery"
      placeholder="검색할 도시 이름 입력"
      autocomplete="off"
      @input="$emit('update-query', $event.target.value)"
    />
    <p>
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-inner label {
  display: block;
  margin-bottom: 14px;
  color: #334155;
  font-size: 0.98rem;
  font-weight: 750;
}

.search-inner input {
  width: 100%;
  min-height: 46px;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 11px;
  background: #fff;
  color: #172033;
  outline: none;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.search-inner input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 4px rgb(37 99 235 / 10%);
}

.search-inner p {
  min-height: 24px;
  margin: 10px 0 0;
  color: #64748b;
  font-size: 0.88rem;
}

.search-inner strong {
  color: #2563eb;
  font-weight: 800;
}
</style>
