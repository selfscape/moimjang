import { rest } from "msw";
import { serverUrl } from "configs";
import { registerListDummyData } from "mocks/data/landing/registerList";

export const getRegisterList = [
  rest.get(`${serverUrl}/landing/registerlist`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(registerListDummyData));
  }),
];
