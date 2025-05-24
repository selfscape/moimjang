import styled from "styled-components";

export const TableContainer = styled.div`
  max-height: calc(100vh - 200px);
  overflow-x: auto;
  overflow-y: auto;

  padding: 0px 16px;
`;

export const Table = styled.table`
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
    vertical-align: middle;
  }
  .no-data {
    text-align: center;
    padding: 20px;
    font-size: 16px;
    font-weight: bold;
    color: #666;
  }
`;
