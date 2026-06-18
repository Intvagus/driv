export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      procedures: {
        Row: {
          id: string;
          title: string;
          slug: string;
          category: "surgical" | "non_surgical";
          technique: string | null;
          graft_range_min: number | null;
          graft_range_max: number | null;
          duration_hours: number | null;
          downtime_days: number | null;
          price_per_graft: number | null;
          package_price: number | null;
          advance_amount: number | null;
          description: string | null;
          process_steps: Json | null;
          included: Json | null;
          excluded: Json | null;
          pre_op_care: string | null;
          post_op_care: string | null;
          recovery_timeline: Json | null;
          risks: string | null;
          seo_title: string | null;
          seo_description: string | null;
          status: "draft" | "published" | "archived";
          featured: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["procedures"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["procedures"]["Insert"]>;
      };
      bookings: {
        Relationships: [
          {
            foreignKeyName: "bookings_procedure_id_fkey";
            columns: ["procedure_id"];
            isOneToOne: false;
            referencedRelation: "procedures";
            referencedColumns: ["id"];
          }
        ];
        Row: {
          id: string;
          reference: string;
          patient_name: string;
          patient_email: string;
          patient_phone: string;
          patient_whatsapp: string | null;
          procedure_id: string | null;
          preferred_date: string | null;
          scheduled_date: string | null;
          booking_status: "awaiting_deposit" | "confirmed" | "cancelled" | "completed";
          payment_status:
            | "deposit_pending"
            | "deposit_submitted"
            | "deposit_confirmed"
            | "deposit_rejected"
            | "balance_pending"
            | "fully_paid";
          estimated_total: number | null;
          advance_required: number | null;
          advance_paid: number | null;
          balance_due: number | null;
          notes: string | null;
          deposit_upload_token: string;
          deposit_reminder_count: number;
          last_deposit_reminder_sent_at: string | null;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["bookings"]["Row"],
          "id" | "reference" | "deposit_upload_token" | "created_at" | "updated_at"
        > & {
          id?: string;
          reference?: string;
          deposit_upload_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
      consultation_leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          hair_loss_area: string | null;
          norwood_stage: string | null;
          age: number | null;
          medical_history: string | null;
          budget: string | null;
          preferred_technique: string | null;
          preferred_dates: string | null;
          notes: string | null;
          photo_path: string | null;
          status: "new" | "contacted" | "quoted" | "converted" | "lost";
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["consultation_leads"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["consultation_leads"]["Insert"]>;
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string | null;
          excerpt: string | null;
          featured_image_path: string | null;
          author: string | null;
          tags: string[] | null;
          seo_title: string | null;
          seo_description: string | null;
          status: "draft" | "published";
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["blog_posts"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
      };
      before_after_gallery: {
        Relationships: [
          {
            foreignKeyName: "before_after_gallery_procedure_id_fkey";
            columns: ["procedure_id"];
            isOneToOne: false;
            referencedRelation: "procedures";
            referencedColumns: ["id"];
          }
        ];
        Row: {
          id: string;
          procedure_id: string | null;
          patient_consent: boolean;
          before_image_path: string;
          after_image_path: string;
          months_post_op: number | null;
          graft_count: number | null;
          technique: string | null;
          description: string | null;
          featured: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["before_after_gallery"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["before_after_gallery"]["Insert"]>;
      };
      testimonials: {
        Relationships: [
          {
            foreignKeyName: "testimonials_procedure_id_fkey";
            columns: ["procedure_id"];
            isOneToOne: false;
            referencedRelation: "procedures";
            referencedColumns: ["id"];
          }
        ];
        Row: {
          id: string;
          patient_name: string;
          rating: number;
          review: string;
          procedure_id: string | null;
          featured: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["testimonials"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          title: string;
          bio: string | null;
          photo_path: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["team_members"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["team_members"]["Insert"]>;
      };
      booking_reminders: {
        Relationships: [
          {
            foreignKeyName: "booking_reminders_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          }
        ];
        Row: {
          id: string;
          booking_id: string;
          sent_via: string;
          message: string;
          sent_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["booking_reminders"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["booking_reminders"]["Insert"]>;
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          role:
            | "super_admin"
            | "content_editor"
            | "procedure_manager"
            | "patient_coordinator"
            | "finance_admin"
            | "clinical_coordinator";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["admin_users"]["Row"], "created_at"> & {
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["admin_users"]["Insert"]>;
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["site_settings"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      procedure_category: "surgical" | "non_surgical";
      procedure_status: "draft" | "published" | "archived";
      booking_status: "awaiting_deposit" | "confirmed" | "cancelled" | "completed";
      payment_status:
        | "deposit_pending"
        | "deposit_submitted"
        | "deposit_confirmed"
        | "deposit_rejected"
        | "balance_pending"
        | "fully_paid";
      lead_status: "new" | "contacted" | "quoted" | "converted" | "lost";
      blog_status: "draft" | "published";
      admin_role:
        | "super_admin"
        | "content_editor"
        | "procedure_manager"
        | "patient_coordinator"
        | "finance_admin"
        | "clinical_coordinator";
    };
  };
};
