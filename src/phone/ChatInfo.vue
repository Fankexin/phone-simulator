<script setup>
import Avatar from './Avatar.vue'
import { computed } from 'vue'
import { usePhone } from './usePhone.js'

const props = defineProps({
  threadId: { type: String, required: true },
})

const phone = usePhone()
const { pop } = phone
const thread = computed(() => phone.story.threads.find((item) => item.id === props.threadId))
const contact = computed(() => phone.contactOf(thread.value?.contact))
</script>

<template>
  <section class="info">
    <header>
      <button type="button" aria-label="返回" @click="pop">
        <svg viewBox="0 0 24 24"><path d="M15 4 7 12l8 8" /></svg>
      </button>
      <b>聊天信息</b>
      <span />
    </header>

    <div class="body">
      <div class="card people">
        <button type="button" class="person" @click="phone.openContact(thread.contact)">
          <Avatar :contact="contact" :size="52" />
          <small>{{ contact.name }}</small>
        </button>
        <div class="person add" aria-hidden="true">
          <i>+</i>
          <small>添加</small>
        </div>
      </div>

      <div class="card">
        <button type="button" class="row" @click="phone.openFindChat(threadId)">
          <span>查找聊天内容</span>
          <svg class="chev" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.info {
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
  border-bottom: 0.5px solid #dcdcdc;
}

header b {
  font-size: 17px;
  font-weight: 650;
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

.body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 10px 0 calc(12px + var(--safe-bottom));
}

.card {
  margin-bottom: 8px;
  background: #fff;
  border-top: 0.5px solid #e5e5e5;
  border-bottom: 0.5px solid #e5e5e5;
}

.people {
  display: flex;
  gap: 18px;
  padding: 18px 16px 14px;
}

.person {
  width: 56px;
  text-align: center;
  color: inherit;
}

.person :deep(.avatar) {
  border-radius: 6px;
  font-size: 20px;
  margin: 0 auto;
}

.person small {
  display: block;
  margin-top: 8px;
  overflow: hidden;
  color: #7f7f7f;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.add i {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin: 0 auto;
  border: 1px dashed #c7c7c7;
  border-radius: 6px;
  color: #b2b2b2;
  font-size: 28px;
  font-style: normal;
  line-height: 1;
}

.row {
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  padding: 0 16px;
  text-align: left;
  font-size: 17px;
}

.row span {
  flex: 1;
}

.chev {
  width: 14px;
  height: 14px;
  color: #c7c7cc;
}
</style>
