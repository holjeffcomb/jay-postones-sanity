import {defineField, defineType} from 'sanity'
import {tagOptions} from './common/tagOptions'

export default defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      validation: (Rule) => Rule.max(200),
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
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      description: 'Each course requires at least one lesson.',
      of: [{type: 'reference', to: {type: 'lesson'}}],
      validation: (Rule) => Rule.min(1).required(),
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      description: 'Select the difficulty level of this course.',
      options: {
        list: [
          {title: 'All Levels', value: 'all'},
          {title: 'Beginner', value: 'beginner'},
          {title: 'Intermediate', value: 'intermediate'},
          {title: 'Advanced', value: 'advanced'},
        ],
        layout: 'radio',
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'membershipLevel',
      title: 'Membership Level',
      type: 'string',
      options: {
        list: [
          {title: 'Free', value: 'free'},
          {title: 'Silver', value: 'silver'},
          {title: 'Gold', value: 'gold'},
          {title: 'Platinum', value: 'platinum'},
        ],
        layout: 'radio',
      },
      initialValue: 'free',
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
