export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          name: string;
          cuisine: string;
          area: string;
          address: string | null;
          image_url: string | null;
          lat: number;
          lng: number;
          rating: number | null;
          price: number;
          description: string;
          google_maps_url: string | null;
          vibes: string[];
          moods: string[];
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          cuisine: string;
          area: string;
          address?: string | null;
          image_url?: string | null;
          lat: number;
          lng: number;
          rating?: number | null;
          price: number;
          description: string;
          google_maps_url?: string | null;
          vibes?: string[];
          moods?: string[];
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          cuisine?: string;
          area?: string;
          address?: string | null;
          image_url?: string | null;
          lat?: number;
          lng?: number;
          rating?: number | null;
          price?: number;
          description?: string;
          google_maps_url?: string | null;
          vibes?: string[];
          moods?: string[];
          is_active?: boolean;
          created_at?: string;
        };
      };
      suggestions: {
        Row: {
          id: string;
          name: string;
          cuisine: string | null;
          area: string | null;
          price: number | null;
          description: string | null;
          google_maps_url: string | null;
          suggested_moods: string[];
          submitter_name: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          cuisine?: string | null;
          area?: string | null;
          price?: number | null;
          description?: string | null;
          google_maps_url?: string | null;
          suggested_moods?: string[];
          submitter_name?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          cuisine?: string | null;
          area?: string | null;
          price?: number | null;
          description?: string | null;
          google_maps_url?: string | null;
          suggested_moods?: string[];
          submitter_name?: string | null;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}
