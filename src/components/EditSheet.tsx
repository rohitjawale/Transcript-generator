'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, MessageSquare, Notebook } from 'lucide-react'

interface EditSheetProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    formData: {
        raw_transcript: string
        notes: string
    }
    setFormData: (data: any) => void
    loading: boolean
}

export function EditSheet({ isOpen, onClose, onSave, formData, setFormData, loading }: EditSheetProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 max-h-[90vh] bg-white rounded-t-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                            <div className="flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900">Edit Interview</h3>
                                <p className="text-xs text-gray-500">Update transcript and notes</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                                >
                                    <X size={24} />
                                </button>
                                <button
                                    onClick={onSave}
                                    disabled={loading}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
                                >
                                    {loading ? 'Saving...' : (
                                        <>
                                            <Save size={18} />
                                            Save
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-12">
                            <section>
                                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <MessageSquare size={16} className="text-blue-500" />
                                    Interview Transcript
                                </h4>
                                <textarea
                                    className="w-full h-80 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-mono text-sm resize-none"
                                    placeholder="Paste transcript here... (e.g. Them: Hello, Me: Hi!)"
                                    value={formData.raw_transcript}
                                    onChange={e => setFormData({ ...formData, raw_transcript: e.target.value })}
                                />
                            </section>

                            <section>
                                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Notebook size={16} className="text-blue-500" />
                                    Interview Notes
                                </h4>
                                <textarea
                                    className="w-full h-64 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm resize-none"
                                    placeholder="Type your personal observations and notes here..."
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </section>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
