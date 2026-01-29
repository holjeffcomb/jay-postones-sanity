import {defineField, defineType} from 'sanity'
import DailyLessonsInput from '../components/DailyLessonsInput'

export default defineType({
  name: 'dailyLessons',
  title: 'Daily Lessons',
  type: 'document',
  // Make it a singleton - only one instance
  __experimental_actions: [
    // Disable create/delete, only allow update
    // 'create',
    // 'delete',
    'update',
    'publish',
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Daily Lessons',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'lessons',
      title: 'Lessons',
      type: 'array',
      description:
        'This list automatically shows all lessons with the "Daily Lesson" toggle enabled. Drag and drop to reorder. To add/remove lessons, toggle the "Daily Lesson" checkbox when editing individual lessons.',
      of: [
        {
          type: 'reference',
          to: [{type: 'lesson'}],
        },
      ],
      components: {
        input: DailyLessonsInput,
      },
      options: {
        // Disable the add button by making it read-only for additions
        // Users can still reorder via drag-and-drop
      },
      // Drag-and-drop reordering is built into Sanity arrays by default
    }),
  ],
  preview: {
    select: {
      title: 'title',
      lessonCount: 'lessons',
    },
    prepare({title, lessonCount}) {
      const count = Array.isArray(lessonCount) ? lessonCount.length : 0
      return {
        title: 'Daily Lessons',
        subtitle: `${count} lesson${count !== 1 ? 's' : ''} selected`,
      }
    },
  },
})
