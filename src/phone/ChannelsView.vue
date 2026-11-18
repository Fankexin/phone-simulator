<script setup>
import { computed } from 'vue'
import { usePhone } from './usePhone.js'

const phone = usePhone()
const { pop } = phone

const list = computed(() => phone.story.channels?.likes || [])
</script>

<template>
  <section class="page">
    <header class="bar">
      <button type="button" aria-label="返回" @click="pop">
        <svg viewBox="0 0 24 24"><path d="M15 4 7 12l8 8" /></svg>
      </button>
      <nav class="tabs">
        <button type="button" class="on">赞和收藏</button>
        <button type="button" tabindex="-1">最近看过</button>
      </nav>
      <div class="tools">
        <button type="button" aria-label="搜索" tabindex="-1">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m16 16 3.8 3.8" /></svg>
        </button>
        <button type="button" aria-label="更多" tabindex="-1">
          <svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
        </button>
      </div>
    </header>

    <div class="filters">
      <button type="button" class="chip on">全部</button>
      <button type="button" class="icon" tabindex="-1" aria-label="收藏">
        <svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-9.2A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7 3.6C19 15.6 12 20 12 20z" /></svg>
      </button>
      <button type="button" class="icon" tabindex="-1" aria-label="点赞">
        <svg viewBox="0 0 24 24"><path d="M8 20h9.2a2 2 0 0 0 1.9-1.4l1.4-5A1.6 1.6 0 0 0 19 11.5H14l.8-3.6a1.6 1.6 0 0 0-3-.9L8.5 12.5V20zM8 20H5.5A1.5 1.5 0 0 1 4 18.5v-5A1.5 1.5 0 0 1 5.5 12H8" /></svg>
      </button>
      <button type="button" class="icon" tabindex="-1" aria-label="商品">
        <svg viewBox="0 0 24 24"><path d="M4 8h16l-1.2 11.2A2 2 0 0 1 16.8 21H7.2a2 2 0 0 1-2-1.8L4 8zm4-3.5A4 4 0 0 1 12 2a4 4 0 0 1 4 2.5" /></svg>
      </button>
    </div>

    <div class="scroll">
      <div class="grid">
        <article v-for="entry in list" :key="entry.id" class="card">
          <span class="thumb">
            <img :src="entry.cover" alt="" referrerpolicy="no-referrer" />
            <em>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-9.2A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7 3.6C19 15.6 12 20 12 20z" /></svg>
              {{ entry.likes || '0' }}
            </em>
          </span>
          <span class="title">{{ entry.title }}</span>
          <span class="author">
            <i :style="{ background: entry.color || '#b0b0b0' }">{{ entry.initial || '讯' }}</i>
            <small>{{ entry.author || '视频号' }}</small>
          </span>
        </article>
      </div>
      <p v-if="!list.length" class="empty">暂无内容</p>
    </div>
  </section>
</template>

<style scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f7f7f7;
  color: #111;
}

.bar {
  position: relative;
  display: grid;
  grid-template-columns: 40px 1fr auto;
  align-items: flex-end;
  min-height: 44px;
  padding: var(--safe-top) 8px 8px;
  background: #f7f7f7;
}

.bar > button:first-child {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  color: #111;
}

.bar > button:first-child svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 22px;
  padding-bottom: 2px;
}

.tabs button {
  position: relative;
  padding: 8px 0;
  color: #888;
  font-size: 16px;
}

.tabs button.on {
  color: #111;
  font-weight: 650;
}

.tabs button.on::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 18px;
  height: 2.5px;
  border-radius: 99px;
  background: #111;
  transform: translateX(-50%);
}

.tools {
  display: flex;
  gap: 2px;
  padding-bottom: 2px;
}

.tools button {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  color: #111;
}

.tools svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.tools button:last-child svg {
  fill: currentColor;
  stroke: none;
}

.filters {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 10px;
}

.chip {
  height: 30px;
  padding: 0 14px;
  border-radius: 8px;
  background: #ebebeb;
  color: #111;
  font-size: 13px;
  font-weight: 560;
}

.filters .icon {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #ebebeb;
  color: #666;
}

.filters .icon svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 10px calc(var(--safe-bottom) + 16px);
}

.grid {
  column-count: 2;
  column-gap: 8px;
}

.card {
  display: block;
  width: 100%;
  margin: 0 0 8px;
  padding: 0 0 10px;
  overflow: hidden;
  break-inside: avoid;
  border-radius: 10px;
  background: #fff;
  text-align: left;
}

.thumb {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  background: #ddd;
}

.thumb img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  display: block;
}

.thumb em {
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: #fff;
  font-style: normal;
  font-size: 12px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
}

.thumb em svg {
  width: 13px;
  height: 13px;
  fill: #fff;
  stroke: none;
}

.title {
  display: -webkit-box;
  margin: 8px 8px 0;
  overflow: hidden;
  color: #111;
  font-size: 14px;
  font-weight: 650;
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.author {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 8px 8px 0;
}

.author i {
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border-radius: 99px;
  color: #fff;
  font-style: normal;
  font-size: 9px;
  font-weight: 700;
}

.author small {
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
