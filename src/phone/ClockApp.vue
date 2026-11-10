<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { usePhone } from './usePhone.js'

const phone = usePhone()
const tab = ref('alarm')
const alarms = reactive(
  (phone.story.clock?.alarms || []).map((item) => ({
    ...item,
    days: item.days || '每天',
  })),
)

const cities = [
  { id: 'bj', name: '北京', offset: 0 },
  { id: 'tyo', name: '东京', offset: 1 },
  { id: 'lon', name: '伦敦', offset: -8 },
  { id: 'ny', name: '纽约', offset: -13 },
]

const now = ref(Date.now())
let clockTimer = 0

function tickClock() {
  now.value = Date.now()
  clockTimer = window.setTimeout(tickClock, 1000 - (Date.now() % 1000))
}

onMounted(tickClock)
onUnmounted(() => window.clearTimeout(clockTimer))

function cityTime(offset) {
  const date = new Date(now.value + offset * 3600000)
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

function cityDay(offset) {
  const here = new Date(now.value)
  const there = new Date(now.value + offset * 3600000)
  const diff = Math.round((Date.UTC(there.getFullYear(), there.getMonth(), there.getDate()) - Date.UTC(here.getFullYear(), here.getMonth(), here.getDate())) / 86400000)
  if (diff === 0) return '今天'
  if (diff === 1) return '明天'
  if (diff === -1) return '昨天'
  return diff > 0 ? `+${diff}天` : `${diff}天`
}

const stopwatch = reactive({ running: false, elapsed: 0, started: 0 })
let stopframe = 0

function formatStop(ms) {
  const total = Math.max(0, Math.floor(ms))
  const minutes = Math.floor(total / 60000)
  const seconds = Math.floor((total % 60000) / 1000)
  const centi = Math.floor((total % 1000) / 10)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centi).padStart(2, '0')}`
}

const stopDisplay = computed(() => {
  const value = stopwatch.running ? Date.now() - stopwatch.started + stopwatch.elapsed : stopwatch.elapsed
  return formatStop(value)
})

function loopStop() {
  if (!stopwatch.running) return
  now.value = Date.now()
  stopframe = requestAnimationFrame(loopStop)
}

function toggleStop() {
  if (stopwatch.running) {
    stopwatch.elapsed += Date.now() - stopwatch.started
    stopwatch.running = false
    cancelAnimationFrame(stopframe)
    return
  }
  stopwatch.started = Date.now()
  stopwatch.running = true
  stopframe = requestAnimationFrame(loopStop)
}

function resetStop() {
  stopwatch.running = false
  stopwatch.elapsed = 0
  stopwatch.started = 0
  cancelAnimationFrame(stopframe)
}

const timerMinutes = ref(5)
const timerLeft = ref(5 * 60)
const timerRunning = ref(false)
let timerId = 0

const timerDisplay = computed(() => {
  const minutes = Math.floor(timerLeft.value / 60)
  const seconds = timerLeft.value % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
})

function startTimer() {
  if (timerRunning.value) {
    timerRunning.value = false
    window.clearInterval(timerId)
    return
  }
  if (timerLeft.value <= 0) timerLeft.value = timerMinutes.value * 60
  timerRunning.value = true
  timerId = window.setInterval(() => {
    if (timerLeft.value <= 1) {
      timerLeft.value = 0
      timerRunning.value = false
      window.clearInterval(timerId)
      return
    }
    timerLeft.value -= 1
  }, 1000)
}

function resetTimer() {
  timerRunning.value = false
  window.clearInterval(timerId)
  timerLeft.value = timerMinutes.value * 60
}

function setTimer(minutes) {
  timerMinutes.value = minutes
  if (!timerRunning.value) timerLeft.value = minutes * 60
}

onUnmounted(() => {
  cancelAnimationFrame(stopframe)
  window.clearInterval(timerId)
})
</script>

<template>
  <section class="clock">
    <template v-if="tab === 'alarm'">
      <header class="top">
        <button type="button" class="edit" tabindex="-1">编辑</button>
        <button type="button" class="add" tabindex="-1" aria-label="添加">＋</button>
      </header>
      <h1>闹钟</h1>
      <ul class="alarms">
        <li v-for="alarm in alarms" :key="alarm.id" :class="{ off: !alarm.on }">
          <span class="copy">
            <b>{{ alarm.time }}</b>
            <small>{{ alarm.label }}, {{ alarm.days }}</small>
          </span>
          <button
            type="button"
            class="switch"
            :class="{ on: alarm.on }"
            :aria-pressed="alarm.on"
            @click="alarm.on = !alarm.on"
          >
            <i />
          </button>
        </li>
      </ul>
    </template>

    <template v-else-if="tab === 'world'">
      <header class="top">
        <button type="button" class="edit" tabindex="-1">编辑</button>
        <button type="button" class="add" tabindex="-1" aria-label="添加">＋</button>
      </header>
      <h1>世界时钟</h1>
      <ul class="world">
        <li v-for="city in cities" :key="city.id">
          <span>
            <small>{{ cityDay(city.offset) }}, {{ city.offset >= 0 ? `+${city.offset}` : city.offset }}小时</small>
            <b class="city">{{ city.name }}</b>
          </span>
          <strong>{{ cityTime(city.offset) }}</strong>
        </li>
      </ul>
    </template>

    <template v-else-if="tab === 'stopwatch'">
      <div class="stage">
        <p class="face">{{ stopDisplay }}</p>
        <div class="actions">
          <button type="button" class="round gray" @click="resetStop">复位</button>
          <button type="button" class="round" :class="stopwatch.running ? 'red' : 'green'" @click="toggleStop">
            {{ stopwatch.running ? '停止' : '启动' }}
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="stage">
        <p class="face timer">{{ timerDisplay }}</p>
        <div class="presets">
          <button type="button" :class="{ on: timerMinutes === 1 }" @click="setTimer(1)">1 分钟</button>
          <button type="button" :class="{ on: timerMinutes === 5 }" @click="setTimer(5)">5 分钟</button>
          <button type="button" :class="{ on: timerMinutes === 15 }" @click="setTimer(15)">15 分钟</button>
        </div>
        <div class="actions">
          <button type="button" class="round gray" @click="resetTimer">取消</button>
          <button type="button" class="round" :class="timerRunning ? 'orange' : 'green'" @click="startTimer">
            {{ timerRunning ? '暂停' : '启动' }}
          </button>
        </div>
      </div>
    </template>

    <nav class="tabs">
      <button type="button" :class="{ on: tab === 'world' }" @click="tab = 'world'">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4a14 14 0 0 1 0 16M12 4a14 14 0 0 0 0 16" /></svg>
        <span>世界时钟</span>
      </button>
      <button type="button" :class="{ on: tab === 'alarm' }" @click="tab = 'alarm'">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="7" /><path d="M12 10v3l2 2M6 4 3.5 6.5M18 4l2.5 2.5" /></svg>
        <span>闹钟</span>
      </button>
      <button type="button" :class="{ on: tab === 'stopwatch' }" @click="tab = 'stopwatch'">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="7" /><path d="M12 9v4M10 3h4" /></svg>
        <span>秒表</span>
      </button>
      <button type="button" :class="{ on: tab === 'timer' }" @click="tab = 'timer'">
        <svg viewBox="0 0 24 24"><path d="M8 4h8l2 4H6z" /><path d="M7 8v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8" /></svg>
        <span>计时器</span>
      </button>
    </nav>
  </section>
</template>

<style scoped>
.clock {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #000;
  color: #fff;
}

.top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  min-height: calc(var(--safe-top) + 36px);
  padding: var(--safe-top) 16px 4px;
}

.edit,
.add {
  color: #ff9f0a;
  font-size: 17px;
}

.add {
  font-size: 28px;
  line-height: 1;
}

h1 {
  margin: 0;
  padding: 4px 16px 10px;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.alarms,
.world {
  flex: 1;
  margin: 0;
  padding: 0 0 calc(58px + var(--safe-bottom));
  overflow: auto;
  list-style: none;
}

.alarms li,
.world li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px 14px;
  border-bottom: 0.5px solid rgba(84, 84, 88, 0.65);
}

.alarms .off {
  opacity: 0.38;
}

.copy {
  flex: 1;
  min-width: 0;
}

.alarms b {
  display: block;
  font-size: 56px;
  font-weight: 200;
  letter-spacing: -2px;
  line-height: 1;
}

.alarms small,
.world small {
  display: block;
  margin-top: 4px;
  color: rgba(235, 235, 245, 0.6);
  font-size: 15px;
}

.world .city {
  display: block;
  margin-top: 2px;
  font-size: 26px;
  font-weight: 400;
  letter-spacing: -0.4px;
}

.world strong {
  font-size: 48px;
  font-weight: 200;
  letter-spacing: -1.5px;
  line-height: 1;
}

.switch {
  width: 51px;
  height: 31px;
  padding: 2px;
  border-radius: 99px;
  background: #39393d;
}

.switch i {
  display: block;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.28);
  transition: transform 0.2s ease;
}

.switch.on {
  background: #34c759;
}

.switch.on i {
  transform: translateX(20px);
}

.stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: calc(var(--safe-top) + 24px) 20px calc(80px + var(--safe-bottom));
}

.face {
  margin: 0;
  font-size: 72px;
  font-weight: 200;
  letter-spacing: -2px;
  font-variant-numeric: tabular-nums;
}

.face.timer {
  font-size: 84px;
}

.presets {
  display: flex;
  gap: 10px;
  margin-top: 28px;
}

.presets button {
  padding: 8px 14px;
  border-radius: 99px;
  background: #1c1c1e;
  color: #ff9f0a;
  font-size: 15px;
}

.presets .on {
  background: #ff9f0a;
  color: #000;
  font-weight: 650;
}

.actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 320px;
  margin-top: 48px;
}

.round {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  border: 2px solid transparent;
  font-size: 17px;
}

.round.gray {
  background: #242426;
  color: #fff;
}

.round.green {
  background: rgba(52, 199, 89, 0.22);
  color: #30d158;
  box-shadow: inset 0 0 0 2px rgba(52, 199, 89, 0.55);
}

.round.red {
  background: rgba(255, 69, 58, 0.22);
  color: #ff453a;
  box-shadow: inset 0 0 0 2px rgba(255, 69, 58, 0.55);
}

.round.orange {
  background: rgba(255, 159, 10, 0.22);
  color: #ff9f0a;
  box-shadow: inset 0 0 0 2px rgba(255, 159, 10, 0.55);
}

.tabs {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  height: calc(50px + var(--safe-bottom));
  padding: 4px 0 var(--safe-bottom);
  background: rgba(28, 28, 30, 0.94);
  border-top: 0.5px solid rgba(84, 84, 88, 0.65);
  backdrop-filter: blur(18px);
}

.tabs button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: #8e8e93;
  font-size: 10px;
}

.tabs .on {
  color: #ff9f0a;
}

.tabs svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
