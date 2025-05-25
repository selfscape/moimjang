import { createContext, useContext } from "react";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { BrandReview } from "api/admin/brand/types/brandReview";
import { GetBrandReviewsOutput } from "api/admin/brand/hooks/useGetBrandReviews";

interface BrandReviewContextType {
  brandReviews: Array<BrandReview>;
  isLoading: boolean;
  error: Error;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<GetBrandReviewsOutput, Error>>;
  enlargedImageUrl: string;
  setEnlargedImageUrl: React.Dispatch<React.SetStateAction<string>>;
  filter: {
    isDescending: boolean;
    limit: number;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      isDescending: boolean;
      limit: number;
    }>
  >;
}

export const BrandReviewContext = createContext<BrandReviewContextType>(null);

export const useBrandReviewContext = (): BrandReviewContextType => {
  const context = useContext(BrandReviewContext);

  if (!context) {
    throw new Error("BrandReviewContext must be used within a BrandProvider");
  }
  return context;
};
