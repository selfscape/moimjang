export interface BrandReview {
  id: number;
  contents: string;
  is_display: boolean;
  createdAt: string;
  updatedAt: string;
  brandId: number;
  user: {
    id: number;
    username: string;
    gender: "male" | "female";
  };
  imageList: {
    id: number;
    url: string;
  }[];
}
