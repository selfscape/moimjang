import { rest } from "msw";
import { serverUrl } from "configs";

export const dummyData = {
  id: 1,
  url: "https://cdn.pixabay.com/photo/2024/02/15/13/52/students-8575444_1280.png",
};

export const getMainImage = [
  rest.get(`${serverUrl}/landingAdmin/mainImage`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dummyData));
  }),
];
