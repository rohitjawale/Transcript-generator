export type Database = {
  public: {
    Tables: {
      interviews: {
        Row: {
          id: string
          company_name: string
          interviewer_name: string
          interview_date: string
          raw_transcript: string
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_name: string
          interviewer_name: string
          interview_date: string
          raw_transcript: string
          notes: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          interviewer_name?: string
          interview_date?: string
          raw_transcript?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Interview = Database['public']['Tables']['interviews']['Row']
export type InterviewInsert = Database['public']['Tables']['interviews']['Insert']
export type InterviewUpdate = Database['public']['Tables']['interviews']['Update']
