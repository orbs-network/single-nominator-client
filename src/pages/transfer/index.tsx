import { Input, Page } from "components";
import React from "react";
import {  Container, InputsContainer, SubmitButton } from "styles";
import { useForm, Controller } from "react-hook-form";
import { isTonAddress, parseFormInputError } from "utils";
import { useTransferFundsTx } from "hooks";

const inputs = [
  {
    label: "Recipient address",
    name: "address",
    validate: isTonAddress,
    error: "Invalid address",
    required: true,
    info: "Where does it come from? Contrary to popular belief, Lorem Ipsum is not simply random text.",
  },
  {
    label: "Amount",
    name: "amount",
    type: "number",
    required: true,
    info: "Where does it come from? Contrary to popular belief, Lorem Ipsum is not simply",
  },
  {
    label: "Comment",
    name: "comment",
    info: "Where does it come from? Contrary to popular belief, Lorem Ipsum is not simply text.",
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
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { mutate, isLoading } = useTransferFundsTx();

  

  return (
    <Page title="Deposit">
      <Container>
        <form onSubmit={handleSubmit((data) => mutate(data as FormValues))}>
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
            <SubmitButton connectionRequired isLoading={isLoading} type="submit">
              Proceed
            </SubmitButton>
          </InputsContainer>
        </form>
      </Container>
    </Page>
  );
}


export default TransferPage;

