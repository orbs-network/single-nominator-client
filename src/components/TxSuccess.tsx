import { ColumnFlex, Typography } from "styles";
import styled from "styled-components";
import { lazy, ReactNode, Suspense } from "react";

const AiFillCheckCircle = lazy(() =>
  import("react-icons/ai").then((mod) => ({ default: mod.AiFillCheckCircle }))
);


export const TxSuccess = ({
  text,
  button,
}: {
  text: string;
  button?: ReactNode;
}) => {
  return (
    <Container>
      <Suspense>
        <SuccessIcon />
      </Suspense>
      <Text>{text}</Text>
      {button}
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
  font-size: 17px;
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