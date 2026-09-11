import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
test('built routes contain their own titles, descriptions and canonical URL', () => {
  const urls = ['services','calculator','contact','privacy','terms','integrity','faq','how-it-works']
  const descriptions = new Set()
  for (const path of urls) {
    const html = readFileSync(`dist/${path}/index.html`,'utf8')
    assert.ok(html.includes(`https://farajaay.github.io/nexora-academic/${path}/`))
    assert.ok(html.includes('application/ld+json'))
    const desc = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)[1]
    descriptions.add(desc)
    assert.ok(html.includes('/nexora-academic/assets/'))
  }
  assert.equal(descriptions.size,urls.length)
  assert.ok(readFileSync('dist/admin/index.html','utf8').includes('noindex, nofollow'))
  assert.ok(readFileSync('dist/404.html','utf8').includes('noindex, nofollow'))
  assert.ok(!readFileSync('dist/sitemap.xml','utf8').includes('/admin/'))
})
