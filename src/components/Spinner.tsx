import React from "react";
import styled from "styled-components";

export const Spinner = ({
  className = "",
  color = "white",
}: {
  className?: string;
  color?: string;
}) => (
  <Container className={className}>
    <StyledSpinner $color={color} viewBox="0 0 50 50" className="spinner">
      <circle
        className="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="4"
      />
    </StyledSpinner>
  </Container>
);

const Container = styled.div`

`

const StyledSpinner = styled.svg<{ $color: string }>`
  animation: rotate 2s linear infinite;
  width: 50px;
  height: 50px;

  & .path {
    stroke: ${({ $color }) => $color};
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

