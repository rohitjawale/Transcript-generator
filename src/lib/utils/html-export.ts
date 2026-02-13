import { Interview } from '@/types/database'
import { Message } from './transcript-parser'

export function exportTranscriptToHtml(interview: Interview, messages: Message[]) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transcript: ${interview.company_name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50 text-gray-900 min-h-screen py-10 px-4">
    <div class="max-w-2xl mx-auto">
        <header class="mb-8 border-b border-gray-200 pb-6">
            <h1 class="text-3xl font-bold text-gray-900">${interview.company_name}</h1>
            <div class="mt-2 text-gray-600 space-y-1 text-sm">
                <p><strong>Interviewer:</strong> ${interview.interviewer_name}</p>
                <p><strong>Date:</strong> ${interview.interview_date}</p>
            </div>
        </header>

        <main class="space-y-4">
            ${messages.map(msg => `
                <div class="flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'}">
                    <div class="max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.isMe
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
        }">
                        <div class="flex items-center gap-2 mb-1.5 overflow-hidden">
                            <span class="font-bold border-b border-current pb-0.5 text-[10px] uppercase tracking-wider opacity-80 whitespace-nowrap">
                                ${msg.sender}
                            </span>
                        </div>
                        <div class="whitespace-pre-wrap">${msg.text}</div>
                        ${msg.timestamp ? `
                            <div class="text-[10px] mt-2 opacity-60 ${msg.isMe ? 'text-right' : 'text-left'}">
                                ${msg.timestamp}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </main>

        ${interview.notes ? `
            <section class="mt-12 pt-8 border-t border-gray-200">
                <h2 class="text-xl font-bold mb-4">Personal Notes</h2>
                <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                    ${interview.notes}
                </div>
            </section>
        ` : ''}

        <footer class="mt-12 text-center text-gray-400 text-xs py-4 border-t border-gray-100">
            Exported from Transcript Generator
        </footer>
    </div>
</body>
</html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${interview.company_name.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
