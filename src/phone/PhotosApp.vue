<script setup>
import { computed, ref } from 'vue'
import AppBar from './AppBar.vue'
import PhotoArt from './PhotoArt.vue'
import { usePhone } from './usePhone.js'

const phone = usePhone()
const pane = ref('library')
const code = ref('')
const wrong = ref(false)
const shakeKey = ref(0)
const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

const album = computed(() => phone.story.albums.find((item) => item.id === phone.route.value?.album))
const photo = computed(() => phone.story.photos.find((item) => item.id === phone.route.value?.photo))
const locked = computed(() => Boolean(album.value?.secret) && !phone.progress.unlocked[album.value.id])

const library = computed(() =>
  phone.story.albums.flatMap((item) => {
    if (item.secret && !phone.progress.unlocked[item.id]) return []
    return phone.photosIn(item.id)
  }),
)

function cover(albumId) {
  return phone.photosIn(albumId)[0]
}

function press(key) {
  if (!key) return
  wrong.value = false
  if (key === 'del') {
    code.value = code.value.slice(0, -1)
    return
  }
  if (code.value.length >= 4) return
  code.value += key
  if (code.value.length === 4) submit()
}

function submit() {
  const albumId = album.value?.id
  const attempt = code.value
  code.value = ''
  if (phone.tryUnlock(albumId, attempt)) {
    wrong.value = false
    return
  }
  wrong.value = true
  shakeKey.value += 1
}
</script>

<template>
  <section v-if="photo" class="viewer">
    <AppBar tone="dark" back="相册" :title="photo.title" />
    <PhotoArt class="frame" :photo="photo" />
    <p>{{ photo.caption }}</p>
  </section>

  <section v-else-if="album && locked" class="lock">
    <AppBar tone="ios" back="相簿" :title="album.title" />
    <div class="gate">
      <p class="hint">输入密码</p>
      <div :key="shakeKey" class="dots" :class="{ wrong }" aria-live="polite">
        <i v-for="index in 4" :key="index" :class="{ on: code.length >= index }" />
      </div>
      <p class="err">{{ wrong ? '密码不正确' : '' }}</p>
      <div class="pad">
        <button v-for="(key, index) in keys" :key="index" type="button" :disabled="!key" @click="press(key)">
          <b v-if="key && key !== 'del'">{{ key }}</b>
          <span v-else-if="key === 'del'">删除</span>
        </button>
      </div>
    </div>
  </section>

  <section v-else-if="album" class="grid-wrap">
    <AppBar tone="ios" back="相簿" :title="album.title" />
    <div class="grid">
      <button v-for="item in phone.photosIn(album.id)" :key="item.id" type="button" @click="phone.openPhoto(item.id)">
        <PhotoArt :photo="item" />
      </button>
      <p v-if="!phone.photosIn(album.id).length" class="empty">没有照片</p>
    </div>
  </section>

  <section v-else class="albums">
    <header class="hero">
      <div>
        <h2>{{ pane === 'library' ? '图库' : '相簿' }}</h2>
        <span v-if="pane === 'library'">{{ library.length }} 张照片</span>
      </div>
      <button type="button" class="select" tabindex="-1">选择</button>
    </header>

    <div v-if="pane === 'library'" class="grid library">
      <p class="day">最近项目</p>
      <button v-for="item in library" :key="item.id" type="button" @click="phone.openPhoto(item.id)">
        <PhotoArt :photo="item" />
      </button>
    </div>

    <div v-else class="list">
      <p class="group">我的相簿</p>
      <div class="sheet">
        <button v-for="item in phone.story.albums" :key="item.id" type="button" @click="phone.openAlbum(item.id)">
          <span class="cover">
            <PhotoArt v-if="cover(item.id) && !(item.secret && !phone.progress.unlocked[item.id])" :photo="cover(item.id)" />
            <span v-else-if="item.secret" class="seal">
              <svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
            </span>
          </span>
          <span class="meta">
            <b>{{ item.title }}</b>
            <small>{{ item.secret && !phone.progress.unlocked[item.id] ? '已锁定' : `${phone.photosIn(item.id).length}` }}</small>
          </span>
          <svg class="chev" viewBox="0 0 12 20"><path d="M3 2l7 8-7 8" /></svg>
        </button>
      </div>
    </div>

    <nav class="tabs">
      <button type="button" :class="{ on: pane === 'library' }" @click="pane = 'library'">
        <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="m21 16-4.5-4.5L8 20" /></svg>
        <span>图库</span>
      </button>
      <button type="button" tabindex="-1">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 10h.01M15 10h.01" /></svg>
        <span>为你推荐</span>
      </button>
      <button type="button" :class="{ on: pane === 'albums' }" @click="pane = 'albums'">
        <svg viewBox="0 0 24 24"><rect x="4" y="5" width="12" height="12" rx="2" /><path d="M8 19h10a2 2 0 0 0 2-2V7" /></svg>
        <span>相簿</span>
      </button>
      <button type="button" tabindex="-1">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
        <span>搜索</span>
      </button>
    </nav>
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

.hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex: none;
  padding: calc(var(--safe-top) + 8px) 16px 10px;
  background: #f2f2f7;
}

.hero h2 {
  margin: 0;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.hero span {
  display: block;
  margin-top: 2px;
  color: rgba(60, 60, 67, 0.6);
  font-size: 15px;
}

.select {
  color: #007aff;
  font-size: 17px;
}

.list,
.grid,
.viewer {
  min-height: 0;
}

.list {
  flex: 1;
  overflow: auto;
  padding: var(--call-gap, 0px) 16px calc(70px + var(--safe-bottom));
}

.group {
  margin: 8px 4px;
  color: rgba(60, 60, 67, 0.6);
  font-size: 13px;
  font-weight: 600;
}

.sheet {
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
}

.list button {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.12);
}

.list button:last-child {
  border-bottom: 0;
}

.cover {
  width: 64px;
  height: 64px;
  overflow: hidden;
  border-radius: 6px;
  background: #e5e5ea;
}

.seal {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: #8e8e93;
  background: #ececef;
}

.seal svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
}

.meta {
  flex: 1;
  min-width: 0;
}

.meta b,
.meta small {
  display: block;
}

.meta b {
  font-size: 17px;
  font-weight: 500;
}

.meta small {
  margin-top: 3px;
  color: rgba(60, 60, 67, 0.6);
  font-size: 15px;
}

.chev {
  width: 8px;
  height: 14px;
  fill: none;
  stroke: #c7c7cc;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  align-content: start;
  overflow: auto;
  padding-top: var(--call-gap, 0px);
  padding-bottom: calc(70px + var(--safe-bottom));
  background: #fff;
}

.library .day {
  grid-column: 1 / -1;
  margin: 12px 16px 8px;
  color: #111;
  font-size: 20px;
  font-weight: 700;
  text-align: left;
}

.grid button {
  width: 100%;
  aspect-ratio: 1;
  padding: 0;
}

.grid :deep(.art) {
  height: 100%;
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
  gap: 2px;
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

.empty,
.hint,
.err {
  color: #8e8e93;
  text-align: center;
}

.lock {
  background: #f2f2f7;
}

.gate {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: calc(36px + var(--call-gap, 0px));
}

.hint {
  margin: 0;
  color: #111;
  font-size: 17px;
}

.dots {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 22px;
}

.dots i {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #111;
}

.dots i.on {
  background: #111;
}

.dots.wrong {
  animation: shake 0.35s linear;
}

.err {
  height: 24px;
  margin: 12px 0 0;
  color: #ff3b30;
  font-size: 14px;
}

.pad {
  display: grid;
  grid-template-columns: repeat(3, 76px);
  justify-content: center;
  gap: 16px 22px;
  margin-top: 28px;
  padding-bottom: var(--safe-bottom);
}

.pad button {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: #fff;
  color: #111;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

.pad b {
  font-size: 32px;
  font-weight: 400;
}

.pad span {
  font-size: 16px;
}

.pad button:disabled {
  visibility: hidden;
}

.viewer {
  background: #000;
  color: #fff;
}

.frame {
  flex: 1;
  min-height: 0;
  margin: calc(8px + var(--call-gap, 0px)) 0 8px;
  overflow: hidden;
}

.viewer p {
  margin: 0;
  padding: 0 24px calc(16px + var(--safe-bottom));
  font-size: 15px;
  line-height: 1.5;
  text-align: center;
  user-select: text;
}

.grid-wrap {
  background: #fff;
}

@keyframes shake {
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(3px); }
}
</style>
