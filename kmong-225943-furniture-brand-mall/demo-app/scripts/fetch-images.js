// Unsplash 사진을 image-pool.ts의 ID 리스트로 일괄 다운로드해 public/images/{id}.jpg에 저장.
// 사용: node scripts/fetch-images.js
// 이미 존재하면 skip. 800px, q=80, fm=jpg.
const fs = require('fs')
const path = require('path')

const POOL_FILE = path.join(__dirname, '..', 'src', 'lib', 'imagePool.ts')
const OUT_DIR = path.join(__dirname, '..', 'public', 'images')

function extractIds(src) {
  const out = new Set()
  const re = /'(\d{9,14}-[0-9a-f]{12})'/g
  let m
  while ((m = re.exec(src)) !== null) out.add(m[1])
  return Array.from(out)
}

async function fetchOne(id) {
  const target = path.join(OUT_DIR, `${id}.jpg`)
  if (fs.existsSync(target)) return { id, status: 'skip' }
  const url = `https://images.unsplash.com/photo-${id}?w=800&q=80&fm=jpg&fit=crop&auto=format`
  const r = await fetch(url, { redirect: 'follow' })
  if (!r.ok) return { id, status: `fail-${r.status}` }
  const buf = Buffer.from(await r.arrayBuffer())
  fs.writeFileSync(target, buf)
  return { id, status: 'ok', size: buf.length }
}

;(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const src = fs.readFileSync(POOL_FILE, 'utf8')
  const ids = extractIds(src)
  console.log(`pool: ${ids.length} unique ids`)
  let ok = 0, skip = 0, fail = 0, bytes = 0
  for (const id of ids) {
    try {
      const r = await fetchOne(id)
      if (r.status === 'ok') { ok++; bytes += r.size; console.log(`OK  ${(r.size/1024).toFixed(0).padStart(4)}K  ${id}`) }
      else if (r.status === 'skip') { skip++ }
      else { fail++; console.log(`FAIL ${r.status} ${id}`) }
    } catch (e) { fail++; console.log(`ERR ${id} :: ${e.message}`) }
  }
  console.log(`---\nDone: ${ok} ok, ${skip} skip, ${fail} fail, ${(bytes/1024/1024).toFixed(1)}MB`)
  process.exit(fail > 0 ? 1 : 0)
})()
