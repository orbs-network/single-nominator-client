/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCopyToClipboard } from "hooks";
import { goToTONScanContractUrl, makeElipsisAddress } from "utils";
import styled from "styled-components";
import { lazy, Suspense } from "react";

const IoCopyOutline = lazy(() =>
  import("react-icons/io5").then((mod) => ({ default: mod.IoCopyOutline }))
);

const Icon = () => {
  return (
    <Suspense>
      <IoCopyOutline />
    </Suspense>
  );
};

export function Address({
  address,
  className = "",
  padding = 8,
}: {
  address?: string;
  className?: string;
  padding?: number;
}) {
  const [_, copy] = useCopyToClipboard();

  const onCopy = (e: any) => {
    e.stopPropagation();
    copy(address || "");
  };

  return (
    <StyledContainer className={className}>
      <StyledLink href={goToTONScanContractUrl(address || "")} target="_blank">
        <p>{makeElipsisAddress(address, padding)}</p>
      </StyledLink>
      <StyledButton onClick={onCopy}>
        <Icon />
      </StyledButton>
    </StyledContainer>
  );
}

const StyledLink = styled.a`
  text-decoration: none;
  color: #000;
  font-size: 15px;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StyledButton = styled.button`
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  svg {
    width: 18px;
    height: 18px;
  }
`;
