import { Button, Input, Page } from "components";
import React from "react";
import { ColumnFlex, Container } from "styles";
import { useForm, Controller } from "react-hook-form";
import { isTonAddress } from "utils";

const inputs = [
  {
    label: "Single nominator address",
    name: "single-nominator-address",
    validate: isTonAddress,
    error: "Invalid address",
    type: "text",
    defaultValue: "",
  },
  {
    label: "Amount",
    name: "amount",
    type: "number",
    suffix: "TON",
  },
];

export function WithdrawPage() {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    reValidateMode: "onBlur",
 
  });

  const onSubmit = () => {};

  console.log('render');
  

  return (
    <Page title="Withdraw">
      <Container>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ColumnFlex $gap={30}>
            {inputs.map((input) => {
              return (
                <Controller
                  name={input.name}
                  control={control}
                  key={input.name}
                  rules={{ required: true, validate: input.validate }}
                  render={({ field }) => {
                    return (
                      <Input
                      suffix={input.suffix}
                        type={input.type}
                        label={input.label}
                        field={field}
                        error={errors[input.name] ? input.error : undefined}
                      />
                    );
                  }}
                />
              );
            })}

            <Button type="submit">Submit</Button>
          </ColumnFlex>
        </form>
      </Container>
    </Page>
  );
}
