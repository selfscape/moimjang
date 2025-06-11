import { User } from "../user";
import { ChannelFeatureButton, ChannelState } from "./enums";

export interface Channel {
  title: string;
  brand_id: number;
  description: string;
  event_date: string;
  visible_components: Array<ChannelFeatureButton>;
  channel_state: ChannelState;
  id: number;
  created_at: string;
  brand_title: string;
  joined_users: Array<User>;
}
