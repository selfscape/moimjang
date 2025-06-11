import styled from "styled-components";
import { FaFolderOpen } from "react-icons/fa";

const EmptyState = () => {
  return (
    <TableBody>
      <EmptyContainer>
        <EmptyIcon />
        <EmptyText>데이터가 존재하지 않습니다</EmptyText>
        <SubText>데이터가 등록되면 이 곳에 표시됩니다</SubText>
      </EmptyContainer>
    </TableBody>
  );
};
const TableBody = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmptyContainer = styled.div`
  width: 100%;
  height: 400px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyIcon = styled(FaFolderOpen)`
  color: #9ca3af; // tailwind text-gray-400
  font-size: 3rem; // tailwind text-5xl
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  color: #6b7280; // tailwind text-gray-500
  font-size: 1.125rem; // tailwind text-lg
`;

const SubText = styled.p`
  color: #9ca3af; // tailwind text-gray-400
  font-size: 0.875rem; // tailwind text-sm
  margin-top: 0.5rem;
`;

export default EmptyState;
