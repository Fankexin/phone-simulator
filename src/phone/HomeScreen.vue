<script setup>
import { appCatalog } from './catalog.js'
import AppIcon from './AppIcon.vue'
import { usePhone } from './usePhone.js'

const phone = usePhone()

function apps(ids) {
  return (ids || []).map((id) => ({ id, ...appCatalog[id] })).filter((item) => item.name)
}
</script>

<template>
  <section class="home">
    <img
      v-if="phone.story.meta.homeWallpaper"
      class="wall"
      :src="phone.story.meta.homeWallpaper"
      alt=""
      referrerpolicy="no-referrer"
      aria-hidden="true"
    />
    <div class="grid">
      <button
        v-for="app in apps(phone.story.home.grid)"
        :key="app.id"
        type="button"
        class="icon"
        @click="phone.openApp(app.id)"
      >
        <span class="glyph" :class="app.id">
          <AppIcon :name="app.id" />
        </span>
        <i v-if="phone.badgeCount(app.id)" class="badge">{{ phone.badgeCount(app.id) }}</i>
        <span class="label">{{ app.name }}</span>
      </button>
    </div>

    <div class="search">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.25" fill="none" stroke="currentColor" stroke-width="2.4" />
        <path d="M15.2 15.2L20.2 20.2" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
      </svg>
      <span>搜索</span>
    </div>

    <div class="dock">
      <button
        v-for="app in apps(phone.story.home.dock)"
        :key="app.id"
        type="button"
        class="icon dock-icon"
        :aria-label="app.name"
        @click="phone.openApp(app.id)"
      >
        <span class="glyph" :class="app.id">
          <AppIcon :name="app.id" />
        </span>
        <i v-if="phone.badgeCount(app.id)" class="badge">{{ phone.badgeCount(app.id) }}</i>
      </button>
    </div>
  </section>
</template>

<style scoped>
.home {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: calc(68px + var(--call-gap, 0px)) 16px 18px;
  color: #fff;
  overflow: hidden;
  background:
    radial-gradient(circle at 86% 8%, rgba(255, 236, 206, 0.55) 0 18px, transparent 70px),
    linear-gradient(180deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.35)),
    linear-gradient(180deg, #24344c 0%, #6d88a8 28%, #c98462 58%, #1a140f 100%);
}

.wall {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
}

.home::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.06) 48%, rgba(0, 0, 0, 0.38));
}

.home > :not(.wall) {
  position: relative;
  z-index: 1;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-items: center;
}

.search {
  align-self: center;
  display: flex;
  align-items: center;
  gap: 3px;
  margin: auto auto 12px;
  padding: 3px 8px 3px 6px;
  border-radius: 99px;
  background: rgba(40, 40, 42, 0.55);
  border: 0.5px solid rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: -0.1px;
  backdrop-filter: blur(18px) saturate(1.4);
}

.search svg {
  width: 11px;
  height: 11px;
  display: block;
}

.dock {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 6px;
  padding: 14px 6px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.22);
  border: 0.5px solid rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(22px) saturate(1.5);
}

.icon {
  position: relative;
  width: 74px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #fff;
}

.dock-icon {
  width: 62px;
}

.label {
  max-width: 72px;
  overflow: hidden;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: -0.1px;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
  white-space: nowrap;
}

.glyph {
  position: relative;
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 13px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.35),
    0 1px 1px rgba(0, 0, 0, 0.22);
}

.glyph.calendar :deep(svg),
.glyph.photos :deep(img),
.glyph.notes :deep(img),
.glyph.sms :deep(img),
.glyph.calls :deep(img),
.glyph.clock :deep(img),
.glyph.clock :deep(svg),
.glyph.weather :deep(img),
.glyph.wechat :deep(img) {
  width: 58px;
  height: 58px;
}

.badge {
  position: absolute;
  top: -4px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 99px;
  background: #ff3b30;
  color: #fff;
  font-size: 11px;
  font-style: normal;
  line-height: 18px;
  text-shadow: none;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.12);
}

.foot {
  display: flex;
  justify-content: center;
  gap: 14px;
  min-height: 22px;
}

.foot button {
  color: rgba(255, 255, 255, 0.78);
  font-size: 11px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
}

.ending {
  color: #fff !important;
}
</style>
