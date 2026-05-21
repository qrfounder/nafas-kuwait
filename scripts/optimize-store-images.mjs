#!/usr/bin/env node
/**
 * Generate WebP + responsive widths for storefront images.
 * Usage: node scripts/optimize-store-images.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const require = createRequire(path.join(ROOT, 'frontend/package.json'))
const sharp = require('sharp')
const PUBLIC = path.join(ROOT, 'frontend/public')
const MANIFEST_PATH = path.join(PUBLIC, 'image-manifest.json')

const QUALITY = 82

const CATEGORIES = {
  hero: { max: 1400, widths: [640, 960, 1400] },
  showcase: { max: 960, widths: [400, 640, 960] },
  pain: { max: 640, widths: [400, 640] },
  transformation: { max: 1200, widths: [640, 960, 1200] },
  catalog: { max: 256, widths: [128, 256] },
  logo: { max: 200, widths: [128, 200] },
}

const SKIP_PATTERNS = [
  'unboxing.png',
  'complete-system.png',
  '/reviews/review-',
  '/emotional/sku/period-belt.png',
  '/emotional/sku/gift-box.png',
  '/emotional/sku/lumbar.png',
  '/emotional/sku/neck.png',
  '/emotional/sku/head-massager.png',
  '/emotional/sku/knee-sleeves.png',
  '-lifestyle.png',
  'knee-sleeves-box.png',
]

function categoryFor(rel) {
  if (SKIP_PATTERNS.some((p) => rel.includes(p))) return null
  if (rel.includes('/brand/')) return 'logo'
  if (rel.includes('-showcase')) return 'showcase'
  if (rel.includes('pain-') || rel.includes('/home/pain')) return 'pain'
  if (rel.includes('transformation')) return 'transformation'
  if (rel.includes('/products/') && !rel.includes('/emotional/')) return 'catalog'
  if (rel.includes('hero.png')) return 'hero'
  if (rel.includes('/emotional/')) return 'hero'
  return 'hero'
}

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) walk(full, acc)
    else if (/\.(png|jpe?g)$/i.test(name)) acc.push(full)
  }
  return acc
}

async function optimizeFile(absPath) {
  const rel = '/' + path.relative(PUBLIC, absPath).replace(/\\/g, '/')
  const cat = categoryFor(rel)
  if (!cat) return null

  const { max, widths } = CATEGORIES[cat]
  const base = absPath.replace(/\.(png|jpe?g)$/i, '')
  const generated = []

  const pipeline = sharp(absPath).rotate()

  for (const w of widths) {
    const out = `${base}-${w}.webp`
    await pipeline
      .clone()
      .resize(w, w, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 4 })
      .toFile(out)
    const kb = Math.round(fs.statSync(out).size / 1024)
    generated.push(w)
    console.log(`  ${path.basename(out)}: ${kb}KB`)
  }

  const mainOut = `${base}.webp`
  await sharp(absPath)
    .rotate()
    .resize(max, max, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(mainOut)
  console.log(`  ${path.basename(mainOut)} (main)`)

  return {
    src: rel,
    webp: rel.replace(/\.(png|jpe?g)$/i, '.webp'),
    widths: generated,
    category: cat,
  }
}

async function main() {
  const files = walk(PUBLIC).filter((f) => !f.includes('/payments/'))
  const manifest = {}

  for (const file of files.sort()) {
    const rel = path.relative(ROOT, file)
    if (categoryFor('/' + path.relative(PUBLIC, file).replace(/\\/g, '/')) === null) continue
    console.log(rel)
    const entry = await optimizeFile(file)
    if (entry) manifest[entry.src] = entry
  }

  const count = Object.keys(manifest).length
  if (count === 0 && fs.existsSync(MANIFEST_PATH)) {
    console.log('\nNo PNG sources found — keeping existing image-manifest.json')
    return
  }
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
  console.log(`\nWrote ${count} entries → ${path.relative(ROOT, MANIFEST_PATH)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
