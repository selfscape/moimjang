export interface Group {
  id: number;
  channel_id: number;
  group_name: string;
  created_at: string;
  joined_users: Array<JoinedUser>;
}

export interface JoinedUser {
  id: number;
  user_name: string;
  gender: string;
  birth_year: number;
}
