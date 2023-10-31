/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddressDisplay, Button, Input, Page, Stepper, TxError, TxSuccess } from "components";
import { ColumnFlex, InputsContainer, SubmitButton } from "styles";
import { parseFormInputError } from "utils";
import { Controller, useForm } from "react-hook-form";
import { useDeploySingleNominatorTx, useTransferFundsTx, useVerifySNAddress, useWithdrawTx } from "hooks";
import { FormValues, inputs, useStore } from "./store";
import { useState } from "react";
import { BottomText, StyledAddresses, StyledWithdrawActions } from "./styles";

export const Addresses = () => {
  const { ownerAddress, validatorAddress, snAddress } = useStore();
  return (
    <StyledAddresses $gap={20}>
      {ownerAddress && <AddressDisplay title="Owner" address={ownerAddress} />}
      {validatorAddress && (
        <AddressDisplay title="Validator" address={validatorAddress} />
      )}
      {snAddress && (
        <AddressDisplay title="Single nominator" address={snAddress} />
      )}
    </StyledAddresses>
  );
};



const FirstStep = () => {
  const { setFromValues } = useStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  return (
    <Stepper.Step>
      <form
        onSubmit={handleSubmit((data) => setFromValues(data as FormValues))}
      >
        <ColumnFlex $noGap>
          <InputsContainer>
            {inputs.map((input) => {
              return (
                <Controller
                  name={input.name}
                  control={control}
                  key={input.name}
                  rules={{ required: input.required, validate: input.validate }}
                  render={({ field }) => {
                    const errorMsg = parseFormInputError(
                      errors[input.name]?.type,
                      input.error
                    );
                    return (
                      <Input
                        info={input.info}
                        label={input.label}
                        field={field}
                        error={errorMsg}
                      />
                    );
                  }}
                />
              );
            })}
          </InputsContainer>
          <SubmitButton connectionRequired type="submit">
            Proceed
          </SubmitButton>
        </ColumnFlex>
      </form>
    </Stepper.Step>
  );
};

const SecondStep = () => {
  const { ownerAddress, validatorAddress, nextStep, setFromValues, reset } =
    useStore();
  const [error, setError] = useState("");

  const { mutate, isLoading } = useDeploySingleNominatorTx();

  const onSubmit = () => {
    mutate({
      owner: ownerAddress,
      validator: validatorAddress,
      onSuccess: (snAddress: string) => {
        console.log({ snAddress });
        setFromValues({
          snAddress,
        });
        nextStep();
      },
      onError: setError,
    });
  };

  return (
    <Stepper.Step>
      <Stepper.StepTitle>Deploy</Stepper.StepTitle>
      <Stepper.StepSubtitle>
        Your wallet needs to have at least 2 TON coins for deployment. At least
        1 TON coin should remain in single-nominator balance at all time for
        storage fee costs on masterchain.
      </Stepper.StepSubtitle>
      {error ? (
        <TxError btnText="Try again" text={error} onClick={reset} />
      ) : (
        <>
          <Addresses />
          <SubmitButton onClick={onSubmit} isLoading={isLoading}>
            Deploy
          </SubmitButton>
        </>
      )}
    </Stepper.Step>
  );
};

const VerifyStep = () => {
  const [error, setError] = useState("");
  const { mutate, isLoading } = useVerifySNAddress();
  const { nextStep, snAddress, reset } = useStore();

  const onSubmit = () => {
    mutate({
      snAddress,
      onSuccess: nextStep,
      onError: setError,
    });
  };

  return (
    <Stepper.Step>
      <Stepper.StepTitle>Verify</Stepper.StepTitle>
      <Stepper.StepSubtitle>
        After deployment is complete, this step will read the code hash from
        single-nominator contract that was just deployed and compare it to the
        code hash of the audited version.
      </Stepper.StepSubtitle>
      {error ? (
        <TxError btnText="Try again" text={error} onClick={reset} />
      ) : (
        <>
          <Addresses />
          <SubmitButton onClick={onSubmit} isLoading={isLoading}>
            Verify
          </SubmitButton>
        </>
      )}
    </Stepper.Step>
  );
};

const SuccessStep = () => {
  const { reset } = useStore();
  return (
    <Stepper.Step>
      <Stepper.StepTitle>Success</Stepper.StepTitle>
      <TxSuccess
        onClick={reset}
        text="Successfully deployed single nominator"
        btnText="Deploy again"
      />
    </Stepper.Step>
  );
};

export const WithdrawStep = () => {
  const [error, setError] = useState("");
  const { mutate: withdraw, isLoading: withdrawLoading } = useWithdrawTx();
  const { mutate: deposit, isLoading: depositLoading } = useTransferFundsTx();

  const { nextStep, snAddress, reset } = useStore();

  const onWithdraw = () =>
    withdraw({
      address: snAddress,
      amount: 5,
      onSuccess: nextStep,
      onError: setError,
    });

  const depositFunds = () =>
    deposit({
      address: snAddress,
      amount: "5",
      onSuccess: nextStep,
      onError: setError,
    });

  return (
    <Stepper.Step>
      <Stepper.StepTitle>Sanity test withdrawal</Stepper.StepTitle>
      <Stepper.StepSubtitle>
        To make sure the Owner / admin was set correctly and can withdraw funds
        from single-nominator, we recommend doing a withdrawal test with a small
        amount of 5 TON.
      </Stepper.StepSubtitle>
      {error ? (
        <TxError btnText="Try again" text={error} onClick={reset} />
      ) : (
        <>
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
            Make sure you have at least 5 TON coins in your wallet. Deposit it
            and verify in an explorer that the single-nominator balance is 5 TON
            higher. Then withdraw and verify that Owner wallet receives the
            funds back.
          </BottomText>
        </>
      )}
    </Stepper.Step>
  );
};




const steps = [
  {
    title: "Enter data",
    component: <FirstStep />,
  },
  {
    title: "Deploy",
    component: <SecondStep />,
  },
  {
    title: "Verify",
    component: <VerifyStep />,
  },
  {
    title: "Withdraw",
    component: <WithdrawStep />,
  },
  {
    title: "",
    component: <SuccessStep />,
  },
];

function DeploySingleNominatorPage() {
  const { step, setStep } = useStore();
  return (
    <Page title="Deploy single nominator">
      <Stepper setStep={setStep} currentStep={step} steps={steps} />
    </Page>
  );
}

export default DeploySingleNominatorPage;
