import styled from "styled-components";
import { Container, Typography } from "styles";

export const Step = styled(Container)``;
export const StepTitle = styled.h2`
  margin-bottom: 20px;
  width: 100%;
  color: ${({ theme }) => theme.text.title};
`;


export const StepSubtitle = styled(Typography)({
    fontSize:'16px',
    lineHeight:'22px',
});

export const StyledAddressDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;
