export type Message = {
    sender: 'Them' | 'Me'
    text: string
    timestamp?: string
}

/**
 * Parses a raw transcript text into an array of Message objects.
 * Format expected:
 * Them: Message text
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

        // Match "Them:" or "Me:" at the start of the line
        const match = trimmedLine.match(/^(Them|Me):\s*(.*)/i)

        if (match) {
            if (currentMessage) {
                messages.push(currentMessage)
            }

            const sender = match[1].toLowerCase() === 'them' ? 'Them' : 'Me'
            currentMessage = {
                sender,
                text: match[2].trim()
            }
        } else if (currentMessage) {
            // If it doesn't match a sender but we have a current message, it's a continuation
            currentMessage.text += '\n' + trimmedLine
        }
    })

    if (currentMessage) {
        messages.push(currentMessage)
    }

    return messages
}
