import { ColumnFlex, Typography } from "styles";
import styled from "styled-components";
import { lazy, Suspense } from "react";
import { Button } from "./Button";

const AiFillCheckCircle = lazy(() =>
  import("react-icons/ai").then((mod) => ({ default: mod.AiFillCheckCircle }))
);


export const TxSuccess = ({
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
        <SuccessIcon />
      </Suspense>
      <Text>{text}</Text>
      <Button onClick={onClick}>{btnText}</Button>
    </Container>
  );
};

const SuccessIcon = styled(AiFillCheckCircle)`
  font-size: 80px;
  color: ${({ theme }) => theme.colors.success};
`;

const Text = styled(Typography)`
  width: 100%;
  text-align: center;
  font-size: 15px;
  line-height: 22px;
`;

const Container = styled(ColumnFlex)`
  align-items: center;
  padding-top: 30px;
  gap: 30px;
  .button {
    min-width: 200px;
  }
`;