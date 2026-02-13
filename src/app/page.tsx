'use client'

import React, { useState, useMemo } from 'react'
import { Plus, Building, User, Calendar, MessageCircle, Download, Trash2 } from 'lucide-react'
import { TranscriptChat } from '@/components/TranscriptChat'
import { parseTranscript } from '@/lib/utils/transcript-parser'
import { exportTranscriptToHtml } from '@/lib/utils/html-export'
import { format } from 'date-fns'
import { Interview } from '@/types/interview'

export default function GeneratorPage() {
  const [formData, setFormData] = useState({
    company_name: '',
    interviewer_name: '',
    interview_date: new Date().toISOString().split('T')[0],
    raw_transcript: '',
    notes: ''
  })

  const messages = useMemo(() => parseTranscript(formData.raw_transcript), [formData.raw_transcript])

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      setFormData({
        company_name: '',
        interviewer_name: '',
        interview_date: new Date().toISOString().split('T')[0],
        raw_transcript: '',
        notes: ''
      })
    }
  }

  const interview = {
    id: 'local',
    ...formData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Transcript Generator</h1>
          <p className="text-gray-500 mt-2 text-lg">Paste your transcript and download a beautiful chat view.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClear}
            className="inline-flex items-center justify-center px-4 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all gap-2"
          >
            <Trash2 size={18} />
            Clear All
          </button>
          <button
            onClick={() => exportTranscriptToHtml(interview, messages)}
            disabled={messages.length === 0}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all gap-2 shadow-lg shadow-blue-200"
          >
            <Download size={20} />
            Download HTML
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Editor Column */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Plus size={20} className="text-blue-500 font-bold" />
              <h2 className="text-xl font-bold text-gray-900">Interview Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Building size={16} className="text-gray-400" />
                  Company Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  value={formData.company_name}
                  onChange={e => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="e.g. Google"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  Interviewer
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  value={formData.interviewer_name}
                  onChange={e => setFormData({ ...formData, interviewer_name: e.target.value })}
                  placeholder="e.g. Jane Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                Interview Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                value={formData.interview_date}
                onChange={e => setFormData({ ...formData, interview_date: e.target.value })}
              />
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle size={20} className="text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">Transcript</h2>
            </div>
            <textarea
              className="w-full h-[400px] px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-mono text-sm leading-relaxed resize-none"
              placeholder="Paste your transcript here...&#10;Them: How are you?&#10;Me: I'm doing great!&#10;Jane [10:05]: Glad to hear it."
              value={formData.raw_transcript}
              onChange={e => setFormData({ ...formData, raw_transcript: e.target.value })}
            />
          </section>

          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Plus size={20} className="text-blue-500" />
              <h2 className="text-xl font-bold text-gray-900">Personal Notes (Optional)</h2>
            </div>
            <textarea
              className="w-full h-[150px] px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm leading-relaxed resize-none"
              placeholder="Add any personal notes or takeaways here..."
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </section>
        </div>

        {/* Preview Column */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="flex items-center gap-2 mb-6 ml-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest text-xs opacity-50">Live Preview</h2>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden min-h-[600px] flex flex-col">
            <header className="bg-gray-50/80 backdrop-blur-md border-b border-gray-100 p-8">
              <div className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                Generated Preview
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900">
                {formData.company_name || 'Company Name'}
              </h3>
              <div className="flex gap-4 mt-3 text-sm text-gray-500 font-medium">
                <span>{formData.interviewer_name || 'Interviewer'}</span>
                <span>•</span>
                <span>{formData.interview_date ? format(new Date(formData.interview_date), 'MMMM d, yyyy') : 'Date'}</span>
              </div>
            </header>

            <div className="p-6 flex-1 bg-gray-50/30">
              <TranscriptChat messages={messages} />
            </div>

            {formData.notes && (
              <div className="p-8 bg-white border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-2">Personal Notes</h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{formData.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
