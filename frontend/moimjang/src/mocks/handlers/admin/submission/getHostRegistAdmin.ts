import { rest } from "msw";
import { serverUrl } from "configs";

const dummyData = {
  regists: [
    {
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
        created_at: "2025-05-09T00:05:42.397Z",
      },
      state: "PENDING",
      created_at: "2025-05-09T00:05:42.397Z",
      updated_at: "2025-05-09T00:05:42.397Z",
    },
    {
      id: 1,
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
        created_at: "2025-05-09T00:05:42.397Z",
      },
      state: "PENDING",
      created_at: "2025-05-09T00:05:42.397Z",
      updated_at: "2025-05-09T00:05:42.397Z",
    },
    {
      id: 2,
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
        created_at: "2025-05-09T00:05:42.397Z",
      },
      state: "PENDING",
      created_at: "2025-05-09T00:05:42.397Z",
      updated_at: "2025-05-09T00:05:42.397Z",
    },
  ],
  totalCount: 1,
};

export const getHostRegistAdminHandler = [
  rest.get(`${serverUrl}/hostRegistAdmin`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(dummyData));
  }),
];
