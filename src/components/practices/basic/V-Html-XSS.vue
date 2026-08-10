<script setup>
    import { ref } from 'vue'

    const inputValue = ref('')
    const message = ref('')

    function showMessage() {
        message.value = inputValue.value
    }
</script>

<template>
    <div class="practice-section">
        <h2>2.2 V-HMTL-XSS 학습</h2>
        <input v-model="inputValue" placeholder="내용을 입력하세요" />
        <button @click="showMessage">메시지 표시</button>
        <p v-html="message"></p>
    </div>
</template>