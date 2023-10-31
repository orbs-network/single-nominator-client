/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, Page, TxError, TxSuccess } from "components";
import React, { useMemo, useState } from "react";
import { Container, InputsContainer, SubmitButton } from "styles";
import { useForm, Controller } from "react-hook-form";
import { isTonAddress, parseFormInputError } from "utils";
import { useWithdrawTx } from "hooks";
import { useNavigate } from "react-router-dom";

const useInputs = (isCustomAmount: boolean) => {
  return useMemo(() => {
    const inputs = [
      {
        label: "Single nominator address",
        name: "address",
        validate: isTonAddress,
        error: "Invalid address",
        info: "The address of the single-nominator contract that you want to withdraw from. Your wallet address must be the Owner / admin for this single-nominator.",
      },
      {
        label: "Amount to withdraw",
        name: "customAmount",
        type: "radio",
        info: "A decimal point number of the amount of TON coins that you would like to withdraw from single-nominator. This amount must be in single-nominator balance (unstaked).",
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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  return (
    <Page title="Withdraw">
      <Container>
        {error ? (
          <Error error={error} />
        ) : success ? (
          <Success />
        ) : (
          <Form setSuccess={() => setSuccess(true)} setError={setError} />
        )}{" "}
      </Container>
    </Page>
  );
}

const Error = ({ error }: { error: string }) => {
  return (
    <TxError
      btnText="Try again"
      text={error}
      onClick={() => window.location.reload()}
    />
  );
};

const Success = () => {
  const navigate = useNavigate();
  return (
    <TxSuccess
      text="Withdrawn successfully"
      btnText="Home"
      onClick={() => navigate("/")}
    />
  );
};

const Form = ({
  setError,
  setSuccess,
}: {
  setError: (value: string) => void;
  setSuccess: () => void;
}) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
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
      amount: isCustomAmount ? Number(data.amount) : undefined,
      onSuccess: setSuccess,
      onError: setError,
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
              rules={{ required: true, validate: input.validate }}
              render={({ field }) => {
                const error = errors[input.name];
                const errorMsg = parseFormInputError(error?.type, input.error);

                return (
                  <Input
                    type={input.type}
                    label={input.label}
                    field={field as any}
                    error={errorMsg}
                    info={input.info}
                    radioOptions={input.radioOptions}
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
  );
};

export default WithdrawPage;
