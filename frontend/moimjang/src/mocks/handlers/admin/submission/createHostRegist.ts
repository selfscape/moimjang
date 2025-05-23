import { rest } from "msw";
import { serverUrl } from "configs";

export const createHostRegistHandler = [
  rest.post(`${serverUrl}/hostRegist`, async (_req, res, ctx) => {
    const dummyUser = {
      id: 1,
      username: "newUser",
      email: "newuser@example.com",
      role: "user",
      gender: "female",
      birth_year: 1995,
      mbti: "INFJ",
      keywords: "creative, empathetic",
      favorite_media: "movies",
      tmi: "loves journaling",
      hobby: "hiking",
      strength: "empathy",
      happyMoment: "deep talks",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return res(ctx.status(200), ctx.json(dummyUser));
  }),
];
