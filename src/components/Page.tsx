import React, { ReactNode } from "react";
import styled from "styled-components";

export function Page({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <StyledPage>
      <h1>{title}</h1>
      {children}
    </StyledPage>
  );
}

const StyledPage = styled.div`
display: flex;
flex-direction: column;
gap: 20px
`;
