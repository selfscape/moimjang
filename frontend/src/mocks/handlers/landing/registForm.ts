import { rest } from "msw";
import { serverUrl } from "configs";

export const registForm = [
  rest.post(`${serverUrl}/branding/registform`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: 0,
        surveyId: 1,
        title: "string",
        response: {
          schmeaId1: "Answer1",
          schemaId2: "Answer2",
        },
        submitted_at: "2025-03-28T12:15:00Z",
      })
    );

    // return res(
    //   ctx.status(500),
    //   ctx.json({
    //     detail: "에러입니당",
    //   })
    // );
  }),
];
