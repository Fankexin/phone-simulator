<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { usePhone } from './usePhone.js'
import photos from '../images/photos.svg'
import notes from '../images/notes.svg'
import weather from '../images/weather.svg'
import sms from '../images/sms.svg'
import calls from '../images/calls.svg'
import wechat from '../images/wechat.svg'
import clockFace from '../images/clock.svg'

const props = defineProps({
  name: { type: String, required: true },
})

const files = { photos, notes, weather, sms, calls, wechat }
const file = computed(() => files[props.name] || '')
const weekNames = ['日', '一', '二', '三', '四', '五', '六']
const calendarIcon = computed(() => {
  const calendar = usePhone().story.calendar
  const month = Number(String(calendar?.label || '').match(/\d+/)?.[0])
  const today = Number(calendar?.today)
  const date = new Date(calendar?.year, month - 1, today)
  if (!month || !today || Number.isNaN(date.getTime())) return { weekday: '', day: '' }
  return { weekday: `周${weekNames[date.getDay()]}`, day: String(today) }
})
const now = ref(Date.now())
let frame = 0

const hands = computed(() => {
  const date = new Date(now.value)
  const seconds = date.getSeconds() + date.getMilliseconds() / 1000
  const minutes = date.getMinutes() + seconds / 60
  const hours = (date.getHours() % 12) + minutes / 60
  return {
    hour: hours * 30,
    minute: minutes * 6,
    second: seconds * 6,
  }
})

function tick() {
  now.value = Date.now()
  frame = requestAnimationFrame(tick)
}

function start() {
  cancelAnimationFrame(frame)
  if (props.name !== 'clock' || document.hidden) return
  frame = requestAnimationFrame(tick)
}

function onVisibility() {
  if (document.hidden) cancelAnimationFrame(frame)
  else start()
}

onMounted(() => {
  if (props.name !== 'clock') return
  document.addEventListener('visibilitychange', onVisibility)
  start()
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <template v-if="name === 'clock'">
    <img class="clock-face" :src="clockFace" alt="" />
    <svg class="clock-hands" viewBox="0 0 60 60" aria-hidden="true">
      <g :transform="`rotate(${hands.hour} 29.83 29.83)`">
        <rect x="28.23" y="15.7" width="3.2" height="16.2" rx="1.6" fill="#1c1c1e" />
      </g>
      <g :transform="`rotate(${hands.minute} 29.83 29.83)`">
        <rect x="28.55" y="7.6" width="2.55" height="24.2" rx="1.28" fill="#1c1c1e" />
      </g>
      <g :transform="`rotate(${hands.second} 29.83 29.83)`">
        <rect x="29.35" y="6.4" width="0.96" height="28.4" rx="0.48" fill="#ff942c" />
      </g>
      <circle cx="29.83" cy="29.83" r="2.05" fill="#ff942c" />
      <circle cx="29.83" cy="29.83" r="0.85" fill="#d5d1cd" />
    </svg>
  </template>
  <img v-else-if="file" :src="file" alt="" />
  <svg v-else-if="name === 'calendar'" viewBox="0 0 60 60" aria-hidden="true">
    <rect width="60" height="60" rx="13" fill="#fff" />
    <text x="30" y="17" text-anchor="middle" font-size="13" font-weight="650" letter-spacing="0.4" fill="#ff3b30" font-family="-apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif">{{ calendarIcon.weekday }}</text>
    <text x="30" y="49" text-anchor="middle" font-size="32" font-weight="400" fill="#000" font-family="-apple-system, 'SF Pro Display', 'PingFang SC', 'Microsoft YaHei', sans-serif">{{ calendarIcon.day }}</text>
  </svg>
  <svg v-else viewBox="0 0 48 48" aria-hidden="true" />
</template>

<style scoped>
img,
svg {
  width: 34px;
  height: 34px;
  display: block;
}

.clock-face,
.clock-hands {
  grid-area: 1 / 1;
}

img {
  object-fit: cover;
}
</style>
