import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'registrationSelection',
  title: 'Registration Selection Page',
  type: 'document',
  fields: [
    defineField({
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
      initialValue: 'Get Started with Jay Postones Drum Lessons',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageSubtitle',
      title: 'Page Subtitle',
      type: 'string',
      initialValue: 'Choose the option that best fits your learning style',
    }),
    defineField({
      name: 'existingAccountText',
      title: 'Existing Account Text',
      type: 'string',
      initialValue: 'Already have an account?',
      description: 'Text before the login link',
    }),
    defineField({
      name: 'membershipOption',
      title: 'Membership Option',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Membership',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'badge',
          title: 'Badge/Subtitle',
          type: 'string',
          initialValue: '7-Day Free Trial',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          initialValue: 'One membership. Complete access.',
        }),
        defineField({
          name: 'price',
          title: 'Price',
          type: 'string',
          initialValue: '$29.99/month',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'priceDescription',
          title: 'Price Description',
          type: 'string',
          initialValue: 'Cancel any time.',
        }),
        defineField({
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Start Free Trial',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'benefits',
          title: 'Benefits',
          type: 'array',
          of: [{type: 'string'}],
          validation: (Rule) => Rule.required().min(1),
          initialValue: [
            'Unlimited access to lessons and courses',
            'Weekly live streams with Jay',
            "Access Jay's Popular 'Nine Day Drumming Transformation' Course",
            "A Warm Welcome and support in Jay's Student Discord community",
            'Personal practice lists - so you always know what to practice',
            'Play-alongs, Notation, Guitar Pro & MIDI',
          ],
        }),
      ],
    }),
    defineField({
      name: 'masterclassOption',
      title: 'Masterclass Option',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          initialValue: 'Progressive Drumming Masterclass',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'badge',
          title: 'Badge/Subtitle',
          type: 'string',
          initialValue: '10-Weeks to Drumming Wizardry',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 2,
          initialValue: "Jay's Flagship Drumming Program",
        }),
        defineField({
          name: 'price',
          title: 'Price',
          type: 'string',
          initialValue: 'Premium Program',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'priceDescription',
          title: 'Price Description',
          type: 'text',
          rows: 2,
          initialValue: 'Transform your drumming with personal support from Jay',
        }),
        defineField({
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
          initialValue: 'Start Masterclass Signup',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'benefits',
          title: 'Benefits',
          type: 'array',
          of: [{type: 'string'}],
          validation: (Rule) => Rule.required().min(1),
          initialValue: [
            'Learn to use advanced drumming concepts like polyrhythms, metric modulation, and syncopation - musically',
            '1-on-1 support.',
            'Expand your vocabulary and develop your ability to flow.',
            'Weekly lesson schedule, to avoid burnout.',
            "Work alongside a pro - this is the best decision you'll ever make for your drumming!",
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'pageTitle',
    },
    prepare({title}) {
      return {
        title: title || 'Registration Selection Page',
        subtitle: 'Edit registration page content',
      }
    },
  },
})
