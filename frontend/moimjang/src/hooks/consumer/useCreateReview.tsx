import { useMutation } from "@tanstack/react-query";
import {
  createReview,
  CreateReviewRequestBody,
} from "api/consumer/socialing/createReview";

const useCreateReview = () => {
  return useMutation<void, Error, CreateReviewRequestBody>({
    mutationFn: createReview,
  });
};

export default useCreateReview;
