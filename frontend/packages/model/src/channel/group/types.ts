import { User } from "@/user";

export interface Group {
  id: number;
  channel_id: number;
  group_name: string;
  created_at: string;
  joined_users: Array<User>;
}
