import {defineField, defineType} from 'sanity'
import {v4 as uuidv4} from 'uuid'

export default defineType({
  name: 'exercise',
  type: 'object',
  title: 'Exercise',
  fields: [
    defineField({
      name: 'id',
      type: 'string',
      title: 'Unique ID',
      description: 'Automatically generated UUID for each exercise',
      readOnly: true,
      initialValue: () => uuidv4(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Exercise Title',
      validation: (Rule) =>
        Rule.required().min(3).warning('A title is required for every exercise.'),
    }),
    defineField({
      name: 'type',
      type: 'string',
      title: 'Exercise Type',
      options: {
        list: [
          {title: 'Text', value: 'portableText'},
          {title: 'Video', value: 'video'},
          {title: 'Soundslice', value: 'soundslice'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      hidden: ({parent}) => parent?.type !== 'portableText',
      of: [
        {type: 'block'}, // Standard text blocks
        {type: 'image', options: {hotspot: true}}, // Add image support
      ],
    }),
    defineField({
      name: 'videoUrl',
      type: 'url',
      title: 'Video URL',
      hidden: ({parent}) => parent?.type !== 'video',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'soundsliceUrl',
      type: 'url',
      title: 'Soundslice URL',
      hidden: ({parent}) => parent?.type !== 'soundslice',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      title: 'Created At',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
})
