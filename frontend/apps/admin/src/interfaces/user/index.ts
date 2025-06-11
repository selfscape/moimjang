export interface Joined_users {
  id: number;
  display_name: string;
  gender: string;
  birth_year: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  gender: string;
  birth_year: number;
  created_at: string;
  mbti: string;

  hobby: string;
  strength: string;
  happyMoment: string;
  keywords: string;
  favorite_media: string;
  tmi: string;

  joined_channel: {
    id: number;
    title: string;
    brand_title: string;
    brand_id: number;
    event_date: string;
  };
  state: HostRegistState;
  role: UserRole;
}

export enum HostRegistState {
  PENDING = "PENDING",
  REJECT = "REJECT",
  ACCEPT = "ACCEPT",
}

export enum UserRole {
  SUPER_ADMIN = "superAdmin",
  ADMIN = "admin",
  USER = "user",
}
