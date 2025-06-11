import { UserRole } from "interfaces/user";

const useCheckUserRole = (userRole: UserRole) => {
  const getUserRole = (userRole: UserRole) => {
    return {
      isSuperAdmin: userRole === UserRole.SUPER_ADMIN,
      isAdmin: userRole === UserRole.ADMIN,
      isUser: userRole === UserRole.USER,
    };
  };

  return getUserRole(userRole);
};

export default useCheckUserRole;
