import { ChannelState } from "interfaces/channels";

export interface JoinedUser {
  id: number;
  user_name: string;
  gender: string;
  birth_year: number;
}

export interface LandingChannel {
  title: string;
  brand_id: number;
  description: string;
  event_date: string;
  visible_components: Array<string>;
  channel_state: ChannelState;
  id: number;
  created_at: string;
  brand_title: string;
  joined_users: Array<JoinedUser>;
}
