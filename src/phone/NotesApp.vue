<script setup>
import { computed, ref } from 'vue'
import { usePhone } from './usePhone.js'

const phone = usePhone()
const { visibleNotes, pop } = phone
const query = ref('')
const note = computed(() => phone.story.notes.find((item) => item.id === phone.route.value?.note))
const listed = computed(() =>
  visibleNotes.value.filter((item) => `${item.title}${item.body}`.includes(query.value.trim())),
)

function preview(body) {
  return body.replaceAll('\n', ' ')
}
</script>

<template>
  <section v-if="note" class="detail">
    <header class="bar">
      <button type="button" @click="pop">
        <svg viewBox="0 0 12 20"><path d="M10 2 2 10l8 8" /></svg>
        备忘录
      </button>
      <span />
      <button type="button" class="share" tabindex="-1" aria-label="共享">
        <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.4" /><circle cx="6" cy="12" r="2.4" /><circle cx="18" cy="19" r="2.4" /><path d="m8.2 13.1 7.5 4.2M15.7 6.7l-7.5 4.2" /></svg>
      </button>
    </header>
    <article>
      <time>{{ note.time }}</time>
      <h2>{{ note.title }}</h2>
      <p>{{ note.body }}</p>
    </article>
    <footer class="tools">
      <button type="button" tabindex="-1" aria-label="核对清单">
        <svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11" /><path d="m4 6 1.2 1.2L7.5 5M4 12l1.2 1.2L7.5 11M4 18l1.2 1.2L7.5 17" /></svg>
      </button>
      <button type="button" tabindex="-1" aria-label="相机">
        <svg viewBox="0 0 24 24"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.2" /></svg>
      </button>
      <button type="button" tabindex="-1" aria-label="涂鸦">
        <svg viewBox="0 0 24 24"><path d="M4 17c3-1 5 1 8-1s5-1 8 1" /><path d="M5 7h14" /></svg>
      </button>
      <button type="button" tabindex="-1" aria-label="新建">
        <svg viewBox="0 0 24 24"><path d="M14 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" /><path d="M14 4v5h5M12 12v5M9.5 14.5h5" /></svg>
      </button>
    </footer>
  </section>

  <section v-else class="list">
    <header class="hero">
      <button type="button" class="folders" tabindex="-1">
        <svg viewBox="0 0 12 20"><path d="M10 2 2 10l8 8" /></svg>
        文件夹
      </button>
      <button type="button" class="more" tabindex="-1" aria-label="更多">•••</button>
    </header>
    <div class="scroll">
      <h2>备忘录</h2>
      <label class="search">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
        <input v-model="query" placeholder="搜索" />
      </label>
      <p class="count">{{ listed.length }} 个备忘录</p>
      <div class="sheet">
        <button v-for="item in listed" :key="item.id" type="button" @click="phone.openNote(item.id)">
          <b>{{ item.title }}</b>
          <span><em>{{ item.time }}</em>{{ preview(item.body) }}</span>
        </button>
        <p v-if="!listed.length" class="empty">没有备忘录</p>
      </div>
    </div>
    <footer class="tools">
      <span />
      <button type="button" tabindex="-1" aria-label="新建备忘录">
        <svg viewBox="0 0 24 24"><path d="M14 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" /><path d="M14 4v5h5M12 12v5M9.5 14.5h5" /></svg>
      </button>
    </footer>
  </section>
</template>

<style scoped>
section {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f2f2f7;
  color: #111;
}

.hero,
.bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex: none;
  min-height: calc(var(--safe-top) + 36px);
  padding: var(--safe-top) 10px 8px;
  color: #ffcc00;
}

.folders,
.bar button {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: #ffcc00;
  font-size: 17px;
}

.folders svg,
.bar svg {
  width: 12px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.more {
  color: #ffcc00;
  font-size: 18px;
  letter-spacing: 1px;
}

.share svg {
  width: 22px;
  height: 22px;
  stroke-width: 1.7;
}

.scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: var(--call-gap, 0px) 16px calc(58px + var(--safe-bottom));
}

h2 {
  margin: 0 0 10px;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.search {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 10px;
  border-radius: 10px;
  background: rgba(118, 118, 128, 0.12);
  color: rgba(60, 60, 67, 0.6);
}

.search svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}

.search input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: #111;
  font-size: 17px;
  outline: none;
}

.count {
  margin: 14px 4px 8px;
  color: rgba(60, 60, 67, 0.6);
  font-size: 13px;
  font-weight: 600;
}

.sheet {
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
}

.sheet button {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 12px 14px;
  text-align: left;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.12);
}

.sheet button:last-child {
  border-bottom: 0;
}

.sheet b {
  font-size: 17px;
  font-weight: 650;
}

.sheet span {
  overflow: hidden;
  color: rgba(60, 60, 67, 0.6);
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sheet em {
  margin-right: 6px;
  font-style: normal;
  color: rgba(60, 60, 67, 0.75);
}

.empty {
  margin: 0;
  padding: 28px 16px;
  color: #8e8e93;
  text-align: center;
}

.detail {
  background: #fffef8;
}

article {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: calc(8px + var(--call-gap, 0px)) 18px calc(70px + var(--safe-bottom));
}

time {
  display: block;
  margin: 0 0 10px;
  color: rgba(60, 60, 67, 0.55);
  font-size: 13px;
  text-align: center;
}

article h2 {
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 700;
}

article p {
  margin: 0;
  font-size: 17px;
  line-height: 1.55;
  white-space: pre-wrap;
  user-select: text;
}

.tools {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: calc(50px + var(--safe-bottom));
  padding: 0 18px var(--safe-bottom);
  background: rgba(249, 249, 249, 0.94);
  border-top: 0.5px solid rgba(60, 60, 67, 0.18);
  backdrop-filter: blur(18px);
  color: #ffcc00;
}

.detail .tools {
  justify-content: space-around;
}

.tools button {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  color: #ffcc00;
}

.tools svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
