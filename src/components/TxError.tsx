import { ColumnFlex, Typography } from "styles";
import styled from "styled-components";
import { lazy, Suspense } from "react";
import { Button } from "./Button";

const AiFillWarning = lazy(() =>
  import("react-icons/ai").then((mod) => ({ default: mod.AiFillWarning }))
);

export const TxError = ({
  onClick,
  text,
  btnText,
}: {
  onClick: () => void;
  text: string;
  btnText: string;
}) => {
  return (
    <Container>
      <Suspense>
        <Icon />
      </Suspense>
      <Text>{text}</Text>
      <Button onClick={onClick}>{btnText}</Button>
    </Container>
  );
};

const Icon = styled(AiFillWarning)`
  font-size: 80px;
  color: ${({ theme }) => theme.colors.error};
`;

const Text = styled(Typography)`
  width: 100%;
  text-align: center;
  font-size: 15px;
  line-height: 22px;
`;

const Container = styled(ColumnFlex)`
  align-items: center;
  gap: 30px;
  .button {
    min-width: 200px;
  }
`;
