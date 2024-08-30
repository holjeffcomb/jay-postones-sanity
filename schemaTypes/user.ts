import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'username',
      title: 'Username',
      type: 'string',
    }),
    defineField({
      name: 'membershipStatus',
      title: 'Membership Status',
      type: 'string',
      initialValue: 'Bronze',
      options: {
        list: [
          {title: 'bronze', value: 'Bronze'},
          {title: 'silver', value: 'Silver'},
          {title: 'gold', value: 'Gold'},
          {title: 'platinum', value: 'Platinum'},
          // Add more roles as needed
        ],
      },
    }),
    defineField({
      name: 'profilePicture',
      title: 'Profile Picture',
      type: 'image',
      options: {
        hotspot: true, // Allows you to select the main focus point of the image
      },
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      profilePicture: 'profilePicture',
    },
    prepare({firstName, lastName, email, profilePicture}) {
      const title = firstName && lastName ? `${firstName} ${lastName}` : email
      return {
        title,
        media: profilePicture,
      }
    },
  },
})
