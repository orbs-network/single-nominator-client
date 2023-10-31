/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AddressDisplay,
  Button,
  Input,
  Page,
  Stepper,
  TxError,
  TxSuccess,
} from "components";
import { ColumnFlex, InputsContainer, SubmitButton } from "styles";
import { parseFormInputError } from "utils";
import { Controller, useForm } from "react-hook-form";
import {
  useDeploySingleNominatorTx,
  useRoles,
  useTransferFundsTx,
  useValidateRoles,
  useVerifySNAddress,
  useWithdrawTx,
} from "hooks";
import { FormValues, inputs, useStore } from "./store";
import { useState } from "react";
import { BottomText, StyledAddresses, StyledWithdrawActions } from "./styles";
import { ZERO_ADDR } from "consts";
import { showSuccessToast } from "toasts";

export const Addresses = () => {
  const { ownerAddress, validatorAddress, snAddress } = useStore();
  return (
    <StyledAddresses $gap={20}>
      {snAddress && (
        <AddressDisplay title="Single nominator" address={snAddress} />
      )}
      {ownerAddress && <AddressDisplay title="Owner" address={ownerAddress} />}
      {validatorAddress && (
        <AddressDisplay title="Validator" address={validatorAddress} />
      )}
    </StyledAddresses>
  );
};

const ZeroButton = ({
  name,
  onChange,
}: {
  name: string;
  onChange: (value: string) => void;
}) => {
  if (name !== "validatorAddress") return null;

  return <button onClick={() => onChange(ZERO_ADDR)}>Zero address</button>;
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
      <Stepper.StepTitle>Set owner and validator addresses</Stepper.StepTitle>
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
                        button={
                          !field.value && (
                            <ZeroButton
                              name={input.name}
                              onChange={field.onChange}
                            />
                          )
                        }
                      />
                    );
                  }}
                />
              );
            })}
          </InputsContainer>
          <SubmitButton connectionRequired type="submit">
            Next
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

const VerifyDataStep = () => {
  const store = useStore();
  const { nextStep, snAddress, reset } = store;
  const [error, setError] = useState("");
  const { mutate, isLoading } = useValidateRoles();

  const onSubmit = () => {
    mutate({
      snAddress,
      onwerAddress: store.ownerAddress,
      validatorAddress: store.validatorAddress,
      onError: setError,
      onSuccess: () => {
        nextStep();
        showSuccessToast("Data is valid");
      },
    });
  };

  return (
    <Stepper.Step>
      <Stepper.StepTitle>Verify data</Stepper.StepTitle>
      <Stepper.StepSubtitle>
        After deployment is complete, this step will read the code hash from
        single-nominator contract that was just deployed and compare it to the
        code hash of the audited version.
      </Stepper.StepSubtitle>

      {error ? (
        <TxError text={error} onClick={reset} btnText="Try again" />
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

const VerifyCodeHashStep = () => {
  const [error, setError] = useState("");
  const { mutate, isLoading } = useVerifySNAddress();
  const { nextStep, snAddress, reset } = useStore();

  const { data: roles, isLoading: rolesLoading } = useRoles(snAddress);

  const onSubmit = () => {
    mutate({
      snAddress,
      onSuccess: () => {
        nextStep();
        showSuccessToast("Code hash is valid");
      },
      onError: setError,
    });
  };

  return (
    <Stepper.Step>
      <Stepper.StepTitle>Verify Codehash</Stepper.StepTitle>
      <Stepper.StepSubtitle>
        After deployment is complete, this step will read the code hash from
        single-nominator contract that was just deployed and compare it to the
        code hash of the audited version.
      </Stepper.StepSubtitle>
      {error ? (
        <TxError btnText="Try again" text={error} onClick={reset} />
      ) : (
        <>
          <StyledAddresses $gap={20}>
            <AddressDisplay title="Single nominator" address={snAddress} />
            <AddressDisplay
              isLoading={rolesLoading}
              title="Owner"
              address={roles?.owner}
            />
            <AddressDisplay
              isLoading={rolesLoading}
              title="Validator"
              address={roles?.validatorAddress}
            />
          </StyledAddresses>
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

const WITHDRAW_STEP_AMOUNT = 5;
export const WithdrawStep = () => {
  const [error, setError] = useState("");
  const { mutate: withdraw, isLoading: withdrawLoading } = useWithdrawTx();
  const { mutate: deposit, isLoading: depositLoading } = useTransferFundsTx();

  const { nextStep, snAddress, reset } = useStore();

  const onWithdraw = () =>
    withdraw({
      address: snAddress,
      amount: WITHDRAW_STEP_AMOUNT,
      onError: setError,
      onSuccess: () => {
        showSuccessToast("Funds withdrawn");
      }
    });

  const depositFunds = () =>
    deposit({
      address: snAddress,
      amount: WITHDRAW_STEP_AMOUNT.toString(),
      onError: setError,
      onSuccess: () => {
        showSuccessToast("Funds deposited");
      }
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
          <StyledWithdrawActions>
            <Button isLoading={withdrawLoading} onClick={onWithdraw}>
              Withdraw {WITHDRAW_STEP_AMOUNT} TON
            </Button>
            <Button isLoading={depositLoading} onClick={depositFunds}>
              Deposit {WITHDRAW_STEP_AMOUNT} TON
            </Button>
          </StyledWithdrawActions>
          <BottomText>
            Make sure you have at least 5 TON coins in your wallet. Deposit it
            and verify in an explorer that the single-nominator balance is 5 TON
            higher. Then withdraw and verify that Owner wallet receives the
            funds back.
          </BottomText>
          <SubmitButton onClick={nextStep}>Finish</SubmitButton>
        </>
      )}
    </Stepper.Step>
  );
};

const steps = [
  {
    title: "Set owner and validator addresses",
    component: <FirstStep />,
  },
  {
    title: "Deploy",
    component: <SecondStep />,
  },
  {
    title: "Verify Data",
    component: <VerifyDataStep />,
  },
  {
    title: "Verify Codehash",
    component: <VerifyCodeHashStep />,
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
