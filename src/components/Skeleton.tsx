import React from "react";
import styled, { keyframes } from "styled-components";

export function Skeleton({ className }: { className?: string }) {
  return <Container className={className} />;
}

export default Skeleton;

const animation = keyframes`
 0% {
      background-color: hsl(200, 20%, 80%);
    }
    100% {
      background-color: hsl(200, 20%, 95%);
    }
`;

const Container = styled.div`
  border-radius: 10px;
  height: 20px;
  animation: ${animation} 1s linear infinite alternate;
  opacity: ${({theme}) => theme.dark ? 0.1 : 1};
`;
