export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      badges: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon_url: string | null;
          criteria: Json;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon_url?: string | null;
          criteria: Json;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon_url?: string | null;
          criteria?: Json;
          created_at?: string | null;
        };
        Relationships: [];
      };
      classes: {
        Row: {
          id: string;
          name: string;
          teacher_id: string | null;
          school_year: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          teacher_id?: string | null;
          school_year: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          teacher_id?: string | null;
          school_year?: string;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'classes_teacher_fk';
            columns: ['teacher_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      game_sessions: {
        Row: {
          id: string;
          user_id: string;
          level: number;
          module: number | null;
          start_time: string | null;
          end_time: string | null;
          score: number | null;
          problems_attempted: number | null;
          problems_correct: number | null;
          badge_earned: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          level: number;
          module?: number | null;
          start_time?: string | null;
          end_time?: string | null;
          score?: number | null;
          problems_attempted?: number | null;
          problems_correct?: number | null;
          badge_earned?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          level?: number;
          module?: number | null;
          start_time?: string | null;
          end_time?: string | null;
          score?: number | null;
          problems_attempted?: number | null;
          problems_correct?: number | null;
          badge_earned?: boolean | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'game_sessions_user_fk';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      problems_attempted: {
        Row: {
          id: string;
          session_id: string;
          problem_number: number;
          problem_type: string;
          total_value: number;
          part1_value: number;
          part2_value: number;
          unknown_position: string;
          user_answer: number | null;
          expected_answer: number;
          is_correct: boolean | null;
          attempts: number | null;
          duration_ms: number | null;
          hints_requested: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          problem_number: number;
          problem_type: string;
          total_value: number;
          part1_value: number;
          part2_value: number;
          unknown_position: string;
          user_answer?: number | null;
          expected_answer: number;
          is_correct?: boolean | null;
          attempts?: number | null;
          duration_ms?: number | null;
          hints_requested?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          session_id?: string;
          problem_number?: number;
          problem_type?: string;
          total_value?: number;
          part1_value?: number;
          part2_value?: number;
          unknown_position?: string;
          user_answer?: number | null;
          expected_answer?: number;
          is_correct?: boolean | null;
          attempts?: number | null;
          duration_ms?: number | null;
          hints_requested?: number | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'problems_attempted_session_id_fkey';
            columns: ['session_id'];
            referencedRelation: 'game_sessions';
            referencedColumns: ['id'];
          }
        ];
      };
      strategies_detected: {
        Row: {
          id: string;
          problem_id: string;
          strategy_type: string;
          confidence: number | null;
          detected_at: string | null;
        };
        Insert: {
          id?: string;
          problem_id: string;
          strategy_type: string;
          confidence?: number | null;
          detected_at?: string | null;
        };
        Update: {
          id?: string;
          problem_id?: string;
          strategy_type?: string;
          confidence?: number | null;
          detected_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'strategies_detected_problem_id_fkey';
            columns: ['problem_id'];
            referencedRelation: 'problems_attempted';
            referencedColumns: ['id'];
          }
        ];
      };
      student_profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          date_of_birth: string | null;
          class_id: string | null;
          adaptive_level: number | null;
          current_max_value: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          date_of_birth?: string | null;
          class_id?: string | null;
          adaptive_level?: number | null;
          current_max_value?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          date_of_birth?: string | null;
          class_id?: string | null;
          adaptive_level?: number | null;
          current_max_value?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'student_profiles_class_id_fkey';
            columns: ['class_id'];
            referencedRelation: 'classes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'student_profiles_user_fk';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      user_badges: {
        Row: {
          user_id: string;
          badge_id: string;
          earned_at: string | null;
        };
        Insert: {
          user_id: string;
          badge_id: string;
          earned_at?: string | null;
        };
        Update: {
          user_id?: string;
          badge_id?: string;
          earned_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_badges_badge_id_fkey';
            columns: ['badge_id'];
            referencedRelation: 'badges';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_badges_user_fk';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
