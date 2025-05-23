import { useMutation } from "@tanstack/react-query";
import { editUser, EditProfileInput } from "api/admin/users/editProfile";
import { User } from "interfaces/user";
import { AxiosError } from "axios";

interface EditProfileVariables {
  user_id: string;
  profileData: EditProfileInput;
}

const useEditProfile = () => {
  return useMutation<User, AxiosError, EditProfileVariables>({
    mutationFn: ({ profileData }) => editUser(profileData),
  });
};

export default useEditProfile;
