<script setup>
import { computed } from 'vue'
import { usePhone } from './usePhone.js'

const phone = usePhone()
const { pop } = phone
const list = computed(() => phone.story.favorites || [])

function shortDate(date) {
  const match = String(date || '').match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/)
  if (!match) return date || ''
  return `${match[1]}/${match[2]}/${match[3]}`
}
</script>

<template>
  <section class="page">
    <header>
      <button type="button" aria-label="返回" @click="pop">
        <svg viewBox="0 0 24 24"><path d="M15 4 7 12l8 8" /></svg>
      </button>
      <b>收藏</b>
    </header>
    <div class="scroll">
      <div v-for="entry in list" :key="entry.id" class="row">
        <span class="meta">
          <span class="line">
            <b>{{ entry.title }}</b>
            <time>{{ shortDate(entry.savedAt) }}</time>
          </span>
          <small>{{ entry.source || '公众号' }}</small>
        </span>
      </div>
      <p v-if="!list.length" class="empty">暂无收藏</p>
    </div>
  </section>
</template>

<style scoped>
.page {
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
  min-height: 44px;
  padding: var(--safe-top) 48px 10px;
  background: #ededed;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
}

header b {
  font-size: 17px;
  font-weight: 650;
}

header button {
  position: absolute;
  left: 4px;
  bottom: 4px;
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  color: #111;
}

header svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 0 24px;
  background: #fff;
}

.row {
  display: block;
  width: 100%;
  padding: 14px 16px;
  text-align: left;
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.06);
}

.meta {
  min-width: 0;
}

.line {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.line b {
  flex: 1;
  min-width: 0;
  display: -webkit-box;
  overflow: hidden;
  font-size: 16px;
  font-weight: 620;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.line time {
  flex: none;
  color: #8e8e93;
  font-size: 12px;
  line-height: 1.35;
  white-space: nowrap;
}

.meta small {
  display: block;
  margin-top: 6px;
  color: #8e8e93;
  font-size: 12px;
}

.empty {
  padding: 48px 16px;
  color: #8e8e93;
  text-align: center;
  font-size: 14px;
}

</style>
