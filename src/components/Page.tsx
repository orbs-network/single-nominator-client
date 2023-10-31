import { TELERGAM_SUPPORT } from "consts";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { H1, Typography } from "styles";

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
      <Footer />
    </StyledPage>
  );
}

const Footer = () => {
  return (
    <StyledFooter>
      <Typography>
        To receive support for using single-nominator contact the team on{" "}
        <a target="_blank" href={TELERGAM_SUPPORT}>
          Telegram
        </a>
      </Typography>
    </StyledFooter>
  );
};

const StyledFooter = styled.div`
  margin-top: auto;
  padding-top: 50px;
  padding-bottom: 50px;
  text-align: center;
  a {
    color: #0098e9;
    text-decoration: none;
  }
`;

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
`;
