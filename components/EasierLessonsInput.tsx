import React from 'react'
import {useClient, useFormValue} from 'sanity'
import {Button, Stack, Card, Text, Flex} from '@sanity/ui'
import {ArrayOfObjectsInputProps, Reference} from 'sanity'
import {PatchEvent, set, setIfMissing, insert, unset} from 'sanity'
import {ArrayOfObjectsInput} from 'sanity'
import {v4 as uuid} from 'uuid'

export default function EasierLessonsInput(props: ArrayOfObjectsInputProps) {
  const {value, onChange, schemaType, members, renderDefault, ...restProps} = props

  const client = useClient({apiVersion: '2023-01-01'})
  const lessonDoc = useFormValue([]) as {
    _id?: string
    level?: 'all' | 'beginner' | 'intermediate' | 'advanced'
    tags?: Reference[]
  }

  const handleClear = () => {
    onChange(PatchEvent.from(set([])))
  }

  const handleAutoFill = async () => {
    if (!lessonDoc || !lessonDoc.level) return

    const currentLevel = lessonDoc.level
    const tagRefs = (lessonDoc.tags || []).map((tag) => tag?._ref).filter(Boolean)

    console.log('🔍 Current lesson _id:', lessonDoc._id)
    console.log('🎚️ Level:', currentLevel)
    console.log('🏷️ Tag refs:', tagRefs)

    const levelOrder = ['beginner', 'intermediate', 'advanced']
    const currentLevelIndex = levelOrder.indexOf(currentLevel)
    const easierLevels = levelOrder.slice(0, currentLevelIndex)

    console.log('⬇️ Easier levels:', easierLevels)

    if (easierLevels.length === 0) return

    const results = await client.fetch(
      `*[_type == "lesson" && level in $levels && count(tags[@._ref in $tags]) > 0 && _id != $currentId][0...5]{_id, title, level, tags[]->{_id, title}}`,
      {
        levels: easierLevels,
        tags: tagRefs,
        currentId: lessonDoc._id?.replace('drafts.', ''),
      },
    )

    console.log('📄 Results from GROQ:', results)

    if (results.length > 0) {
      const references = results.map((res: {_id: string}) => ({
        _type: 'reference',
        _ref: res._id,
        _key: uuid(),
      }))
      console.log('🔗 Reference array to patch:', references)

      onChange(PatchEvent.from(set(references)))
    } else {
      console.warn('⚠️ No easier lessons found that share tags and level.')
    }
  }

  return (
    <Stack space={3}>
      <Card padding={3} tone="transparent" border>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            Easier Lessons
          </Text>
          <Flex gap={2}>
            <Button text="Auto Fill" onClick={handleAutoFill} />
            {Array.isArray(value) && value.length > 0 && (
              <Button text="Clear" tone="critical" onClick={handleClear} />
            )}
          </Flex>
        </Stack>
      </Card>

      <ArrayOfObjectsInput
        {...restProps}
        value={value}
        onChange={onChange}
        members={members}
        schemaType={schemaType}
        renderDefault={renderDefault}
      />
    </Stack>
  )
}
