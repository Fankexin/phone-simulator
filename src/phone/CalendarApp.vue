<script setup>
import { computed, ref } from 'vue'
import { usePhone } from './usePhone.js'

const phone = usePhone()
const data = phone.story.calendar
const selected = ref(data?.today || 1)
const week = ['一', '二', '三', '四', '五', '六', '日']

const cells = computed(() => {
  if (!data) return []
  return [...Array.from({ length: data.lead }, () => null), ...Array.from({ length: data.days }, (_, index) => index + 1)]
})

const events = computed(() => (data?.events || []).filter((item) => item.day === selected.value))
const when = computed(() => `${data?.label || ''}${selected.value}日 周${week[(data?.lead + selected.value - 1) % 7]}`)
</script>

<template>
  <section class="cal">
    <header class="top">
      <button type="button" class="inbox" tabindex="-1">收件箱</button>
      <b>{{ data?.year }}年</b>
      <button type="button" class="plus" tabindex="-1" aria-label="添加">＋</button>
    </header>

    <div class="month">
      <h2>{{ data?.label }}</h2>
      <div class="grid">
        <span v-for="name in week" :key="name" class="w">{{ name }}</span>
        <button
          v-for="(day, index) in cells"
          :key="index"
          type="button"
          class="day"
          :disabled="!day"
          @click="day && (selected = day)"
        >
          <b :class="{ on: day === selected, today: day === data?.today && day !== selected }">{{ day || '' }}</b>
          <span class="marks">
            <i v-if="day && data?.events?.some((item) => item.day === day)" />
          </span>
        </button>
      </div>
    </div>

    <div class="list">
      <p class="when">{{ when }}</p>
      <div v-for="item in events" :key="item.title" class="event">
        <i :style="{ background: item.color }" />
        <span class="copy">
          <b>{{ item.title }}</b>
          <small>{{ item.time }}</small>
        </span>
      </div>
      <p v-if="!events.length" class="none">无日程</p>
    </div>

    <nav class="dock">
      <button type="button" class="on" tabindex="-1">今天</button>
      <button type="button" tabindex="-1">日历</button>
      <button type="button" tabindex="-1">收件箱</button>
    </nav>
  </section>
</template>

<style scoped>
.cal {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #111;
}

.top {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: flex-end;
  min-height: calc(var(--safe-top) + 36px);
  padding: var(--safe-top) 14px 8px;
  color: #ff3b30;
}

.top b {
  font-size: 17px;
  font-weight: 620;
  color: #111;
}

.inbox,
.plus {
  color: #ff3b30;
  font-size: 17px;
}

.inbox {
  justify-self: start;
}

.plus {
  justify-self: end;
  font-size: 24px;
  line-height: 1;
}

.month {
  padding: 0 8px 4px;
}

h2 {
  margin: 0 10px 6px;
  color: #ff3b30;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.6px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.w {
  padding: 4px 0 8px;
  color: rgba(60, 60, 67, 0.6);
  font-size: 11px;
  font-weight: 600;
}

.day {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 52px;
  padding-top: 2px;
  color: #111;
}

.day b {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  font-size: 20px;
  font-weight: 400;
  line-height: 1;
}

.day b.today {
  color: #ff3b30;
  font-weight: 600;
}

.day b.on {
  background: #ff3b30;
  color: #fff;
  font-weight: 600;
}

.marks {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
  height: 8px;
  margin-top: 2px;
}

.marks i {
  display: block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #ff3b30;
}

.list {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 8px 16px calc(8px + var(--safe-bottom) + 44px);
  background: #f2f2f7;
  border-top: 0.5px solid rgba(60, 60, 67, 0.18);
}

.when,
.none {
  margin: 8px 0;
  color: rgba(60, 60, 67, 0.6);
  font-size: 13px;
  font-weight: 600;
}

.event {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
  padding: 12px 12px 12px 0;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
}

.event i {
  width: 4px;
  margin: -12px 0;
  border-radius: 0;
}

.copy {
  min-width: 0;
}

.event b,
.event small {
  display: block;
}

.event b {
  font-size: 16px;
  font-weight: 600;
}

.event small {
  margin-top: 3px;
  color: rgba(60, 60, 67, 0.6);
  font-size: 14px;
}

.dock {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: calc(44px + var(--safe-bottom));
  padding-bottom: var(--safe-bottom);
  background: rgba(249, 249, 249, 0.94);
  border-top: 0.5px solid rgba(60, 60, 67, 0.18);
  backdrop-filter: blur(18px);
  color: #ff3b30;
  font-size: 17px;
}

.dock .on {
  font-weight: 600;
}
</style>
