import { Image } from "../common";
import { User } from "../user";

export interface BrandReview {
  id: number;
  contents: string;
  is_display: boolean;
  createdAt: string;
  updatedAt: string;
  brandId: number;
  user: User;
  imageList: Array<Image>;
}
