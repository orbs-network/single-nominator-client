import React, { ReactNode } from "react";
import styled from "styled-components";
import { H1 } from "styles";

export function Page({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <StyledPage>
      {title && <H1>{title}</H1>}
      {children}
    </StyledPage>
  );
}


const StyledPage = styled.div`
display: flex;
flex-direction: column;
gap: 20px
`;
