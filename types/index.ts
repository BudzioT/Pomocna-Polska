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
  | "other";

export interface Message {
  id: string;
  senderId: string;
  text: string;
  sentAt: Date;
}
