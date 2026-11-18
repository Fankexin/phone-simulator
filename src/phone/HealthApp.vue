<script setup>
import { computed } from 'vue'
import { usePhone } from './usePhone.js'
import Avatar from './Avatar.vue'

const phone = usePhone()
const health = computed(() => phone.story.health || {})
const stepsPct = computed(() => {
  const steps = Number(health.value.steps) || 0
  const goal = Math.max(Number(health.value.goal) || 10000, 1)
  return Math.min(100, Math.round((steps / goal) * 100))
})
const heart = computed(() => health.value.heart || {})
</script>

<template>
  <section class="health">
    <div class="scroll">
      <header class="top">
        <p class="date">摘要</p>
        <div class="headline">
          <h1>今天</h1>
          <Avatar class="profile" :contact="phone.contactOf('me')" :size="44" round />
        </div>
      </header>

      <article class="card steps">
        <p class="label">步数</p>
        <p class="value"><b>{{ health.steps?.toLocaleString?.('zh-CN') || health.steps }}</b> 步</p>
        <p class="sub">目标 {{ health.goal?.toLocaleString?.('zh-CN') || health.goal }} 步</p>
        <div class="bar"><i :style="{ width: `${stepsPct}%` }" /></div>
      </article>

      <div class="row">
        <article class="card mini">
          <p class="label">活动能量</p>
          <p class="value accent"><b>{{ health.energy }}</b> 千卡</p>
        </article>
        <article class="card mini">
          <p class="label">睡眠</p>
          <p class="value"><b>{{ health.sleep }}</b></p>
        </article>
      </div>

      <article class="card heart">
        <div class="heart-top">
          <div>
            <p class="label">心率</p>
            <p class="value accent"><b>{{ heart.resting || '—' }}</b> 次/分</p>
            <p class="sub">静息心率 · {{ heart.device || 'Apple Watch' }}</p>
          </div>
          <svg class="pulse" viewBox="0 0 64 28" aria-hidden="true">
            <path d="M1 18 H12 L16 8 L22 24 L28 4 L34 20 L40 14 H63" />
          </svg>
        </div>
        <ul class="timeline">
          <li v-for="item in heart.events || []" :key="item.id" :data-level="item.level || 'note'">
            <time>{{ item.date }}</time>
            <p>{{ item.text }}</p>
          </li>
        </ul>
      </article>

      <article class="card list">
        <p class="label">健身记录</p>
        <ul>
          <li v-for="item in health.workouts || []" :key="item.name + item.date">
            <div>
              <b>{{ item.name }}</b>
              <span>{{ item.date }} · {{ item.duration }}</span>
            </div>
            <em>{{ item.kcal }} 千卡</em>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<style scoped>
.health {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f2f2f7;
  color: #000;
}

.scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding: calc(58px + var(--call-gap, 0px)) 16px 28px;
}

.top {
  margin-bottom: 18px;
}

.date {
  color: #8e8e93;
  font-size: 13px;
  font-weight: 600;
}

.headline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 2px;
}

h1 {
  font-size: 34px;
  font-weight: 760;
  letter-spacing: -0.6px;
  line-height: 1.05;
}

.profile {
  flex: none;
}

.card {
  margin-bottom: 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 0.5px 0 rgba(0, 0, 0, 0.04);
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.row .card {
  margin: 0;
}

.label {
  margin-bottom: 8px;
  color: #8e8e93;
  font-size: 13px;
  font-weight: 600;
}

.value {
  font-size: 17px;
  font-weight: 500;
}

.value b {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.4px;
}

.accent {
  color: #ff2d55;
}

.sub {
  margin-top: 4px;
  color: #8e8e93;
  font-size: 13px;
}

.bar {
  height: 8px;
  margin-top: 14px;
  overflow: hidden;
  border-radius: 99px;
  background: #f2f2f7;
}

.bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ff375f, #ff2d55);
}

.heart-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.pulse {
  width: 72px;
  height: 32px;
  margin-top: 18px;
  flex: none;
}

.pulse path {
  fill: none;
  stroke: #ff2d55;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.timeline {
  display: grid;
  gap: 12px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 0.5px solid rgba(60, 60, 67, 0.12);
}

.timeline li time {
  display: block;
  color: #8e8e93;
  font-size: 12px;
  font-weight: 600;
}

.timeline li p {
  margin-top: 4px;
  font-size: 14px;
  line-height: 1.45;
}

.timeline li[data-level='high'] p {
  color: #ff2d55;
}

.timeline li[data-level='recover'] p {
  color: #34c759;
}

.list ul {
  display: grid;
  gap: 12px;
}

.list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.list b {
  display: block;
  font-size: 16px;
  font-weight: 620;
}

.list span {
  color: #8e8e93;
  font-size: 12px;
}

.list em {
  color: #ff2d55;
  font-style: normal;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
