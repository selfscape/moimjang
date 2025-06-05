import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Brand, BrandState } from "interfaces/brand";
import { createContext, useContext } from "react";
import { GetBrandOutput } from "../brand/useGetBrands";

interface BrandTableContextType {
  brands: Array<Brand>;
  filter: { limit: number; state: BrandState; isDescending: boolean };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      limit: number;
      state: BrandState;
      isDescending: boolean;
    }>
  >;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<GetBrandOutput, AxiosError<unknown, any>>>;
}

export const BrandTableContext = createContext<BrandTableContextType>(null);

const useBrandTable = () => {
  const context = useContext<BrandTableContextType>(BrandTableContext);

  if (!context) {
    throw new Error("useBrandTable must be used within a BrandTableProvider");
  }
  return context;
};

export default useBrandTable;
