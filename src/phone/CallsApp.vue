<script setup>
import { computed, ref } from 'vue'
import Avatar from './Avatar.vue'
import { usePhone } from './usePhone.js'
import arrowIn from '../images/calls/arrow-in.svg'
import arrowOut from '../images/calls/arrow-out.svg'

const phone = usePhone()
const filter = ref('all')
const tab = ref('recent')
const calls = computed(() =>
  phone.story.calls.filter((item) => filter.value === 'all' || item.direction === 'missed'),
)
const contacts = computed(() =>
  Object.entries(phone.story.contacts)
    .filter(([id]) => id !== 'me')
    .map(([, contact]) => contact),
)

function label(call) {
  if (call.direction === 'missed') return '未接来电'
  if (call.direction === 'out') return '去电'
  return '来电'
}

function arrowOf(direction) {
  return direction === 'out' ? arrowOut : arrowIn
}
</script>

<template>
  <section class="phone">
    <header class="top">
      <h1>{{ tab === 'contacts' ? '通讯录' : tab === 'voicemail' ? '语音留言' : '最近通话' }}</h1>
      <button v-if="tab === 'recent'" type="button" class="edit" tabindex="-1">编辑</button>
    </header>

    <div v-if="tab === 'recent'" class="segment">
      <button type="button" :class="{ on: filter === 'all' }" @click="filter = 'all'">全部</button>
      <button type="button" :class="{ on: filter === 'missed' }" @click="filter = 'missed'">未接来电</button>
    </div>

    <ul v-if="tab === 'recent'" class="list">
      <li v-for="call in calls" :key="call.id" :class="{ missed: call.direction === 'missed' }">
        <Avatar :contact="phone.contactOf(call.contact)" :size="40" round />
        <span class="copy">
          <b>{{ phone.contactOf(call.contact).name }}</b>
          <small>
            <img class="kind" :class="{ red: call.direction === 'missed' }" :src="arrowOf(call.direction)" alt="" />
            {{ label(call) }}
            <template v-if="call.detail"> · {{ call.detail }}</template>
          </small>
        </span>
        <time>{{ call.time }}</time>
        <button type="button" class="info" tabindex="-1" aria-label="信息">ⓘ</button>
      </li>
      <li v-if="!calls.length" class="empty">没有通话记录</li>
    </ul>

    <ul v-else-if="tab === 'contacts'" class="list contacts">
      <li v-for="contact in contacts" :key="contact.name">
        <Avatar :contact="contact" :size="40" round />
        <span class="copy"><b>{{ contact.name }}</b></span>
      </li>
    </ul>

    <div v-else class="blank">
      <p>没有语音留言</p>
    </div>

    <nav class="tabs">
      <button type="button" tabindex="-1">
        <svg viewBox="0 0 24 24"><path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.5 7.2 19l.9-5.4L4.2 9.7l5.4-.8z" /></svg>
        <span>个人收藏</span>
      </button>
      <button type="button" :class="{ on: tab === 'recent' }" @click="tab = 'recent'">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>
        <span>最近通话</span>
      </button>
      <button type="button" :class="{ on: tab === 'contacts' }" @click="tab = 'contacts'">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2" /><path d="M6.5 18.5c1.4-3 3.5-4.5 5.5-4.5s4.1 1.5 5.5 4.5" /></svg>
        <span>通讯录</span>
      </button>
      <button type="button" tabindex="-1">
        <svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>
        <span>拨号键盘</span>
      </button>
      <button type="button" :class="{ on: tab === 'voicemail' }" @click="tab = 'voicemail'">
        <svg viewBox="0 0 24 24"><circle cx="8" cy="12" r="3" /><circle cx="16" cy="12" r="3" /><path d="M11 12h2" /></svg>
        <span>语音留言</span>
      </button>
    </nav>
  </section>
</template>

<style scoped>
.phone {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #111;
}

.top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: calc(var(--safe-top) + 4px) 16px 6px;
}

h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.edit {
  color: #007aff;
  font-size: 17px;
}

.segment {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  margin: 8px 16px 4px;
  padding: 2px;
  border-radius: 9px;
  background: rgba(118, 118, 128, 0.12);
}

.segment button {
  height: 30px;
  border-radius: 7px;
  color: #111;
  font-size: 13px;
  font-weight: 560;
}

.segment .on {
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.list {
  flex: 1;
  margin: 0;
  padding: 0 0 calc(58px + var(--safe-bottom));
  overflow: auto;
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.12);
}

.copy {
  flex: 1;
  min-width: 0;
}

b,
small {
  display: block;
}

b {
  font-size: 17px;
  font-weight: 560;
}

small,
time {
  color: #8e8e93;
  font-size: 14px;
}

small {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
}

.kind {
  width: 12px;
  height: 12px;
  flex: none;
  object-fit: contain;
  opacity: 0.55;
}

.kind.red {
  opacity: 1;
  filter: invert(35%) sepia(92%) saturate(2876%) hue-rotate(346deg) brightness(101%) contrast(101%);
}

.missed b {
  color: #ff3b30;
}

.info {
  color: #007aff;
  font-size: 20px;
  line-height: 1;
}

.empty,
.blank {
  color: #8e8e93;
  text-align: center;
}

.empty {
  justify-content: center;
  border: 0;
  padding-top: 48px;
}

.blank {
  flex: 1;
  display: grid;
  place-items: center;
  padding-bottom: calc(58px + var(--safe-bottom));
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
  background: rgba(249, 249, 249, 0.94);
  border-top: 0.5px solid rgba(60, 60, 67, 0.18);
  backdrop-filter: blur(18px);
}

.tabs button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  color: #8e8e93;
  font-size: 10px;
}

.tabs .on {
  color: #007aff;
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
