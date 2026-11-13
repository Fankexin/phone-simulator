<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import AppBar from './AppBar.vue'
import PhotoArt from './PhotoArt.vue'
import { usePhone } from './usePhone.js'

const phone = usePhone()
const pane = ref('library')
const code = ref('')
const wrong = ref(false)
const shakeKey = ref(0)
const libraryScrolled = ref(false)
const albumScrolled = ref(false)
const chromeOn = ref(true)
const dragX = ref(0)
const dragging = ref(false)
const gliding = ref(false)
const index = ref(0)
const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

let startX = 0
let startY = 0
let axis = ''
let glideTimer = 0

const album = computed(() => phone.story.albums.find((item) => item.id === phone.route.value?.album))
const photo = computed(() => phone.story.photos.find((item) => item.id === phone.route.value?.photo))
const locked = computed(() => Boolean(album.value?.secret) && !phone.progress.unlocked[album.value.id])

const library = computed(() =>
  phone.story.albums.flatMap((item) => {
    if (item.secret && !phone.progress.unlocked[item.id]) return []
    return phone.photosIn(item.id)
  }),
)

const peers = computed(() => {
  const prev = phone.progress.stack[phone.progress.stack.length - 2]
  if (prev?.album) return phone.photosIn(prev.album)
  return library.value
})

const current = computed(() => peers.value[index.value] || photo.value)
const prevPhoto = computed(() => peers.value[index.value - 1])
const nextPhoto = computed(() => peers.value[index.value + 1])
const backLabel = computed(() => {
  const prev = phone.progress.stack[phone.progress.stack.length - 2]
  if (!prev?.album) return '图库'
  return phone.story.albums.find((item) => item.id === prev.album)?.title || '相簿'
})

const reelStyle = computed(() => ({
  transform: `translate3d(${dragX.value}px, 0, 0)`,
  transition: gliding.value ? 'transform 0.28s ease' : 'none',
}))

watch(
  () => photo.value?.id,
  (id) => {
    window.clearTimeout(glideTimer)
    gliding.value = false
    dragging.value = false
    dragX.value = 0
    axis = ''
    if (!id) return
    const found = peers.value.findIndex((item) => item.id === id)
    index.value = found < 0 ? 0 : found
    chromeOn.value = true
  },
  { immediate: true },
)

watch(
  () => album.value?.id,
  () => {
    albumScrolled.value = false
    code.value = ''
    wrong.value = false
  },
)

function cover(albumId) {
  return phone.photosIn(albumId)[0]
}

function onLibraryScroll(event) {
  libraryScrolled.value = event.target.scrollTop > 32
}

function onAlbumScroll(event) {
  albumScrolled.value = event.target.scrollTop > 32
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

function down(event) {
  if (gliding.value) return
  dragging.value = true
  axis = ''
  startX = event.clientX
  startY = event.clientY
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

function move(event) {
  if (!dragging.value || gliding.value) return
  const dx = event.clientX - startX
  const dy = event.clientY - startY
  if (!axis) {
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
    axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
  }
  if (axis !== 'x') return
  const blocked = (dx > 0 && !prevPhoto.value) || (dx < 0 && !nextPhoto.value)
  dragX.value = blocked ? dx * 0.32 : dx
}

function up(event) {
  if (!dragging.value) return
  dragging.value = false
  const dx = event.clientX - startX
  const dy = event.clientY - startY
  if (!axis && Math.abs(dx) < 8 && Math.abs(dy) < 8) {
    chromeOn.value = !chromeOn.value
    dragX.value = 0
    return
  }
  const dir = axis === 'x' && dx < -56 ? 1 : axis === 'x' && dx > 56 ? -1 : 0
  if (dir && peers.value[index.value + dir]) {
    const width = event.currentTarget.offsetWidth || 1
    gliding.value = true
    dragX.value = dir * -width
    window.clearTimeout(glideTimer)
    glideTimer = window.setTimeout(() => {
      gliding.value = false
      index.value += dir
      dragX.value = 0
    }, 280)
    return
  }
  gliding.value = true
  dragX.value = 0
  window.clearTimeout(glideTimer)
  glideTimer = window.setTimeout(() => {
    gliding.value = false
  }, 280)
}

onBeforeUnmount(() => window.clearTimeout(glideTimer))
</script>

<template>
  <div class="photos">
    <section v-if="photo" class="viewer">
      <div class="reel" :style="reelStyle" @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up">
        <div v-if="prevPhoto" :key="prevPhoto.id" class="cell prev">
          <PhotoArt :photo="prevPhoto" />
        </div>
        <div v-if="current" :key="current.id" class="cell">
          <PhotoArt :photo="current" />
        </div>
        <div v-if="nextPhoto" :key="nextPhoto.id" class="cell next">
          <PhotoArt :photo="nextPhoto" />
        </div>
      </div>
      <header class="chrome topbar" :class="{ off: !chromeOn }">
        <button type="button" @click="phone.pop()">
          <svg viewBox="0 0 12 20" aria-hidden="true">
            <path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ backLabel }}
        </button>
      </header>
      <footer class="chrome tools" :class="{ off: !chromeOn }">
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 15V4M8 8l4-4 4 4" /><path d="M5 13v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6" /></svg>
        </span>
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M12 19s-6.5-4.1-6.5-8.2A3.4 3.4 0 0 1 12 8.2a3.4 3.4 0 0 1 6.5 2.6C18.5 14.9 12 19 12 19z" /></svg>
        </span>
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M12 11v5M12 8h.01" /></svg>
        </span>
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 7h14M9 7V5h6v2M8 7l.7 12h6.6L16 7" /></svg>
        </span>
      </footer>
    </section>

    <section v-else-if="album && locked" class="lock">
      <AppBar tone="ios" back="相簿" :title="album.title" />
      <div class="gate">
        <p class="hint">输入密码</p>
        <div :key="shakeKey" class="dots" :class="{ wrong }" aria-live="polite">
          <i v-for="n in 4" :key="n" :class="{ on: code.length >= n }" />
        </div>
        <p class="err">{{ wrong ? '密码不正确' : '' }}</p>
        <div class="pad">
          <button v-for="(key, keyIndex) in keys" :key="keyIndex" type="button" :disabled="!key" @click="press(key)">
            <b v-if="key && key !== 'del'">{{ key }}</b>
            <span v-else-if="key === 'del'">删除</span>
          </button>
        </div>
      </div>
    </section>

    <section v-else-if="album" class="browser">
      <header class="nav" :class="{ stuck: albumScrolled }">
        <span class="side">
          <button type="button" class="back" @click="phone.pop()">
            <svg viewBox="0 0 12 20" aria-hidden="true">
              <path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            相簿
          </button>
        </span>
        <b>{{ album.title }}</b>
        <span class="side end">
          <button type="button" class="select" tabindex="-1">选择</button>
        </span>
      </header>
      <div class="scroller" @scroll="onAlbumScroll">
        <h2>{{ album.title }}</h2>
        <p class="count">{{ phone.photosIn(album.id).length }}张照片</p>
        <p v-if="!phone.photosIn(album.id).length" class="empty">没有照片</p>
        <div v-else class="grid">
          <button v-for="item in phone.photosIn(album.id)" :key="item.id" type="button" @click="phone.openPhoto(item.id)">
            <PhotoArt :photo="item" />
          </button>
        </div>
      </div>
    </section>

    <section v-show="!photo && !album" class="browser home">
      <header class="nav" :class="{ stuck: libraryScrolled }">
        <span class="side" />
        <b>{{ pane === 'library' ? '图库' : '相簿' }}</b>
        <span class="side end">
          <button v-if="pane === 'library'" type="button" class="select" tabindex="-1">选择</button>
        </span>
      </header>
      <div class="scroller" @scroll="onLibraryScroll">
        <h2>{{ pane === 'library' ? '图库' : '相簿' }}</h2>

        <div v-if="pane === 'library'" class="grid library">
          <button v-for="item in library" :key="item.id" type="button" @click="phone.openPhoto(item.id)">
            <PhotoArt :photo="item" />
          </button>
        </div>

        <div v-else class="mine">
          <div class="mine-head">
            <p>我的相簿</p>
            <button type="button" tabindex="-1" aria-label="新建相簿">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
            </button>
          </div>
          <div class="cards">
            <button v-for="item in phone.story.albums" :key="item.id" type="button" class="card" @click="phone.openAlbum(item.id)">
              <span class="cover">
                <PhotoArt v-if="cover(item.id) && !(item.secret && !phone.progress.unlocked[item.id])" :photo="cover(item.id)" />
                <span v-else class="seal">
                  <svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
                </span>
              </span>
              <b>{{ item.title }}</b>
              <small>{{ item.secret && !phone.progress.unlocked[item.id] ? '已锁定' : phone.photosIn(item.id).length }}</small>
            </button>
          </div>
        </div>
      </div>

      <nav class="tabs">
        <button type="button" :class="{ on: pane === 'library' }" @click="pane = 'library'">
          <svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2" /><circle cx="9" cy="10.5" r="1.6" /><path d="m20.5 16-4.2-4.2L8.5 19" /></svg>
          <span>图库</span>
        </button>
        <button type="button" tabindex="-1">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M8.2 14.2s1.4 1.8 3.8 1.8 3.8-1.8 3.8-1.8M9 10h.01M15 10h.01" /></svg>
          <span>为你推荐</span>
        </button>
        <button type="button" :class="{ on: pane === 'albums' }" @click="pane = 'albums'">
          <svg viewBox="0 0 24 24"><rect x="7" y="7" width="12" height="12" rx="2" /><path d="M5 15V6.5A1.5 1.5 0 0 1 6.5 5H15" /></svg>
          <span>相簿</span>
        </button>
        <button type="button" tabindex="-1">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
          <span>搜索</span>
        </button>
      </nav>
    </section>
  </div>
</template>

<style scoped>
.photos,
.browser,
.lock,
.viewer {
  height: 100%;
}

.browser,
.lock {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #000;
}

.nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: flex-end;
  flex: none;
  height: calc(var(--safe-top) + var(--call-gap, 0px) + 44px);
  padding: calc(var(--safe-top) + var(--call-gap, 0px)) 8px 0 6px;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 0.5px solid transparent;
}

.nav.stuck {
  border-bottom-color: rgba(60, 60, 67, 0.29);
  backdrop-filter: blur(18px) saturate(1.4);
}

.side {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 44px;
}

.side.end {
  justify-content: flex-end;
  padding-right: 8px;
}

.nav b {
  margin-bottom: 12px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.3px;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.nav.stuck b {
  opacity: 1;
}

.back,
.select {
  min-height: 44px;
  color: #007aff;
  font-size: 17px;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  min-height: 44px;
  padding-right: 8px;
}

.back svg {
  width: 12px;
  height: 20px;
}

.scroller {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding-bottom: calc(12px + var(--safe-bottom));
}

.home .scroller {
  padding-bottom: calc(62px + var(--safe-bottom));
}

.scroller h2 {
  margin: 0;
  padding: 2px 16px 0;
  font-size: 34px;
  font-weight: 700;
  letter-spacing: 0.2px;
  line-height: 1.15;
}

.count {
  margin: 2px 0 8px;
  padding: 0 16px;
  color: rgba(60, 60, 67, 0.6);
  font-size: 15px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  margin-top: 8px;
  background: #fff;
}

.grid.library {
  margin-top: 12px;
}

.grid button {
  aspect-ratio: 1;
  padding: 0;
  overflow: hidden;
}

.grid :deep(.art),
.cover :deep(.art) {
  height: 100%;
}

.grid :deep(img),
.cover :deep(img) {
  pointer-events: none;
  -webkit-user-drag: none;
}

.mine-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 16px 12px;
}

.mine-head p {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.mine-head button {
  width: 28px;
  height: 28px;
  color: #007aff;
}

.mine-head svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
}

.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 14px;
  padding: 0 16px 8px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  text-align: left;
}

.cover {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  background: #e5e5ea;
  box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.12);
}

.card b,
.card small {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card b {
  margin-top: 6px;
  font-size: 16px;
  font-weight: 400;
}

.card small {
  margin-top: 1px;
  color: #8e8e93;
  font-size: 13px;
}

.seal {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: #8e8e93;
}

.seal svg {
  width: 28px;
  height: 28px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
}

.tabs {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  height: calc(49px + var(--safe-bottom));
  padding: 5px 0 var(--safe-bottom);
  background: rgba(249, 249, 249, 0.9);
  border-top: 0.5px solid rgba(60, 60, 67, 0.29);
  backdrop-filter: blur(22px) saturate(1.6);
}

.tabs button {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: #8e8e93;
  font-size: 10px;
  letter-spacing: -0.1px;
}

.tabs .on {
  color: #007aff;
}

.tabs svg {
  width: 25px;
  height: 25px;
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

.empty {
  margin: 48px 16px;
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
  position: relative;
  overflow: hidden;
  background: #000;
  color: #fff;
  touch-action: none;
  user-select: none;
}

.reel {
  position: absolute;
  inset: 0;
}

.cell {
  position: absolute;
  inset: 0;
  background: #000;
}

.cell.prev {
  transform: translateX(-100%);
}

.cell.next {
  transform: translateX(100%);
}

.cell :deep(.art) {
  height: 100%;
}

.cell :deep(img) {
  object-fit: contain;
  background: #000;
  pointer-events: none;
  -webkit-user-drag: none;
}

.chrome {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 2;
  transition: opacity 0.2s ease;
}

.chrome.off {
  opacity: 0;
  pointer-events: none;
}

.topbar {
  top: 0;
  display: flex;
  align-items: flex-end;
  height: calc(var(--safe-top) + var(--call-gap, 0px) + 44px);
  padding: calc(var(--safe-top) + var(--call-gap, 0px)) 8px 0;
  background: rgba(22, 22, 22, 0.55);
  backdrop-filter: blur(22px) saturate(1.4);
}

.topbar button {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  min-height: 44px;
  padding: 0 6px;
  color: #fff;
  font-size: 17px;
}

.topbar svg {
  width: 12px;
  height: 20px;
}

.tools {
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: calc(49px + var(--safe-bottom));
  padding: 0 8px var(--safe-bottom);
  background: rgba(22, 22, 22, 0.55);
  backdrop-filter: blur(22px) saturate(1.4);
}

.tools svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: #fff;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@keyframes shake {
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(3px); }
}
</style>
