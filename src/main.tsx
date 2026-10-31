import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './styles.css';

// Register service worker for Progressive Web App and offline mobile play
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.info('[PWA] New version available, updated in background.');
  },
  onOfflineReady() {
    console.info('[PWA] Sanctum models and engine cached for offline play.');
  },
});

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
