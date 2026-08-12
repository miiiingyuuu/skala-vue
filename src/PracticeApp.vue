<script setup>
import SampleOne from "./components/practices/basic/SampleOne.vue";
import SampleTwo from "./components/practices/basic/SampleTwo.vue";
import StyleScoped from "./components/practices/basic/StyleScoped.vue";
import VBindAdvanced from "./components/practices/basic/V-Bind-Advanced.vue";
import VBindDynamic from "./components/practices/basic/V-Bind-Dynamic.vue";
import VBindShort from "./components/practices/basic/V-Bind-Short.vue";
import VBind from "./components/practices/basic/V-Bind.vue";
import VCloak from "./components/practices/basic/V-Cloak.vue";
import VFor from "./components/practices/basic/V-For.vue";
import VHtmlDirective from "./components/practices/basic/V-Html-Directive.vue";
import VHtmlXSS from "./components/practices/basic/V-Html-XSS.vue";
import VIf from "./components/practices/basic/V-If.vue";
import VMemo from "./components/practices/basic/V-Memo.vue";
import VModelFormBasic from "./components/practices/basic/V-Model-FormBasic.vue";
import VModelFormModifier from "./components/practices/basic/V-Model-FormModifier.vue";
import VModelForm from "./components/practices/basic/V-Model-Form.vue";
import VOnEventBasic from "./components/practices/basic/V-On-EventBasic.vue";
import VOnEventModifier from "./components/practices/basic/V-On-EventModifier.vue";
import VOnEventObject from "./components/practices/basic/V-On-EventObject.vue";
import VOnce from "./components/practices/basic/V-Once.vue";
import VPre from "./components/practices/basic/V-Pre.vue";
import VShow from "./components/practices/basic/V-Show.vue";
import VText from "./components/practices/basic/V-Text.vue";
import Ref from "./components/practices/composition/Reactive-Ref.vue";
import Reactive from "./components/practices/composition/Reactive-Reactive.vue";
import ComputedBasic from "./components/practices/composition/ComputedBasic.vue";
import WatcherBasic from "./components/practices/composition/WatcherBasic.vue";
import WatcherMulti from "./components/practices/composition/WatcherMultiSource.vue";
import WatcherDeep from "./components/practices/composition/WatcherDeep.vue";
import WatcherReactive from "./components/practices/composition/WatcherReactive.vue";
import WatcherWatchEffect from "./components/practices/composition/Watcher-WatchEffect.vue";
import LifecycleHookExample from "./components/practices/component/LifecycleHookExampleParent.vue";
import PropsEmits from "./components/practices/component/PropsEmitsParent.vue";
import SlotDefault from "./components/practices/component/SlotDefaultParent.vue";
import SlotNamed from "./components/practices/component/SlotNamedParent.vue";
import SlotScoped from "./components/practices/component/SlotScopedParent.vue";
</script>

<template>
  <div class="practice-container">
    <h1>Basic</h1>
    <hr />

    <h1>1. Dev Setup</h1>
    <SampleOne />
    <SampleTwo />

    <h1>2. Vue Directive</h1>
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
    <VPre />
    <VCloak />
    <VOnce />
    <VMemo />

    <h1>3. Vue Event Handling</h1>
    <VOnEventBasic />
    <VOnEventObject />
    <VOnEventModifier />

    <h1>4. Vue Form Handling</h1>
    <VModelFormBasic />
    <VModelForm />
    <VModelFormModifier />

    <h1>5. Vue Style Handling</h1>
    <StyleScoped />

    <h1>Composition</h1>
    <hr />

    <h1>1. Reactive State</h1>
    <Ref />
    <Reactive />

    <h1>2. Computed & Watchers</h1>
    <ComputedBasic />
    <WatcherBasic />
    <WatcherMulti />
    <WatcherDeep />
    <WatcherReactive />
    <WatcherWatchEffect />

    <h1>Component</h1>
    <hr />

    <h1>1. Lifecycle Hooks</h1>
    <LifecycleHookExample />

    <h1>2. Props & Emits</h1>
    <PropsEmits />

    <h1>3. Slots</h1>
    <SlotDefault />
    <SlotNamed />
    <SlotScoped />
  </div>
</template>

<style src="./assets/practice.css"></style>
