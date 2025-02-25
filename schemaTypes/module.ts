import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'module',
  title: 'Module',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      description: 'Modules contain lessons.',
      of: [{type: 'reference', to: {type: 'lesson'}}],
      validation: (Rule) => Rule.min(1).required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
