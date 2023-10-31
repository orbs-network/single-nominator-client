/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCopyToClipboard } from "hooks";
import { goToTONScanContractUrl, makeElipsisAddress } from "utils";
import styled from "styled-components";
import { lazy, Suspense } from "react";
import { ColumnFlex, RowFlex, Typography } from "styles";
import Skeleton from "./Skeleton";

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

export function AddressDisplay({
  address,
  className = "",
  title,
  isLoading,
}: {
  address?: string;
  className?: string;
  title: string;
  isLoading?: boolean;
}) {
  const [_, copy] = useCopyToClipboard();

  const onCopy = (e: any) => {
    e.stopPropagation();
    copy(address || "");
  };

  return (
    <StyledContainer className={className}>
      <Title>{title}</Title>
      <Bottom>
        {isLoading ? (
          <StyledSkeleton />
        ) : (
          <>
            <StyledLink
              href={goToTONScanContractUrl(address || "")}
              target="_blank"
            >
              <Typography>{address}</Typography>
            </StyledLink>
            <StyledButton onClick={onCopy} disabled={isLoading}>
              <Icon />
            </StyledButton>
          </>
        )}
      </Bottom>
    </StyledContainer>
  );
}

const StyledSkeleton = styled(Skeleton)`
  width: 70%;
  height: 25px;
`;

const Bottom = styled(RowFlex)`
  border: 1px solid rgba(0, 0, 0, 0.23);
  width: 100%;
  padding: 12px 8px;
  justify-content: space-between;
  border-radius: 10px;
  background: #F9F9F9;
`;

const Title = styled(Typography)`
  font-size: 15px;
  font-weight: 600;
`;

const StyledLink = styled.a`
  text-decoration: none;
  color: #000;
  font-size: 15px;
  font-weight: 500;
  max-width: 90%;
  min-width: 0%;
  &:hover {
    text-decoration: underline;
  }
  p {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 14px;
  }
`;

const StyledContainer = styled(ColumnFlex)`
  display: flex;
  align-items: flex-start;
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
    color: ${({ theme }) => theme.text.color};
  }
`;
