import { rest } from "msw";
import { serverUrl } from "configs";

export const updateRegister = [
  rest.put(`${serverUrl}/landing/update`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ suceess: true }));
  }),

  // return res(
  //   ctx.status(500),
  //   ctx.json({
  //     detail: "에러입니당",
  //   })
  // );
];
