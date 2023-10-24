/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "components";
import { useWithdrawTx } from "hooks";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputsContainer, SubmitButton } from "styles";
import { parseFormInputError } from "utils";
import { Addresses } from "./Components";
import { useStore } from "./store";
import { Step, StepTitle } from "./styles";
import styled from "styled-components";
const useInputs = (isCustomAmount: boolean) => {
  return useMemo(() => {
    const inputs = [
      {
        label: "Select amount",
        name: "customAmount",
        type: "radio",
        radioOptions: [
          {
            title: "Max",
            value: "max",
          },
          {
            title: "Custom",
            value: "custom",
          },
        ],
      },
    ];

    if (isCustomAmount) {
      inputs.push({
        label: "Amount",
        name: "amount",
      } as any);
    }

    return inputs;
  }, [isCustomAmount]);
};

export const WithdrawStep = () => {
  const { mutate, isLoading } = useWithdrawTx();
  const { nextStep, snAddress } = useStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const isCustomAmount = watch("customAmount") === "custom";

  const onSubmit = (data: { amount: string }) => {
    mutate({
      address: snAddress,
      amount: isCustomAmount ? Number(data.amount) : undefined,
      onSuccess: () => {
        nextStep();
      },
    });
  };

  const inputs = useInputs(isCustomAmount);

  return (
    <Step>
      <StepTitle>Withdraw</StepTitle>
      <Addresses />
      <StyledForm
        onSubmit={handleSubmit((data) => onSubmit(data as { amount: string }))}
      >
        <InputsContainer>
          {inputs.map((input) => {
            return (
              <Controller
                name={input.name}
                control={control}
                key={input.name}
                rules={{ required: true }}
                render={({ field }) => {
                  const errorMsg = parseFormInputError(
                    errors[input.name]?.type
                  );
                  return (
                    <Input
                      type={input.type}
                      radioOptions={input.radioOptions}
                      label={input.label}
                      field={field as any}
                      error={errorMsg}
                    />
                  );
                }}
              />
            );
          })}

          <SubmitButton isLoading={isLoading} type="submit">
            Withdraw
          </SubmitButton>
        </InputsContainer>
      </StyledForm>
    </Step>
  );
};


const StyledForm = styled.form`
    margin-top: 20px;
`

