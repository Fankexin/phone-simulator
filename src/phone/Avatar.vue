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
    {{ contact.initial }}
  </span>
</template>

<style scoped>
.avatar {
  display: grid;
  place-items: center;
  flex: none;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
}

.avatar.round {
  border-radius: 50%;
}
</style>
