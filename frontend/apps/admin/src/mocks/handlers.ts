import { getRegisterList } from "./handlers/landing/getRegisterList";
import { registForm } from "./handlers/landing/registForm";
import { updateRegister } from "./handlers/admin/socialing/updateRegister";

import { getGalleryImages } from "./handlers/landing/getGalleryImages";
import { getMainImage } from "./handlers/landing/getMainImage";
import { deleteMainImage } from "./handlers/admin/landing/deleteMainImage";
import { deleteGalleryImage } from "./handlers/admin/landing/deleteGalleryImage";
import { uploadGalleryImage } from "./handlers/admin/landing/uploadGalleryImage";
import { uploadMainImage } from "./handlers/admin/landing/uploadMainImage";
import { getMainImage as getAdminMainImage } from "./handlers/admin/landing/getMainImage";
import { getBrandReviewsHandler } from "./handlers/admin/brand/review/getBrandReviews";
import { login } from "./handlers/auth/Login";
import { createHostRegistHandler } from "./handlers/admin/submission/createHostRegist";
import { getHostRegistAdminHandler } from "./handlers/admin/submission/getHostRegistAdmin";
import { getMyHostRegistHandler } from "./handlers/admin/submission/getMyHostRegist";
import { updateHostRegistHandler } from "./handlers/admin/submission/updateHostRegist";

export const handlers = [
  ...login,
  ...getRegisterList,
  ...registForm,
  ...updateRegister,
  getBrandReviewsHandler,

  // landing
  ...getGalleryImages,
  ...getMainImage,
  ...deleteMainImage,
  ...deleteGalleryImage,
  ...uploadGalleryImage,
  ...uploadMainImage,
  ...getAdminMainImage,

  // hostRegist
  ...createHostRegistHandler,
  ...getHostRegistAdminHandler,
  ...getMyHostRegistHandler,
  ...updateHostRegistHandler,
];
