export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  resume_url: string | null;
  location: string | null;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon: string | null;
  color: string | null;
  order_index: number;
  created_at: string;
}

export interface SkillCategory {
  category: string;
  skills: Skill[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  short_description: string | null;
  tech_stack: string[];
  github_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  featured: boolean;
  category: string | null;
  year: string | null;
  order_index: number;
  created_at: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export interface ChatRequest {
  session_id: string | null;
  message: string;
}

export interface ChatResponse {
  session_id: string;
  reply: string;
  tokens_used: number | null;
}

export interface HealthResponse {
  status: string;
  version: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
