import styled from "styled-components";
import { Container } from "styles";

export const Step = styled(Container)``;
export const StepTitle = styled.h2`
  margin-bottom: 20px;
  width: 100%;
  color: ${({ theme }) => theme.text.title};
`;

export const StyledAddressDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
