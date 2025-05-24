import { useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

import { BrandTableContext } from "hooks/admin/users/useBrandTable";
import useGetBrands from "hooks/admin/brand/useGetBrands";
import { BrandState } from "interfaces/brand";

import AdminLayout from "components/admin/common/AdminLayout";
import Controller from "components/admin/brand/Controller";
import BrandTable from "components/admin/brand/BrandTable";
import Pagination from "components/admin/common/Pagination";

const Brand = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const [filter, setFilter] = useState<{
    limit: number;
    state: BrandState;
    isDescending: boolean;
  }>({
    limit: 20,
    state: null,
    isDescending: true,
  });

  const { data, refetch } = useGetBrands({
    sort_by: null,
    state: filter.state,
    descending: filter.isDescending,
    offset: (page - 1) * filter.limit,
    limit: filter.limit,
  });

  const brands = data?.brands;
  const totalCount = data?.totalCount;

  return (
    <AdminLayout>
      <BrandTableContext.Provider
        value={{ filter, setFilter, brands, refetch }}
      >
        <Container>
          <Controller />
          <BrandTable />
          <Pagination totalItems={totalCount} skip={filter.limit} />
        </Container>
      </BrandTableContext.Provider>
    </AdminLayout>
  );
};

const Container = styled.div``;

export default Brand;
