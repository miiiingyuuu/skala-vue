<script setup>
  import SampleOne from './components/practices/basic/SampleOne.vue'
  import SampleTwo from './components/practices/basic/SampleTwo.vue'
  import VHtmlDirective from './components/practices/basic/V-Html-Directive.vue'
  import VHtmlXSS from './components/practices/basic/V-Html-XSS.vue'
  import VText from './components/practices/basic/V-Text.vue'
  import VBind from './components/practices/basic/V-Bind.vue'
  import VBindAdvanced from './components/practices/basic/V-Bind-Advanced.vue'
  import VBindDynamic from './components/practices/basic/V-Bind-Dynamic.vue'
  import VBindShort from './components/practices/basic/V-Bind-Short.vue'
  import VIf from './components/practices/basic/V-If.vue'
  import VShow from './components/practices/basic/V-Show.vue'
  import VFor from './components/practices/basic/V-For.vue'
</script>

<template>
  <main class="container page">
    <h1 class="page-title">Vue.js Practice</h1>
    <h2>1. Dev Setup</h2>
    <SampleOne />
    <SampleTwo />
    <h2>2. Vue Directive</h2>
    <VHtmlDirective />
    <VHtmlXSS />
    <VText />
    <VBind />
    <VBindAdvanced />
    <VBindDynamic />
    <VBindShort />
    <VIf />
    <VShow />
    <VFor />
  </main>
</template>

<style>

</style>