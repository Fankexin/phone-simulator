<script setup>
import { usePhone } from './usePhone.js'

defineProps({
  title: { type: String, default: '' },
  back: { type: String, default: '' },
  tone: { type: String, default: 'plain' },
  showBack: { type: Boolean, default: true },
})

const { pop } = usePhone()
</script>

<template>
  <header class="bar" :data-tone="tone">
    <button v-if="showBack" type="button" @click="pop">
      <svg viewBox="0 0 12 20" aria-hidden="true">
        <path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span v-if="back">{{ back }}</span>
    </button>
    <span v-else />
    <h1>{{ title }}</h1>
    <span />
  </header>
</template>

<style scoped>
.bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: end;
  gap: 8px;
  min-height: 44px;
  padding: var(--safe-top) 12px 8px;
  background: rgba(242, 242, 247, 0.92);
  color: #000;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.18);
  backdrop-filter: blur(18px) saturate(1.4);
}

.bar[data-tone='plain'] {
  background: #ededed;
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.bar[data-tone='dark'] {
  background: transparent;
  color: #fff;
  border-bottom-color: transparent;
  backdrop-filter: none;
}

.bar[data-tone='ios'] button {
  color: #007aff;
}

button {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  margin-left: 2px;
  font-size: 17px;
  font-weight: 400;
}

svg {
  width: 12px;
  height: 20px;
  display: block;
}

h1 {
  margin: 0 0 4px;
  max-width: 190px;
  overflow: hidden;
  font-size: 17px;
  font-weight: 620;
  letter-spacing: -0.3px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

span:last-child {
  justify-self: end;
}
</style>
