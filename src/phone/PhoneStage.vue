<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { usePhone } from './usePhone.js'
import StatusBar from './StatusBar.vue'
import LockScreen from './LockScreen.vue'
import HomeScreen from './HomeScreen.vue'
import MessengerApp from './MessengerApp.vue'
import PhotosApp from './PhotosApp.vue'
import NotesApp from './NotesApp.vue'
import CallsApp from './CallsApp.vue'
import CalendarApp from './CalendarApp.vue'
import ClockApp from './ClockApp.vue'
import WeatherApp from './WeatherApp.vue'
import HealthApp from './HealthApp.vue'
import TaobaoApp from './TaobaoApp.vue'

const gripTipKey = 'found-phone:home-grip-tip'
const phone = usePhone()
const { darkChrome, route } = phone
const views = {
  wechat: MessengerApp,
  sms: MessengerApp,
  photos: PhotosApp,
  notes: NotesApp,
  calls: CallsApp,
  calendar: CalendarApp,
  clock: ClockApp,
  weather: WeatherApp,
  health: HealthApp,
  taobao: TaobaoApp,
}

const appView = computed(() => views[phone.route.value?.app] || null)
/** 只在锁屏 / 主屏 / 换应用时换 key；应用内跳转由各 App 自己切视图，避免整页 rise 重挂造成晃动 */
const screenKey = computed(() => {
  if (phone.progress.phase !== 'home') return phone.progress.phase
  const current = phone.route.value
  if (!current) return 'home'
  return current.app
})

const showGripTip = ref(false)

function maybeShowGripTip() {
  if (phone.progress.phase !== 'home' || route.value) {
    showGripTip.value = false
    return
  }
  try {
    if (localStorage.getItem(gripTipKey) === '1') {
      showGripTip.value = false
      return
    }
  } catch {
    /* ignore */
  }
  showGripTip.value = true
}

function dismissGripTip() {
  try {
    localStorage.setItem(gripTipKey, '1')
  } catch {
    /* ignore */
  }
  showGripTip.value = false
}

watch(
  () => [phone.progress.phase, route.value],
  () => maybeShowGripTip(),
  { immediate: true },
)

/** 真机/触控：去掉模拟外框（含 Safari「桌面网站」把宽度撑大的情况） */
const flat = ref(false)
let shellQuery
function syncShell() {
  flat.value = Boolean(shellQuery?.matches)
  document.documentElement.classList.toggle('shell-flat', flat.value)
}
onMounted(() => {
  shellQuery = window.matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)')
  syncShell()
  shellQuery.addEventListener('change', syncShell)
})
onUnmounted(() => {
  shellQuery?.removeEventListener('change', syncShell)
  document.documentElement.classList.remove('shell-flat')
})
</script>

<template>
  <main class="stage" :class="{ flat }">
    <div class="device" :class="{ flat }">
      <i class="side silent" aria-hidden="true" />
      <i class="side vol-up" aria-hidden="true" />
      <i class="side vol-down" aria-hidden="true" />
      <i class="side power" aria-hidden="true" />
      <div class="screen">
        <i class="island" aria-hidden="true" />
        <StatusBar :dark="darkChrome" />
        <div class="slot">
          <Transition name="rise">
            <LockScreen v-if="phone.progress.phase === 'lock'" key="lock" />
            <HomeScreen v-else-if="!route" key="home" />
            <component :is="appView" v-else :key="screenKey" />
          </Transition>
        </div>
        <button
          v-if="phone.progress.phase === 'home' && route"
          type="button"
          class="grip"
          :class="{ ink: !darkChrome, tip: showGripTip }"
          aria-label="主屏幕"
          @click="phone.goHome"
        />
        <i v-else class="grip" :class="{ ink: !darkChrome, tip: showGripTip }" aria-hidden="true" />

        <div
          v-if="showGripTip"
          class="grip-tip"
          role="dialog"
          aria-modal="true"
          aria-labelledby="grip-tip-title"
        >
          <button type="button" class="grip-tip-mask" aria-label="关闭提示" @click="dismissGripTip" />
          <div class="grip-tip-card">
            <p id="grip-tip-title">打开应用后，点屏幕最下方的横条，可以回到主屏幕。</p>
            <button type="button" class="grip-tip-ok" @click="dismissGripTip">知道了</button>
          </div>
          <span class="grip-tip-arrow" aria-hidden="true" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.stage {
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(ellipse at 50% 115%, rgba(196, 132, 74, 0.18), transparent 46%),
    radial-gradient(ellipse at 50% 0%, rgba(86, 110, 140, 0.22), transparent 42%),
    #121418;
}

.device {
  position: relative;
  width: min(402px, 100%);
  height: min(844px, calc(100svh - 36px));
  padding: 11px;
  border-radius: 54px;
  background:
    linear-gradient(160deg, #8d929a 0%, #4a4e55 12%, #1c1e22 38%, #2c3036 72%, #6d727a 100%);
  box-shadow:
    inset 0 0 0 1px #0b0c0e,
    inset 0 0 0 3px #c5c8ce,
    inset 0 0 0 5px #2a2d32,
    0 28px 60px rgba(0, 0, 0, 0.48),
    0 2px 0 rgba(255, 255, 255, 0.25);
}

.device.buzzing {
  animation: buzz 0.35s linear 3;
}

.side {
  position: absolute;
  z-index: 2;
  width: 4px;
  border-radius: 2px 0 0 2px;
  background: linear-gradient(90deg, #1a1c20, #8e939b 55%, #3a3e44);
  box-shadow: -1px 0 1px rgba(0, 0, 0, 0.35);
}

.silent { left: -3px; top: 118px; height: 28px; }
.vol-up { left: -3px; top: 164px; height: 58px; }
.vol-down { left: -3px; top: 232px; height: 58px; }
.power {
  right: -3px;
  top: 190px;
  width: 4px;
  height: 86px;
  border-radius: 0 2px 2px 0;
  background: linear-gradient(270deg, #1a1c20, #8e939b 55%, #3a3e44);
}

.screen {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 44px;
  background: #000;
  box-shadow: inset 0 0 0 2px #000;
}

.screen::after {
  content: '';
  position: absolute;
  z-index: 35;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(115deg, rgba(255, 255, 255, 0.14), transparent 26%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16);
}

.island {
  position: absolute;
  z-index: 8;
  top: 11px;
  left: 50%;
  width: 118px;
  height: 35px;
  border-radius: 20px;
  background: #000;
  transform: translateX(-50%);
  pointer-events: none;
  transition: width 0.25s ease;
}

.island.live {
  width: 148px;
}

.slot {
  position: absolute;
  inset: 0;
}

.slot > :deep(*) {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.grip {
  position: absolute;
  z-index: 12;
  left: 50%;
  bottom: 0;
  width: 160px;
  height: var(--safe-bottom);
  background: transparent;
  transform: translateX(-50%);
  pointer-events: none;
}

button.grip {
  pointer-events: auto;
}

.grip::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 8px;
  width: 134px;
  height: 5px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.92);
  transform: translateX(-50%);
}

.grip.ink::before {
  background: rgba(0, 0, 0, 0.28);
}

.grip.tip::before {
  background: #fff;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.28);
  animation: grip-pulse 1.4s ease-in-out infinite;
}

.grip-tip {
  position: absolute;
  z-index: 40;
  inset: 0;
  pointer-events: none;
}

.grip-tip-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.42);
  pointer-events: auto;
}

.grip-tip-card {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: calc(var(--safe-bottom) + 28px);
  padding: 16px 16px 14px;
  border-radius: 16px;
  background: rgba(28, 28, 30, 0.94);
  color: #f5f5f7;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  pointer-events: auto;
}

.grip-tip-card p {
  margin: 0;
  font-size: 15px;
  line-height: 1.45;
  letter-spacing: 0.01em;
}

.grip-tip-ok {
  margin-top: 14px;
  width: 100%;
  height: 40px;
  border-radius: 12px;
  background: #fff;
  color: #111;
  font-size: 15px;
  font-weight: 600;
}

.grip-tip-arrow {
  position: absolute;
  left: 50%;
  bottom: calc(var(--safe-bottom) + 14px);
  width: 14px;
  height: 14px;
  background: rgba(28, 28, 30, 0.94);
  transform: translateX(-50%) rotate(45deg);
  pointer-events: none;
}

@keyframes grip-pulse {
  0%,
  100% { opacity: 1; transform: translateX(-50%) scaleX(1); }
  50% { opacity: 0.72; transform: translateX(-50%) scaleX(1.06); }
}

@keyframes buzz {
  25% { transform: translateX(-1px) rotate(-0.2deg); }
  75% { transform: translateX(1px) rotate(0.2deg); }
}

.stage.flat {
  min-height: 100%;
  height: 100svh;
  padding: 0;
  background: #000;
}

.device.flat {
  width: 100%;
  height: 100%;
  max-height: 100svh;
  padding: 0;
  border-radius: 0;
  background: #000;
  box-shadow: none;
}

.device.flat .side {
  display: none;
}

.device.flat .screen,
.device.flat .screen::after {
  border-radius: 0;
}

.device.flat .screen::after {
  display: none;
}

@media (max-width: 900px), (hover: none) and (pointer: coarse) {
  .stage {
    min-height: 100%;
    height: 100svh;
    padding: 0;
    background: #000;
  }

  .device {
    width: 100%;
    height: 100%;
    max-height: 100svh;
    padding: 0;
    border-radius: 0;
    background: #000;
    box-shadow: none;
  }

  .side {
    display: none;
  }

  .screen,
  .screen::after {
    border-radius: 0;
  }

  .screen::after {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .device.buzzing {
    animation: none;
  }
}
</style>
