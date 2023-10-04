import { Button, Input, Page } from "components";
import React from "react";
import { ColumnFlex, Container } from "styles";
import { useForm, Controller } from "react-hook-form";
import { isTonAddress } from "utils";

const inputs = [
  {
    label: "Recipient address",
    name: "address",
    validate: isTonAddress,
    error: "Invalid address",
  },
  {
    label: "Comment",
    name: "comment",
  },
];

export function TransferPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    reValidateMode: "onBlur",
  });

  const onSubmit = (data: unknown) => {
    console.log(data);
  };

  return (
    <Page title="Transfer">
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
