/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Input, Page } from "components";
import React from "react";
import { ColumnFlex, Container } from "styles";
import { useForm, Controller } from "react-hook-form";
import { isTonAddress, parseFormInputError } from "utils";
import {  useWithdrawTx } from "hooks";

const inputs = [
  {
    label: "Single nominator address",
    name: "address",
    validate: isTonAddress,
    error: "Invalid address",
  },
];

type FormValues = {
  address: string;
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

  const onSubmit = (data: FormValues) => mutate({ address: data.address });

  return (
    <Page title="Withdraw">
      <Container>
        <form onSubmit={handleSubmit((data) => onSubmit(data as FormValues))}>
          <ColumnFlex $gap={30}>
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

            <Button connectionRequired isLoading={isLoading} type="submit">
              Proceed
            </Button>
          </ColumnFlex>
        </form>
      </Container>
    </Page>
  );
}


export default WithdrawPage;