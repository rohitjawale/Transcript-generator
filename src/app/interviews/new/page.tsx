'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ArrowRight, Building, User, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function NewInterviewPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        company_name: '',
        interviewer_name: '',
        interview_date: new Date().toISOString().split('T')[0]
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('interviews')
                .insert([{
                    company_name: formData.company_name,
                    interviewer_name: formData.interviewer_name,
                    interview_date: formData.interview_date,
                    raw_transcript: '', // Empty initially
                    notes: '' // Empty initially
                }])
                .select()
                .single()

            if (error) throw error
            if (data) {
                router.push(`/interviews/${data.id}`)
            }
        } catch (error) {
            console.error('Error creating interview:', error)
            alert('Failed to create interview.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <header className="mb-10 text-center">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
                >
                    <ChevronLeft size={16} />
                    Back to list
                </Link>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">New Interview</h1>
                <p className="text-gray-500 mt-2 text-lg">Let's capture the core details first.</p>
            </header>

            <form className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50" onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Building size={16} className="text-blue-500" />
                            Company Name
                        </label>
                        <input
                            type="text"
                            required
                            autoFocus
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-lg"
                            value={formData.company_name}
                            onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                            placeholder="e.g. Google"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <User size={16} className="text-blue-500" />
                            Interviewer Name
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                            value={formData.interviewer_name}
                            onChange={e => setFormData({ ...formData, interviewer_name: e.target.value })}
                            placeholder="e.g. Jane Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar size={16} className="text-blue-500" />
                            Interview Date
                        </label>
                        <input
                            type="date"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                            value={formData.interview_date}
                            onChange={e => setFormData({ ...formData, interview_date: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !formData.company_name}
                        className="w-full mt-8 inline-flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all gap-2 shadow-lg shadow-blue-200"
                    >
                        {loading ? 'Creating...' : (
                            <>
                                Create & Continue
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
