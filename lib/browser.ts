import { chromium, Browser } from "playwright";

let browser: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
  if (!browser || !browser.isConnected()) {
    browser = await chromium.launch({
      channel: "chrome",
      headless: false,
    });
  }
  return browser;
}

export async function closeBrowser() {
  await browser?.close();
  browser = null;
}