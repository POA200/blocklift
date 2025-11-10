#!/usr/bin/env node
// Simple mock HTTP server returning impact metrics JSON for local development.
const http = require('http')

const PORT = process.env.MOCK_PORT || 4001

const metrics = [
  { key: 'children_equipped', label: 'Children Equipped', desc: 'Nutritious meals & learning kits delivered', value: 5000, suffix: '+' },
  { key: 'verified_donations', label: 'Verified Donations', desc: 'Donations recorded on-chain (verified)', value: 12500, prefix: '$' },
  { key: 'nft_proofs', label: 'NFT Proofs Minted', desc: 'On-chain receipts minted for donors', value: 1240 },
  { key: 'field_ambassadors', label: 'Field Ambassadors', desc: 'Local verifiers & volunteers deployed', value: 45 },
]

const server = http.createServer((req, res) => {
  if (req.url === '/metrics' || req.url === '/api/metrics') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    res.end(JSON.stringify({ metrics }))
    return
  }

  // Simple verification endpoint for local testing
  if (req.url === '/api/verify' && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}')
        const id = (payload.id || '').toString().trim()
        // naive validation: require length > 5 for success
        if (id && id.length > 5) {
          res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
          res.end(JSON.stringify({ ok: true, message: 'Verified', id }))
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
          res.end(JSON.stringify({ ok: false, message: 'Invalid or too-short id' }))
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        res.end(JSON.stringify({ ok: false, message: 'Bad request' }))
      }
    })
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock metrics server running at http://localhost:${PORT}/metrics`)
})
