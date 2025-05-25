import { useMutation } from "@tanstack/react-query";
import { User } from "interfaces/user";
import {
  updateMyInfo,
  UpdateMyInfoRequestBody,
} from "api/consumer/updateMyInfo";

const useUpdateMyInfo = () => {
  return useMutation<User, Error, UpdateMyInfoRequestBody>({
    mutationFn: updateMyInfo,
  });
};

export default useUpdateMyInfo;
