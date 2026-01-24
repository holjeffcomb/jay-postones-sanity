import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({type: 'course'}),
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
      name: 'featured',
      title: 'Featured Course',
      type: 'boolean',
      description: 'Mark this course as featured to display it in the Featured Courses section',
      initialValue: false,
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
      name: 'previewVideo',
      title: 'Preview Video',
      type: 'file',
      description: 'A short video preview (preferably 10-15 seconds, 720p, optimized for web)',
      options: {
        accept: 'video/mp4,video/webm',
      },
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'An optional URL for a video',
    }),
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      description: 'Choose whether this course consists of lessons or modules.',
      options: {
        list: [
          {title: 'Lessons', value: 'lessons'},
          {title: 'Modules', value: 'modules'},
        ],
        layout: 'radio',
      },
      initialValue: 'lessons',
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      description: 'Each course requires at least one lesson.',
      of: [{type: 'reference', to: {type: 'lesson'}}],
      hidden: ({document}) => document?.contentType !== 'lessons', // Hide unless 'Lessons' is selected
      validation: (Rule) =>
        Rule.custom((lessons, context) => {
          if (context.document?.contentType === 'lessons' && (!lessons || lessons.length < 1)) {
            return 'A course with lessons must have at least one lesson.'
          }
          return true
        }),
    }),
    defineField({
      name: 'modules',
      title: 'Modules',
      type: 'array',
      description: 'Each course requires at least one module if using modules.',
      of: [{type: 'reference', to: {type: 'module'}}],
      hidden: ({document}) => document?.contentType !== 'modules', // Hide unless 'Modules' is selected
      validation: (Rule) =>
        Rule.custom((modules, context) => {
          if (context.document?.contentType === 'modules' && (!modules || modules.length < 1)) {
            return 'A course with modules must have at least one module.'
          }
          return true
        }),
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
      name: 'stripeProductId',
      title: 'Stripe Product ID',
      type: 'string',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'tag'}],
        },
      ],
    }),
    defineField({
      name: 'isVisible',
      title: 'Display on Course Browser?',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
})
