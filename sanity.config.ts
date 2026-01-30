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
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            // Registration Selection Page (singleton)
            S.listItem()
              .title('Registration Selection Page')
              .id('registrationSelection')
              .child(
                S.document()
                  .schemaType('registrationSelection')
                  .documentId('registrationSelection'),
              ),
            // Daily Lessons (singleton)
            S.listItem()
              .title('Daily Lessons')
              .id('dailyLessons')
              .child(
                S.document()
                  .schemaType('dailyLessons')
                  .documentId('dailyLessons'),
              ),
            // Orderable Courses List
            orderableDocumentListDeskItem({
              type: 'course',
              title: 'Courses',
              S,
              context,
            }),
            // Add a divider
            S.divider(),
            // All other document types (lessons, modules, tags, etc.)
            ...S.documentTypeListItems().filter(
              (listItem) =>
                listItem.getId() !== 'course' &&
                listItem.getId() !== 'dailyLessons' &&
                listItem.getId() !== 'registrationSelection',
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
