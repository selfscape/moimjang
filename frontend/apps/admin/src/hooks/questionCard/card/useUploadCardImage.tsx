import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import { uploadCardImage } from "api/questionCard/card/uploadCardImage";
import { QuestionCard } from "interfaces/questionCardCategory";

interface Variables {
  file: File;
  card_id: number;
}

const useUploadCardImage = () => {
  return useMutation<QuestionCard, AxiosError, Variables>({
    mutationFn: ({ card_id, file }) => uploadCardImage(file, card_id),
  });
};

export default useUploadCardImage;
