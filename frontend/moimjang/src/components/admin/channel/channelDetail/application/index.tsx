import { useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

import useGetSurvey from "api/admin/survey/hook/useGetSurvey";
import useGetSurveyResponses from "hooks/admin/channel/useGetSurveyResponses";
import { ApplicationTableContext } from "hooks/admin/channel/context/useApplicationTableContext";
import { useChannelFormContext } from "hooks/admin/channel/context/useChannelFormContext";

import Pagination from "components/admin/common/Pagination";
import Controller from "./Controller";
import PopupImageModal from "./PopupImageModal";
import Table from "./Table";

const Application = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { channelData, channelId } = useChannelFormContext();

  const [filter, setFilter] = useState<{
    limit: number;
    sort_by: string;
    isDescending: boolean;
  }>({
    limit: 10,
    sort_by: null,
    isDescending: true,
  });

  const { data: survey } = useGetSurvey(String(channelData?.brand_id));

  const { data, refetch } = useGetSurveyResponses({
    survey_id: survey?.[0]?._id,
    channel_id: channelId,
    sort_by: null,
    descending: filter.isDescending,
    limit: filter.limit,
    offset: (page - 1) * filter.limit,
  });

  const [enlargedImageUrl, setEnlargedImageUrl] = useState<string | null>(null);
  const surveyResponses = data?.responses;
  const totalItems = data?.totalCount;

  return (
    <ApplicationTableContext.Provider
      value={{
        survey,
        surveyResponses,
        refetch,
        enlargedImageUrl,
        setEnlargedImageUrl,
        filter,
        setFilter,
      }}
    >
      <Container>
        <Controller />
        <Table />
        {enlargedImageUrl && (
          <PopupImageModal
            src={enlargedImageUrl}
            isOpen={!!enlargedImageUrl}
            onClose={() => setEnlargedImageUrl(null)}
          />
        )}
        <Pagination totalItems={totalItems} skip={filter.limit} />
      </Container>
    </ApplicationTableContext.Provider>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
`;

export default Application;
