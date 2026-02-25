/**
 * Migration script to convert old Tesseract documents to the new schema.
 *
 * Old tesseract had embedded content (title, subtitle, image, summary, description,
 * exercises, level, membershipLevel, tags, downloadableFiles, isDisplayed).
 *
 * New tesseract has: title + content (reference to course or lesson).
 *
 * This script creates a lesson from each old tesseract's embedded data,
 * then updates the tesseract to reference that lesson.
 *
 * Run with: npx tsx scripts/migrateTesseractToNewSchema.ts
 * Or: npm run migrate:tesseract-schema
 *
 * Requires SANITY_WRITE_TOKEN in .env.local
 */

import {createClient} from '@sanity/client'
import {v4 as uuidv4} from 'uuid'
import dotenv from 'dotenv'

dotenv.config({path: '.env.local'})

const client = createClient({
  projectId: 'bcij3qe4',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
})

function generateKey(): string {
  return uuidv4().replace(/-/g, '').slice(0, 12)
}

function createPlaceholderExercise(description: string) {
  const text = description || 'Content migrated from Tesseract.'
  return {
    _type: 'exercise',
    _key: generateKey(),
    id: uuidv4(),
    title: 'Notes',
    type: 'portableText',
    createdAt: new Date().toISOString(),
    content: [
      {
        _type: 'block',
        _key: generateKey(),
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: generateKey(),
            text,
            marks: [],
          },
        ],
      },
    ],
  }
}

async function migrateTesseractToNewSchema() {
  try {
    console.log('🔍 Finding tesseract documents with old schema...')

    const tesseracts = await client.fetch(`
      *[_type == "tesseract" && !defined(content) && (defined(subtitle) || defined(image) || defined(exercises))]
    `)

    if (tesseracts.length === 0) {
      console.log('✅ No tesseract documents with old schema found. Nothing to migrate!')
      return
    }

    console.log(`📦 Found ${tesseracts.length} tesseract(s) to migrate\n`)

    for (const doc of tesseracts) {
      const docId = doc._id
      const title = doc.title || 'Untitled Tesseract'
      console.log(`🔄 Migrating: ${title} (${docId})`)

      try {
        // Build exercises array - lesson requires at least one
        const oldExercises = doc.exercises || []
        const exercises =
          oldExercises.length > 0
            ? oldExercises.map((ex: Record<string, unknown>) => ({
                ...ex,
                _key: ex._key || generateKey(),
                _type: 'exercise',
              }))
            : [createPlaceholderExercise(doc.description || doc.summary)]

        // Create new lesson from old tesseract data
        // Use full docId to avoid collision between draft and published docs
        const lessonId = `lesson-migrated-${docId.replace(/\./g, '-')}`
        const lesson = {
          _id: lessonId,
          _type: 'lesson',
          title: doc.title,
          subtitle: doc.subtitle,
          summary: doc.summary || '',
          description: doc.description || '',
          lessonImage: doc.image, // tesseract used 'image', lesson uses 'lessonImage'
          exercises,
          level: doc.level || 'all',
          membershipLevel: doc.membershipLevel || 'free',
          tags: doc.tags || [],
          downloadableFiles: doc.downloadableFiles || [],
          isDisplayed: doc.isDisplayed ?? true,
          isDailyLesson: false,
        }

        // Create the lesson
        await client.createOrReplace(lesson)
        console.log(`   📝 Created lesson: ${lessonId}`)

        // Replace tesseract with new schema (reference to lesson)
        const newTesseract = {
          _id: docId,
          _type: 'tesseract',
          title: doc.title,
          content: {
            _type: 'reference',
            _ref: lessonId,
          },
        }

        await client.createOrReplace(newTesseract)
        console.log(`   ✅ Updated tesseract to reference lesson`)
      } catch (error) {
        console.error(`   ❌ Error migrating ${docId}:`, error)
        if (error instanceof Error) {
          console.error(`   Details: ${error.message}`)
        }
      }
    }

    console.log(`\n🎉 Migration complete! Processed ${tesseracts.length} document(s).`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrateTesseractToNewSchema()
