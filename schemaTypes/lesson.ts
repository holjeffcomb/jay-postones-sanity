import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'lesson',
  title: 'Lesson',
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
      name: 'lessonImage',
      title: 'Lesson Image',
      type: 'image',
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
      name: 'sticking',
      title: 'Sticking',
      type: 'string',
    }),
    defineField({
      name: 'timeSignature',
      title: 'Time Signature',
      type: 'string',
    }),
    defineField({
      name: 'tempo',
      title: 'Tempo',
      type: 'string',
    }),
    defineField({
      name: 'exercises',
      title: 'Exercises',
      type: 'array',
      of: [{type: 'exercise'}],
      validation: (Rule) =>
        Rule.required().min(1).warning('A lesson must have at least one exercise.'),
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      description: 'Select the difficulty level of this lesson.',
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
      of: [
        {
          type: 'reference',
          to: [{type: 'tag'}],
        },
      ],
    }),
    defineField({
      name: 'downloadableFiles',
      title: 'Downloadable Files',
      type: 'array',
      of: [
        {
          type: 'file',
          options: {
            accept: '.pdf,.gp,.gpx,.gp5,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp3,.wav,.zip,.rar',
          },
        },
      ],
      description:
        'Upload multiple files for download (PDFs, Guitar Pro, images, audio, docs, etc.).',
    }),

    defineField({
      name: 'isDisplayed',
      title: 'Display on Lesson Browser?',
      type: 'boolean',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'lessonImage',
    },
  },
})
