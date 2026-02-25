import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'tesseract',
  title: 'Tesseract',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'A title for this tesseract',
    }),
    defineField({
      name: 'content',
      title: 'Course or Lesson',
      type: 'reference',
      to: [{type: 'course'}, {type: 'lesson'}],
      validation: (Rule) => Rule.required(),
      description:
        'Pick an existing course or lesson, or create a new one. Each tesseract is a single course or lesson.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      refTitle: 'content.title',
      refType: 'content._type',
    },
    prepare: ({title, refTitle, refType}) => ({
      title,
      subtitle: refTitle ? `${refType}: ${refTitle}` : undefined,
    }),
  },
})
