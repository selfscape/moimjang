import React, { useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

import { Pathnames } from "constants/admin";
import { useBrandFormContext } from "hooks/admin/brand/context/useBrandFormContext";
import useSystemModal from "hooks/common/components/useSystemModal";
import useSaveBar from "hooks/admin/components/useSaveBar";
import useEditBrand from "hooks/admin/brand/useEditBrand";

import TitleInput from "../management/TitleInput";
import DescriptionInput from "../management/DescriptionInput";
import ThumbnailUpload from "../management/ThumbnailUpload";
import DetailImageUpload from "./DetailImageUpload";
import Participants from "./Participants";
import MeetingLocation from "./MeetingLocation";
import { BrandState } from "interfaces/brand";
import SocialingDuration from "./SocialingDuration";

const ManagementSection = () => {
  const { brand } = useBrandFormContext();

  const { brandId } = useParams();
  const { showErrorModal, showAnyMessageModal, openModal } = useSystemModal();
  const { showSaveBar, closeSaveBar } = useSaveBar();
  const { mutate: editBrand } = useEditBrand();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!brand.title || !brand.description || !brand.thumbnailImage?.url) {
      showAnyMessageModal("제목, 설명, 대표 이미지는 \n 필수 입력 사항입니다.");
      return;
    }

    const requestBody = {
      title: brand.title,
      description: brand.description,
      min_participants: brand.min_participants,
      max_participants: brand.max_participants,
      socialing_duration: brand.socialing_duration,
      meeting_location: brand.meeting_location,
      location_link: brand.location_link,
      brand_state: BrandState.ONGOING,
    };

    editBrand(
      {
        requestBody,
        brand_id: brandId,
      },
      {
        onSuccess: () => {
          openModal({
            isOpen: true,
            title: "저장 성공🎉",
            message: "브랜드 페이지로 이동합니다.",
            onConfirm: () => {
              navigate(Pathnames.Brand);
            },
          });
        },
        onError: (error) => {
          const errorDetail = error.response.data as { detail: string };
          showErrorModal(errorDetail.detail);
        },
      }
    );
  };

  useEffect(() => {
    showSaveBar({
      isVisible: true,
      onSave: handleSubmit,
      buttonText: "저장",
    });

    return () => {
      closeSaveBar();
    };
  }, [showSaveBar, closeSaveBar]);

  return (
    <Container onSubmit={handleSubmit}>
      <ThumbnailUpload />
      <TitleInput />
      <DescriptionInput />
      <Participants />
      <SocialingDuration />
      <MeetingLocation />
      <DetailImageUpload />
    </Container>
  );
};

const Container = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export default ManagementSection;
