# Migration Guide: Playthrough → Tesseract

This guide will help you migrate all existing "playthrough" documents to "tesseract" in your Sanity database.

## Option 1: Using Sanity's Migration Script (Recommended)

### Step 1: Install tsx (if not already installed)

```bash
npm install -D tsx
```

### Step 2: Run the migration script

```bash
npm run migrate:tesseract
```

Or directly:
```bash
npx tsx scripts/migratePlaythroughToTesseract.ts
```

The script will:
- Find all documents with `_type: "playthrough"`
- Update them to `_type: "tesseract"`
- Preserve all other data

## Option 2: Using Sanity Vision (Manual)

1. Open Sanity Studio
2. Go to the Vision tool (in the toolbar)
3. Run this query to see all playthrough documents:
   ```
   *[_type == "playthrough"]
   ```
4. Then run this mutation for each document (replace `DOCUMENT_ID`):
   ```
   *[_id == "DOCUMENT_ID"][0] {
     ...,
     _type: "tesseract"
   }
   ```

## Option 3: Using Sanity CLI Migration

You can also use Sanity's built-in migration tools:

```bash
npx sanity@latest exec scripts/migratePlaythroughToTesseract.ts --with-user-token
```

## What Happens

- All documents with `_type: "playthrough"` will be renamed to `_type: "tesseract"`
- All field data is preserved
- The schema change is already in place, so after migration, documents will appear as "Tesseract" in the Studio

## After Migration

1. Restart your Sanity Studio
2. You should see "Tesseract" instead of "Playthrough" in the sidebar
3. All your existing data will be there, just with the new type name

## Troubleshooting

If you get permission errors, make sure your `SANITY_WRITE_TOKEN` in `.env.local` has write permissions.
