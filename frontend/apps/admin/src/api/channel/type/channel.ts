export interface JoinedUser {
  id: number;
  user_name: string;
  gender: string;
  birth_year: number;
}

export enum ChannelState {
  PENDING = "PENDING",
  ONGOING = "ONGOING",
  FULL = "FULL",
  FINISH = "FINISH",
}

export interface Channel {
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
