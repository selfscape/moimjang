import { useNavigate } from "react-router-dom";
import { Pathnames } from "constants/index";

import useUserTable from "hooks/users/useUserTable";
import useSystemModal from "hooks/common/components/useSystemModal";
import { Table, TableContainer } from "../common/Table";
import Button from "components/common/Button";
import { UserRole } from "interfaces/user";
import { USER_ROLE } from "configs";
import useCheckUserRole from "hooks/auth/useCheckUserRole";

const UserTable = () => {
  const userRole = localStorage.getItem(USER_ROLE) as UserRole;
  const { isSuperAdmin } = useCheckUserRole(userRole);
  const { openModal, showErrorModal, showAnyMessageModal } = useSystemModal();
  const navigate = useNavigate();
  const { deleteUser, refetchUser, userList } = useUserTable();

  const handleRowClick = (userId: number) => {
    navigate(`${Pathnames.User}/${userId}`);
  };

  const handleDeleteButtonClick = (userId: number, username: string) => {
    openModal({
      isOpen: true,
      title: `${username}님을 정말로 삭제하시겠어요?`,
      message: "삭제된 멤버는 다시 복구가 불가능합니다.",
      showCancel: true,
      confirmText: "삭제하기",
      cancelText: "취소",
      onConfirm: () => {
        deleteUser(String(userId), {
          onSuccess: () => {
            refetchUser();
            showAnyMessageModal("유저가 성공적으로 삭제되었습니다.");
          },
          onError: (error) => {
            const errorDetails = error.response.data as { detail: string };
            showErrorModal(errorDetails.detail);
          },
        });
      },
    });
  };

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>이메일</th>
            <th>성별</th>
            <th>년생</th>
            <th>MBTI</th>
            {isSuperAdmin && <th>유저 삭제</th>}
          </tr>
        </thead>
        <tbody>
          {userList && userList.length > 0 ? (
            userList.map((user) => (
              <tr
                key={user.id}
                className="hover-row"
                onClick={() => handleRowClick(user.id)}
              >
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.gender === "male" ? "남자" : "여자"}</td>
                <td>{user.birth_year}</td>
                <td>{user.mbti}</td>
                {isSuperAdmin && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="small"
                      className="positive"
                      onClick={() =>
                        handleDeleteButtonClick(user.id, user.username)
                      }
                    >
                      삭제
                    </Button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="no-data">
                등록된 유저가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
