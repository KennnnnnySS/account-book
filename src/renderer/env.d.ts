/// <reference types="vite/client" />

import type { LedgerAPI } from './types'

declare global {
  interface Window {
    api: LedgerAPI
  }
}
