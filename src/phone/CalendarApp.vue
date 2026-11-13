<script setup>
import { computed, ref } from 'vue'
import { usePhone } from './usePhone.js'

const phone = usePhone()
const now = new Date()
const cursor = ref(new Date(now.getFullYear(), now.getMonth(), 1))
const selected = ref(now.getDate())
const week = ['一', '二', '三', '四', '五', '六', '日']

const month = computed(() => {
  const year = cursor.value.getFullYear()
  const monthIndex = cursor.value.getMonth()
  const firstWeekday = new Date(year, monthIndex, 1).getDay()
  return {
    year,
    month: monthIndex + 1,
    label: `${monthIndex + 1}月`,
    days: new Date(year, monthIndex + 1, 0).getDate(),
    lead: (firstWeekday + 6) % 7,
    today: year === now.getFullYear() && monthIndex === now.getMonth() ? now.getDate() : 0,
  }
})

const cells = computed(() => [
  ...Array.from({ length: month.value.lead }, () => null),
  ...Array.from({ length: month.value.days }, (_, index) => index + 1),
])

const when = computed(() => `${month.value.label}${selected.value}日 周${week[(month.value.lead + selected.value - 1) % 7]}`)

function matches(event, day) {
  if (!day || event.day !== day || event.month !== month.value.month) return false
  return event.yearly || event.year === month.value.year
}

function marked(day) {
  return (phone.story.calendar?.events || []).some((event) => matches(event, day))
}

const dayEvents = computed(() =>
  (phone.story.calendar?.events || []).filter((event) => matches(event, selected.value)),
)

function shift(delta) {
  const next = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + delta, 1)
  cursor.value = next
  const days = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
  if (selected.value > days) selected.value = days
}

function goToday() {
  cursor.value = new Date(now.getFullYear(), now.getMonth(), 1)
  selected.value = now.getDate()
}
</script>

<template>
  <section class="cal">
    <header class="top">
      <button type="button" class="inbox" tabindex="-1">收件箱</button>
      <b>{{ month.year }}年</b>
      <button type="button" class="plus" tabindex="-1" aria-label="添加">＋</button>
    </header>

    <div class="month">
      <div class="month-head">
        <h2>{{ month.label }}</h2>
        <span>
          <button type="button" aria-label="上个月" @click="shift(-1)">‹</button>
          <button type="button" aria-label="下个月" @click="shift(1)">›</button>
        </span>
      </div>
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
          <b :class="{ on: day === selected, today: day === month.today && day !== selected }">{{ day || '' }}</b>
          <i v-if="marked(day)" class="dot" />
        </button>
      </div>
    </div>

    <div class="list">
      <p class="when">{{ when }}</p>
      <article v-for="event in dayEvents" :key="event.id" class="event">
        <i />
        <span>
          <b>{{ event.title }}</b>
          <small>全天</small>
        </span>
      </article>
      <p v-if="!dayEvents.length" class="none">无日程</p>
    </div>

    <nav class="dock">
      <button type="button" class="on" @click="goToday">今天</button>
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

.month-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 10px 6px;
}

.month-head h2 {
  margin: 0;
}

.month-head button {
  width: 28px;
  color: #ff3b30;
  font-size: 28px;
  line-height: 1;
}

h2 {
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

.dot {
  width: 5px;
  height: 5px;
  margin-top: 2px;
  border-radius: 50%;
  background: #ff3b30;
}

.event {
  display: flex;
  gap: 8px;
  margin: 8px 0;
  padding: 8px 10px;
  border-radius: 10px;
  background: #fff;
}

.event i {
  width: 4px;
  border-radius: 2px;
  background: #ff3b30;
}

.event b,
.event small {
  display: block;
}

.event b {
  font-size: 16px;
  font-weight: 560;
}

.event small {
  margin-top: 2px;
  color: #8e8e93;
  font-size: 13px;
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
