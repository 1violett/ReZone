import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { protectionSystem } from './utils/protection';
import { AntiTamperingSystem } from './utils/antiTampering';

// Initialize protection systems
protectionSystem.validateIntegrity();
AntiTamperingSystem.initializeChecksums();

// Periodic integrity checks
setInterval(() => {
  if (!AntiTamperingSystem.validateIntegrity()) {
    AntiTamperingSystem.reportTampering();
  }
}, 30000); // Check every 30 seconds

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);