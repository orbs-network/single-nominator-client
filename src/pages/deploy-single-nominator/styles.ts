import styled from "styled-components";
import { ColumnFlex, RowFlex, Typography } from "styles";
export const BottomText = styled(Typography)`
  margin-top: 30px;
  font-size: 14px;
  line-height: 18px;
`;

export const StyledWithdrawActions = styled(RowFlex)`
  margin-top: 30px;
  justify-content: center;
  gap: 20px;
  .button {
   min-width: 100px;
  }
`;

export const StyledAddresses = styled(ColumnFlex)`
  margin-top: 30px;
`;


