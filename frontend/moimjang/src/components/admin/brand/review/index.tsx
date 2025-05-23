import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useGetBrandReviews from "api/admin/brand/hooks/useGetBrandReviews";
import { BrandReviewContext } from "hooks/admin/brand/context/useBrandReviewContext";

import PopupImageModal from "components/admin/channel/channelDetail/application/PopupImageModal";
import Pagination from "components/admin/common/Pagination";
import ReviewTable from "./ReviewTable";
import Controller from "./Controller";

const Review = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const [filter, setFilter] = useState<{
    isDescending: boolean;
    limit: number;
  }>({ isDescending: true, limit: 20 });

  const { data, isLoading, error, refetch } = useGetBrandReviews({
    offset: (page - 1) * filter.limit,
    limit: filter.limit,
    sort_by: "",
    descending: filter.isDescending,
  });

  const [enlargedImageUrl, setEnlargedImageUrl] = useState<string | null>(null);
  const brandReviews = data?.reviews;
  const totalCount = data?.totalCount;

  return (
    <BrandReviewContext.Provider
      value={{
        brandReviews,
        isLoading,
        error,
        refetch,
        enlargedImageUrl,
        setEnlargedImageUrl,
        filter,
        setFilter,
      }}
    >
      <Controller />
      <ReviewTable />
      <Pagination totalItems={totalCount} skip={filter.limit} />

      {enlargedImageUrl && (
        <PopupImageModal
          src={enlargedImageUrl}
          isOpen={!!enlargedImageUrl}
          onClose={() => setEnlargedImageUrl(null)}
        />
      )}
    </BrandReviewContext.Provider>
  );
};

export default Review;
