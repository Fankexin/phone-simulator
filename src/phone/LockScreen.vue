<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { usePhone } from './usePhone.js'
import flashlightIcon from '../images/flashlight.svg'
import cameraIcon from '../images/camera.svg'

const { story, notices, unlock, openFromLock, openApp } = usePhone()
const startY = ref(null)
const flash = ref(false)
const asking = ref(false)
const code = ref('')
const wrong = ref(false)
const shake = ref(0)
const letters = ['', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ']
let pending = null
let timer = 0
let clockTimer = 0
const clock = ref('')
const dateLabel = ref('')
const weekNames = ['日', '一', '二', '三', '四', '五', '六']

function tickClock() {
  const date = new Date()
  clock.value = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  dateLabel.value = `${date.getMonth() + 1}月${date.getDate()}日 星期${weekNames[date.getDay()]}`
  clockTimer = window.setTimeout(tickClock, 60000 - (date.getSeconds() * 1000 + date.getMilliseconds()))
}

onMounted(tickClock)

const length = computed(() => String(story.meta.passcode || '').length || 4)

function down(event) {
  if (asking.value) return
  startY.value = event.clientY
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

function up(event) {
  if (asking.value || startY.value == null) {
    startY.value = null
    return
  }
  if (startY.value - event.clientY > 48) ask(() => unlock())
  startY.value = null
}

function openCamera() {
  ask(() => openApp('photos'))
}

function openNotice(id) {
  ask(() => openFromLock(id))
}

function ask(action) {
  if (!story.meta.passcode) {
    action()
    return
  }
  window.clearTimeout(timer)
  pending = action
  code.value = ''
  wrong.value = false
  asking.value = true
}

function cancel() {
  window.clearTimeout(timer)
  asking.value = false
  pending = null
  code.value = ''
  wrong.value = false
}

function press(key) {
  if (wrong.value) return
  if (key === 'del') {
    code.value = code.value.slice(0, -1)
    return
  }
  if (code.value.length >= length.value) return
  code.value += key
  if (code.value.length < length.value) return
  if (code.value === String(story.meta.passcode)) {
    const action = pending
    cancel()
    action?.()
    return
  }
  wrong.value = true
  shake.value += 1
  timer = window.setTimeout(() => {
    code.value = ''
    wrong.value = false
  }, 520)
}

onUnmounted(() => {
  window.clearTimeout(timer)
  window.clearTimeout(clockTimer)
})
</script>

<template>
  <section class="lock" :class="{ lit: flash }" @pointerdown="down" @pointerup="up">
    <div class="wall" aria-hidden="true">
      <img
        v-if="story.meta.lockWallpaper"
        :src="story.meta.lockWallpaper"
        alt=""
        referrerpolicy="no-referrer"
      />
    </div>
    <template v-if="!asking">
    <p class="date">{{ dateLabel }}</p>
    <p class="clock">{{ clock }}</p>
    <div class="notices">
      <button
        v-for="item in notices"
        :key="item.id"
        type="button"
        class="notice"
        @pointerdown.stop
        @click="openNotice(item.id)"
      >
        <span class="top">
          <i class="mini" :class="item.app"><AppIcon :name="item.app" /></i>
          <small>{{ item.appName }}</small>
          <time>现在</time>
        </span>
        <strong>{{ item.contact.name }}</strong>
        <span class="body">{{ item.text }}</span>
      </button>
    </div>
    <p v-if="story.meta.passcode" class="cue">上滑输入密码</p>
    <div class="shortcuts">
      <button type="button" class="orb" :class="{ on: flash }" aria-label="手电筒" @pointerdown.stop @click="flash = !flash">
        <img :src="flashlightIcon" alt="" />
      </button>
      <button type="button" class="orb" aria-label="相机" @pointerdown.stop @click="openCamera">
        <img :src="cameraIcon" alt="" />
      </button>
    </div>
    </template>

    <div v-else class="pass" @pointerdown.stop @pointerup.stop>
      <button type="button" class="cancel" @click="cancel">取消</button>
      <p class="title">{{ wrong ? '密码错误' : '输入密码' }}</p>
      <p v-if="story.meta.passcodeHint && !wrong" class="hint">{{ story.meta.passcodeHint }}</p>
      <div :key="shake" class="dots" :class="{ wrong }">
        <i v-for="index in length" :key="index" :class="{ on: code.length >= index }" />
      </div>
      <div class="pad">
        <button v-for="(sub, index) in letters" :key="index" type="button" class="key" @click="press(String(index + 1))">
          <b>{{ index + 1 }}</b>
          <small v-if="sub">{{ sub }}</small>
        </button>
        <span></span>
        <button type="button" class="key" @click="press('0')"><b>0</b></button>
        <button type="button" class="key del" aria-label="删除" @click="press('del')">
          <svg viewBox="0 0 28 20" aria-hidden="true">
            <path d="M9 1.5h14.2A2.3 2.3 0 0 1 25.5 3.8v12.4a2.3 2.3 0 0 1-2.3 2.3H9L2.2 10 9 1.5z" fill="none" stroke="currentColor" stroke-width="1.6" />
            <path d="m12 6.5 6 7M18 6.5l-6 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lock {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 78px 16px 28px;
  color: #fff;
  overflow: auto;
  touch-action: none;
}

.wall {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 78% 18%, rgba(255, 236, 206, 0.95) 0 34px, rgba(255, 196, 130, 0.25) 35px, transparent 90px),
    linear-gradient(180deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.45)),
    linear-gradient(180deg, #24344c 0%, #6d88a8 30%, #e09a72 62%, #1a140f 100%);
}

.wall img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.wall::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.08) 42%, rgba(0, 0, 0, 0.42));
  pointer-events: none;
}

.lock.lit .wall {
  filter: brightness(1.65) saturate(0.85);
}

.lock > :not(.wall) {
  position: relative;
  z-index: 1;
}

.date,
.clock {
  margin: 0;
  text-align: center;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
}

.date {
  font-size: 20px;
  font-weight: 520;
  letter-spacing: 0.2px;
}

.clock {
  margin-top: 2px;
  font-family: 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  font-size: 92px;
  font-weight: 250;
  letter-spacing: -3px;
  line-height: 0.95;
}

.notices {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 22px;
}

.notice {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 12px 14px 13px;
  border-radius: 22px;
  text-align: left;
  color: #fff;
  background: rgba(40, 40, 42, 0.46);
  border: 0.5px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(22px) saturate(1.4);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
}

.top {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  margin-bottom: 3px;
}

.mini {
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border-radius: 4px;
  overflow: hidden;
}

.mini :deep(svg) {
  width: 13px;
  height: 13px;
}

.mini.clock :deep(svg) {
  width: 18px;
  height: 18px;
}

.mini :deep(img) {
  width: 18px;
  height: 18px;
}

.mini.calendar { background: #fff; }
.mini.sms,
.mini.photos,
.mini.notes,
.mini.calls,
.mini.weather,
.mini.clock,
.mini.wechat { background: transparent; }

.top small,
.top time {
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
  font-weight: 500;
}

.top time {
  margin-left: auto;
}

.notice strong {
  font-size: 15px;
  font-weight: 650;
}

.body {
  margin-top: 1px;
  font-size: 15px;
  line-height: 1.35;
}

.cue {
  margin: auto 0 0;
  text-align: center;
  font-size: 15px;
  font-weight: 520;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.4);
}

.shortcuts {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding: 0 8px 8px;
}

.lock:not(:has(.cue)) .shortcuts {
  margin-top: auto;
}

.lock > .pass {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: calc(var(--safe-top) + 8px) 0 calc(var(--safe-bottom) + 12px);
}

.cancel {
  align-self: flex-start;
  margin-left: 22px;
  font-size: 17px;
}

.title {
  margin: 42px 0 0;
  font-size: 17px;
  font-weight: 560;
}

.hint {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.dots {
  display: flex;
  gap: 18px;
  margin-top: 24px;
}

.dots i {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.92);
}

.dots i.on {
  background: #fff;
}

.dots.wrong {
  animation: shake 0.42s ease;
}

.pad {
  display: grid;
  grid-template-columns: repeat(3, 75px);
  gap: 16px 26px;
  margin-top: auto;
}

.key {
  width: 75px;
  height: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
}

.key:active {
  background: rgba(255, 255, 255, 0.72);
  color: #111;
}

.key b {
  font-size: 36px;
  font-weight: 360;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.key small {
  margin-top: 2px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.key.del {
  background: transparent;
}

.key.del:active {
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
}

.key svg {
  width: 30px;
  height: 22px;
}

@keyframes shake {
  0%,
  100% { transform: translateX(0); }
  20% { transform: translateX(-12px); }
  40% { transform: translateX(10px); }
  60% { transform: translateX(-7px); }
  80% { transform: translateX(4px); }
}

.orb {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: rgba(30, 30, 32, 0.38);
  border: 0.5px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(16px);
}

.orb img {
  display: block;
  width: auto;
  height: 22px;
}

.orb:first-child img {
  height: 26px;
}

.orb.on {
  background: rgba(255, 255, 255, 0.92);
}

.orb.on img {
  filter: brightness(0);
}
</style>
