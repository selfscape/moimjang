import { rest } from "msw";
import { serverUrl } from "configs";
import { registerListDummyData } from "mocks/data/landing/registerList";

export const dummyData = {
  id: 1,
  url: "https://cdn.pixabay.com/photo/2018/02/24/21/40/smartphone-3179295_1280.jpg",
};

export const uploadGalleryImage = [
  rest.post(
    `${serverUrl}/landimgAdmin/uploadImage/gallery`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(dummyData));
    }
  ),
];
