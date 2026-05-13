// 주요 라우트를 순회하며 img 태그 중 깨진 것(naturalWidth=0)을 전수 검출.
// 사용: BASE_URL=http://localhost:3000 node scripts/check-broken-images.js
const puppeteer = require('puppeteer')

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const STORAGE_KEY = 'kmong225943:auth'
const CART_KEY = 'kmong225943:cart'
const CART_SEED = [
  { productId: 'prd-oakhaus-dining-table-1800', option: '오크|Q', qty: 1, unitPrice: 1450000 },
  { productId: 'prd-maholn-oak-sofa-3s', option: '오크|Q', qty: 1, unitPrice: 1890000 },
  { productId: 'prd-raonwood-oak-bed', option: '오크|Q', qty: 1, unitPrice: 1140000 },
]
const PRESETS = {
  guest: { userId: 'user-guest', role: 'guest' },
  member: { userId: 'user-member-1', role: 'member' },
  partner: { userId: 'user-partner-2', role: 'partner' },
  admin: { userId: 'user-admin-1', role: 'admin' },
}

const routes = [
  { url: '/', role: 'guest' },
  { url: '/collections/', role: 'guest' },
  { url: '/collections/warm-living-26ss/', role: 'guest' },
  { url: '/products/', role: 'guest' },
  { url: '/products/oakhaus-dining-table-1800/', role: 'guest' },
  { url: '/products/maholn-oak-sofa-3s/', role: 'guest' },
  { url: '/products/raonwood-oak-bed/', role: 'guest' },
  { url: '/search?q=오크', role: 'guest' },
  { url: '/cart/', role: 'member', cart: true },
  { url: '/checkout/', role: 'member', cart: true },
  { url: '/sign-in/', role: 'guest' },
  { url: '/account/', role: 'member' },
  { url: '/account/orders/order-DEMO-S02/', role: 'member' },
  { url: '/account/rewards/', role: 'member' },
  { url: '/maholn/', role: 'guest' },
  { url: '/maholn/lookbook/2026-spring/', role: 'guest' },
  { url: '/maholn/about/', role: 'guest' },
  { url: '/admin/', role: 'admin' },
  { url: '/admin/products/', role: 'admin' },
  { url: '/admin/orders/', role: 'admin' },
  { url: '/admin/cms/', role: 'admin' },
  { url: '/admin/cms/partner/raonwood/', role: 'partner' },
  { url: '/admin/brands/', role: 'admin' },
  { url: '/admin/delivery-monitor/', role: 'admin' },
]

;(async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' })

  const allBroken = []
  for (const r of routes) {
    const preset = PRESETS[r.role]
    await page.evaluate(({ key, val, cartKey, cartVal, hasCart }) => {
      sessionStorage.setItem(key, val)
      if (hasCart) sessionStorage.setItem(cartKey, cartVal)
    }, { key: STORAGE_KEY, val: JSON.stringify(preset), cartKey: CART_KEY, cartVal: JSON.stringify(CART_SEED), hasCart: !!r.cart })

    try {
      await page.goto(BASE + r.url, { waitUntil: 'networkidle0', timeout: 45000 })
    } catch (e) {
      console.log(`NAV-FAIL ${r.url} :: ${e.message}`)
      continue
    }
    await new Promise(res => setTimeout(res, 600))

    const broken = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter((img) => img.complete && img.naturalWidth === 0)
        .map((img) => img.currentSrc || img.src)
    })

    if (broken.length > 0) {
      console.log(`BROKEN ${r.url} (${broken.length})`)
      broken.forEach((s) => console.log('   ' + s))
      allBroken.push({ route: r.url, broken })
    } else {
      console.log(`OK     ${r.url}`)
    }
  }

  await browser.close()
  console.log('---')
  console.log(`Total routes with broken images: ${allBroken.length}/${routes.length}`)
  process.exit(allBroken.length > 0 ? 1 : 0)
})()
