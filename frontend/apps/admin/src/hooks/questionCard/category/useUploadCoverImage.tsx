import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { uploadCoverImage } from "api/questionCard/category/uploadCoverImage";
import { UploadCoverImageOutput } from "api/questionCard/category/uploadCoverImage";

interface Variables {
  file: File;
  question_card_category_id: number;
}

const useUploadCoverImage = () => {
  return useMutation<UploadCoverImageOutput, AxiosError, Variables>({
    mutationFn: ({ question_card_category_id, file }) =>
      uploadCoverImage(file, question_card_category_id),
  });
};

export default useUploadCoverImage;
