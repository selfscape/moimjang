import { rest } from "msw";
import { serverUrl } from "configs";

export const updateHostRegistHandler = [
  rest.put(
    `${serverUrl}/hostRegistAdmin/:host_regist_id/state`,
    async (req, res, ctx) => {
      const { host_regist_id } = req.params;
      const { state } = await req.json();

      const dummyUser = {
        id: 2,
        username: "updatedUser",
        email: "updated@example.com",
        role: "admin",
        gender: "male",
        birth_year: 1990,
        mbti: "ENFJ",
        keywords: "organized, social",
        favorite_media: "books",
        tmi: "loves coffee",
        hobby: "reading",
        strength: "leadership",
        happyMoment: "hosting events",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        host_regist_id: Number(host_regist_id),
        updated_state: state,
      };

      return res(ctx.status(200), ctx.json(dummyUser));
    }
  ),
];
