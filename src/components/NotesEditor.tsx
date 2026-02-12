'use client'

import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'

interface NotesEditorProps {
    value: string
    onChange: (value: string) => void
}

export function NotesEditor({ value, onChange }: NotesEditorProps) {
    const editorRef = useRef<any>(null)

    return (
        <div className="min-h-[400px] border border-gray-200 rounded-lg overflow-hidden">
            <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={value}
                onEditorChange={onChange}
                init={{
                    height: 400,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | borderless | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px }',
                    skin: 'oxide',
                    branding: false,
                    statusbar: false,
                }}
            />
        </div>
    )
}
