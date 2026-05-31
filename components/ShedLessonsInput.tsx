import React from 'react'
import {Button, Stack, Card, Text, Flex} from '@sanity/ui'
import {AddIcon} from '@sanity/icons'
import {ArrayOfObjectsInputProps} from 'sanity'
import {ArrayOfObjectsInput} from 'sanity'
import {v4 as uuid} from 'uuid'

/**
 * Custom input for the Shed Lessons array.
 *
 * Adds an "Add Lesson" button at the top of the field so the client doesn't
 * have to scroll to the bottom of a long list to reach the default add button.
 * Clicking it prepends a new (empty) lesson reference to the top of the list,
 * with the search box ready to pick a lesson. The default bottom add button
 * is left in place as well.
 */
export default function ShedLessonsInput(props: ArrayOfObjectsInputProps) {
  const {value, onItemPrepend} = props

  const handleAddToTop = () => {
    onItemPrepend({_key: uuid(), _type: 'reference'} as any)
  }

  const count = Array.isArray(value) ? value.length : 0

  return (
    <Stack space={3}>
      <Card padding={3} tone="transparent" border>
        <Flex align="center" justify="space-between" gap={3}>
          <Text size={1} muted>
            {count} lesson{count === 1 ? '' : 's'}
          </Text>
          <Button
            text="Add Lesson"
            icon={AddIcon}
            tone="primary"
            mode="default"
            onClick={handleAddToTop}
          />
        </Flex>
      </Card>

      <ArrayOfObjectsInput {...props} />
    </Stack>
  )
}
