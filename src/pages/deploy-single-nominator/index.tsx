/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Page, Stepper, TxSuccess } from "components";
import { InputsContainer, SubmitButton } from "styles";
import { parseFormInputError } from "utils";
import { Controller, useForm } from "react-hook-form";
import { useDeploySingleNominatorTx, useVerifySNAddress } from "hooks";
import { FormValues, inputs, useStore } from "./store";
import { WithdrawStep } from "./WithrawStep";
import { Addresses } from "./Components";


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
    </Stepper.Step>
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
    <Stepper.Step>
      <Stepper.StepTitle>Deploy</Stepper.StepTitle>
      <Stepper.StepSubtitle>
        Your wallet needs to have at least 2 TON coins for deployment. At least
        1 TON coin should remain in single-nominator balance at all time for
        storage fee costs on masterchain.
      </Stepper.StepSubtitle>
      <Addresses />
      <SubmitButton onClick={onSubmit} isLoading={isLoading}>
        Deploy
      </SubmitButton>
    </Stepper.Step>
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
    <Stepper.Step>
      <Stepper.StepTitle>Verify</Stepper.StepTitle>
      <Stepper.StepSubtitle>
        After deployment is complete, this step will read the code hash from
        single-nominator contract that was just deployed and compare it to the
        code hash of the audited version.
      </Stepper.StepSubtitle>
      <Addresses />
      <SubmitButton onClick={onSubmit} isLoading={isLoading}>
        Verify
      </SubmitButton>
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
