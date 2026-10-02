// Supabase types for the Rootline tracker tables only (see
// supabase/migrations/002_rootline_tracker.sql). Kept separate from
// database.ts so the tracker gets a fully typed client.

type Angle = "front" | "top" | "crown" | "sides";

export type TrackerDatabase = {
  public: {
    Tables: {
      tracker_checkins: {
        Row: {
          id: string;
          user_id: string;
          taken_on: string;
          shedding: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          taken_on?: string;
          shedding?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          taken_on?: string;
          shedding?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      tracker_photos: {
        Row: {
          id: string;
          checkin_id: string;
          user_id: string;
          angle: Angle;
          storage_path: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          checkin_id: string;
          user_id: string;
          angle: Angle;
          storage_path: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          checkin_id?: string;
          user_id?: string;
          angle?: Angle;
          storage_path?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tracker_photos_checkin_id_fkey";
            columns: ["checkin_id"];
            isOneToOne: false;
            referencedRelation: "tracker_checkins";
            referencedColumns: ["id"];
          }
        ];
      };
      tracker_treatments: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          dose: string | null;
          started_on: string | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          dose?: string | null;
          started_on?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          dose?: string | null;
          started_on?: string | null;
          active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      tracker_treatment_logs: {
        Row: {
          id: string;
          treatment_id: string;
          user_id: string;
          logged_on: string;
        };
        Insert: {
          id?: string;
          treatment_id: string;
          user_id: string;
          logged_on?: string;
        };
        Update: {
          id?: string;
          treatment_id?: string;
          user_id?: string;
          logged_on?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tracker_treatment_logs_treatment_id_fkey";
            columns: ["treatment_id"];
            isOneToOne: false;
            referencedRelation: "tracker_treatments";
            referencedColumns: ["id"];
          }
        ];
      };
      tracker_subscriptions: {
        Row: {
          user_id: string;
          status: string;
          variant_id: string | null;
          ls_subscription_id: string | null;
          ls_customer_id: string | null;
          customer_portal_url: string | null;
          renews_at: string | null;
          ends_at: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          status: string;
          variant_id?: string | null;
          ls_subscription_id?: string | null;
          ls_customer_id?: string | null;
          customer_portal_url?: string | null;
          renews_at?: string | null;
          ends_at?: string | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          status?: string;
          variant_id?: string | null;
          ls_subscription_id?: string | null;
          ls_customer_id?: string | null;
          customer_portal_url?: string | null;
          renews_at?: string | null;
          ends_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      tracker_is_pro: { Args: Record<PropertyKey, never>; Returns: boolean };
      tracker_checkin_count: { Args: Record<PropertyKey, never>; Returns: number };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
