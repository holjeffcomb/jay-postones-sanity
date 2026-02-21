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

        // Sanity doesn't allow changing _type directly.
        // The workaround is to delete and recreate, but Sanity may prevent
        // creating a document with the same _id immediately after deletion.
        // 
        // Try using createOrReplace first - if that fails with _type error,
        // fall back to delete + delay + create
        try {
          // Try createOrReplace first - this might work in some Sanity versions
          await client.createOrReplace(newDoc)
        } catch (replaceError: any) {
          // If createOrReplace fails due to _type immutability, use delete + create
          if (replaceError?.message?.includes('_type') || replaceError?.message?.includes('immutable')) {
            console.log(`   ⚠️  createOrReplace failed, using delete + create approach...`)
            await client.delete(docId)
            // Wait for deletion to fully process
            await new Promise(resolve => setTimeout(resolve, 1000))
            await client.create(newDoc)
          } else {
            throw replaceError
          }
        }

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
