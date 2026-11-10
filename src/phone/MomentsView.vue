<script setup>
import { ref } from 'vue'
import Avatar from './Avatar.vue'
import { usePhone } from './usePhone.js'

const phone = usePhone()
const { visibleMoments, pop } = phone
const solid = ref(false)

function onScroll(event) {
  solid.value = event.target.scrollTop > 120
}
</script>

<template>
  <section class="moments">
    <header :class="{ solid }">
      <button type="button" aria-label="返回" @click="pop">
        <svg viewBox="0 0 24 24"><path d="M15 4 7 12l8 8" /></svg>
      </button>
      <b>朋友圈</b>
      <span class="cam" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M4 8.5h3l1.4-2h7.2l1.4 2H20a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5z" /><circle cx="12" cy="13.5" r="3.2" /></svg>
      </span>
    </header>
    <div class="scroll" @scroll="onScroll">
      <div class="cover">
        <span class="cvn">{{ phone.story.contacts.me.name }}</span>
        <Avatar :contact="phone.story.contacts.me" :size="72" />
      </div>
      <article v-for="post in visibleMoments" :key="post.id">
        <Avatar :contact="phone.contactOf(post.contact)" :size="42" />
        <div class="body">
          <b>{{ phone.contactOf(post.contact).name }}</b>
          <p>{{ post.text }}</p>
          <i class="shot" :data-tone="post.tone" />
          <div class="foot">
            <time>{{ post.time }}</time>
            <span class="ops" aria-hidden="true">
              <svg viewBox="0 0 24 24"><circle cx="8" cy="12" r="1.6" /><circle cx="16" cy="12" r="1.6" /></svg>
            </span>
          </div>
        </div>
      </article>
      <p v-if="!visibleMoments.length" class="empty">还没有朋友圈</p>
    </div>
  </section>
</template>

<style scoped>
.moments {
  position: relative;
  height: 100%;
  background: #fff;
  color: #111;
}

header {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: calc(var(--safe-top) + 44px);
  padding-bottom: 10px;
  color: #fff;
}

header.solid {
  background: #ededed;
  color: #111;
  border-bottom: 0.5px solid #dcdcdc;
}

header b {
  font-size: 17px;
  font-weight: 650;
  opacity: 0;
}

header.solid b {
  opacity: 1;
}

header button,
.cam {
  position: absolute;
  bottom: 8px;
  width: 32px;
  display: grid;
  place-items: center;
}

header button {
  left: 8px;
}

.cam {
  right: 10px;
}

header svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.scroll {
  height: 100%;
  overflow: auto;
  padding-bottom: var(--safe-bottom);
}

.cover {
  position: relative;
  height: 280px;
  margin-bottom: 48px;
  background:
    radial-gradient(circle at 72% 28%, rgba(255, 214, 160, 0.85), transparent 18%),
    linear-gradient(180deg, #d49274 0%, #6d5a78 42%, #243044 100%);
}

.cvn {
  position: absolute;
  right: 100px;
  bottom: 12px;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
}

.cover :deep(.avatar) {
  position: absolute;
  right: 14px;
  bottom: -30px;
  border: 2px solid #fff;
  border-radius: 6px;
  font-size: 28px;
}

article {
  display: flex;
  gap: 10px;
  padding: 16px 14px 12px;
  border-bottom: 0.5px solid #ececec;
}

article :deep(.avatar) {
  border-radius: 4px;
}

.body {
  flex: 1;
  min-width: 0;
}

article b {
  color: #576b95;
  font-size: 16px;
  font-weight: 650;
}

article p {
  margin: 6px 0 0;
  font-size: 16px;
  line-height: 1.45;
  user-select: text;
}

.shot {
  display: block;
  width: 168px;
  height: 168px;
  margin-top: 10px;
  background: linear-gradient(160deg, #f0b48a, #6f86a8);
}

.shot[data-tone='night'] {
  background: linear-gradient(160deg, #243044, #0d1016);
}

.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}

time,
.empty {
  color: #999;
  font-size: 12px;
}

.ops {
  display: grid;
  place-items: center;
  width: 32px;
  height: 20px;
  border-radius: 4px;
  background: #f7f7f7;
  color: #576b95;
}

.ops svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.empty {
  display: block;
  margin-top: 24px;
  text-align: center;
}
</style>
