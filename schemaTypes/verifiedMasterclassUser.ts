import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'verifiedMasterclassUser',
  type: 'document',
  title: 'Verified Masterclass User',
  fields: [
    defineField({
      name: 'email',
      type: 'string',
      title: 'Email Address',
      validation: (Rule) =>
        Rule.required()
          .regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, {name: 'email', invert: false})
          .error('Must be a valid email address'),
    }),
    defineField({
      name: 'firstName',
      type: 'string',
      title: 'First Name',
    }),
    defineField({
      name: 'lastName',
      type: 'string',
      title: 'Last Name',
    }),
  ],
})
