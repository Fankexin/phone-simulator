<script setup>
import { computed } from 'vue'
import Avatar from './Avatar.vue'
import { usePhone } from './usePhone.js'

const props = defineProps({
  threadId: { type: String, required: true },
  mode: { type: String, required: true },
  day: { type: String, default: '' },
})

const phone = usePhone()
const { pop } = phone
const thread = computed(() => phone.story.threads.find((item) => item.id === props.threadId))
const contact = computed(() => phone.contactOf(thread.value?.contact))
const me = computed(() => phone.contactOf('me'))
const onlyDay = '2023-11-23'
const year = 2023
const month = 11
const daysInMonth = 30
const lead = 3
const title = computed(() => {
  if (props.mode === 'date') return '按日期查找'
  if (props.mode === 'day') return contact.value?.name || '聊天记录'
  return '查找聊天内容'
})
const dayMessages = computed(() => phone.historyOf(props.threadId, props.day))
const cells = computed(() => {
  const list = Array.from({ length: lead }, () => null)
  for (let day = 1; day <= daysInMonth; day += 1) list.push(day)
  while (list.length % 7) list.push(null)
  return list
})

function dayKey(day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function pickDay(day) {
  const key = dayKey(day)
  if (key !== onlyDay) return
  phone.openFindDay(props.threadId, key)
}

function showTime(index) {
  const current = dayMessages.value[index]
  const previous = dayMessages.value[index - 1]
  return !previous || previous.time !== current.time
}
</script>

<template>
  <section class="find" :data-mode="mode">
    <header>
      <button type="button" aria-label="返回" @click="pop">
        <svg viewBox="0 0 24 24"><path d="M15 4 7 12l8 8" /></svg>
      </button>
      <b>{{ title }}</b>
      <span />
    </header>

    <div v-if="mode === 'find'" class="pane">
      <label class="search">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
        搜索
      </label>
      <div class="card">
        <button type="button" class="row" @click="phone.openFindDate(threadId)">
          <span>日期</span>
          <svg class="chev" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
        </button>
      </div>
    </div>

    <div v-else-if="mode === 'date'" class="pane cal">
      <div class="month">
        <b>{{ year }}年{{ month }}月</b>
      </div>
      <div class="week">
        <span v-for="label in ['日', '一', '二', '三', '四', '五', '六']" :key="label">{{ label }}</span>
      </div>
      <div class="grid">
        <button
          v-for="(day, index) in cells"
          :key="index"
          type="button"
          class="cell"
          :class="{ on: day && dayKey(day) === onlyDay, empty: !day, off: day && dayKey(day) !== onlyDay }"
          :disabled="!day || dayKey(day) !== onlyDay"
          @click="pickDay(day)"
        >
          <template v-if="day">{{ day }}</template>
        </button>
      </div>
      <p class="hint">仅可查看有记录的日期</p>
    </div>

    <div v-else class="pane day">
      <div class="log">
        <template v-for="(msg, index) in dayMessages" :key="msg.id">
          <p v-if="showTime(index)" class="stamp">{{ msg.time }}</p>
          <p v-if="msg.from === 'system'" class="system">{{ msg.text }}</p>
          <div v-else class="line" :class="{ me: msg.from === 'me' }">
            <button
              v-if="msg.from !== 'me'"
              type="button"
              class="face"
              aria-label="个人资料"
              @click="phone.openContact(thread.contact)"
            >
              <Avatar :contact="contact" :size="40" />
            </button>
            <p class="bubble">{{ msg.text }}</p>
            <button
              v-if="msg.from === 'me'"
              type="button"
              class="face"
              aria-label="个人资料"
              @click="phone.openContact('me')"
            >
              <Avatar :contact="me" :size="40" />
            </button>
          </div>
        </template>
        <p v-if="!dayMessages.length" class="empty">这一天没有聊天记录</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.find {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ededed;
  color: #111;
}

header {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex: none;
  height: calc(var(--safe-top) + 44px);
  padding-bottom: 10px;
  background: #ededed;
  border-bottom: 0.5px solid #dcdcdc;
}

header b {
  font-size: 17px;
  font-weight: 650;
}

header button,
header span {
  position: absolute;
  bottom: 8px;
  width: 32px;
}

header button {
  left: 8px;
}

header span {
  right: 8px;
}

header svg,
.search svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.pane {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding-bottom: var(--safe-bottom);
}

.search {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  margin: 10px;
  border-radius: 8px;
  background: #fff;
  color: #b2b2b2;
  font-size: 15px;
}

.search svg {
  width: 15px;
  height: 15px;
}

.card {
  margin-top: 8px;
  background: #fff;
  border-top: 0.5px solid #e5e5e5;
  border-bottom: 0.5px solid #e5e5e5;
}

.row {
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  padding: 0 16px;
  text-align: left;
  font-size: 17px;
}

.row span {
  flex: 1;
}

.chev {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: #c7c7cc;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.cal {
  background: #fff;
}

.month {
  padding: 18px 16px 8px;
  font-size: 17px;
}

.week,
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 8px;
}

.week span {
  height: 32px;
  display: grid;
  place-items: center;
  color: #8e8e93;
  font-size: 13px;
}

.cell {
  position: relative;
  height: 48px;
  display: grid;
  place-items: center;
  color: #c7c7cc;
  font-size: 17px;
}

.cell.empty {
  pointer-events: none;
}

.cell.off {
  color: #d1d1d6;
}

.cell.on {
  color: #07c160;
  font-weight: 700;
}

.cell.on::after {
  content: '';
  position: absolute;
  bottom: 8px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #07c160;
}

.hint {
  margin: 18px 16px 0;
  color: #8e8e93;
  font-size: 13px;
  text-align: center;
}

.day .log {
  padding: 12px 10px 20px;
}

.stamp,
.system {
  margin: 10px 0;
  text-align: center;
  color: #b2b2b2;
  font-size: 12px;
}

.line {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 12px 0;
}

.line.me {
  justify-content: flex-end;
}

.face {
  display: block;
  flex: none;
  padding: 0;
}

.bubble {
  position: relative;
  max-width: 72%;
  margin: 0;
  padding: 10px 12px;
  border-radius: 4px;
  background: #fff;
  font-size: 16px;
  line-height: 1.45;
  overflow-wrap: anywhere;
  user-select: text;
}

.bubble::before {
  content: '';
  position: absolute;
  top: 14px;
  left: -6px;
  border-width: 5px 6px 5px 0;
  border-style: solid;
  border-color: transparent #fff transparent transparent;
}

.me .bubble {
  background: #95ec69;
}

.me .bubble::before {
  left: auto;
  right: -6px;
  border-width: 5px 0 5px 6px;
  border-color: transparent transparent transparent #95ec69;
}

.line :deep(.avatar) {
  border-radius: 4px;
}

.empty {
  margin-top: 48px;
  color: #8e8e93;
  text-align: center;
}
</style>
