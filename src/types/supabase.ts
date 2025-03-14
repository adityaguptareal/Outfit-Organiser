export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      outfits: {
        Row: {
          id: string
          name: string
          type: string
          top_id: string
          bottom_id: string
          shoes_id: string
          accessory_id?: string
          user_id: string
          created_at: string
          updated_at: string
          is_favorite: boolean
        }
        Insert: {
          id?: string
          name: string
          type: string
          top_id: string
          bottom_id: string
          shoes_id: string
          accessory_id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          is_favorite?: boolean
        }
        Update: {
          id?: string
          name?: string
          type?: string
          top_id?: string
          bottom_id?: string
          shoes_id?: string
          accessory_id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          is_favorite?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "outfits_top_id_fkey"
            columns: ["top_id"]
            referencedRelation: "wardrobe_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfits_bottom_id_fkey"
            columns: ["bottom_id"]
            referencedRelation: "wardrobe_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfits_shoes_id_fkey"
            columns: ["shoes_id"]
            referencedRelation: "wardrobe_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfits_accessory_id_fkey"
            columns: ["accessory_id"]
            referencedRelation: "wardrobe_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outfits_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      wardrobe_items: {
        Row: {
          id: string
          name: string
          image_url: string
          category: string
          color: string
          purchase_link?: string
          is_favorite: boolean
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          image_url: string
          category: string
          color: string
          purchase_link?: string
          is_favorite?: boolean
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string
          category?: string
          color?: string
          purchase_link?: string
          is_favorite?: boolean
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wardrobe_items_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 