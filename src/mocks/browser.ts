// src/mocks/browser.ts
// MSW browser worker setup for development mocks
import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);
