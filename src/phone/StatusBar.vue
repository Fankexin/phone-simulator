<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

defineProps({
  dark: { type: Boolean, default: false },
})

const time = ref('')
let timer = 0

function format(date) {
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

function tick() {
  const date = new Date()
  time.value = format(date)
  timer = window.setTimeout(tick, 60000 - (date.getSeconds() * 1000 + date.getMilliseconds()))
}

onMounted(tick)
onUnmounted(() => window.clearTimeout(timer))
</script>

<template>
  <div class="status" :class="{ dark }">
    <span class="time">{{ time }}</span>
    <span class="sys" aria-hidden="true">
      <svg class="cell" viewBox="0 0 18 12">
        <rect x="0" y="7" width="3" height="5" rx="0.6" />
        <rect x="5" y="5" width="3" height="7" rx="0.6" />
        <rect x="10" y="2.5" width="3" height="9.5" rx="0.6" />
        <rect x="15" y="0" width="3" height="12" rx="0.6" />
      </svg>
      <svg class="wifi" viewBox="0 0 16 13">
        <path d="M8 9.7a1.15 1.15 0 1 0 .01 0Z" />
        <path d="M4.1 7.2a5.5 5.5 0 0 1 7.8 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <path d="M1.4 4.6a9.2 9.2 0 0 1 13.2 0" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <span class="bat"><i /></span>
    </span>
  </div>
</template>

<style scoped>
.status {
  position: absolute;
  z-index: 7;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 54px;
  padding: 14px 22px 0 26px;
  color: #000;
  pointer-events: none;
}

.status.dark {
  color: #fff;
}

.time {
  font-size: 16px;
  font-weight: 650;
  letter-spacing: -0.3px;
  line-height: 20px;
}

.sys {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 20px;
}

.cell,
.wifi {
  display: block;
  fill: currentColor;
}

.cell { width: 17px; height: 12px; }
.wifi { width: 16px; height: 12px; }

.bat {
  position: relative;
  width: 25px;
  height: 12px;
  border: 1.4px solid currentColor;
  border-radius: 3.5px;
  opacity: 0.95;
}

.bat i {
  position: absolute;
  left: 1px;
  top: 1px;
  bottom: 1px;
  width: 16px;
  border-radius: 1.5px;
  background: currentColor;
}

.bat::after {
  content: '';
  position: absolute;
  right: -3px;
  top: 3px;
  width: 1.6px;
  height: 4px;
  border-radius: 0 1px 1px 0;
  background: currentColor;
  opacity: 0.7;
}
</style>
