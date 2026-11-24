import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { installCollisionAudit } from './lib/collide';
import { installFpsMeter } from './lib/perf';

if (import.meta.env.DEV) {
  installCollisionAudit();
  installFpsMeter();

  // Dev-only build badge: proves the preview actually reloaded.
  const badge = document.createElement('div');
  badge.id = 'dd-build-badge';
  badge.textContent = `DD build ${new Date().toLocaleTimeString([], { hour12: false })}`;
  badge.style.cssText =
    'position:fixed;left:8px;bottom:8px;z-index:12000;font:10px/1 ui-monospace,monospace;opacity:.5;pointer-events:none;color:#0A0A0A;letter-spacing:.04em;';
  document.body.appendChild(badge);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
