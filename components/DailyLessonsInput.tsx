import React, {useState, useEffect} from 'react'
import {useClient} from 'sanity'
import {Button, Stack, Card, Text, Flex, Spinner} from '@sanity/ui'
import {ArrayOfObjectsInputProps} from 'sanity'
import {ArrayOfObjectsInput} from 'sanity'
import {PatchEvent, set} from 'sanity'
import {v4 as uuid} from 'uuid'
import styled from 'styled-components'

// Hide the "Add item" button with CSS
const HiddenAddButton = styled.div`
  /* Hide Sanity's array add button */
  button[data-testid='array-input-append-button'],
  button[aria-label*='Add'],
  [data-testid='array-input-insert-button'],
  [data-testid='array-input-insert-before-button'],
  button:has([data-sanity-icon='add']) {
    display: none !important;
  }
  
  /* Also target by class if needed */
  [class*='ArrayInput__insertButton'],
  [class*='ArrayOfObjectsInput__insertButton'] {
    display: none !important;
  }
`

/**
 * Custom input component for Daily Lessons
 * Auto-populates from lessons with isDailyLesson=true
 * Allows reordering but not manual add/remove
 */
export default function DailyLessonsInput(props: ArrayOfObjectsInputProps) {
  const {value, onChange, schemaType, members, renderDefault, ...restProps} = props

  const client = useClient({apiVersion: '2023-01-01'})
  const [isLoading, setIsLoading] = useState(false)
  const valueRef = React.useRef(value)
  const onChangeRef = React.useRef(onChange)

  // Keep refs updated
  useEffect(() => {
    valueRef.current = value
    onChangeRef.current = onChange
  }, [value, onChange])

  const populateFromToggles = React.useCallback(async () => {
    setIsLoading(true)
    try {
      // Get all lessons marked as daily lessons
      const dailyLessons = await client.fetch(
        `*[_type == "lesson" && isDailyLesson == true && !(_id in path("drafts.**"))]{_id, title}`,
      )

      const currentValue = valueRef.current

      if (dailyLessons.length === 0) {
        // If no daily lessons, clear the array
        if (Array.isArray(currentValue) && currentValue.length > 0) {
          onChangeRef.current(PatchEvent.from(set([])))
        }
        setIsLoading(false)
        return
      }

      // Get current lesson IDs in the array (for preserving order)
      const currentIds = Array.isArray(currentValue)
        ? currentValue
            .map((item: any) => item?._ref?.replace('drafts.', '') || item?._ref)
            .filter(Boolean)
        : []

      // Create references, preserving existing order when possible
      const allReferences = dailyLessons.map((lesson: {_id: string}) => {
        // Check if this lesson is already in the array (preserve its position)
        const existingItem = Array.isArray(currentValue)
          ? currentValue.find((item: any) => {
              const refId = item?._ref?.replace('drafts.', '') || item?._ref
              return refId === lesson._id.replace('drafts.', '')
            })
          : null

        // Use existing item if found (preserves order), otherwise create new reference
        if (existingItem) {
          return existingItem
        }

        return {
          _type: 'reference',
          _ref: lesson._id,
          _key: uuid(),
        }
      })

      // Check if there are changes
      const currentRefIds = (currentValue || []).map((item: any) =>
        (item?._ref || '').replace('drafts.', ''),
      )
      const newRefIds = allReferences.map((item: any) =>
        (item?._ref || '').replace('drafts.', ''),
      )

      const hasChanges =
        currentRefIds.length !== newRefIds.length ||
        !currentRefIds.every((id) => newRefIds.includes(id)) ||
        !newRefIds.every((id) => currentRefIds.includes(id))

      if (hasChanges) {
        onChangeRef.current(PatchEvent.from(set(allReferences)))
      }
    } catch (error) {
      console.error('Error populating daily lessons:', error)
    } finally {
      setIsLoading(false)
    }
  }, [client])

  // Auto-populate on mount and refresh periodically
  useEffect(() => {
    // Initial populate
    populateFromToggles()

    // Refresh every 3 seconds to catch toggles made elsewhere
    const interval = setInterval(() => {
      populateFromToggles()
    }, 3000)

    return () => clearInterval(interval)
  }, [populateFromToggles])

  // Filter out the "new item" member to hide the add button
  const filteredMembers = React.useMemo(() => {
    if (!members) return members
    // The "new item" button is typically the last member with kind 'item' and no key
    // Filter it out to hide the add button
    return members.filter((member: any) => {
      // Keep all actual array items and field members
      // Remove the "new item" member (usually has kind 'item' but represents the add button)
      if (member.kind === 'item' && !member.key && member.name === undefined) {
        return false
      }
      return true
    })
  }, [members])

  return (
    <Stack space={3}>
      <Card padding={3} tone="transparent" border>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            Daily Lessons
          </Text>
          <Text size={1} muted>
            This list automatically shows all lessons with the "Daily Lesson" toggle enabled. Drag
            and drop to reorder. To add/remove lessons, toggle the "Daily Lesson" checkbox when
            editing individual lessons.
          </Text>
          <Flex gap={2}>
            <Button
              text="Refresh"
              onClick={populateFromToggles}
              disabled={isLoading}
              tone="default"
              mode="ghost"
            />
            {isLoading && (
              <>
                <Spinner />
                <Text size={1}>Syncing...</Text>
              </>
            )}
          </Flex>
        </Stack>
      </Card>

      <HiddenAddButton>
        <ArrayOfObjectsInput
          {...restProps}
          value={value}
          onChange={onChange}
          members={filteredMembers}
          schemaType={schemaType}
          renderDefault={renderDefault}
        />
      </HiddenAddButton>
    </Stack>
  )
}
