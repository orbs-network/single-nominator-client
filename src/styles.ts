import { createGlobalStyle, styled } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;


export const Layout = styled.div`
  max-width: 770px;
  margin: 0 auto;
  width: calc(100% - 40px);
`

export const Container = styled.div`
  background: white;
  border: 1px solid rgb(224, 224, 224);
  box-shadow: rgba(114, 138, 150, 0.08) 0px 2px 16px;
  transition: border-color 0.2s ease 0s;
  display: flex;
  flex-direction: column;
  border-radius: 13px;
  height: 100%;
  padding: 20px;
  position: relative;
`;



export const HoverContainer = styled(Container)`
  background: white;
  border: 1px solid rgb(224, 224, 224);
  box-shadow: rgba(114, 138, 150, 0.08) 0px 2px 16px;
  transition: border-color 0.2s ease 0s;
  display: flex;
  flex-direction: column;
  border-radius: 13px;
  height: 100%;
  padding: 20px;
  position: relative;
  &:hover {
    border: 1px solid rgb(0, 136, 204);
  }
`;


export const ColumnFlex = styled.div<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => `${$gap || 10}px`};
`;