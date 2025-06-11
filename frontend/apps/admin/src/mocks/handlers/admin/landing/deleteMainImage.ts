import { rest } from "msw";
import { serverUrl } from "configs";

export const deleteMainImage = [
  rest.delete(`${serverUrl}/landingAdmin/deleteImage/main`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json([]));
  }),
];
