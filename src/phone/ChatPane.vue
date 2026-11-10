<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import Avatar from './Avatar.vue'
import { usePhone } from './usePhone.js'

const props = defineProps({
  threadId: { type: String, required: true },
  theme: { type: String, required: true },
  backLabel: { type: String, required: true },
})

const phone = usePhone()
const { pop } = phone
const scroller = ref(null)
const thread = computed(() => phone.story.threads.find((item) => item.id === props.threadId))
const contact = computed(() => phone.contactOf(thread.value?.contact))
const me = computed(() => phone.contactOf('me'))
const view = computed(() => phone.projection(props.threadId))

function showTime(index) {
  const current = view.value.messages[index]
  const previous = view.value.messages[index - 1]
  return !previous || previous.time !== current.time
}

async function stick() {
  await nextTick()
  if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
}

onMounted(stick)
watch(() => view.value.messages.length, stick)
</script>

<template>
  <section class="chat" :data-theme="theme">
    <header v-if="theme === 'wechat'" class="wxh">
      <button type="button" aria-label="返回" @click="pop">
        <svg viewBox="0 0 24 24"><path d="M15 4 7 12l8 8" /></svg>
      </button>
      <b>{{ contact.name }}</b>
      <button type="button" class="more" aria-label="更多" @click="phone.openChatInfo(threadId)">
        <svg viewBox="0 0 24 24"><circle cx="6" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="18" cy="12" r="1.6" /></svg>
      </button>
    </header>
    <header v-else class="sms-bar">
      <button type="button" aria-label="返回" @click="pop">
        <svg viewBox="0 0 12 20"><path d="M10 2 2 10l8 8" /></svg>
      </button>
      <div class="who">
        <Avatar :contact="contact" :size="36" round />
        <b>{{ contact.name }}</b>
      </div>
      <span />
    </header>
    <div ref="scroller" class="log">
      <template v-for="(msg, index) in view.messages" :key="msg.id">
        <p v-if="showTime(index)" class="stamp">{{ msg.time }}</p>
        <p v-if="msg.from === 'system'" class="system">{{ msg.text }}</p>
        <div v-else class="line" :class="{ me: msg.from === 'me' }">
          <Avatar v-if="theme === 'wechat' && msg.from !== 'me'" :contact="contact" :size="40" />
          <p class="bubble">{{ msg.text }}</p>
          <Avatar v-if="theme === 'wechat' && msg.from === 'me'" :contact="me" :size="40" />
        </div>
      </template>
    </div>
    <div v-if="theme === 'wechat'" class="wxin">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 17v3" /></svg>
      <i>{{ view.draft }}</i>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8.2 14.2s1.4 2.2 3.8 2.2 3.8-2.2 3.8-2.2" /><path d="M9 9.6h.01M15 9.6h.01" /></svg>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></svg>
    </div>
    <div v-else class="smsin">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.2" /></svg>
      <i>iMessage</i>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15a3 3 0 0 0 3-3V7a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3z" /><path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v3" /></svg>
    </div>
  </section>
</template>

<style scoped>
.chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ededed;
  color: #111;
}

.chat[data-theme='sms'] {
  background: #fff;
}

.sms-bar {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex: none;
  height: calc(var(--safe-top) + 52px);
  padding-bottom: 8px;
  background: rgba(249, 249, 249, 0.94);
  border-bottom: 0.5px solid rgba(60, 60, 67, 0.18);
  backdrop-filter: blur(18px);
}

.sms-bar > button {
  position: absolute;
  left: 8px;
  bottom: 14px;
  color: #007aff;
}

.sms-bar > button svg {
  width: 12px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.who {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.who b {
  font-size: 11px;
  font-weight: 560;
}

.wxh {
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

.wxh b {
  max-width: 180px;
  overflow: hidden;
  font-size: 17px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wxh > button {
  position: absolute;
  bottom: 8px;
  color: #111;
}

.wxh > button:first-of-type {
  left: 8px;
}

.more {
  right: 12px;
  left: auto;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
}

.wxh svg,
.wxin svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.more svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
  stroke: none;
}

.log {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: calc(10px + var(--call-gap, 0px)) 10px 12px;
}

.stamp,
.system,
.quiet {
  margin: 10px 0;
  text-align: center;
  color: #b2b2b2;
  font-size: 12px;
}

.stamp {
  display: inline-block;
  width: 100%;
}

.line {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 12px 0;
}

.line.me {
  justify-content: flex-end;
}

.bubble {
  max-width: 72%;
  margin: 0;
  padding: 10px 12px;
  border-radius: 6px;
  background: #fff;
  font-size: 16px;
  line-height: 1.45;
  overflow-wrap: anywhere;
  text-wrap: pretty;
  user-select: text;
}

.chat[data-theme='wechat'] .bubble {
  position: relative;
  border-radius: 4px;
  min-height: 40px;
}

.chat[data-theme='wechat'] .bubble::before {
  content: '';
  position: absolute;
  top: 14px;
  left: -6px;
  border-width: 5px 6px 5px 0;
  border-style: solid;
  border-color: transparent #fff transparent transparent;
}

.chat[data-theme='wechat'] .me .bubble {
  background: #95ec69;
}

.chat[data-theme='wechat'] .me .bubble::before {
  left: auto;
  right: -6px;
  border-width: 5px 0 5px 6px;
  border-color: transparent transparent transparent #95ec69;
}

.chat[data-theme='wechat'] .line :deep(.avatar) {
  border-radius: 4px;
}

.chat[data-theme='sms'] .bubble {
  position: relative;
  max-width: 78%;
  border-radius: 18px;
  padding: 8px 12px;
}

.chat[data-theme='sms'] .me .bubble {
  background: #0b93f6;
  color: #fff;
}

.chat[data-theme='sms'] .line:not(.me) .bubble {
  background: #e9e9eb;
}

.chat[data-theme='sms'] .log {
  background: #fff;
}

.composer,
.quiet {
  padding: 10px 12px 12px;
  background: #f7f7f7;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.chat[data-theme='sms'] .composer,
.chat[data-theme='sms'] .quiet {
  background: #fff;
  border-top: 0;
  padding-bottom: 8px;
}

.composer p {
  margin: 0 0 8px;
  color: #888;
  font-size: 12px;
  text-align: center;
}

.composer button {
  display: block;
  width: 100%;
  margin-top: 8px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  font-size: 16px;
}

.chat[data-theme='wechat'] .composer button {
  color: #576b95;
}

.chat[data-theme='sms'] .composer button {
  color: #0b6bcb;
}

.quiet {
  margin: 0;
}

.wxin {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  height: calc(54px + var(--safe-bottom));
  padding: 8px 10px var(--safe-bottom);
  background: #f7f7f7;
  border-top: 0.5px solid #dcdcdc;
  color: #191919;
}

.wxin i {
  flex: 1;
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 6px;
  background: #fff;
  color: #111;
  font-size: 16px;
  font-style: normal;
  line-height: 1.2;
  overflow: hidden;
  white-space: nowrap;
}

.smsin {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
  height: calc(52px + var(--safe-bottom));
  padding: 8px 10px var(--safe-bottom);
  background: rgba(249, 249, 249, 0.94);
  border-top: 0.5px solid rgba(60, 60, 67, 0.18);
  color: #8e8e93;
}

.smsin svg {
  width: 28px;
  height: 28px;
  fill: none;
  stroke: #007aff;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.smsin i {
  flex: 1;
  height: 34px;
  display: grid;
  align-items: center;
  padding: 0 12px;
  border: 1px solid rgba(60, 60, 67, 0.22);
  border-radius: 18px;
  background: #fff;
  color: rgba(60, 60, 67, 0.45);
  font-size: 16px;
  font-style: normal;
}
</style>
