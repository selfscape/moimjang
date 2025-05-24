import styled from "styled-components";
import useCheckUserRole from "hooks/auth/useCheckUserRole";

import ManagementTabs from "components/admin/common/ManagementTabs";
import SystemModal from "components/consumer/common/SystemModal";
import PopupModal from "components/consumer/common/PopupModal";
import SaveBar from "./SaveBar";
import { useRecoilState } from "recoil";
import userState from "recoils/atoms/auth/userState";

interface Props {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  const [userData, setUserData] = useRecoilState(userState);
  const { isUser } = useCheckUserRole(userData?.role);

  return (
    <Container>
      {!isUser && <ManagementTabs />}

      {children}
      <SystemModal />
      <PopupModal />
      <SaveBar />
    </Container>
  );
};

const Container = styled.div``;

export default AdminLayout;
