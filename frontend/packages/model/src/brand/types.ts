import { Image } from "../common";
import { BrandState } from "./enums";

export interface Brand {
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
