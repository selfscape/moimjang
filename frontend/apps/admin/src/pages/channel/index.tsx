import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

import useGetChannels from "api/channel/hooks/useGetChannels";
import { ChannelTableContext } from "hooks/channel/context/useChannelTableContext";
import { ChannelState } from "interfaces/channels";

import AdminLayout from "components/common/AdminLayout";
import Pagination from "components/common/Pagination";
import Controller from "components/channel/Controller";
import ChannelTable from "components/channel/ChannelTable";

const Channel = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const [filter, setFilter] = useState<{
    limit: number;
    isDescending: boolean;
    state: ChannelState;
  }>({
    limit: 10,
    state: null,
    isDescending: true,
  });

  const { data, refetch } = useGetChannels({
    sort_by: null,
    brand_id: null,
    state: filter.state,
    descending: filter.isDescending,
    offset: (page - 1) * filter.limit,
    limit: filter.limit,
  });

  const channelData = data?.channels;
  const totalCount = data?.totalCount;

  return (
    <AdminLayout>
      <ChannelTableContext.Provider
        value={{ channelData, refetch, filter, setFilter }}
      >
        <Container>
          <Controller />
          <ChannelTable />
          <Pagination totalItems={totalCount} skip={filter.limit} />
        </Container>
      </ChannelTableContext.Provider>
    </AdminLayout>
  );
};

const Container = styled.div`
  white-space: nowrap;
  padding: 16px;
`;

export default Channel;
