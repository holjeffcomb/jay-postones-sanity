/**
 * Ensures the Shed Lessons singleton document exists with the correct title.
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

async function ensureShedLessonsSingleton() {
  try {
    const existing = await client.fetch('*[_id == "shedLessons"][0]{ _id }')
    if (existing) {
      console.log('✅ Shed Lessons singleton already exists')
    } else {
      await client.create({
        _id: 'shedLessons',
        _type: 'shedLessons',
        lessons: [],
      })
      console.log('✅ Created Shed Lessons singleton')
    }
  } catch (error) {
    console.error('❌ Failed:', error)
    process.exit(1)
  }
}

ensureShedLessonsSingleton()
