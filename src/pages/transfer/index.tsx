import { Input, Page, TxError, TxSuccess } from "components";
import React, {useState } from "react";
import { Container, InputsContainer, SubmitButton } from "styles";
import { useForm, Controller } from "react-hook-form";
import { isTonAddress, parseFormInputError } from "utils";
import { useRoles, useTransferFundsTx, useValidateSingleNominator } from "hooks";
import { useNavigate } from "react-router-dom";

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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  return (
    <Page title="Deposit">
      <Container>
        {error ? (
          <Error error={error} />
        ) : success ? (
          <Success />
        ) : (
          <Form setError={setError} setSuccess={() => setSuccess(true)} />
        )}{" "}
      </Container>
    </Page>
  );
}

const Error = ({ error }: { error: string}) => {
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
      text="Funds successfully transferred!"
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
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const snAddress = watch("address");

  const { mutate, isLoading } = useTransferFundsTx();

  const {data: roles} = useRoles(snAddress);
  const { data: isSNAddress, isLoading: isSNAddressLoading } =
    useValidateSingleNominator(snAddress);

  const onSubmit = (data: FormValues) => {
    mutate({
      address: data.address,
      amount: data.amount,
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
          disabled={!isSNAddress || isSNAddressLoading}
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
