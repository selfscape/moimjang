import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import useDeleteUser from "hooks/admin/users/useDeleteUser";
import useGetUsers from "hooks/admin/users/useGetUsers";
import { UserTableContext } from "hooks/admin/users/useUserTable";

import AdminLayout from "components/admin/common/AdminLayout";
import Pagination from "components/admin/common/Pagination";
import Controller from "components/admin/user/Controller";
import UserTable from "components/admin/user/UserTable";

const User = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const [filter, setFilter] = useState<{
    limit: number;
    isDescending: boolean;
  }>({
    limit: 10,
    isDescending: true,
  });

  const { data, refetch: refetchUser } = useGetUsers({
    sort_by: null,
    descending: filter.isDescending,
    offset: (page - 1) * filter.limit,
    limit: filter.limit,
  });

  const { mutate: deleteUser } = useDeleteUser();

  const userList = data?.users?.length ? data?.users : [];
  const totalItems = data?.totalCount;

  return (
    <AdminLayout>
      <UserTableContext.Provider
        value={{
          filter,
          setFilter,
          refetchUser,
          deleteUser,
          userList,
          totalItems,
        }}
      >
        <Container>
          <Controller />
          <UserTable />
          <Pagination totalItems={totalItems} skip={filter.limit} />
        </Container>
      </UserTableContext.Provider>
    </AdminLayout>
  );
};

const Container = styled.div``;

export default User;
