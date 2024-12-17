import {defineField, defineType} from 'sanity'
import {tagOptions} from './common/tagOptions'

export default defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  fields: [
    defineField({
      name: 'course',
      title: 'Parent Course',
      type: 'reference',
      to: [{type: 'course'}],
    }),
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
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
    }),
    defineField({
      name: 'exercises',
      title: 'Exercises',
      type: 'array',
      of: [{type: 'exercise'}],
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
      of: [{type: 'string'}],
      options: {
        list: tagOptions,
      },
    }),
    defineField({
      name: 'downloadableFile',
      title: 'Downloadable File',
      type: 'file',
      options: {
        accept: '.zip,.pdf,.docx', // Adjust accepted file types if needed
      },
      description: 'Upload a file that users can download, such as a ZIP file.',
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
