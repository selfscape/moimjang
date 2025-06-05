import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { BrandFormContext } from "hooks/brand/context/useBrandFormContext";
import useGetBrandById from "hooks/brand/useGetBrandById";
import { Brand } from "interfaces/brand";

import AdminLayout from "components/common/AdminLayout";
import EditBrandForm from "components/brand/EditBrandForm";

export type EditBrandInputType = Pick<
  Brand,
  | "id"
  | "title"
  | "description"
  | "max_participants"
  | "min_participants"
  | "brand_state"
  | "location_link"
  | "meeting_location"
  | "thumbnailImage"
  | "detailImages"
  | "socialing_duration"
>;

const EditBrand = () => {
  const { brandId } = useParams();
  const { data } = useGetBrandById(brandId);

  const [brand, setBrand] = useState<EditBrandInputType>({
    id: null,
    title: null,
    description: null,
    max_participants: null,
    min_participants: null,
    brand_state: null,
    location_link: null,
    meeting_location: null,
    thumbnailImage: { id: null, url: null },
    detailImages: [{ id: null, url: null }],
    socialing_duration: null,
  });

  useEffect(() => {
    if (!data) return;

    setBrand({
      id: data.id,
      title: data.title,
      description: data.description,
      max_participants: data.max_participants,
      min_participants: data.min_participants,
      brand_state: data.brand_state,
      location_link: data.location_link,
      meeting_location: data.meeting_location,
      thumbnailImage: {
        id: data?.thumbnailImage?.id || null,
        url: data?.thumbnailImage?.url || null,
      },
      detailImages: data?.detailImages || null,
      socialing_duration: data?.socialing_duration || null,
    });
  }, [data]);

  return (
    <BrandFormContext.Provider
      value={{
        brand,
        setBrand,
        brandId,
      }}
    >
      <AdminLayout>
        <EditBrandForm />
      </AdminLayout>
    </BrandFormContext.Provider>
  );
};

export default EditBrand;
