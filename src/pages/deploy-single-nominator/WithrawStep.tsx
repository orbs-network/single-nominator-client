/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Stepper } from "components";
import { useTransferFundsTx, useWithdrawTx } from "hooks";
import {  RowFlex, Typography } from "styles";
import { Addresses } from "./Components";
import { useStore } from "./store";
import styled from "styled-components";

export const WithdrawStep = () => {
  const { mutate: withdraw, isLoading: withdrawLoading } = useWithdrawTx();
  const { mutate: deposit, isLoading: depositLoading } = useTransferFundsTx();
  const { nextStep, snAddress } = useStore();

  const onWithdraw = () =>
    withdraw({
      address: snAddress,
      amount: 5,
      onSuccess: () => {
        nextStep();
      },
    });

  const depositFunds = () =>
    deposit({
      address: snAddress,
      amount: "5",
      onSuccess: () => {
        nextStep();
      },
    });

  return (
    <Stepper.Step>
      <Stepper.StepTitle>Sanity test withdrawal</Stepper.StepTitle>
      <Stepper.StepSubtitle>
        To make sure the Owner / admin was set correctly and can withdraw funds
        from single-nominator, we recommend doing a withdrawal test with a small
        amount of 5 TON.
      </Stepper.StepSubtitle>
      <Addresses />

      <StyledWithdrawActions>
        <Button isLoading={withdrawLoading} onClick={onWithdraw}>
          Withdraw 5 TON
        </Button>
        <Button isLoading={depositLoading} onClick={depositFunds}>
          Deposit 5 TON
        </Button>
      </StyledWithdrawActions>
      <BottomText>
        Make sure you have at least 5 TON coins in your wallet. Deposit it and
        verify in an explorer that the single-nominator balance is 5 TON higher.
        Then withdraw and verify that Owner wallet receives the funds back.
      </BottomText>
    </Stepper.Step>
  );
};

const BottomText = styled(Typography)`
  margin-top: 30px;
  font-size: 14px;
  line-height: 18px;
`

const StyledWithdrawActions = styled(RowFlex)`
  margin-top: 30px;
  justify-content: center;
  gap: 20px;
  .button {
    width: 50%;
  }
`;
