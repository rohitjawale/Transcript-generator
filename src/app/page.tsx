'use client'

import React from 'react'
import Link from 'next/link'
import { Plus, Search, Calendar, User, Building, MessageSquare } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Interview } from '@/types/database'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export default function ListingPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchInterviews()
  }, [])

  async function fetchInterviews() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .order('interview_date', { ascending: false })

      if (error) throw error
      setInterviews(data || [])
    } catch (error) {
      console.error('Error fetching interviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredInterviews = interviews.filter(interview =>
    interview.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    interview.interviewer_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-500 mt-1">Manage and review your interview transcripts</p>
        </div>
        <Link
          href="/interviews/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors gap-2"
        >
          <Plus size={20} />
          New Interview
        </Link>
      </header>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by company or interviewer..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : filteredInterviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInterviews.map((interview) => (
            <Link
              key={interview.id}
              href={`/interviews/${interview.id}`}
              className="group bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Building size={24} />
                </div>
                <span className="text-xs font-medium text-gray-400">
                  {format(new Date(interview.created_at), 'MMM d, yyyy')}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {interview.company_name}
              </h3>
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <User size={14} />
                <span>{interview.interviewer_name}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-gray-400 text-xs mt-auto">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{format(new Date(interview.interview_date), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  <span>Transcript ready</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
            <Building size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No interviews found</h3>
          <p className="text-gray-500 mt-1">Start by creating your first interview record.</p>
          <Link
            href="/interviews/new"
            className="mt-6 inline-flex items-center text-blue-600 font-medium hover:underline gap-1"
          >
            Create new interview <Plus size={16} />
          </Link>
        </div>
      )}
    </div>
  )
}
