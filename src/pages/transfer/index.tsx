import { Input, ModalErrorContent, Page } from "components";
import React, { useCallback } from "react";
import { Container, InputsContainer, SubmitButton } from "styles";
import { useForm, Controller } from "react-hook-form";
import { isTonAddress, parseFormInputError } from "utils";
import { useTransferFundsTx, useValidateSingleNominator } from "hooks";
import { Modal } from "antd";

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
  return (
    <Page title="Deposit">
      <Container>
        <Form />
      </Container>
    </Page>
  );
}

const Form = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const snAddress = watch("address");

  const { mutate, isLoading } = useTransferFundsTx();

  const { data: isSNAddress, isLoading: isSNAddressLoading } =
    useValidateSingleNominator(snAddress);

  const error = useCallback(() => {
    Modal.error({
      title: "Deposit failed",
      content: <ModalErrorContent />,
      okText: "Close",
    });
  }, []);

  const success = useCallback(() => {
    Modal.success({
      title: "Funds successfully deposited!",
      okText: "Close",
    });
  }, []);

  const onSubmit = (data: FormValues) => {
    mutate({
      address: data.address,
      amount: data.amount,
      onSuccess: () => {
        success();
        reset();
      },
      onError: error,
    });
  };

  return (
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
                const errorMsg = parseFormInputError(error?.type, input.error);
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
          Deposit
        </SubmitButton>
      </InputsContainer>
    </form>
  );
};

export default TransferPage;
