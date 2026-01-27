/**
 * Simple proxy server for OpenAI API calls
 *
 * This runs locally alongside Sanity Studio to handle OpenAI API calls
 * and avoid CORS issues.
 *
 * Run with: npm run proxy
 */

// Load environment variables from .env.local
// Try multiple paths to be sure we find it
const dotenv = require('dotenv')
const result = dotenv.config({path: '.env.local'})

if (result.error) {
  console.warn('⚠️  Warning: Could not load .env.local, trying default .env')
  dotenv.config() // Try default .env as fallback
}

const http = require('http')
const https = require('https')

const PORT = 3001
// Try both possible env var names and trim whitespace/newlines
let OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.SANITY_STUDIO_OPENAI_API_KEY
if (OPENAI_API_KEY) {
  OPENAI_API_KEY = OPENAI_API_KEY.trim().replace(/\r?\n/g, '')
}

if (!OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY or SANITY_STUDIO_OPENAI_API_KEY not set')
  console.error('   Please add it to your .env.local file')
  console.error('   Current env vars:', {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '***set***' : 'not set',
    SANITY_STUDIO_OPENAI_API_KEY: process.env.SANITY_STUDIO_OPENAI_API_KEY
      ? '***set***'
      : 'not set',
  })
  process.exit(1)
}

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  // Only handle POST requests to /autofill
  if (req.method !== 'POST' || req.url !== '/autofill') {
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.end('Not Found')
    return
  }

  let body = ''
  req.on('data', (chunk) => {
    body += chunk.toString()
  })

  req.on('end', () => {
    try {
      const {transcript, title} = JSON.parse(body)

      if (!transcript) {
        res.writeHead(400, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({error: 'Transcript is required'}))
        return
      }

      // Debug: Log the key being used (first 10 and last 4 chars only for security)
      const keyPreview = OPENAI_API_KEY.length > 14
        ? OPENAI_API_KEY.substring(0, 10) + '...' + OPENAI_API_KEY.slice(-4)
        : '***'
      console.log(`📤 Sending request to OpenAI with key: ${keyPreview}`)
      console.log(`   Key length: ${OPENAI_API_KEY.length} chars`)
      console.log(`   Key starts with: ${OPENAI_API_KEY.substring(0, 15)}`)
      console.log(`   Key ends with: ${OPENAI_API_KEY.slice(-10)}`)
      
      // Check for non-printable characters
      const hasNonPrintable = /[^\x20-\x7E]/.test(OPENAI_API_KEY)
      if (hasNonPrintable) {
        console.warn('⚠️  Warning: Key contains non-printable characters!')
      }

      // Forward request to OpenAI
      const authHeader = `Bearer ${OPENAI_API_KEY}`
      const openaiRequest = https.request(
        {
          hostname: 'api.openai.com',
          path: '/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader,
          },
        },
        (openaiResponse) => {
          let openaiBody = ''
          openaiResponse.on('data', (chunk) => {
            openaiBody += chunk.toString()
          })
          openaiResponse.on('end', () => {
            // Log errors for debugging
            if (openaiResponse.statusCode !== 200) {
              console.error(`❌ OpenAI API error (${openaiResponse.statusCode}):`, openaiBody)
              try {
                const errorData = JSON.parse(openaiBody)
                if (errorData.error?.message) {
                  console.error(`   Error message: ${errorData.error.message}`)
                }
              } catch (e) {
                // Not JSON, that's okay
              }
            }
            res.writeHead(openaiResponse.statusCode, {
              'Content-Type': 'application/json',
            })
            res.end(openaiBody)
          })
        },
      )

      openaiRequest.on('error', (error) => {
        console.error('OpenAI request error:', error)
        res.writeHead(500, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({error: 'Failed to connect to OpenAI'}))
      })

      const requestBody = JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that generates lesson metadata from transcripts.
Generate:
1. A subtitle (a few words, catchy and descriptive)
2. A summary (no more than 150 characters, concise overview)
3. A description (2-3 paragraphs, detailed explanation for "Notes From Jay" section)

Return ONLY valid JSON in this exact format:
{
  "subtitle": "the subtitle here",
  "summary": "the summary here (max 150 chars)",
  "description": "the description here (2-3 paragraphs)"
}`,
          },
          {
            role: 'user',
            content: `Lesson title: ${title || 'Untitled'}\n\nTranscript:\n${transcript}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      })

      openaiRequest.write(requestBody)
      openaiRequest.end()
    } catch (error) {
      console.error('Error processing request:', error)
      res.writeHead(500, {'Content-Type': 'application/json'})
      res.end(JSON.stringify({error: 'Invalid request'}))
    }
  })
})

server.listen(PORT, () => {
  console.log(`✅ Autofill proxy server running on http://localhost:${PORT}`)
  console.log(`   Make sure to keep this running while using Sanity Studio`)

  if (OPENAI_API_KEY) {
    const keyPreview =
      OPENAI_API_KEY.length > 10
        ? OPENAI_API_KEY.substring(0, 7) + '...' + OPENAI_API_KEY.slice(-4)
        : '***'
    console.log(`   ✅ API Key loaded: ${keyPreview}`)
    console.log(`   ✅ Key length: ${OPENAI_API_KEY.length} characters`)
  } else {
    console.error(`   ❌ API Key NOT loaded - check .env.local file!`)
  }
})
