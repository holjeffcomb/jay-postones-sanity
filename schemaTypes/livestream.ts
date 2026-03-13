import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'livestream',
  title: 'Livestream',
  type: 'document',
  fields: [
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      description: 'Add lessons to Livestream. Pick from existing lessons or create new ones.',
      of: [{type: 'reference', to: {type: 'lesson'}}],
    }),
  ],
  preview: {
    select: {
      lessonCount: 'lessons',
    },
    prepare: ({lessonCount}) => {
      const count = Array.isArray(lessonCount) ? lessonCount.length : 0
      return {
        title: 'Livestream',
        subtitle: `${count} lesson${count === 1 ? '' : 's'}`,
      }
    },
  },
})
