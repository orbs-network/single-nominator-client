import { Address, Input, Page, Stepper } from "components";
import {
  ColumnFlex,
  Container,
  InputsContainer,
  SubmitButton,
  Typography,
} from "styles";
import { parseFormInputError } from "utils";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { useDeploySingleNominatorTx } from "hooks";
import { FormValues, inputs, Steps, useStore } from "./store";
import { lazy, Suspense } from "react";

const AiFillCheckCircle = lazy(() =>
  import("react-icons/ai").then((mod) => ({ default: mod.AiFillCheckCircle }))
);

const FirstStep = () => {
  const { step, setFromValues } = useStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  return (
    <Step $disabled={step !== Steps.First}>
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
                    <Input label={input.label} field={field} error={errorMsg} />
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
  const { ownerAddress, validatorAddress, nextStep } = useStore();
  const { mutateAsync, isLoading } = useDeploySingleNominatorTx();

  const onSubmit = () => {
    mutateAsync({
      owner: ownerAddress,
      validator: validatorAddress,
    }).then(nextStep);
  };
  return (
    <Step>
      <StepTitle>Deploy</StepTitle>
      <Addresses />
      <SubmitButton onClick={onSubmit} isLoading={isLoading}>
        Deploy
      </SubmitButton>
    </Step>
  );
};

const Addresses = () => {
  const { ownerAddress, validatorAddress, snAddress } = useStore();
  return (
    <ColumnFlex>
      <AddressDisplay label="Owner:" address={ownerAddress} />
      <AddressDisplay label="Single nominator:" address={snAddress} />
      <AddressDisplay label="Validator:" address={validatorAddress} />
    </ColumnFlex>
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

const AddressDisplay = ({
  label,
  address,
}: {
  label: string;
  address: string;
}) => {
  return (
    <StyledAddressDisplay>
      <Typography>{label}</Typography> <Address address={address} />
    </StyledAddressDisplay>
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
    title: "",
    component: <SuccessStep />,
  },
];

function DeploySingleNominatorPage() {
  const { step } = useStore();
  return (
    <Page title="Deploy single nominator">
      <Stepper currentStep={step} steps={steps} />
    </Page>
  );
}

export default DeploySingleNominatorPage;

const Step = styled(Container)<{ $disabled?: boolean }>`
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
`;
const StepTitle = styled.h2`
  margin-bottom: 20px;
  width: 100%;
  color: ${({ theme }) => theme.text.title};
`;

const StyledAddressDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StyledSuccessStep = styled(Step)`
  align-items: center;
`;
