<script setup>
import { computed } from 'vue'
import { usePhone } from './usePhone.js'

const phone = usePhone()
const weather = phone.story.weather

const weekMin = computed(() => Math.min(...(weather?.days || []).map((day) => day.low)))
const weekMax = computed(() => Math.max(...(weather?.days || []).map((day) => day.high)))

function barStyle(day) {
  const span = Math.max(weekMax.value - weekMin.value, 1)
  const left = ((day.low - weekMin.value) / span) * 100
  const width = ((day.high - day.low) / span) * 100
  return {
    left: `${left}%`,
    width: `${Math.max(width, 8)}%`,
  }
}

function nowMark(day) {
  if (day.name !== '今天' || weather?.temp == null) return null
  const span = Math.max(weekMax.value - weekMin.value, 1)
  const left = ((weather.temp - weekMin.value) / span) * 100
  return { left: `${Math.min(Math.max(left, 2), 98)}%` }
}

function rainChance(value) {
  const number = Number(String(value || '').replace('%', ''))
  return Number.isFinite(number) && number > 0 ? `${number}%` : ''
}
</script>

<template>
  <section class="weather">
    <div class="sky" aria-hidden="true">
      <i class="mist a" />
      <i class="mist b" />
    </div>

    <div class="sheet">
      <header class="hero">
        <h1>{{ weather?.city }}</h1>
        <p class="now">{{ weather?.temp }}°</p>
        <p class="cond">{{ weather?.condition }}</p>
        <p class="range">最高{{ weather?.high }}° 最低{{ weather?.low }}°</p>
      </header>

      <div class="card hours">
        <div class="rail">
          <div v-for="hour in weather?.hours || []" :key="hour.time" class="hour">
            <span>{{ hour.time }}</span>
            <i class="sym" :data-icon="hour.icon || 'cloud'" />
            <b>{{ hour.temp }}°</b>
          </div>
        </div>
      </div>

      <div class="card days">
        <p class="caption">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10M6 8h12M8 12h8M9 16h6M10 20h4" /></svg>
          10日天气预报
        </p>
        <ul>
          <li v-for="day in weather?.days || []" :key="day.name + day.high">
            <span class="name">{{ day.name }}</span>
            <span class="chance">{{ rainChance(day.rain) }}</span>
            <i class="sym" :data-icon="day.icon || 'cloud'" />
            <b class="low">{{ day.low }}°</b>
            <span class="track">
              <i :style="barStyle(day)" />
              <em v-if="nowMark(day)" :style="nowMark(day)" />
            </span>
            <b class="high">{{ day.high }}°</b>
          </li>
        </ul>
      </div>

      <div class="cards">
        <article class="mini">
          <p class="label">体感温度</p>
          <p class="value">8°</p>
          <p class="note">接近实际气温。</p>
        </article>
        <article class="mini">
          <p class="label">湿度</p>
          <p class="value">86%</p>
          <p class="note">露点温度为 6°。</p>
        </article>
      </div>
    </div>

    <footer class="dock">
      <button type="button" aria-label="地图" tabindex="-1">
        <svg viewBox="0 0 24 24"><path d="M4 6.5 9.5 4l5 2.5L20 4v13.5L14.5 20l-5-2.5L4 20V6.5Z" /><path d="M9.5 4v13.5M14.5 6.5V20" /></svg>
      </button>
      <div class="dots" aria-hidden="true">
        <i class="on" />
        <i />
        <i />
      </div>
      <button type="button" aria-label="城市列表" tabindex="-1">
        <svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14" /></svg>
      </button>
    </footer>
  </section>
</template>

<style scoped>
.weather {
  position: relative;
  height: 100%;
  color: #fff;
  background: #1b2d45;
  overflow: hidden;
}

.sky {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% -10%, rgba(140, 170, 210, 0.45), transparent 42%),
    linear-gradient(180deg, #4d6482 0%, #2c4058 42%, #1a2838 100%);
}

.mist {
  position: absolute;
  inset: auto -10% 18%;
  height: 38%;
  background: radial-gradient(ellipse at center, rgba(180, 200, 220, 0.22), transparent 68%);
  filter: blur(8px);
}

.mist.a {
  bottom: 28%;
  opacity: 0.7;
}

.mist.b {
  bottom: 8%;
  height: 46%;
  opacity: 0.45;
}

.sheet {
  position: relative;
  z-index: 1;
  height: 100%;
  overflow: auto;
  padding: calc(var(--safe-top) + 4px) 14px calc(var(--safe-bottom) + 52px);
}

.hero {
  padding: 10px 8px 18px;
  text-align: center;
}

h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 400;
  letter-spacing: 0.2px;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.22);
}

.now {
  margin: 2px 0 0;
  font-size: 96px;
  font-weight: 200;
  letter-spacing: -4px;
  line-height: 0.92;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
}

.cond,
.range {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.2px;
}

.range {
  margin-top: 2px;
}

.card {
  margin-top: 10px;
  border-radius: 14px;
  background: rgba(36, 52, 72, 0.42);
  border: 0.5px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(28px) saturate(1.35);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.hours {
  padding: 12px 0 14px;
}

.rail {
  display: flex;
  gap: 4px;
  padding: 0 10px;
  overflow: auto;
}

.hour {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  min-width: 52px;
  padding: 0 4px;
}

.hour span {
  font-size: 13px;
  font-weight: 560;
  letter-spacing: -0.1px;
}

.hour b {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.3px;
}

.caption {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 12px 14px 8px;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 620;
  letter-spacing: 0.02em;
  text-transform: none;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.12);
}

.caption svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}

ul {
  margin: 0;
  padding: 2px 12px 8px;
  list-style: none;
}

li {
  display: grid;
  grid-template-columns: 42px 34px 22px 28px 1fr 30px;
  align-items: center;
  gap: 6px;
  min-height: 42px;
  border-bottom: 0.5px solid rgba(255, 255, 255, 0.1);
  font-size: 17px;
}

li:last-child {
  border-bottom: 0;
}

.name {
  font-weight: 500;
}

.chance {
  color: #7ec8ff;
  font-size: 12px;
  font-weight: 650;
  text-align: right;
}

.low {
  color: rgba(255, 255, 255, 0.45);
  font-weight: 560;
  text-align: right;
}

.high {
  font-weight: 560;
  text-align: right;
}

.track {
  position: relative;
  height: 4px;
  margin: 0 4px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.18);
  overflow: hidden;
}

.track i {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #6ec6ff, #ffd60a 70%, #ff9f0a);
}

.track em {
  position: absolute;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 2px rgba(20, 34, 50, 0.55);
  transform: translate(-50%, -50%);
}

.sym {
  width: 22px;
  height: 22px;
  display: block;
  margin: 0 auto;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

.sym[data-icon='rain'] {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath fill='%23dfe9f5' d='M20 28c0-8 7-14 15-14 6 0 12 4 14 9 6 1 10 6 10 12 0 7-6 12-13 12H24c-7 0-12-5-12-11 0-5 3-10 8-11z'/%3E%3Cpath fill='none' stroke='%237ec8ff' stroke-width='4' stroke-linecap='round' d='M24 50v8M34 48v10M44 50v8'/%3E%3C/svg%3E");
}

.sym[data-icon='cloud'] {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath fill='%23e8eef7' d='M20 36c0-8 7-14 15-14 6 0 12 4 14 9 6 1 10 6 10 12 0 7-6 12-13 12H24c-7 0-12-5-12-11 0-5 3-10 8-11z'/%3E%3C/svg%3E");
}

.sym[data-icon='sun'] {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='12' fill='%23ffd60a'/%3E%3Cg stroke='%23ffd60a' stroke-width='4' stroke-linecap='round'%3E%3Cpath d='M32 8v6M32 50v6M8 32h6M50 32h6M14 14l4 4M46 46l4 4M14 50l4-4M46 18l4-4'/%3E%3C/g%3E%3C/svg%3E");
}

.sym[data-icon='moon'] {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath fill='%23f2f4f8' d='M40 12c-2 8-10 16-20 18 6 10 18 16 30 12 2-12-2-24-10-30z'/%3E%3C/svg%3E");
}

.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}

.mini {
  min-height: 132px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(36, 52, 72, 0.42);
  border: 0.5px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(28px) saturate(1.35);
}

.label {
  margin: 0;
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.04em;
}

.value {
  margin: 10px 0 0;
  font-size: 34px;
  font-weight: 400;
  letter-spacing: -0.8px;
}

.note {
  margin: 18px 0 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
  line-height: 1.35;
}

.dock {
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  height: calc(var(--safe-bottom) + 44px);
  padding: 0 10px var(--safe-bottom);
  background: linear-gradient(180deg, transparent, rgba(12, 20, 30, 0.55) 40%);
  backdrop-filter: blur(18px);
  border-top: 0.5px solid rgba(255, 255, 255, 0.12);
}

.dock button {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  color: #fff;
}

.dock svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linejoin: round;
  stroke-linecap: round;
}

.dots {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.28);
}

.dots .on {
  background: #fff;
}
</style>
