import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';
import './styles/global.css';

import { FocusStyleManager } from '@blueprintjs/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App.tsx';
import { warmUpOCL } from './oclWarmup.ts';

FocusStyleManager.onlyShowFocusOnTabs();
warmUpOCL();

const container = document.querySelector('#root');
if (!container) throw new Error('missing #root element');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
