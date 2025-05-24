import { rest } from "msw";
import { serverUrl } from "configs";

export const deleteGalleryImage = [
  rest.delete(
    `${serverUrl}/landingAdmin/deleteImage/gallery`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json([]));
    }
  ),
];
