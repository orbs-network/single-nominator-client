import { Address, Button, Input, Page, Stepper } from "components";
import { ColumnFlex, Container } from "styles";
import { parseFormInputError } from "utils";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { useTransferFundsTx, useWithdrawTx } from "hooks";
import { FormValues, inputs, Steps, useStore } from "./store";

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
        <ColumnFlex $gap={30}>
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
          {step === Steps.First && (
            <Submit connectionRequired type="submit">
              Proceed
            </Submit>
          )}
        </ColumnFlex>
      </form>
    </Step>
  );
};

const SecondStep = () => {
  const { step, ownerAddress, snAddress, nextStep } = useStore();
  const { mutateAsync, isLoading } = useTransferFundsTx();
  if (step < Steps.Second) return null;

  const onSubmit = () => {
    mutateAsync({
      amount: 1,
      address: snAddress,
    }).then(nextStep);
  };

  return (
    <StyledStep2 $disabled={step !== Steps.Second}>
      <StepTitle>Send 1 Ton</StepTitle>
      <AddressDisplay label="From owner:" address={ownerAddress} />
      <AddressDisplay label="To single nominator:" address={snAddress} />
      {step === Steps.Second && (
        <Submit isLoading={isLoading} onClick={onSubmit}>
          Proceed
        </Submit>
      )}
    </StyledStep2>
  );
};

const ThirdStep = () => {
  const { step, ownerAddress } = useStore();
  const { mutateAsync, isLoading } = useWithdrawTx();
  if (step < Steps.Third) return null;

  const onSubmit = () => {
    mutateAsync({
      amount: 1,
      address: ownerAddress,
    });
  };
  return (
    <Step>
      <StepTitle>Withrdaw 1 TON to owner</StepTitle>
      <AddressDisplay label="Owner:" address={ownerAddress} />
      <Submit onClick={onSubmit} isLoading={isLoading}>
        Proceed
      </Submit>
    </Step>
  );
};


const AddressDisplay = ({
  label,
  address,
}: {
  label: string;
  address: string;
}) => {
  return (
    <StyledAddressDisplay>
      <p>{label}</p> <Address address={address} />
    </StyledAddressDisplay>
  );
};

const steps = [
  {
    title: "Enter data",
    component: <FirstStep />,
  },
  {
    title: "Transfer funds",
    component: <SecondStep />,
  },
  {
    title: "Withdraw funds",
    component: <ThirdStep />,
  },
];

 function DeploySingleNominatorPage() {
    const {step} = useStore()
  return (
    <Page title="Deploy single nominator">
      <Stepper currentStep={step} steps={steps} />
    </Page>
  );
}

export default DeploySingleNominatorPage;

const Submit = styled(Button)`
  max-width: 200px;
  margin: 0 auto;
  width: 100%;
  margin-top: 20px;
`;

const Step = styled(Container)<{ $disabled?: boolean }>`
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
`;
const StepTitle = styled.h2`
  margin-bottom: 20px;
`;

const StyledStep2 = styled(Step)`
  .address-disaply {
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

const StyledAddressDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

