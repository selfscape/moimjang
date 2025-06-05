import { useState } from "react";
import styled from "styled-components";
import useGetHostRegistAdmin from "api/hostRegist/useGetHostRegistAdmin";
import { SubmissionContext } from "hooks/submission/context/useSubmissionContext";

import AdminLayout from "components/common/AdminLayout";
import Controller from "components/submission/Controller";
import Pagination from "components/common/Pagination";
import SubmissionTable from "components/submission/SubmissionTable";

const Submission = () => {
  const [filter, setFilter] = useState<{
    sort_by: string;
    descending: boolean;
    offset: number;
    limit: number;
  }>({
    sort_by: "",
    descending: true,
    offset: 0,
    limit: 10,
  });

  const { data, refetch, error, isLoading } = useGetHostRegistAdmin({
    sort_by: filter.sort_by,
    descending: filter.descending,
    offset: filter.offset,
    limit: filter.limit,
  });

  const totalItems = data?.totalCount;
  const hostRegists = data?.regists;

  return (
    <AdminLayout>
      <SubmissionContext.Provider
        value={{ hostRegists, refetch, error, isLoading, filter, setFilter }}
      >
        <Container>
          <Controller />
          <SubmissionTable />
          <Pagination totalItems={totalItems} skip={filter?.limit} />
        </Container>
      </SubmissionContext.Provider>
    </AdminLayout>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0px;
`;

export default Submission;
