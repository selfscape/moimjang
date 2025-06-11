import { rest } from "msw";
import { serverUrl } from "configs";

export const dummyData = {
  id: 1,
  url: "https://minio.chanyoung.site/matchlog/brands/thumb…880f21b99f24b3763321be0553fe0635817e1ece0b1c3b6e5",
};

export const getMainImage = [
  rest.get(`${serverUrl}/landing/registerlist`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dummyData));
  }),
];
