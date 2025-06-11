import { http, HttpResponse } from "msw";

export const handlers = [
  http.post(`/api/auth/callback/credentials`, () => {
    return HttpResponse.json(
      { data: "" },
      {
        headers: {
          "Set-Cookie": "connect.sid=msw-cookie;HttpOnly;Path=/",
        },
        status: 202,
      }
    );
  }),
];
