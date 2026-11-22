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
          {title: 'DrumKi player', value: 'drumki'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      hidden: ({parent}) => parent?.type !== 'portableText',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
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
      name: 'drumkiSlug',
      type: 'string',
      title: 'DrumKi exercise',
      description:
        "Paste the exercise's address from the DrumKi player (the one with # in it), or just the ID after the #. Not a student share link (/s/...): those open the exercise for anyone. Keep the Soundslice URL filled in so the exercise can be switched back.",
      hidden: ({parent}) => parent?.type !== 'drumki',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {type?: string} | undefined
          if (parent?.type !== 'drumki') return true
          if (!value) return "A DrumKi exercise needs the exercise's address or ID."
          const v = value.trim()
          if (/\/s\/[A-Za-z0-9]+/.test(v))
            return "That's a student share link, which anyone can open. Use the exercise's address from the player instead (it has # in it)."
          const id = v.includes('#') ? v.slice(v.lastIndexOf('#') + 1) : v
          if (!/^[A-Za-z0-9_-]{1,120}$/.test(id))
            return 'That doesn\'t look like a DrumKi exercise. Paste the address from the player (with # in it) or the ID after the #.'
          return true
        }),
    }),
    defineField({
      name: 'showMarkDifficult',
      type: 'boolean',
      title: 'Able to Mark as Difficult?',
      description: 'Enable this if you want this exercise to show the "Mark Difficult" button.',
      initialValue: true,
    }),
    defineField({
      name: 'integration',
      type: 'boolean',
      title: 'Integration',
      description: 'Toggle on if this is an Integration',
      initialValue: false,
    }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      title: 'Created At',
      description: 'Timestamp when this exercise was created',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
})
