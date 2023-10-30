/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Page, Stepper } from "components";
import { InputsContainer, SubmitButton, Typography } from "styles";
import { parseFormInputError } from "utils";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { useDeploySingleNominatorTx, useVerifySNAddress } from "hooks";
import { FormValues, inputs, useStore } from "./store";
import { lazy, Suspense } from "react";
import { Step, StepSubtitle, StepTitle } from "./styles";
import { WithdrawStep } from "./WithrawStep";
import { Addresses } from "./Components";

const AiFillCheckCircle = lazy(() =>
  import("react-icons/ai").then((mod) => ({ default: mod.AiFillCheckCircle }))
);

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
    <Step>
      <form
        onSubmit={handleSubmit((data) => setFromValues(data as FormValues))}
      >
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
                    <Input info={input.info} label={input.label} field={field} error={errorMsg} />
                  );
                }}
              />
            );
          })}
          <SubmitButton connectionRequired type="submit">
            Proceed
          </SubmitButton>
        </InputsContainer>
      </form>
    </Step>
  );
};

const SecondStep = () => {
  const { ownerAddress, validatorAddress, nextStep, setFromValues } =
    useStore();
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
    });
  };

  return (
    <Step>
      <StepTitle>Deploy</StepTitle>
      <StepSubtitle>
        Your wallet needs to have at least 2 TON coins for deployment. At least
        1 TON coin should remain in single-nominator balance at all time for
        storage fee costs on masterchain.
      </StepSubtitle>
      <Addresses />
      <SubmitButton onClick={onSubmit} isLoading={isLoading}>
        Deploy
      </SubmitButton>
    </Step>
  );
};

const VerifyStep = () => {
  const { mutate, isLoading } = useVerifySNAddress();
  const { nextStep, snAddress } = useStore();

  const onSubmit = () => {
    mutate({
      snAddress,
      onSuccess: () => {
        console.log("verified");

        nextStep();
      },
    });
  };

  return (
    <Step>
      <StepTitle>Verify</StepTitle>
      <StepSubtitle>
        After deployment is complete, this step will read the code hash from
        single-nominator contract that was just deployed and compare it to the
        code hash of the audited version.
      </StepSubtitle>
      <Addresses />
      <SubmitButton onClick={onSubmit} isLoading={isLoading}>
        Verify
      </SubmitButton>
    </Step>
  );
};

const SuccessStep = () => {
  const { reset } = useStore();
  return (
    <StyledSuccessStep>
      <StepTitle>Success</StepTitle>
      <Suspense>
        <SuccessIcon />
      </Suspense>
      <Typography>Successfully deployed single nominator</Typography>
      <SubmitButton onClick={reset}>Deploy one more</SubmitButton>
    </StyledSuccessStep>
  );
};

const SuccessIcon = styled(AiFillCheckCircle)`
  font-size: 80px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.success};
`;

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

const StyledSuccessStep = styled(Step)`
  align-items: center;
`;
