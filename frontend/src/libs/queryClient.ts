// src/libs/graphqlClient.ts
import { SERVER_URI } from "constants/env";
import { GraphQLClient } from "graphql-request";

const graphqlClient = new GraphQLClient(`${SERVER_URI}/graphql`, {
  headers: {
    // 필요시 인증 토큰 추가 가능
    // Authorization: `Bearer ${token}`
  },
});

export default graphqlClient;
