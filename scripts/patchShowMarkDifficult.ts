import {createClient} from '@sanity/client'
import dotenv from 'dotenv'
dotenv.config({path: '.env.local'})

const client = createClient({
  projectId: 'bcij3qe4',
  dataset: 'production',
  apiVersion: '2023-10-10',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

async function patchLessonsWithMissingExerciseToggles() {
  const lessons = await client.fetch<any[]>(`
    *[_type == "lesson" && defined(exercises)] {
      _id,
      exercises
    }
  `)

  const lessonsToUpdate = lessons.filter((lesson) =>
    lesson.exercises.some((ex: any) => typeof ex.showMarkDifficult === 'undefined'),
  )

  console.log(`🧠 Found ${lessonsToUpdate.length} lessons with missing exercise toggles.`)

  for (const lesson of lessonsToUpdate) {
    const updatedExercises = lesson.exercises.map((ex: any) => {
      if (typeof ex.showMarkDifficult === 'undefined') {
        return {...ex, showMarkDifficult: true}
      }
      return ex
    })

    try {
      await client.patch(lesson._id).set({exercises: updatedExercises}).commit()

      console.log(`✅ Patched lesson ${lesson._id}`)
    } catch (err) {
      console.error(`❌ Failed to patch ${lesson._id}`, err)
    }
  }

  console.log('🎉 All done!')
}

patchLessonsWithMissingExerciseToggles()
