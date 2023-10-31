import { Button } from "components";
import { createGlobalStyle, styled } from "styled-components";

export const MOBILE_MEDIA_QUERY = "@media (max-width: 768px)";

export const GlobalStyle = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.colors.body};
  }
    ${MOBILE_MEDIA_QUERY}  {
      tc-root  {
        right: 10px;
        left: unset!important;
      },
    },
`;

export const Layout = styled.div`
  max-width: 820px;
  margin: 0 auto;
  width: calc(100% - 40px);
`;

export const Container = styled.div`
  background: ${({ theme }) => theme.colors.container};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) =>
    theme.dark ? "unset" : "rgba(114, 138, 150, 0.08) 0px 2px 16px"});
  display: flex;
  flex-direction: column;
  border-radius: 13px;
  height: 100%;
  padding: 20px;
  position: relative;
`;

export const HoverContainer = styled(Container)`
  &:hover {
    transition: border-color 0.2s;
    border: 1px solid
      ${({ theme }) =>
        theme.dark ? "rgba(255,255,255, 0.7)" : theme.colors.blue};
  }
`;

export const ColumnFlex = styled.div<{ $gap?: number; $noGap?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap, $noGap }) => $noGap ?  '0px' :  `${$gap || 10}px`};
`;

export const Typography = styled.p`
  color: ${({ theme }) => theme.text.color};
`;

export const H1 = styled(Typography)`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.dark ? "#fff" : "#000"};
  ${MOBILE_MEDIA_QUERY} {
    font-size: 18px;
  }
`;

export const RowFlex = styled.div<{ $gap?: number }>`
  display: flex;
  flex-direction: row;
  gap: ${({ $gap }) => `${$gap || 10}px`};
  align-items: center;
`;

export const InputsContainer = styled(ColumnFlex)`
  gap: 20px;
`;

export const SubmitButton = styled(Button)`
  width: fit-content;
  min-width: 200px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
`;
