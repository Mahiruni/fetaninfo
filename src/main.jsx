import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './styles.css';
import './upgrade.css';
import './brand.css';
import './mobile.css';
import './competition-ui.css';
import './visual-identity.css';
import './performance.css';
import './velocity-rebrand.css';
import './fetan-reference-brand.css';
import './fetan-black-red.css';
import './fetan-broadcast.css';
import './fetan-editorial.css';
import './fetan-single-hero.css';
import './fetan-club-crests.css';
import './fetan-fire.css';
import './fetan-match-premium.css';
import './fetan-glass-nav.css';
import './fetan-elite-matchday.css';
import './fetan-match-center.css';
import './fetan-award.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><BrowserRouter><AuthProvider><App/></AuthProvider></BrowserRouter></React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const hadController = Boolean(navigator.serviceWorker.controller);
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
      await registration.update();

      if (hadController) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          const key = 'fetan-sw-refresh-v9';
          if (sessionStorage.getItem(key)) return;
          sessionStorage.setItem(key, '1');
          window.location.reload();
        }, { once: true });
      }
    } catch (error) {
      console.warn('Service worker update failed:', error);
    }
  });
}
