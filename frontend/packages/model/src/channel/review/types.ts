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
