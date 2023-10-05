import { Button, Input, Page } from "components";
import React from "react";
import { ColumnFlex, Container } from "styles";
import { useForm, Controller } from "react-hook-form";
import { isTonAddress, parseFormInputError } from "utils";
import { useChangeValidatorTx } from "hooks";

const inputs = [
  {
    label: "Single nominator address",
    name: "address",
    validate: isTonAddress,
    error: "Invalid address",
    required: true,
  },
  {
    label: "New validator address",
    name: "newAddress",
    validate: isTonAddress,
    error: "Invalid address",
    required: true,
  },
];

type FormValues = {
  address: string;
  newAddress: string;
};


function ChangeValidatorPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { mutate, isLoading } = useChangeValidatorTx();

  return (
    <Page title="Transfer">
      <Container>
        <form onSubmit={handleSubmit((data) => mutate(data as FormValues))}>
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
                      <Input
                        label={input.label}
                        field={field}
                        error={errorMsg}
                      />
                    );
                  }}
                />
              );
            })}
            <Button isLoading={isLoading} connectionRequired type="submit">
              Proceed
            </Button>
          </ColumnFlex>
        </form>
      </Container>
    </Page>
  );
}


export default ChangeValidatorPage;