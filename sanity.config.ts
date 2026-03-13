import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

export default defineConfig({
  name: 'default',
  title: 'jay-postones-backend',
  projectId: 'bcij3qe4',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) => {
        const docItems = S.documentTypeListItems()
        return S.list()
          .title('Content')
          .items([
            // Courses
            orderableDocumentListDeskItem({
              type: 'course',
              title: 'Courses',
              S,
              context,
            }),
            // Modules (custom title for sidebar; schema keeps "Module" for document view)
            S.listItem()
              .title('Modules')
              .id('module')
              .schemaType('module')
              .child(S.documentTypeList('module').title('Modules')),
            // Lessons (custom title for sidebar; schema keeps "Lesson" for document view)
            S.listItem()
              .title('Lessons')
              .id('lesson')
              .schemaType('lesson')
              .child(S.documentTypeList('lesson').title('Lessons')),
            // Daily Lessons (singleton)
            S.listItem()
              .title('Daily Lessons')
              .id('dailyLessons')
              .child(S.document().schemaType('dailyLessons').documentId('dailyLessons')),
            // Shed Lessons (singleton)
            S.listItem()
              .title('Shed Lessons')
              .id('shedLessons')
              .child(S.document().schemaType('shedLessons').documentId('shedLessons')),
            // Tesseract
            orderableDocumentListDeskItem({
              type: 'tesseract',
              title: 'Tesseract',
              S,
              context,
            }),
            S.divider(),
            // Tag
            docItems.find((item) => item.getId() === 'tag'),
            // Registration Selection Page (singleton)
            S.listItem()
              .title('Registration Selection Page')
              .id('registrationSelection')
              .child(
                S.document()
                  .schemaType('registrationSelection')
                  .documentId('registrationSelection'),
              ),
          ].filter((item): item is NonNullable<typeof item> => Boolean(item)))
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
