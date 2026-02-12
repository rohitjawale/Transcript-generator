'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Save, Building, User, Calendar, MessageSquare, Notebook, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { TranscriptChat } from '@/components/TranscriptChat'
import { NotesEditor } from '@/components/NotesEditor'
import { parseTranscript } from '@/lib/utils/transcript-parser'
import { Interview } from '@/types/database'

export default function InterviewDetailsPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [interview, setInterview] = useState<Interview | null>(null)

    const [formData, setFormData] = useState({
        company_name: '',
        interviewer_name: '',
        interview_date: '',
        raw_transcript: '',
        notes: ''
    })

    useEffect(() => {
        if (id) fetchInterview()
    }, [id])

    async function fetchInterview() {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('interviews')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            if (data) {
                setInterview(data)
                setFormData({
                    company_name: data.company_name,
                    interviewer_name: data.interviewer_name,
                    interview_date: data.interview_date,
                    raw_transcript: data.raw_transcript,
                    notes: data.notes
                })
            }
        } catch (error) {
            console.error('Error fetching interview:', error)
            router.push('/')
        } finally {
            setLoading(false)
        }
    }

    const messages = useMemo(() => parseTranscript(formData.raw_transcript), [formData.raw_transcript])

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault()
        try {
            setSaving(true)
            const { error } = await supabase
                .from('interviews')
                .update({
                    company_name: formData.company_name,
                    interviewer_name: formData.interviewer_name,
                    interview_date: formData.interview_date,
                    raw_transcript: formData.raw_transcript,
                    notes: formData.notes,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)

            if (error) throw error
            alert('Changes saved successfully!')
        } catch (error) {
            console.error('Error updating interview:', error)
            alert('Failed to update interview.')
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this interview record?')) return

        try {
            const { error } = await supabase
                .from('interviews')
                .delete()
                .eq('id', id)

            if (error) throw error
            router.push('/')
        } catch (error) {
            console.error('Error deleting interview:', error)
            alert('Failed to delete interview.')
        }
    }

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
                <div className="h-10 w-48 bg-gray-200 rounded mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="h-64 bg-gray-100 rounded-xl" />
                        <div className="h-64 bg-gray-100 rounded-xl" />
                    </div>
                    <div className="h-[600px] bg-gray-50 rounded-2xl" />
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{interview?.company_name}</h1>
                        <p className="text-sm text-gray-500">Interview with {interview?.interviewer_name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Interview"
                    >
                        <Trash2 size={20} />
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={saving || !formData.company_name}
                        className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all gap-2 shadow-sm shadow-blue-200"
                    >
                        {saving ? 'Saving...' : (
                            <>
                                <Save size={20} />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Form Fields */}
                <div className="space-y-6">
                    <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Building size={20} className="text-blue-500" />
                            Interview Details
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.company_name}
                                    onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.interviewer_name}
                                    onChange={e => setFormData({ ...formData, interviewer_name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.interview_date}
                                    onChange={e => setFormData({ ...formData, interview_date: e.target.value })}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <MessageSquare size={20} className="text-blue-500" />
                            Transcript
                        </h2>
                        <textarea
                            className="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono text-sm resize-none"
                            value={formData.raw_transcript}
                            onChange={e => setFormData({ ...formData, raw_transcript: e.target.value })}
                        />
                    </section>

                    <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Notebook size={20} className="text-blue-500" />
                            Notes
                        </h2>
                        <NotesEditor
                            value={formData.notes}
                            onChange={notes => setFormData({ ...formData, notes })}
                        />
                    </section>
                </div>

                {/* Right Column: Chat View */}
                <div className="lg:sticky lg:top-8 h-fit space-y-4">
                    <div className="flex flex-col h-[calc(100vh-8rem)] bg-blue-50/30 border border-blue-100 rounded-2xl overflow-hidden shadow-inner">
                        <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                            <span className="font-semibold text-gray-700">Transcript Chat</span>
                            <div className="px-3 py-1 bg-blue-600 text-white text-[10px] uppercase tracking-wider font-bold rounded-full shadow-sm shadow-blue-200">
                                Live
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4">
                            <TranscriptChat messages={messages} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
