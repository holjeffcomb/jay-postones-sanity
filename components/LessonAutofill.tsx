import React, {useState} from 'react'
import {useFormValue, useClient} from 'sanity'
import {Button, Stack, Card, Text, TextArea, Flex, Spinner} from '@sanity/ui'
import {StringInputProps} from 'sanity'
import {set} from 'sanity'

export default function LessonAutofill(props: StringInputProps) {
  const {value, onChange} = props
  const [transcript, setTranscript] = useState(value || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const client = useClient({apiVersion: '2023-01-01'})
  const lessonDoc = useFormValue([]) as {
    _id?: string
    title?: string
  }

  const handleAutofill = async () => {
    if (!transcript.trim()) {
      setError('Please enter a transcript first')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Determine proxy URL based on environment
      // In production, use the deployed proxy URL
      // In development, use localhost
      const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      
      // Get proxy URL from environment variable (exposed via SANITY_STUDIO_ prefix)
      // Or use default based on environment
      const envProxyUrl = process.env.SANITY_STUDIO_PROXY_URL
      // Default to your Next.js frontend API route
      const defaultProductionUrl = 'https://jaypostones.com/api/autofill'
      const proxyUrl = envProxyUrl || (isProduction ? defaultProductionUrl : 'http://localhost:3001/autofill')

      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          title: lessonDoc?.title || '',
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = `Error ${response.status}: ${response.statusText}`
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.error) {
            if (typeof errorData.error === 'string') {
              errorMessage = errorData.error
            } else if (errorData.error.message) {
              errorMessage = errorData.error.message
            } else {
              errorMessage = JSON.stringify(errorData.error)
            }
          } else {
            errorMessage = errorData.message || errorMessage
          }
        } catch {
          // If it's not JSON, use the text directly
          if (errorText) {
            errorMessage = errorText.length > 200 ? errorText.substring(0, 200) + '...' : errorText
          }
        }
        
        // Provide helpful error messages
        if (response.status === 401) {
          errorMessage = `Unauthorized: ${errorMessage}. Check that OPENAI_API_KEY is set correctly in .env.local`
        } else if (response.status === 404) {
          errorMessage = 'Proxy server not found. Make sure "npm run proxy" is running in another terminal.'
        }
        
        throw new Error(errorMessage)
      }

      const openaiData = await response.json()

      // Handle OpenAI API response format
      let content: string
      if (openaiData.choices?.[0]?.message?.content) {
        // OpenAI API response format
        content = openaiData.choices[0].message.content
      } else if (openaiData.subtitle) {
        // Already parsed response (shouldn't happen, but handle it)
        const data = openaiData as {subtitle: string; summary: string; description: string}
        // Validate and truncate summary to 150 characters
        if (data.summary && data.summary.length > 150) {
          data.summary = data.summary.substring(0, 147) + '...'
        }
        // Update fields directly
        onChange(set(transcript))
        if (lessonDoc?._id) {
          const docId = lessonDoc._id
          let patch = client.patch(docId)
          if (data.subtitle) patch = patch.set({subtitle: data.subtitle})
          if (data.summary) patch = patch.set({summary: data.summary})
          if (data.description) patch = patch.set({description: data.description})
          await patch.commit()
        }
        return
      } else {
        throw new Error('Unexpected response format from proxy')
      }

      // Parse the JSON response from OpenAI
      let data: {subtitle: string; summary: string; description: string}
      try {
        data = JSON.parse(content)
      } catch (parseError) {
        // If parsing fails, try to extract JSON from markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
        if (jsonMatch) {
          data = JSON.parse(jsonMatch[1])
        } else {
          throw new Error('Failed to parse AI response as JSON')
        }
      }

      // Validate and truncate summary to 150 characters
      if (data.summary && data.summary.length > 150) {
        data.summary = data.summary.substring(0, 147) + '...'
      }

      // Update the transcript field
      onChange(set(transcript))

      // Update other fields by patching the document directly
      if (lessonDoc?._id) {
        const docId = lessonDoc._id
        let patch = client.patch(docId)

        // Build patch with all fields
        if (data.subtitle) {
          patch = patch.set({subtitle: data.subtitle})
        }
        if (data.summary) {
          patch = patch.set({summary: data.summary})
        }
        if (data.description) {
          patch = patch.set({description: data.description})
        }

        // Apply all patches in one commit
        await patch.commit()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to autofill content')
      console.error('Autofill error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Stack space={3}>
      <Card padding={3} tone="transparent" border>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Lesson Autofill Tool
          </Text>
          <Text size={1} muted>
            Enter a transcript below and click "Autofill" to generate subtitle, summary, and
            description.
          </Text>
          <TextArea
            value={transcript}
            onChange={(e) => {
              const newValue = e.currentTarget.value
              setTranscript(newValue)
              onChange(set(newValue))
            }}
            placeholder="Paste the lesson transcript here..."
            rows={8}
          />
          {error && (
            <Card padding={2} tone="critical" radius={2}>
              <Text size={1}>{error}</Text>
            </Card>
          )}
          <Flex gap={2}>
            <Button
              text="Autofill"
              onClick={handleAutofill}
              disabled={isLoading || !transcript.trim()}
              tone="primary"
            />
            {isLoading && <Spinner />}
          </Flex>
        </Stack>
      </Card>
    </Stack>
  )
}
