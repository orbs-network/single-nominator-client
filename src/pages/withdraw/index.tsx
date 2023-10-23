/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Page } from "components";
import React from "react";
import { Container, InputsContainer, SubmitButton } from "styles";
import { useForm, Controller } from "react-hook-form";
import { isTonAddress, parseFormInputError } from "utils";
import { useWithdrawTx } from "hooks";

const inputs = [
  {
    label: "Single nominator address",
    name: "address",
    validate: isTonAddress,
    error: "Invalid address",
  },
  {
    label: "Amount",
    name: "amount",
  },
];

type FormValues = {
  address: string;
  amount: string;
};

function WithdrawPage() {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { mutate, isLoading } = useWithdrawTx();

  const onSubmit = (data: FormValues) => mutate({ address: data.address, amount: Number(data.amount) });

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
                        label={input.label}
                        field={field as any}
                        error={errorMsg}
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
