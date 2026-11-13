<script setup>
defineProps({
  contact: { type: Object, required: true },
  size: { type: Number, default: 46 },
  round: { type: Boolean, default: false },
})
</script>

<template>
  <span
    class="avatar"
    :class="{ round }"
    :style="{ width: `${size}px`, height: `${size}px`, background: contact.color, fontSize: `${Math.round(size * 0.38)}px` }"
    aria-hidden="true"
  >
    <img v-if="contact.avatar" :src="contact.avatar" alt="" referrerpolicy="no-referrer" />
    <template v-else>{{ contact.initial }}</template>
  </span>
</template>

<style scoped>
.avatar {
  display: grid;
  place-items: center;
  flex: none;
  overflow: hidden;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
}

.avatar.round {
  border-radius: 50%;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
