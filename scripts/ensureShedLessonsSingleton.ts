/**
 * Ensures singleton documents exist (Shed Lessons, Livestream).
 * Run once to fix "Untitled" showing in the document pane.
 *
 * npx tsx scripts/ensureShedLessonsSingleton.ts
 */

import {createClient} from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({path: '.env.local'})

const client = createClient({
  projectId: 'bcij3qe4',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
})

const singletons = [
  {id: 'shedLessons', type: 'shedLessons'},
  {id: 'livestream', type: 'livestream'},
]

async function ensureSingletons() {
  try {
    for (const {id, type} of singletons) {
      const existing = await client.fetch(`*[_id == "${id}"][0]{ _id }`)
      if (existing) {
        console.log(`✅ ${type} singleton already exists`)
      } else {
        await client.create({
          _id: id,
          _type: type,
          lessons: [],
        })
        console.log(`✅ Created ${type} singleton`)
      }
    }
  } catch (error) {
    console.error('❌ Failed:', error)
    process.exit(1)
  }
}

ensureSingletons()
