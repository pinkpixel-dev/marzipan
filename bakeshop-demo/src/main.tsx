import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './styles.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Unable to find root element for Marzipan Bakeshop.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
