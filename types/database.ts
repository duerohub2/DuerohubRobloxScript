/**
 * Hand-written to match PRD section 4 exactly. Once the migration runs against
 * a real Supabase project, regenerate with:
 *   supabase gen types typescript --project-id <ref> > types/database.ts
 * and diff against this file — column order/nullability must match 1:1.
 */

export type UserRole = 'user' | 'moderator' | 'admin';
export type ScriptStatus = 'published' | 'flagged' | 'archived';
export type ReportTarget = 'script' | 'comment' | 'user';
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          role: UserRole;
          is_banned: boolean;
          ban_reason: string | null;
          total_scripts: number;
          total_likes_received: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          role?: UserRole;
          is_banned?: boolean;
          ban_reason?: string | null;
          total_scripts?: number;
          total_likes_received?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      games: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          thumbnail_url: string | null;
          total_scripts: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          thumbnail_url?: string | null;
          total_scripts?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['games']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          color: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          color?: string;
          display_order?: number;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      scripts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          code: string;
          author_id: string;
          game_id: string | null;
          category_id: string | null;
          tags: string[];
          features: string[];
          tested_with: string[];
          is_keyless: boolean;
          is_mobile_friendly: boolean;
          status: ScriptStatus;
          view_count: number;
          copy_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          code: string;
          author_id: string;
          game_id?: string | null;
          category_id?: string | null;
          tags?: string[];
          features?: string[];
          tested_with?: string[];
          is_keyless?: boolean;
          is_mobile_friendly?: boolean;
          status?: ScriptStatus;
          view_count?: number;
          copy_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['scripts']['Insert']>;
      };
      script_views: {
        Row: {
          id: string;
          script_id: string;
          viewer_id: string | null;
          ip_hash: string;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          script_id: string;
          viewer_id?: string | null;
          ip_hash: string;
          viewed_at?: string;
        };
        Update: Partial<Database['public']['Tables']['script_views']['Insert']>;
      };
      comments: {
        Row: {
          id: string;
          script_id: string;
          user_id: string;
          parent_id: string | null;
          content: string;
          is_deleted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          script_id: string;
          user_id: string;
          parent_id?: string | null;
          content: string;
          is_deleted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['comments']['Insert']>;
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string | null;
          target_type: ReportTarget;
          target_id: string;
          reason: string;
          status: ReportStatus;
          resolved_by: string | null;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id?: string | null;
          target_type: ReportTarget;
          target_id: string;
          reason: string;
          status?: ReportStatus;
          resolved_by?: string | null;
          resolved_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_user_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
    };
    Enums: {
      user_role: UserRole;
      script_status: ScriptStatus;
      report_target: ReportTarget;
      report_status: ReportStatus;
    };
  };
};

// Convenience row aliases — import these instead of reaching into Database[...] everywhere.
export type UserRow = Database['public']['Tables']['users']['Row'];
export type GameRow = Database['public']['Tables']['games']['Row'];
export type CategoryRow = Database['public']['Tables']['categories']['Row'];
export type ScriptRow = Database['public']['Tables']['scripts']['Row'];
export type ScriptViewRow = Database['public']['Tables']['script_views']['Row'];
export type CommentRow = Database['public']['Tables']['comments']['Row'];
export type ReportRow = Database['public']['Tables']['reports']['Row'];
