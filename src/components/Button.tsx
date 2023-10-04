import React, { ReactNode } from 'react'
import styled from 'styled-components'
export function Button({ children, type }: { children: ReactNode; type?: "submit" | "button" }) {
  return <StyledButton type={type}>{children}</StyledButton>;
}

const StyledButton = styled("button")`
  height: 44px;
  border-radius: 40px;
  opacity: 1;
  pointer-events: all;
  background: rgb(0, 136, 204);
  border: 1px solid transparent;
  cursor: pointer;
  position: relative;
  padding: 0px 16px;
  transition: all 0.3s ease 0s;
  color: rgb(255, 255, 255);
  &:hover {
    border: 1px solid rgb(0, 136, 204);
    background: transparent;
    color: rgb(0, 136, 204);
  }
`;