/**
 * Migration script to rename "playthrough" documents to "tesseract"
 * 
 * Run with: npx tsx scripts/migratePlaythroughToTesseract.ts
 * Or: npm run migrate:tesseract
 * 
 * This will:
 * 1. Find all documents with _type: "playthrough"
 * 2. Update their _type to "tesseract"
 * 3. Preserve all other data
 */

import {createClient} from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({path: '.env.local'})

// Create Sanity client
const client = createClient({
  projectId: 'bcij3qe4',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
})

async function migratePlaythroughToTesseract() {
  try {
    console.log('🔍 Finding all playthrough documents...')

    // Fetch all playthrough documents
    const playthroughs = await client.fetch(`*[_type == "playthrough"]`)

    if (playthroughs.length === 0) {
      console.log('✅ No playthrough documents found. Nothing to migrate!')
      return
    }

    console.log(`📦 Found ${playthroughs.length} playthrough document(s) to migrate`)

    // Migrate each document using transactions
    // Note: _type cannot be patched directly, so we delete old and create new
    for (const doc of playthroughs) {
      const docId = doc._id
      console.log(`\n🔄 Migrating: ${doc.title || docId}`)

      try {
        // Extract document data (excluding Sanity metadata)
        const {_type, _id, _rev, _createdAt, _updatedAt, ...docData} = doc

        // Create new document with type "tesseract" and same _id
        const newDoc = {
          _id: docId, // Preserve the same ID
          _type: 'tesseract',
          ...docData,
        }

        // Use transaction to delete old and create new atomically
        await client
          .transaction()
          .delete(docId) // Delete old playthrough document
          .create(newDoc) // Create new tesseract document with same ID
          .commit()

        console.log(`   ✅ Successfully migrated: ${doc.title || docId}`)
      } catch (error) {
        console.error(`   ❌ Error migrating ${docId}:`, error)
        if (error instanceof Error) {
          console.error(`   Error details: ${error.message}`)
        }
      }
    }

    console.log(`\n🎉 Migration complete! Migrated ${playthroughs.length} document(s).`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
migratePlaythroughToTesseract()
