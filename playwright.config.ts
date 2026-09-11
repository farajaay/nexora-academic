import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  use: { baseURL: process.env.TEST_BASE_URL || 'http://127.0.0.1:5173/nexora-academic/', trace: 'retain-on-failure' },
  projects: [ { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport:{width:1440,height:1000} } }, { name: 'mobile', use:{...devices['iPhone 13'],defaultBrowserType:'chromium'} } ],
  reporter: [['list'],['html',{open:'never'}]],
})
