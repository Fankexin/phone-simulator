<script setup>
defineProps({
  photo: { type: Object, required: true },
})
</script>

<template>
  <div
    class="art"
    role="img"
    :aria-label="photo.title"
    :style="photo.src ? undefined : { background: `linear-gradient(155deg, ${photo.colors[0]}, ${photo.colors[1]})` }"
  >
    <img v-if="photo.src" :src="photo.src" alt="" referrerpolicy="no-referrer" />
    <span v-else class="motif" :class="photo.motif" />
  </div>
</template>

<style scoped>
.art {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.art img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.motif {
  position: absolute;
  inset: 18%;
}

.motif.window {
  border: 2px solid rgba(255, 255, 255, 0.75);
  box-shadow:
    inset 1px 0 0 rgba(255, 255, 255, 0.75),
    inset -50% 0 0 rgba(255, 255, 255, 0.28),
    inset 0 -50% 0 rgba(255, 255, 255, 0.2);
}

.motif.shutter {
  inset: 22% 12%;
  background: repeating-linear-gradient(
    to bottom,
    rgba(40, 28, 16, 0.78) 0 8px,
    transparent 8px 14px
  );
}

.motif.ticket {
  inset: 24% 16%;
  border-radius: 6px;
  background:
    radial-gradient(circle at 0 50%, transparent 8px, rgba(255, 248, 236, 0.92) 9px) left / 18px 100% no-repeat,
    radial-gradient(circle at 100% 50%, transparent 8px, rgba(255, 248, 236, 0.92) 9px) right / 18px 100% no-repeat,
    rgba(255, 248, 236, 0.92);
}

.motif.ticket::after {
  content: '';
  position: absolute;
  left: 18px;
  right: 18px;
  top: 38%;
  border-top: 2px dashed rgba(141, 75, 60, 0.55);
}
</style>
