<script setup>
import { computed, ref } from 'vue'
import Avatar from './Avatar.vue'
import { usePhone } from './usePhone.js'

const props = defineProps({
  contactId: { type: String, default: '' },
})

const phone = usePhone()
const { pop } = phone
const solid = ref(false)
const frames = ref({})

const ownerId = computed(() => props.contactId || 'me')
const owner = computed(() => phone.contactOf(ownerId.value))
const posts = computed(() =>
  props.contactId ? phone.momentsOf(props.contactId) : phone.visibleMoments.value,
)
const showCam = computed(() => !props.contactId)

function onScroll(event) {
  solid.value = event.target.scrollTop > 120
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function momentTime(post) {
  if (!post.at) return post.time || ''
  const date = new Date(post.at)
  if (Number.isNaN(date.getTime())) return post.time || ''
  const diff = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86400000)
  const clock = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
  if (diff <= 0) return clock
  if (diff === 1) return '昨天'
  if (date.getFullYear() === new Date().getFullYear()) return `${date.getMonth() + 1}月${date.getDate()}日`
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

function photosOf(post) {
  if (post.images?.length) return post.images
  if (post.image) return [post.image]
  return []
}

function onPhoto(event, id) {
  const { naturalWidth: width, naturalHeight: height } = event.target
  if (!width || !height) return
  const ratio = width / height
  const long = 220
  const wide = 180
  const frame = ratio >= 1
    ? { width: wide, height: Math.max(72, Math.round(wide / ratio)) }
    : { height: long, width: Math.max(72, Math.round(long * ratio)) }
  frames.value = { ...frames.value, [id]: { width: `${frame.width}px`, height: `${frame.height}px` } }
}
</script>

<template>
  <section class="moments">
    <header :class="{ solid }">
      <button type="button" aria-label="返回" @click="pop">
        <svg viewBox="0 0 24 24"><path d="M15 4 7 12l8 8" /></svg>
      </button>
      <b>朋友圈</b>
      <span v-if="showCam" class="cam" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M4 8.5h3l1.4-2h7.2l1.4 2H20a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5z" /><circle cx="12" cy="13.5" r="3.2" /></svg>
      </span>
      <span v-else />
    </header>
    <div class="scroll" @scroll="onScroll">
      <div class="cover">
        <img
          v-if="owner.cover"
          class="wall"
          :src="owner.cover"
          alt=""
          referrerpolicy="no-referrer"
        />
        <span class="cvn">{{ owner.name }}</span>
        <button type="button" class="face" aria-label="个人资料" @click="phone.openContact(ownerId)">
          <Avatar :contact="owner" :size="72" />
        </button>
      </div>
      <article v-for="post in posts" :key="post.id">
        <button type="button" class="face" aria-label="个人资料" @click="phone.openContact(post.contact)">
          <Avatar :contact="phone.contactOf(post.contact)" :size="42" />
        </button>
        <div class="body">
          <b>{{ phone.contactOf(post.contact).name }}</b>
          <p v-if="post.text">{{ post.text }}</p>
          <div v-if="photosOf(post).length > 1" class="album" :data-count="photosOf(post).length">
            <img
              v-for="(src, index) in photosOf(post)"
              :key="index"
              :src="src"
              alt=""
              referrerpolicy="no-referrer"
            />
          </div>
          <img
            v-else-if="photosOf(post).length === 1"
            class="photo"
            :src="photosOf(post)[0]"
            alt=""
            referrerpolicy="no-referrer"
            :style="frames[post.id]"
            @load="onPhoto($event, post.id)"
          />
          <i v-else-if="post.tone" class="shot" :data-tone="post.tone" />
          <div class="foot">
            <time>{{ momentTime(post) }}</time>
            <span class="ops" aria-hidden="true">
              <svg viewBox="0 0 24 24"><circle cx="8" cy="12" r="1.6" /><circle cx="16" cy="12" r="1.6" /></svg>
            </span>
          </div>
          <div v-if="post.likes?.length || post.comments?.length" class="react">
            <p v-if="post.likes?.length" class="likes">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 19.2s-6.4-3.9-6.4-8a3.6 3.6 0 0 1 6.4-2.2 3.6 3.6 0 0 1 6.4 2.2c0 4.1-6.4 8-6.4 8z" />
              </svg>
              <span>
                <template v-for="(id, index) in post.likes" :key="id">
                  <b>{{ phone.contactOf(id).name }}</b><template v-if="index < post.likes.length - 1">，</template>
                </template>
              </span>
            </p>
            <ul v-if="post.comments?.length" class="comments" :class="{ split: post.likes?.length }">
              <li v-for="(item, index) in post.comments" :key="index">
                <b>{{ phone.contactOf(item.from).name }}</b><template v-if="item.to"><em>回复</em><b>{{ phone.contactOf(item.to).name }}</b></template>：{{ item.text }}
              </li>
            </ul>
          </div>
        </div>
      </article>
      <p v-if="!posts.length" class="empty">还没有朋友圈</p>
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
  justify-content: space-between;
  height: calc(var(--safe-top) + 44px);
  padding: 0 8px 8px;
  color: #fff;
  pointer-events: none;
}

header.solid {
  color: #111;
  background: rgba(237, 237, 237, 0.94);
  border-bottom: 0.5px solid #d9d9d9;
  backdrop-filter: blur(18px);
  pointer-events: auto;
}

header button,
header .cam,
header > span:last-child {
  pointer-events: auto;
}

header button,
.cam,
header > span:last-child {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
}

header b {
  margin-bottom: 6px;
  font-size: 17px;
  font-weight: 600;
  opacity: 0;
}

header.solid b {
  opacity: 1;
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

.wall {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  clip-path: inset(0);
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

.cover .face {
  position: absolute;
  z-index: 1;
  right: 14px;
  bottom: -30px;
}

.cover :deep(.avatar) {
  border: 2px solid #fff;
  border-radius: 6px;
  font-size: 28px;
}

.face {
  display: block;
  padding: 0;
  flex: none;
}

article {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 16px 12px 14px 16px;
}

article :deep(.avatar) {
  border-radius: 4px;
}

.body {
  flex: 1;
  min-width: 0;
}

article b {
  display: block;
  color: #576b95;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;
}

article p {
  margin: 4px 0 0;
  color: #111;
  font-size: 16px;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-word;
  user-select: text;
}

.photo {
  display: block;
  margin-top: 8px;
  border-radius: 4px;
  object-fit: cover;
  background: #f2f2f2;
}

.album {
  display: grid;
  gap: 4px;
  width: min(100%, 248px);
  margin-top: 8px;
}

.album[data-count='2'],
.album[data-count='4'] {
  grid-template-columns: 1fr 1fr;
}

.album[data-count='3'],
.album[data-count='5'],
.album[data-count='6'],
.album[data-count='7'],
.album[data-count='8'],
.album[data-count='9'] {
  grid-template-columns: repeat(3, 1fr);
}

.album img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  background: #f2f2f2;
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
  color: #b2b2b2;
  font-size: 13px;
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

.react {
  position: relative;
  margin-top: 8px;
  padding: 5px 8px;
  border-radius: 3px;
  background: #f7f7f7;
}

.react::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 10px;
  border-right: 5px solid transparent;
  border-bottom: 5px solid #f7f7f7;
  border-left: 5px solid transparent;
}

article .likes {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin: 0;
  color: #576b95;
  font-size: 14px;
  line-height: 1.35;
  white-space: normal;
}

.likes svg {
  flex: none;
  width: 14px;
  height: 14px;
  margin-top: 2px;
  fill: none;
  stroke: #737373;
  stroke-width: 1.7;
  stroke-linejoin: round;
}

.likes b {
  display: inline;
  color: #576b95;
  font-size: 14px;
  font-weight: 400;
  line-height: inherit;
}

.comments {
  margin: 0;
  padding: 0;
  list-style: none;
  color: #111;
  font-size: 14px;
  line-height: 1.45;
}

.comments.split {
  margin-top: 5px;
  padding-top: 5px;
  border-top: 0.5px solid rgba(0, 0, 0, 0.08);
}

.comments li {
  word-break: break-word;
}

.comments b {
  display: inline;
  color: #576b95;
  font-size: 14px;
  font-weight: 400;
}

.comments em {
  margin: 0 2px;
  color: #111;
  font-style: normal;
}

.empty {
  display: block;
  margin-top: 24px;
  text-align: center;
}
</style>
