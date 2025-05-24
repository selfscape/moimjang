import { BrandState } from "interfaces/brand";

export interface Image {
  id: number;
  url: string;
}

export interface LandingBrand {
  id: number;
  title: string;
  description: string;
  min_participants: number;
  max_participants: number;
  meeting_location: string;
  location_link: string;
  brand_state: BrandState;
  thumbnailImage: Image;
  detailImages: Array<Image>;
  socialing_duration: number;
}
