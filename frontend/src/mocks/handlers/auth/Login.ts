import { rest } from "msw";
import { serverUrl } from "configs";
import { HostRegistState, UserRole } from "interfaces/user";

export const login = [
  rest.post(`${serverUrl}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnb2F3bWZoZmwxQG5hdmVyLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTc0NjY5MDA5NH0.x7wMTAGbGVYYbVm7ngPgW9CTU5Z3VRoY_5lXJWRhxOU",
        token_type: "string",
        user: {
          id: 0,
          username: "string",
          email: "string",
          gender: "string",
          birth_year: 0,
          mbti: "string",
          keywords: "string",
          favorite_media: "string",
          tmi: "string",
          hobby: "string",
          strength: "string",
          happyMoment: "string",
          created_at: "2025-05-07T07:28:15.103Z",
          role: UserRole.ADMIN,
        },
      })
    );
  }),
];
