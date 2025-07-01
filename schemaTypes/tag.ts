import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      title: 'Weight',
      name: 'weight',
      type: 'number',
      description:
        'A number that determines the order of tags in lists. Lower numbers appear first.',
      validation: (Rule) => Rule.min(1).max(5).error('Weight must be between 1 and 5'),
      initialValue: 5,
    }),
  ],
})
