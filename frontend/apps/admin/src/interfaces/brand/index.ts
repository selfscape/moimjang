export enum BrandState {
  ONGOING = "ONGOING",
  FINISH = "FINISH",
}

export interface Brand {
  id: number;
  title: string;
  description: string;
  min_participants: number;
  max_participants: number;
  socialing_duration: number;
  meeting_location: string;
  location_link: string | null;
  brand_state: BrandState;
  thumbnailImage: {
    id: number;
    url: string;
  };
  detailImages: Array<{
    id: number;
    url: string;
  }>;
}
