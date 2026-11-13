<script setup>
import { computed } from 'vue'
import { usePhone } from './usePhone.js'
import StatusBar from './StatusBar.vue'
import LockScreen from './LockScreen.vue'
import HomeScreen from './HomeScreen.vue'
import MessengerApp from './MessengerApp.vue'
import PhotosApp from './PhotosApp.vue'
import NotesApp from './NotesApp.vue'
import CallsApp from './CallsApp.vue'
import CalendarApp from './CalendarApp.vue'
import ClockApp from './ClockApp.vue'
import WeatherApp from './WeatherApp.vue'
const phone = usePhone()
const { darkChrome, route } = phone
const views = {
  wechat: MessengerApp,
  sms: MessengerApp,
  photos: PhotosApp,
  notes: NotesApp,
  calls: CallsApp,
  calendar: CalendarApp,
  clock: ClockApp,
  weather: WeatherApp,
}

const appView = computed(() => views[phone.route.value?.app] || null)
const screenKey = computed(() => {
  const route = phone.route.value
  if (phone.progress.phase !== 'home') return phone.progress.phase
  if (!route) return 'home'
  return [route.app, route.view, route.thread, route.day, route.note, route.contact]
    .filter(Boolean)
    .join(':')
})
</script>

<template>
  <main class="stage">
    <div class="device" :class="{ off: phone.progress.phase === 'off' }">
      <i class="side silent" aria-hidden="true" />
      <i class="side vol-up" aria-hidden="true" />
      <i class="side vol-down" aria-hidden="true" />
      <i class="side power" aria-hidden="true" />
      <div class="screen" @click="phone.progress.phase === 'off' && phone.pickUp()">
        <template v-if="phone.progress.phase === 'off'">
          <p class="aod">{{ phone.story.meta.clock }}</p>
          <button type="button" class="wake" @click.stop="phone.pickUp">轻点捡起</button>
        </template>

        <template v-else>
          <i class="island" aria-hidden="true" />
          <StatusBar :dark="darkChrome" />
          <div class="slot">
            <Transition name="rise">
              <LockScreen v-if="phone.progress.phase === 'lock'" key="lock" />
              <HomeScreen v-else-if="!route" key="home" />
              <component :is="appView" v-else :key="screenKey" />
            </Transition>
          </div>
          <button
            v-if="phone.progress.phase === 'home' && route"
            type="button"
            class="grip"
            :class="{ ink: !darkChrome }"
            aria-label="主屏幕"
            @click="phone.goHome"
          />
          <i v-else class="grip" :class="{ ink: !darkChrome }" aria-hidden="true" />
        </template>
      </div>
    </div>
  </main>
</template>

<style scoped>
.stage {
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(ellipse at 50% 115%, rgba(196, 132, 74, 0.18), transparent 46%),
    radial-gradient(ellipse at 50% 0%, rgba(86, 110, 140, 0.22), transparent 42%),
    #121418;
}

.device {
  position: relative;
  width: min(402px, 100%);
  height: min(844px, calc(100svh - 36px));
  padding: 11px;
  border-radius: 54px;
  background:
    linear-gradient(160deg, #8d929a 0%, #4a4e55 12%, #1c1e22 38%, #2c3036 72%, #6d727a 100%);
  box-shadow:
    inset 0 0 0 1px #0b0c0e,
    inset 0 0 0 3px #c5c8ce,
    inset 0 0 0 5px #2a2d32,
    0 28px 60px rgba(0, 0, 0, 0.48),
    0 2px 0 rgba(255, 255, 255, 0.25);
}

.device.buzzing {
  animation: buzz 0.35s linear 3;
}

.side {
  position: absolute;
  z-index: 2;
  width: 4px;
  border-radius: 2px 0 0 2px;
  background: linear-gradient(90deg, #1a1c20, #8e939b 55%, #3a3e44);
  box-shadow: -1px 0 1px rgba(0, 0, 0, 0.35);
}

.silent { left: -3px; top: 118px; height: 28px; }
.vol-up { left: -3px; top: 164px; height: 58px; }
.vol-down { left: -3px; top: 232px; height: 58px; }
.power {
  right: -3px;
  top: 190px;
  width: 4px;
  height: 86px;
  border-radius: 0 2px 2px 0;
  background: linear-gradient(270deg, #1a1c20, #8e939b 55%, #3a3e44);
}

.screen {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 44px;
  background: #000;
  cursor: pointer;
  box-shadow: inset 0 0 0 2px #000;
}

.screen::after {
  content: '';
  position: absolute;
  z-index: 35;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(115deg, rgba(255, 255, 255, 0.14), transparent 26%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16);
}

.device:not(.off) .screen {
  cursor: default;
}

.aod {
  margin: 0;
  padding-top: 22%;
  color: rgba(255, 255, 255, 0.55);
  font-family: 'SF Pro Display', 'Segoe UI', system-ui, sans-serif;
  font-size: 86px;
  font-weight: 220;
  letter-spacing: -2px;
  text-align: center;
}

.wake {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 16%;
  color: rgba(255, 255, 255, 0.42);
  font-size: 13px;
  letter-spacing: 0.08em;
}

.island {
  position: absolute;
  z-index: 8;
  top: 11px;
  left: 50%;
  width: 118px;
  height: 35px;
  border-radius: 20px;
  background: #000;
  transform: translateX(-50%);
  pointer-events: none;
  transition: width 0.25s ease;
}

.island.live {
  width: 148px;
}

.slot {
  position: absolute;
  inset: 0;
}

.slot > :deep(*) {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.grip {
  position: absolute;
  z-index: 12;
  left: 50%;
  bottom: 0;
  width: 160px;
  height: var(--safe-bottom);
  background: transparent;
  transform: translateX(-50%);
  pointer-events: none;
}

button.grip {
  pointer-events: auto;
}

.grip::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 8px;
  width: 134px;
  height: 5px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.92);
  transform: translateX(-50%);
}

.grip.ink::before {
  background: rgba(0, 0, 0, 0.28);
}

@keyframes buzz {
  25% { transform: translateX(-1px) rotate(-0.2deg); }
  75% { transform: translateX(1px) rotate(0.2deg); }
}

@media (max-width: 520px) {
  .stage {
    padding: 0;
  }

  .device {
    width: 100%;
    height: 100svh;
    padding: 0;
    border-radius: 0;
    background: #000;
    box-shadow: none;
  }

  .side {
    display: none;
  }

  .screen,
  .screen::after {
    border-radius: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .device.buzzing {
    animation: none;
  }
}
</style>
