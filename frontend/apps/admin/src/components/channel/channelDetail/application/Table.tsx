import styled from "styled-components";
import { useQueryClient } from "@tanstack/react-query";

import useUpdateSurveyState from "api/survey/hook/useUpdateSurveyState";
import useSystemModal from "hooks/common/components/useSystemModal";
import { useApplicationTableContext } from "hooks/channel/context/useApplicationTableContext";
import { SurveyRegistState } from "interfaces/landing";

const Table = () => {
  const { setEnlargedImageUrl, surveyResponses, survey, refetch } =
    useApplicationTableContext();

  const { mutate: updateSurveyResponse } = useUpdateSurveyState();
  const { showErrorModal, openModal, showAnyMessageModal } = useSystemModal();

  const handleUpdateButtonClick = (id: string, state: SurveyRegistState) => {
    const action =
      state === SurveyRegistState.ACCEPT
        ? "수락"
        : state === SurveyRegistState.REJECT
        ? "거절"
        : "";
    openModal({
      isOpen: true,
      message: ` ${action} 하시겠습니까?`,
      confirmText: action,
      cancelText: "취소",
      showCancel: true,
      onConfirm: () => {
        updateSurveyResponse(
          { response_id: id, requestBody: { regist_state: state } },
          {
            onSuccess: () => {
              refetch();
              showAnyMessageModal(`${action}이 완료되었습니다.`);
            },
            onError: (error) => {
              console.log("error", error);
              const errorDetails = error.response?.data as {
                detail: string;
              };
              showErrorModal(errorDetails?.detail || "등록 상태 업데이트 실패");
            },
          }
        );
      },
    });
  };

  const questions = survey?.[0]?.questions;

  if (surveyResponses?.length === 0) {
    return (
      <NoDataWrapper>
        <EmptyIcon>📭</EmptyIcon>
        <EmptyText>등록된 응답이 없습니다.</EmptyText>
      </NoDataWrapper>
    );
  }

  return (
    <TableWrapper>
      <StyledTable>
        <thead>
          <tr>
            {questions?.map((q, index) => (
              <Th key={`${q.id}-${index}`}>{q.text}</Th>
            ))}
            <Th>버튼</Th>
          </tr>
        </thead>
        <tbody>
          {surveyResponses?.map((entry) => (
            <StyledTr key={entry._id} registState={entry.registState}>
              {questions?.map((q) => {
                const answerObj = entry.answers.find(
                  (ans) => ans.questionId === q.id
                );
                const answerVal = answerObj ? answerObj.answerValue : "";
                const isImage =
                  typeof answerVal === "string" &&
                  (answerVal.includes(
                    "https://minio.chanyoung.site/matchlog/landing/survey/form"
                  ) ||
                    answerVal.match(/\.(jpeg|jpg|gif|png|bmp)$/i));
                return (
                  <Td key={q.id}>
                    {isImage ? (
                      <img
                        src={answerVal}
                        alt={`응답 이미지 for question ${q.id}`}
                        style={{
                          cursor: "pointer",
                          maxWidth: "40px",
                          maxHeight: "40px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEnlargedImageUrl(answerVal);
                        }}
                      />
                    ) : (
                      answerVal
                    )}
                  </Td>
                );
              })}
              <ActionTd>
                {entry.registState === SurveyRegistState.PENDING ? (
                  <>
                    <AcceptButton
                      onClick={() =>
                        handleUpdateButtonClick(
                          entry._id,
                          SurveyRegistState.ACCEPT
                        )
                      }
                    >
                      수락
                    </AcceptButton>
                    <RejectButton
                      onClick={() =>
                        handleUpdateButtonClick(
                          entry._id,
                          SurveyRegistState.REJECT
                        )
                      }
                    >
                      거절
                    </RejectButton>
                  </>
                ) : entry.registState === SurveyRegistState.ACCEPT ? (
                  <StatusLabel status="accept">수락됨</StatusLabel>
                ) : entry.registState === SurveyRegistState.REJECT ? (
                  <StatusLabel status="reject">거절됨</StatusLabel>
                ) : null}
              </ActionTd>
            </StyledTr>
          ))}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
`;

const Th = styled.th`
  padding: 10px;
  background-color: #f7f7f7;
  border: 1px solid #e0e0e0;
  text-align: center;
`;

const Td = styled.td`
  padding: 10px;
  height: 40px;
  line-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: 1px solid #e0e0e0;
  text-align: center;
`;

const ActionTd = styled.td`
  padding: 10px;
  border: 1px solid #e0e0e0;
  text-align: center;
`;

const ActionButton = styled.button`
  margin: 0 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
`;

const AcceptButton = styled(ActionButton)`
  background-color: #86bff4;
  color: #fff;

  &:hover {
    background-color: #178efc;
  }

  &:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
  }
`;

const RejectButton = styled(ActionButton)`
  background-color: #f67676;
  color: #fff;

  &:hover {
    background-color: rgb(248, 21, 21);
  }

  &:disabled {
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
  }
`;

const StyledTr = styled.tr<{ registState: string }>`
  height: 40px;
  background-color: ${(props) => {
    switch (props.registState) {
      case SurveyRegistState.ACCEPT:
        return "#e5f1fc"; // 얕은 하늘색
      case SurveyRegistState.REJECT:
        return "#f5e3e3"; // 얕은 분홍색
      default:
        return "#f5f5f5"; // 얕은 회색
    }
  }};
`;

const StatusLabel = styled.span<{ status: string }>`
  font-size: 0.9rem;
  padding: 6px 12px;
  border-radius: 4px;
  color: #000;
`;

const NoDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #777;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyText = styled.div`
  font-size: 1.1rem;
`;

export default Table;
