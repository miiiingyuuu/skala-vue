<script setup>
import { onMounted, ref } from "vue";
import Button from "primevue/button";
import Card from "primevue/card";
import { fetchRandomAdvice } from "@/final/services/adviceApi";

const advice = ref(null);
const isLoading = ref(false);

async function refreshAdvice() {
  isLoading.value = true;
  advice.value = await fetchRandomAdvice();
  isLoading.value = false;
}

onMounted(refreshAdvice);
</script>

<template>
  <section class="advice-section" aria-labelledby="advice-title">
    <header class="advice-header">
      <div>
        <span>오늘의 문장</span>
        <h2 id="advice-title">날씨와 함께 읽는 명언</h2>
      </div>
      <Button
        label=""
        icon="pi pi-refresh"
        severity="secondary"
        text
        rounded
        :loading="isLoading"
        @click="refreshAdvice"
      />
    </header>

    <div class="advice-grid" :aria-busy="isLoading">
      <Card v-if="advice" class="glass-card advice-card">
        <template #content>
          <i class="pi pi-quote-left"></i>
          <blockquote>{{ advice.message }}</blockquote>
          <footer>
            <strong>{{ advice.author }}</strong>
            <span>{{ advice.authorProfile }}</span>
          </footer>
        </template>
      </Card>
    </div>
  </section>
</template>
