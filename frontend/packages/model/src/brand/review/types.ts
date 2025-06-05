import { Image } from "../../common/index";
import { User } from "../../user/index";

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
