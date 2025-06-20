import {defineField, defineType} from 'sanity'

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
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      validation: (Rule) => [Rule.max(200).error('Summary must be 200 characters or less')],
      description: 'A short summary of the playthrough.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'This will be displayed in the "Notes From Jay" section.',
    }),

    defineField({
      name: 'exercises',
      title: 'Exercises',
      type: 'array',
      of: [{type: 'exercise'}],
      description: 'Optional additional exercises related to this playthrough',
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      description: 'Select the difficulty level of this playthrough.',
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
            accept:
              '.pdf,.gp,.gpx,.gp5,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp3,.wav,.zip,.rar,.mid,.midi',
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
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'image',
    },
  },
})
