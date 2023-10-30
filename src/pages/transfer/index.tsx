import { Input, Page } from "components";
import React from "react";
import { Container, InputsContainer, SubmitButton } from "styles";
import { useForm, Controller } from "react-hook-form";
import { isTonAddress, parseFormInputError } from "utils";
import { useTransferFundsTx } from "hooks";

const inputs = [
  {
    label: "Single nominator address (recipient)",
    name: "address",
    validate: isTonAddress,
    error: "Invalid address",
    required: true,
    info: "The address of the single-nominator contract that you want to fund. Your wallet is going to send the TON coins to this recipient address.",
  },
  {
    label: "Amount to deposit",
    name: "amount",
    type: "number",
    required: true,
    info: "A decimal point number of the amount of TON coins that you would like to send from your wallet in order to fund the single-nominator contract.",
  },
];

type FormValues = {
  address: string;
  comment: string;
  amount: string;
};

function TransferPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { mutate, isLoading } = useTransferFundsTx();

  const onSubmit = (data: FormValues) => {
    mutate({
      address: data.address,
      amount: data.amount,
      onSuccess: reset,
    });
  };

  return (
    <Page title="Deposit">
      <Container>
        <form onSubmit={handleSubmit((data) => onSubmit(data as FormValues))}>
          <InputsContainer>
            {inputs.map((input) => {
              return (
                <Controller
                  name={input.name}
                  control={control}
                  key={input.name}
                  rules={{ required: input.required, validate: input.validate }}
                  render={({ field }) => {
                    const error = errors[input.name];
                    const errorMsg = parseFormInputError(
                      error?.type,
                      input.error
                    );
                    return (
                      <Input
                        type={input.type}
                        info={input.info}
                        label={input.label}
                        field={field}
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

export default TransferPage;
