import { defineConfig, devices } from '@playwright/test';

const port = process.env.LYS_TEST_PORT || "5173";
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'msedge' } }],
  webServer: { command: `npm run dev -- --port ${port} --strictPort`, url: baseURL, reuseExistingServer: !process.env.CI && (!process.env.LYS_TEST_PORT || process.env.LYS_TEST_REUSE === "1") },
});
