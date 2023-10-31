import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import React, { ReactNode } from "react";
import styled from "styled-components";
import { Spinner } from "./Spinner";
export function Button({
  children,
  type,
  isLoading,
  connectionRequired,
  onClick,
  className = "",
  disabled,
}: {
  children: ReactNode;
  type?: "submit" | "button";
  isLoading?: boolean;
  connectionRequired?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  const tonAddress = useTonAddress();
  const [tonConnect] = useTonConnectUI();

  const connectMode = !tonAddress && connectionRequired;

  const handleClick = () => {
    if (connectMode) {
      tonConnect.connectWallet();
    } else {
      onClick?.();
    }
  };

  return (
    <StyledButton
      className={`${className} button`}
      type={connectMode ? "button" : type}
      $isLoading={isLoading}
      onClick={handleClick}
      $disabled={disabled}
    >
      {isLoading && <StyledSpinner />}
      <Children $hide={isLoading}>
        {connectMode ? "Connect wallet" : children}
      </Children>
    </StyledButton>
  );
}

const StyledSpinner = styled(Spinner)`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  & > .spinner {
    width: 30px;
    height: 30px;
    color: #fff;
  }
`;

const Children = styled("div")<{ $hide?: boolean }>`
  opacity: ${({ $hide }) => ($hide ? 0 : 1)};
  transition: opacity 0.2s;
`;

const StyledButton = styled("button")<{
  $isLoading?: boolean;
  $disabled?: boolean;
}>`
  pointer-events: ${({ $isLoading, $disabled }) =>
    $isLoading || $disabled ? "none" : "all"};
  opacity: ${({ $isLoading, $disabled }) => ($isLoading || $disabled ? 0.8 : 1)};
  position: relative;
  height: 44px;
  border-radius: 40px;
  background: ${({ theme }) => theme.colors.blue};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.16);
  border: 1px solid transparent;
  cursor: pointer;
  position: relative;
  padding: 0px 16px;
  transition: all 0.3s ease 0s;
  color: rgb(255, 255, 255);
  font-size: 16px;
  font-weight: 500;
  * {
    font-weight: inherit;
    font-size: inherit;
  }
  &:hover {
    transform: scale(1.02);
  }
`;
