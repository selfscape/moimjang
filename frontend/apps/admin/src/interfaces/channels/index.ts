import { ChannelFeatureButton } from "constants/common";
import { JoinedUser } from "interfaces/group";
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
  visible_components: Array<ChannelFeatureButton>;
  id: number;
  created_at: string; // ISO 8601 datetime format (YYYY-MM-DDTHH:mm:ss.sssZ)
  brand_title: string;
  joined_users: JoinedUser[];
  event_date: string;

  channel_state: ChannelState;
  event_time: string;
  min_participants: number;
  max_participants: number;
  meeting_location: string;
  location_link: string;
}

export interface Review {
  id: number;
  channel_id: number;
  style: string;
  impression: string;
  conversation: string;
  additional_info: string;
  keywords: string;
  created_at: string;
  is_reviewer_anonymous: boolean;
  reviewer_user_gender: string;
  reviewer_user_name: string;
}
