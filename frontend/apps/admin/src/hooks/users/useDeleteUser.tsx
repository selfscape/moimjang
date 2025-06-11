import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "api/users/deleteUser";
import { AxiosError } from "axios";

const useDeleteUser = () => {
  return useMutation<void, AxiosError, string>({
    mutationFn: (userId) => deleteUser(userId),
  });
};

export default useDeleteUser;
