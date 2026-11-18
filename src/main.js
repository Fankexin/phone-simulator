import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')

// 临时隐藏 Netlify Free 角标（#nl-badge-frame）；后台能关掉后可删
function hideNetlifyBadge() {
  const frame = document.getElementById('nl-badge-frame')
  if (frame) frame.remove()
}
hideNetlifyBadge()
new MutationObserver(hideNetlifyBadge).observe(document.documentElement, {
  childList: true,
  subtree: true,
})
