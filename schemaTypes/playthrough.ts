import {defineField, defineType} from 'sanity'
import {tagOptions} from './common/tagOptions'

export default defineType({
  name: 'playthrough',
  title: 'Playthrough',
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
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'An optional URL for a video',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: tagOptions,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
})
