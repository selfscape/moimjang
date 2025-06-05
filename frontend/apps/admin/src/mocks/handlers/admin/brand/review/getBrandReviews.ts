import { graphql } from "msw";
import { getBrandReviews } from "mocks/data/admin/brand/brandReviewList";

export const getBrandReviewsHandler = graphql.query(
  "GetBrandReviews",
  (req, res, ctx) => {
    return res(ctx.data({ getBrandReviews }));
  }
);
