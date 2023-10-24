import { Input, Page } from "components";
import { ColumnFlex, Container, SubmitButton } from "styles";
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
    reset
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { mutate, isLoading } = useChangeValidatorTx();

  const onSubmit = (data: FormValues) => {
    mutate({
      address: data.address,
      newAddress: data.newAddress,
      onSuccess: reset,
    });
  }

  return (
    <Page title="Change Validator">
      <Container>
        <form onSubmit={handleSubmit((data) => onSubmit(data as FormValues))}>
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
            <SubmitButton
              isLoading={isLoading}
              connectionRequired
              type="submit"
            >
              Proceed
            </SubmitButton>
          </ColumnFlex>
        </form>
      </Container>
    </Page>
  );
}


export default ChangeValidatorPage;