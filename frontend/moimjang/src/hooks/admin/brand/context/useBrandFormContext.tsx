import { createContext, useContext } from "react";
import { EditBrandInputType } from "pages/admin/brand/form/EditBrand";

interface BrandFormContextType {
  brand: EditBrandInputType;
  setBrand: React.Dispatch<React.SetStateAction<EditBrandInputType>>;
  brandId: string;
}

export const BrandFormContext = createContext<BrandFormContextType>(null);

export const useBrandFormContext = (): BrandFormContextType => {
  const context = useContext(BrandFormContext);

  if (!context) {
    throw new Error("BrandFormContextType must be used within a BrandProvider");
  }
  return context;
};
