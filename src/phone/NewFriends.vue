<script setup>
import Avatar from './Avatar.vue'
import { usePhone } from './usePhone.js'

const phone = usePhone()
const { pop } = phone

const label = {
  pending: '未通过',
}
</script>

<template>
  <section class="page">
    <header>
      <button type="button" aria-label="返回" @click="pop">
        <svg viewBox="0 0 24 24"><path d="M15 4 7 12l8 8" /></svg>
      </button>
      <b>新的朋友</b>
    </header>
    <div class="scroll">
      <p class="group">更早</p>
      <article v-for="item in phone.story.requests" :key="item.id">
        <button type="button" class="face" aria-label="个人资料" @click="phone.openContact(item.contact)">
          <Avatar :contact="phone.contactOf(item.contact)" :size="42" />
        </button>
        <span class="who">
          <b>{{ phone.contactOf(item.contact).name }}</b>
          <small>{{ item.message }}</small>
        </span>
        <em>{{ label[item.status] || '未通过' }}</em>
      </article>
      <p v-if="!phone.story.requests?.length" class="empty">没有新的朋友</p>
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
  flex: none;
  height: calc(var(--safe-top) + 44px);
  padding-bottom: 10px;
  background: #ededed;
  font-size: 17px;
}

header b {
  font-weight: 650;
}

header button {
  position: absolute;
  left: 8px;
  bottom: 6px;
  width: 32px;
  height: 32px;
  color: #111;
}

header svg {
  width: 22px;
  height: 22px;
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
}

.group {
  margin: 0;
  padding: 6px 16px;
  color: #888;
  font-size: 14px;
}

article {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #fff;
}

.face {
  display: block;
  flex: none;
  padding: 0;
}

article :deep(.avatar) {
  border-radius: 4px;
}

.who {
  flex: 1;
  min-width: 0;
}

.who b,
.who small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.who b {
  font-size: 16px;
  font-weight: 500;
}

.who small {
  margin-top: 3px;
  color: #888;
  font-size: 13px;
}

em {
  flex: none;
  color: #b2b2b2;
  font-size: 14px;
  font-style: normal;
}

.empty {
  margin: 48px 0;
  color: #888;
  text-align: center;
}
</style>
