#!/usr/bin/env node
/**
 * Simulates realistic e-commerce traffic on tea-leafs.com using Playwright.
 * Generates RudderStack analytics events from multiple customers on varied devices.
 *
 * Usage:
 *   npx playwright install chromium
 *   node scripts/generate-events.mjs [--base-url https://tea-leafs.com] [--rounds 2]
 */

import { chromium } from 'playwright';

const BASE_URL = process.argv.includes('--base-url')
  ? process.argv[process.argv.indexOf('--base-url') + 1]
  : 'https://tea-leafs.com';

const ROUNDS = process.argv.includes('--rounds')
  ? parseInt(process.argv[process.argv.indexOf('--rounds') + 1], 10)
  : 1;

const CUSTOMERS = [
  { email: 'maya.patel@example.com', first: 'Maya', last: 'Patel' },
  { email: 'jordan.ramirez@example.com', first: 'Jordan', last: 'Ramirez' },
  { email: 'olivia.kim@example.com', first: 'Olivia', last: 'Kim' },
  { email: 'marcus.johnson@example.com', first: 'Marcus', last: 'Johnson' },
  { email: 'zoe.thompson@example.com', first: 'Zoe', last: 'Thompson' },
  { email: 'ethan.nguyen@example.com', first: 'Ethan', last: 'Nguyen' },
];

const DEVICE_PROFILES = [
  { name: 'Desktop Chrome', viewport: { width: 1920, height: 1080 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
  { name: 'Desktop Safari', viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15' },
  { name: 'iPhone 14', viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' },
  { name: 'iPhone 14 Pro Max', viewport: { width: 428, height: 926 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' },
  { name: 'Pixel 8', viewport: { width: 412, height: 915 }, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.64 Mobile Safari/537.36' },
  { name: 'Samsung Galaxy S24', viewport: { width: 360, height: 800 }, userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.64 Mobile Safari/537.36' },
  { name: 'iPad Pro', viewport: { width: 1024, height: 1366 }, userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' },
  { name: 'Laptop 1366', viewport: { width: 1366, height: 768 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
];

const PRODUCTS = [
  'dragon-well', 'gyokuro-supreme', 'earl-grey-royal', 'golden-yunnan',
  'iron-goddess', 'milk-oolong', 'silver-needle', 'moonlight-white',
  'chamomile-dreams', 'aged-pu-erh-reserve',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function simulateCustomer(browser, customer, device) {
  const context = await browser.newContext({
    viewport: device.viewport,
    userAgent: device.userAgent,
  });
  const page = await context.newPage();

  try {
    // 1. Visit homepage (Promotion Viewed, Product List Viewed)
    await page.goto(BASE_URL);
    await wait(500);

    // 2. Login
    await page.goto(`${BASE_URL}/account`);
    await page.getByRole('textbox', { name: 'Email Address' }).fill(customer.email);
    await page.getByRole('textbox', { name: 'First Name' }).fill(customer.first);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(customer.last);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await wait(500);

    // 3. Browse products page (Product List Viewed)
    await page.goto(`${BASE_URL}/products`);
    await wait(400);

    // 4. View 2-4 random products (Product Clicked, Product Viewed)
    const shuffledProducts = shuffle(PRODUCTS);
    const browseCount = 2 + Math.floor(Math.random() * 3);
    const browsed = shuffledProducts.slice(0, browseCount);

    for (const slug of browsed) {
      await page.goto(`${BASE_URL}/products/${slug}`);
      await wait(400);
    }

    // 5. Add last browsed product to cart (Product Added)
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await wait(300);

    // 6. 50% chance: add another product
    if (Math.random() > 0.5) {
      const extra = shuffledProducts[browseCount] || 'dragon-well';
      await page.goto(`${BASE_URL}/products/${extra}`);
      await wait(400);
      await page.getByRole('button', { name: 'Add to Cart' }).click();
      await wait(300);
    }

    // 7. View cart (Cart Viewed)
    await page.goto(`${BASE_URL}/cart`);
    await wait(400);

    // 8. Pick a checkout path
    const useInstantCheckout = Math.random() > 0.3; // 70% instant, 30% regular

    if (useInstantCheckout) {
      // Buy Now on another product (instant checkout)
      const buySlug = shuffledProducts.find((s) => !browsed.includes(s)) || 'earl-grey-royal';
      await page.goto(`${BASE_URL}/products/${buySlug}`);
      await wait(400);
      await page.getByRole('button', { name: 'Buy Now' }).click();
      await wait(500);
      await page.getByRole('button', { name: 'Place Order' }).click();
      await wait(500);
    } else {
      // Regular checkout
      await page.goto(`${BASE_URL}/checkout`);
      await wait(400);
      // Fill shipping with demo data
      await page.getByRole('button', { name: 'Fill Demo Data' }).click();
      await wait(300);
      await page.getByRole('button', { name: 'Continue to Payment' }).click();
      await wait(400);
      // Fill payment with demo data
      await page.getByRole('button', { name: 'Fill Demo Data' }).click();
      await wait(300);
      await page.getByRole('button', { name: 'Continue to Review' }).click();
      await wait(400);
      await page.getByRole('button', { name: 'Place Order' }).click();
      await wait(500);
    }

    const url = page.url();
    const total = decodeURIComponent(url.match(/total=([^&]+)/)?.[1] || '?');
    console.log(
      `  ✓ ${customer.first} ${customer.last} on ${device.name} (${device.viewport.width}x${device.viewport.height}) — ${total}`,
    );
  } catch (err) {
    console.error(`  ✗ ${customer.first} ${customer.last} on ${device.name}: ${err.message}`);
  } finally {
    await context.close();
  }
}

async function main() {
  console.log(`Generating events on ${BASE_URL}`);
  console.log(`Rounds: ${ROUNDS}, Customers: ${CUSTOMERS.length}\n`);

  const browser = await chromium.launch({ headless: true });

  for (let round = 1; round <= ROUNDS; round++) {
    console.log(`--- Round ${round}/${ROUNDS} ---`);
    const shuffledDevices = shuffle(DEVICE_PROFILES);

    for (let i = 0; i < CUSTOMERS.length; i++) {
      const customer = CUSTOMERS[i];
      const device = shuffledDevices[i % shuffledDevices.length];
      await simulateCustomer(browser, customer, device);
    }
    console.log();
  }

  await browser.close();

  const totalOrders = ROUNDS * CUSTOMERS.length;
  console.log(`Done! Generated ~${totalOrders * 15}+ events from ${totalOrders} orders.`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
