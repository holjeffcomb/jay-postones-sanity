import {defineField, defineType} from 'sanity'
import ShedLessonsInput from '../components/ShedLessonsInput'

export default defineType({
  name: 'shedLessons',
  title: 'Shed Lessons',
  type: 'document',
  fields: [
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      description: 'Add lessons to Shed Lessons. Pick from existing lessons or create new ones.',
      of: [{type: 'reference', to: {type: 'lesson'}}],
      components: {
        input: ShedLessonsInput,
      },
    }),
  ],
  preview: {
    select: {
      lessonCount: 'lessons',
    },
    prepare: ({lessonCount}) => {
      const count = Array.isArray(lessonCount) ? lessonCount.length : 0
      return {
        title: 'Shed Lessons',
        subtitle: `${count} lesson${count === 1 ? '' : 's'}`,
      }
    },
  },
})
