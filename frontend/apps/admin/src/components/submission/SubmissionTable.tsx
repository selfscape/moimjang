import { useState, useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { useQueryClient } from "@tanstack/react-query";

import useUpdateHostRegist from "api/hostRegist/useUpdateHostRegist";
import type { GetHostRegistsOutput } from "api/hostRegist/useGetHostRegistAdmin";
import { GET_HOST_REGIST_ADMIN } from "constants/queryKeys";
import { useSubmissionContext } from "hooks/submission/context/useSubmissionContext";
import useSystemModal from "hooks/common/components/useSystemModal";
import useCheckUserRole from "hooks/auth/useCheckUserRole";
import { HostRegistState } from "interfaces/user";
import userState from "recoils/atoms/auth/userState";

import { Table, TableContainer } from "../common/Table";

const SubmissionTable = () => {
  const { hostRegists, filter } = useSubmissionContext();
  const { mutate: updateHostRegist } = useUpdateHostRegist();
  const { showErrorModal, openModal, showAnyMessageModal } = useSystemModal();
  const queryClient = useQueryClient();

  const [userData] = useRecoilState(userState);
  const { isAdmin, isSuperAdmin } = useCheckUserRole(userData?.role);
  const [hashUrls, setHashUrls] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!isSuperAdmin) return;

    hostRegists?.forEach((entry) => {
      if (entry.state === HostRegistState.ACCEPT && entry.user?.email) {
        setHashUrls((prev) => ({
          ...prev,
          [entry.id]: `https://admin.moimjang.com/login?host=${entry.user.username}`,
        }));
      }
    });
  }, [hostRegists, isAdmin]);

  const handleUpdateButtonClick = (id: number, state: HostRegistState) => {
    const action = state === HostRegistState.ACCEPT ? "수락" : "거절";

    openModal({
      isOpen: true,
      message: `${action} 하시겠습니까?`,
      confirmText: action,
      cancelText: "취소",
      showCancel: true,
      onConfirm: () => {
        updateHostRegist(
          { host_regist_id: id, state },
          {
            onSuccess: (data) => {
              showAnyMessageModal(`${action}이 완료되었습니다.`);
              queryClient.setQueryData<GetHostRegistsOutput>(
                [GET_HOST_REGIST_ADMIN, filter],
                (old) => {
                  if (!old) return old;
                  return {
                    ...old,
                    regists: old.regists.map((r) =>
                      r.id === data.id ? { ...r, state: data.state } : r
                    ),
                  };
                }
              );
            },
            onError: (error) => {
              const errorDetails = error.response?.data as { detail: string };
              showErrorModal(errorDetails?.detail || "상태 업데이트 실패");
            },
          }
        );
      },
    });
  };

  const handleCopy = useCallback(
    (url: string) => {
      navigator.clipboard.writeText(url);
      showAnyMessageModal("URL이 복사되었습니다.");
    },
    [showAnyMessageModal]
  );

  if (hostRegists?.length === 0) {
    return (
      <NoDataWrapper>
        <EmptyIcon>📭</EmptyIcon>
        <EmptyText>등록된 응답이 없습니다.</EmptyText>
      </NoDataWrapper>
    );
  }

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <th>아이디</th>
            <th>이름</th>
            <th>이메일</th>
            <th>성별</th>
            <th>상태</th>
            <th style={{ maxWidth: "200px" }}>URL</th>
          </tr>
        </thead>
        <tbody>
          {hostRegists?.map((entry) => (
            <StyledTr key={entry.id} registState={entry.state}>
              <td>{entry.id}</td>
              <td>{entry.user?.username}</td>
              <td>{entry.user?.email}</td>
              <td>
                {entry.user?.gender === "male"
                  ? "남자"
                  : entry.user?.gender === "female"
                  ? "여자"
                  : "-"}
              </td>
              <td>
                {entry.state === HostRegistState.PENDING ? (
                  <>
                    <AcceptButton
                      onClick={() =>
                        handleUpdateButtonClick(
                          entry.id,
                          HostRegistState.ACCEPT
                        )
                      }
                    >
                      수락
                    </AcceptButton>
                    <RejectButton
                      onClick={() =>
                        handleUpdateButtonClick(
                          entry.id,
                          HostRegistState.REJECT
                        )
                      }
                    >
                      거절
                    </RejectButton>
                  </>
                ) : entry.state === HostRegistState.ACCEPT ? (
                  <StatusLabel status="accept">수락됨</StatusLabel>
                ) : (
                  <StatusLabel status="reject">거절됨</StatusLabel>
                )}
              </td>
              <UrlCell>
                {entry.state === HostRegistState.ACCEPT ? (
                  hashUrls[entry.id] ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CopyButton
                        onClick={() => handleCopy(hashUrls[entry.id])}
                      >
                        복사
                      </CopyButton>
                      <a
                        href={hashUrls[entry.id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginRight: "8px" }}
                      >
                        {hashUrls[entry.id]}
                      </a>
                    </div>
                  ) : (
                    "생성 중..."
                  )
                ) : (
                  "-"
                )}
              </UrlCell>
            </StyledTr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

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
      case HostRegistState.ACCEPT:
        return "#e5f1fc"; // 얕은 하늘색
      case HostRegistState.REJECT:
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

const UrlCell = styled.td`
  max-width: 200px;
  white-space: nowrap;
  overflow-x: auto;
  text-decoration: underline;
`;

const CopyButton = styled.button`
  margin-right: 8px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  background-color: #cccccc;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #aaaaaa;
  }
`;

export default SubmissionTable;
