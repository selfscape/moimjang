import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { ChannelState } from "api/channel/type/channel";
import useUpdateChannelState from "api/channel/hooks/useUpdateChannelState";
import { Pathnames } from "constants/index";
import useDeleteChannel from "hooks/channel/useDeleteChannel";
import useSystemModal from "hooks/common/components/useSystemModal";
import { useChannelTableContext } from "hooks/channel/context/useChannelTableContext";
import Button from "components/common/Button";
import { OWNER } from "configs";
import useOwnerCookie from "hooks/auth/useOwnerCookie";

const channelStateLabels: Record<ChannelState, string> = {
  [ChannelState.PENDING]: "대기",
  [ChannelState.ONGOING]: "진행중",
  [ChannelState.FULL]: "정원 마감",
  [ChannelState.FINISH]: "종료",
};

const ChannelTable = () => {
  const navigate = useNavigate();
  const { mutate: deleteChannel } = useDeleteChannel();
  const { openModal, showErrorModal, showAnyMessageModal } = useSystemModal();
  const { mutate: updateChannelState } = useUpdateChannelState();
  const { channelData, refetch } = useChannelTableContext();

  const owner = useOwnerCookie();
  const isTester = owner === "tester";

  const handleTableRowClick = (channelId: number) => {
    navigate(`${Pathnames.EditChannel}/${channelId}`);
  };

  const handleDeleteButtonClick = (channelId: number, channelName: string) => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    openModal({
      isOpen: true,
      title: `${channelName}을 정말로 삭제하시겠어요?`,
      message: "삭제된 채널은 다시 복구가 불가능합니다.",
      showCancel: true,
      confirmText: "삭제하기",
      cancelText: "취소",
      onConfirm: () => {
        deleteChannel(String(channelId), {
          onSuccess: () => {
            refetch();
            showAnyMessageModal("소셜링이 성공적으로 삭제되었습니다.");
          },
          onError: (error) => {
            const errorDetails = error.response.data as { detail: string };
            showErrorModal(errorDetails.detail);
          },
        });
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleStateChange = (channelId: number, newState: ChannelState) => {
    if (isTester) {
      showAnyMessageModal("테스터 계정은 권한이 없습니다");
      return;
    }

    updateChannelState(
      { channel_id: channelId, channel_state: newState },
      {
        onSuccess: () => {
          refetch();
          showAnyMessageModal(
            `채널 상태가 ${channelStateLabels[newState]}(으)로
            변경되었습니다.`
          );
        },
        onError: (error) => {
          const errorDetails = (error.response?.data as { detail: string })
            ?.detail;
          showErrorModal(
            errorDetails || "채널 상태 변경 중 오류가 발생했습니다."
          );
        },
      }
    );
  };

  return (
    <Container>
      <Table>
        <thead>
          <tr>
            <th>채널 ID</th>
            <th>채널 이름</th>
            <th>채널 설명</th>
            <th>참여 인원</th>
            <th>진행 일시</th>
            <th>채널 상태</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {channelData?.map((row) => (
            <tr
              key={row.id}
              className="hover-row"
              onClick={() => handleTableRowClick(row.id)}
            >
              <td>{row.id}</td>
              <td>{row.title || "정보 없음"}</td>
              <td>{row.description || "정보 없음"}</td>
              <td>{row?.joined_users?.length || 0}</td>
              <td>{formatDate(row.event_date)}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <StyledSelect
                  value={row.channel_state || ChannelState.PENDING}
                  onChange={(e) =>
                    handleStateChange(row.id, e.target.value as ChannelState)
                  }
                  state={row.channel_state}
                >
                  {Object.values(ChannelState).map((state) => (
                    <Option key={state} value={state}>
                      {channelStateLabels[state]}
                    </Option>
                  ))}
                </StyledSelect>
              </td>
              <td onClick={(e) => e.stopPropagation()}>
                <Button
                  size="small"
                  className="positive"
                  onClick={() => handleDeleteButtonClick(row.id, row.title)}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

const Container = styled.div`
  max-height: calc(100vh - 300px);
  overflow-x: auto;
  overflow-y: auto;
`;

const Table = styled.table`
  min-width: 100%;
  background-color: white;
  thead {
    background-color: #f9fafb;
    position: sticky;
    top: 0;
  }
  tbody tr:hover {
    background-color: #f9fafb;
  }
  th,
  td {
    padding: 16px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }
`;

const StyledSelect = styled.select<{ state: ChannelState }>`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  appearance: none;

  background-color: ${({ state, theme }) => {
    switch (state) {
      case ChannelState.PENDING:
        return "#31c02f";
      case ChannelState.ONGOING:
        return theme.palette.blue900;
      case ChannelState.FULL:
        return theme.palette.red900;
      case ChannelState.FINISH:
        return theme.palette.grey600;
      default:
        return "inherit";
    }
  }};

  color: #fff;
`;

const Option = styled.option``;

export default ChannelTable;
