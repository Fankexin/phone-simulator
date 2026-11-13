<script setup>
import { computed } from 'vue'
import Avatar from './Avatar.vue'
import { usePhone } from './usePhone.js'

const props = defineProps({
  contactId: { type: String, required: true },
})

const phone = usePhone()
const { pop } = phone
const contact = computed(() => phone.contactOf(props.contactId))
const previews = computed(() =>
  phone
    .momentsOf(props.contactId)
    .flatMap((post) => {
      if (post.images?.length) return post.images
      if (post.image) return [post.image]
      return []
    })
    .slice(0, 4),
)
</script>

<template>
  <section class="profile">
    <header>
      <button type="button" aria-label="返回" @click="pop">
        <svg viewBox="0 0 24 24"><path d="M15 4 7 12l8 8" /></svg>
      </button>
      <b />
      <span />
    </header>

    <div class="body">
      <div class="card head">
        <div class="who">
          <Avatar :contact="contact" :size="64" />
          <span>
            <b>{{ contact.name }}</b>
            <small>微信号：{{ contact.wxid || contact.name }}</small>
          </span>
        </div>
      </div>

      <div class="card">
        <button type="button" class="row moments" @click="phone.openMoments(contactId)">
          <span>朋友圈</span>
          <span class="shots">
            <img
              v-for="(src, index) in previews"
              :key="index"
              :src="src"
              alt=""
              referrerpolicy="no-referrer"
            />
          </span>
          <svg class="chev" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile {
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
.chev {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chev {
  width: 14px;
  height: 14px;
  color: #c7c7cc;
}

.body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 0 0 calc(12px + var(--safe-bottom));
}

.card {
  margin-bottom: 8px;
  background: #fff;
  border-top: 0.5px solid #e5e5e5;
  border-bottom: 0.5px solid #e5e5e5;
}

.head {
  padding: 18px 16px;
}

.who {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  text-align: left;
}

.who :deep(.avatar) {
  border-radius: 6px;
  font-size: 24px;
}

.who span {
  min-width: 0;
}

.who b,
.who small {
  display: block;
}

.who b {
  font-size: 22px;
  font-weight: 500;
}

.who small {
  margin-top: 6px;
  color: #7f7f7f;
  font-size: 14px;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 56px;
  padding: 10px 16px;
  text-align: left;
  font-size: 17px;
}

.row > span:first-child {
  flex: none;
}

.moments .shots {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  min-width: 0;
}

.shots img {
  width: 44px;
  height: 44px;
  object-fit: cover;
  background: #f2f2f2;
}
</style>
