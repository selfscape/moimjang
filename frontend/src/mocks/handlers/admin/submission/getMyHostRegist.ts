import { rest } from "msw";
import { serverUrl } from "configs";

const dummyData = {
  id: 0,
  user: {
    id: 0,
    username: "string",
    email: "string",
    role: "string",
    gender: "string",
    birth_year: 0,
    mbti: "string",
    keywords: "string",
    favorite_media: "string",
    tmi: "string",
    hobby: "string",
    strength: "string",
    happyMoment: "string",
    created_at: "2025-05-09T00:08:15.686Z",
  },
  state: "PENDING",
  created_at: "2025-05-09T00:08:15.686Z",
  updated_at: "2025-05-09T00:08:15.686Z",
};

export const getMyHostRegistHandler = [
  rest.get(`${serverUrl}/hostRegist/my`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dummyData));
  }),
];
