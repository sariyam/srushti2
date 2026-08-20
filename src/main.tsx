import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './routes/router';
import { registerSW } from 'virtual:pwa-register';
import './index.css';

// Explicitly register PWA service worker immediately for omnibox / searchbar install icon eligibility
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

