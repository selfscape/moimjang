import styled from "styled-components";
import { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaGamepad,
  FaComments,
  FaBoxOpen,
  FaPenNib,
  FaPencilAlt,
} from "react-icons/fa";
import { useRecoilState } from "recoil";

import { Pathnames } from "constants/admin/index";
import { ChannelFeatureButton } from "constants/common";
import useGetChannelById from "hooks/consumer/useGetChannelById";
import useGetBrandById from "hooks/consumer/useGetBrandById";
import useHeader from "hooks/consumer/components/useHeader";
import userState from "recoils/atoms/auth/userState";

import ConsumerLayout from "components/consumer/common/ConsumerLayout";
import RenderActionButton from "components/consumer/channelDetail/RenderActionButton";

const ChannelDetail = () => {
  const { header } = useHeader();
  const navigate = useNavigate();
  const [, setUserData] = useRecoilState(userState);

  const { channelId } = useParams();
  const { data: channelData, refetch } = useGetChannelById();
  const { data: brandData } = useGetBrandById(channelData?.brand_id);

  const handleNavigate = useCallback(
    (pathName: string, stateValue?: any) => {
      navigate(
        pathName,
        stateValue !== undefined ? { state: stateValue } : undefined
      );
    },
    [navigate]
  );

  const handleBackButtonClick = useCallback(() => {
    navigate(Pathnames.Home);
  }, [navigate]);

  useEffect(() => {
    header({
      visible: true,
      title: "채널 상세",
      onBack: handleBackButtonClick,
      onRefresh: refetch,
    });
  }, [header, handleBackButtonClick, refetch]);

  useEffect(() => {
    if (channelData) {
      setUserData((prev) => ({
        ...prev,
        joined_channel: {
          id: channelData.id,
          title: channelData.title,
          event_date: channelData.event_date,
          brand_id: channelData.brand_id,
          brand_title: channelData.brand_title,
        },
      }));
    }
  }, [channelData, setUserData]);

  if (!channelData) return null;

  const { title, description, event_date, visible_components, brand_id } =
    channelData;

  return (
    <ConsumerLayout>
      <Container>
        <CardContainer>
          {brandData?.thumbnailImage?.url && (
            <ThumbnailImage
              src={brandData.thumbnailImage.url}
              alt="찐프제게더링 Thumbnail"
            />
          )}

          <ActionButtons>
            {visible_components.includes(ChannelFeatureButton.GROUP) &&
              RenderActionButton("white", <FaUsers />, "조 확인하기", () =>
                handleNavigate(
                  `${Pathnames.ChannelDetail}/${channelId}/groupCheck`
                )
              )}

            {visible_components.includes(ChannelFeatureButton.QUESTION_CARD) &&
              RenderActionButton("white", <FaBoxOpen />, "컨텐츠 박스", () =>
                handleNavigate(
                  `${Pathnames.ChannelDetail}/${channelId}/questionCard`,
                  brand_id
                )
              )}

            {visible_components.includes(ChannelFeatureButton.MATCHLOG) &&
              RenderActionButton("white", <FaGamepad />, "첫인상 게임", () =>
                handleNavigate(
                  `${Pathnames.ChannelDetail}/${channelId}/matchLog`
                )
              )}

            {visible_components.includes(ChannelFeatureButton.REVIEW_FORM) &&
              RenderActionButton(
                "white",
                <FaPenNib />,
                "대화 후기 남기기",
                () =>
                  handleNavigate(
                    `${Pathnames.ChannelDetail}/${channelId}/reviewForm`
                  )
              )}

            {visible_components.includes(ChannelFeatureButton.REVIEW_LIST) &&
              RenderActionButton(
                "white",
                <FaComments />,
                "대화 후기 확인하기",
                () =>
                  handleNavigate(
                    `${Pathnames.ChannelDetail}/${channelId}/reviewlist`
                  )
              )}

            {visible_components.includes(ChannelFeatureButton.WRITE_REVIEW) &&
              RenderActionButton(
                "white",
                <FaPencilAlt />,
                "리뷰 작성하기",
                () =>
                  handleNavigate(
                    `${Pathnames.ChannelDetail}/${channelId}/writereview`,
                    brand_id
                  )
              )}
          </ActionButtons>

          {visible_components.length === 0 ? (
            <EmptyState>
              <EmptyTitle>컨텐츠를 준비 중입니다</EmptyTitle>
              <EmptyDescription>잠시만 기다려주세요.</EmptyDescription>
            </EmptyState>
          ) : (
            <ChannelInfo>
              <ChannelInfoContent>
                <ChannelName>{title}</ChannelName>
                <ChannelDescription>{description}</ChannelDescription>
              </ChannelInfoContent>
            </ChannelInfo>
          )}
        </CardContainer>
      </Container>
    </ConsumerLayout>
  );
};

export default ChannelDetail;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  width: 100%;
  gap: 1.5rem;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 16px;
  margin-bottom: 1rem;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
`;

const ActionButtons = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px dashed #ddd;
  border-radius: 12px;
  background-color: #fffefa;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
`;

const EmptyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #5f3f20;
  margin-bottom: 0.5rem;
`;

const EmptyDescription = styled.p`
  font-size: 0.95rem;
  color: #8d6b3e;
  line-height: 1.4;
`;

const ChannelInfo = styled.div`
  background-color: #fdf7ed; /* 좀 더 부드러운 베이지 톤 */
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;

const ChannelInfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ChannelName = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #5f3f20;
`;

const ChannelDescription = styled.p`
  color: #8d6b3e;
  line-height: 1.4;
`;

const EventDate = styled.p`
  color: #a68254;
  font-size: 0.95rem;
  font-weight: 500;
`;
