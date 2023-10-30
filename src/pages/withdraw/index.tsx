/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Page } from "components";
import React, { useMemo } from "react";
import { Container, InputsContainer, SubmitButton } from "styles";
import { useForm, Controller } from "react-hook-form";
import { isTonAddress, parseFormInputError } from "utils";
import { useWithdrawTx } from "hooks";

const useInputs = (isCustomAmount: boolean) => {
  return useMemo(() => {
    const inputs = [
      {
        label: "Single nominator address",
        name: "address",
        validate: isTonAddress,
        error: "Invalid address",
      },
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

type FormValues = {
  address: string;
  amount: string;
};

function WithdrawPage() {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { mutate, isLoading } = useWithdrawTx();
  const isCustomAmount = watch("customAmount") === "custom";

  const inputs = useInputs(isCustomAmount);

  const onSubmit = (data: FormValues) => {
    mutate({
      address: data.address,
      amount: isCustomAmount ?  Number(data.amount) : undefined,
      onSuccess: reset,
    });
  };

  return (
    <Page title="Withdraw">
      <Container>
        <form onSubmit={handleSubmit((data) => onSubmit(data as FormValues))}>
          <InputsContainer>
            {inputs.map((input) => {
              return (
                <Controller
                  name={input.name}
                  control={control}
                  key={input.name}
                  rules={{ required: true, validate: input.validate }}
                  render={({ field }) => {
                    const error = errors[input.name];
                    const errorMsg = parseFormInputError(
                      error?.type,
                      input.error
                    );

                    return (
                      <Input
                        type={input.type}
                        label={input.label}
                        field={field as any}
                        error={errorMsg}
                        radioOptions={input.radioOptions}
                      />
                    );
                  }}
                />
              );
            })}

            <SubmitButton
              connectionRequired
              isLoading={isLoading}
              type="submit"
            >
              Proceed
            </SubmitButton>
          </InputsContainer>
        </form>
      </Container>
    </Page>
  );
}

export default WithdrawPage;
