export type UserRole = "help-seeker" | "volunteer";

export interface User {
  id: string;
  name: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  trustScore?: number;
  helpGiven?: number;
  helpReceived?: number;
  endorsements?: number;
}

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: HelpCategory;
  type: "in-person" | "remote";
  author: User;
  distanceKm?: number;
  createdAt: Date;
  status: "open" | "matched" | "completed";
}

export type HelpCategory =
  | "shopping"
  | "medicine"
  | "transport"
  | "companionship"
  | "education"
  | "animals"
  | "household"
  | "other";

export interface Message {
  id: string;
  senderId: string;
  text: string;
  sentAt: Date;
}

// ─── Database-aligned types (match API response shapes) ───────────────────────

export interface DbUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  role?: string;
}

export interface DbMessage {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
  conversationId: string;
  sender: DbUser;
}

export interface DbHelpRequest {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  volunteerId: string | null;
  author: DbUser;
  volunteer: DbUser | null;
}
