import { rest } from "msw";
import { serverUrl } from "configs";
import { dummyData } from "mocks/data/getChannels";

export const getChannels = [
  rest.get(`${serverUrl}/channels`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dummyData));
  }),
];
