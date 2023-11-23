import { TELERGAM_SUPPORT } from "consts";
import React, { ReactNode, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { H1, Typography } from "styles";

export function Page({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
   if(ref.current) {
     ref.current.style.opacity = "1"
   }  
  }, [])
  
  return (
    <StyledPage style={{ opacity: 0, transition:'1s all' }} ref={ref}>
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

const fadeIn = keyframes`
  0%{
    opacity: 0;
  },
  100%{
    opacity: 1;
  }
`;




const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  animation: ${fadeIn} 0.3s forwards;
`;
