export type Message = {
    sender: string
    text: string
    timestamp?: string
    isMe?: boolean
}

/**
 * Parses a raw transcript text into an array of Message objects.
 * Format expected:
 * Name: Message text
 * Name [timestamp]: Message text
 * [timestamp] Name: Message text
 * Me: Message text
 */
export function parseTranscript(text: string): Message[] {
    if (!text) return []

    const lines = text.split('\n')
    const messages: Message[] = []

    let currentMessage: Message | null = null

    lines.forEach((line) => {
        const trimmedLine = line.trim()
        if (!trimmedLine) return

        // Regex patterns to match different formats
        // 1. Name [timestamp]: Message
        // 2. [timestamp] Name: Message
        // 3. Name: Message

        // Try [timestamp] Name: Message or Name [timestamp]: Message
        const tsNameMatch = trimmedLine.match(/^\[?(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?)\]?\s+([^:]+):\s*(.*)/i) ||
            trimmedLine.match(/^([^:\[]+)\s+\[?(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?)\]?:\s*(.*)/i)

        // Try Name: Message
        const nameMatch = trimmedLine.match(/^([^:]+):\s*(.*)/i)

        if (tsNameMatch) {
            if (currentMessage) {
                messages.push(currentMessage)
            }

            // In pattern 1: [timestamp] Name: Message -> match[1]=ts, match[2]=name, match[3]=text
            // In pattern 2: Name [timestamp]: Message -> match[1]=name, match[2]=ts, match[3]=text
            // Regular check to see which is which
            const isFirstTimestamp = /^\d{1,2}:\d{2}/.test(tsNameMatch[1])
            const sender = isFirstTimestamp ? tsNameMatch[2].trim() : tsNameMatch[1].trim()
            const timestamp = isFirstTimestamp ? tsNameMatch[1].trim() : tsNameMatch[2].trim()
            const text = tsNameMatch[3].trim()

            currentMessage = {
                sender,
                timestamp,
                text,
                isMe: sender.toLowerCase() === 'me'
            }
        } else if (nameMatch) {
            if (currentMessage) {
                messages.push(currentMessage)
            }

            const sender = nameMatch[1].trim()
            currentMessage = {
                sender,
                text: nameMatch[2].trim(),
                isMe: sender.toLowerCase() === 'me'
            }
        } else if (currentMessage) {
            // Continuation
            currentMessage.text += '\n' + trimmedLine
        }
    })

    if (currentMessage) {
        messages.push(currentMessage)
    }

    return messages
}
