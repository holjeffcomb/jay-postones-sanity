import {defineField, defineType} from 'sanity'
import EasierLessonsInput from '../components/EasierLessonsInput'
import LessonAutofill from '../components/LessonAutofill'

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
      name: 'transcript',
      title: 'Transcript (for Autofill)',
      type: 'text',
      rows: 8,
      description:
        'Paste the lesson transcript here and use the autofill tool to generate subtitle, summary, and description.',
      components: {
        input: LessonAutofill,
      },
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
      rows: 4,
      validation: (Rule) => Rule.required().warning('A summary is optional but recommended'),
      description: 'A short summary of the lesson.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required().warning('A summary is strongly recommended'),
      description: 'This will be displayed in the "Notes From Jay" section.',
    }),
    defineField({
      name: 'lessonImage',
      title: 'Lesson Image',
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
      title: 'Goal Tempo',
      type: 'string',
      description: 'The text "BPM" will automatically be displayed on the front end (eg. 120 BPM)',
    }),
    defineField({
      name: 'exercises',
      title: 'Exercises',
      type: 'array',
      of: [{type: 'exercise'}],
      validation: (Rule) =>
        Rule.required().min(1).error('A lesson must have at least one exercise.'),
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
    }),
    defineField({
      name: 'isDailyLesson',
      title: 'Daily Lesson',
      type: 'boolean',
      description:
        'Toggle this to include this lesson in the Daily Lessons list. The list will update automatically.',
      initialValue: false,
    }),
    defineField({
      name: 'easierLessons',
      title: 'Easier Lessons',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'lesson'}]}],
      components: {
        input: EasierLessonsInput, // Custom input component
      },
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
