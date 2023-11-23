/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AddressDisplay,
  Button,
  Input,
  ModalErrorContent,
  Page,
  Stepper,
  TxSuccess,
} from "components";
import { ColumnFlex, InputsContainer, SubmitButton, Typography } from "styles";
import { makeElipsisAddress, parseFormInputError } from "utils";
import { Controller, useForm } from "react-hook-form";
import { CSVLink } from "react-csv";

import {
  useDeploySingleNominatorTx,
  useRoles,
  useSingleNominatorBalance,
  useValidateRoles,
  useVerifySNAddress,
  useWithdrawTx,
} from "hooks";
import { FormValues, inputs, useStore } from "./store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyledAddresses, StyledWithdrawActions } from "./styles";
import { ZERO_ADDR } from "consts";
import { useTonAddress } from "@tonconnect/ui-react";
import { Alert, Modal } from "antd";
import { getBalance, isEqualAddresses } from "helpers/util";
import { showSuccessToast } from "toasts";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { useMutation } from "@tanstack/react-query";
import { fromNano } from "ton-core";

export const Addresses = () => {
  const { ownerAddress, validatorAddress, snAddress } = useStore();
  return (
    <StyledAddresses $gap={20}>
      {snAddress && (
        <AddressDisplay title="Single nominator" address={snAddress} />
      )}
      {ownerAddress && <AddressDisplay title="Owner" address={ownerAddress} />}
      {validatorAddress && (
        <AddressDisplay title="Validator" address={validatorAddress} />
      )}
    </StyledAddresses>
  );
};

const ZeroButton = ({ onChange }: { onChange: (value: string) => void }) => {
  return <button onClick={() => onChange(ZERO_ADDR)}>Zero Address</button>;
};

const ConnectedWalletBtn = ({
  onChange,
}: {
  onChange: (value: string) => void;
}) => {
  const address = useTonAddress();

  return <button onClick={() => onChange(address)}>Connected Wallet</button>;
};

const MapButton = ({
  name,
  onChange,
}: {
  name: string;
  onChange: (value: string) => void;
}) => {
  if (name === "validatorAddress") {
    return <ZeroButton onChange={onChange} />;
  }
  if (name === "ownerAddress") {
    return <ConnectedWalletBtn onChange={onChange} />;
  }
  return null;
};

const FirstStep = () => {
  const { setFromValues } = useStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  return (
    <Stepper.Step>
      <Stepper.StepTitle>Set owner and validator addresses</Stepper.StepTitle>
      <form
        onSubmit={handleSubmit((data) => setFromValues(data as FormValues))}
      >
        <ColumnFlex $noGap>
          <InputsContainer>
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
                        info={input.info}
                        label={input.label}
                        field={field}
                        error={errorMsg}
                        button={
                          !field.value && (
                            <MapButton
                              name={input.name}
                              onChange={field.onChange}
                            />
                          )
                        }
                      />
                    );
                  }}
                />
              );
            })}
          </InputsContainer>
          <SubmitButton connectionRequired type="submit">
            Next
          </SubmitButton>
        </ColumnFlex>
      </form>
    </Stepper.Step>
  );
};

const SecondStep = () => {
  const { ownerAddress, validatorAddress, nextStep, setFromValues } =
    useStore();
  const { mutate, isLoading } = useDeploySingleNominatorTx();

  const error = useCallback(() => {
    Modal.error({
      title: "Deploy failed",
      content: <ModalErrorContent />,
      okText: "Close",
    });
  }, []);

  const onSubmit = () => {
    mutate({
      owner: ownerAddress,
      validator: validatorAddress,
      onSuccess: (snAddress: string) => {
        setFromValues({
          snAddress,
        });
        nextStep();
        showSuccessToast("Deployed successfully");
      },
      onError: error,
    });
  };

  return (
    <Stepper.Step>
      <Stepper.StepTitle>Deploy</Stepper.StepTitle>
      <Stepper.StepSubtitle>
        Your wallet needs to have at least 2 TON coins for deployment. At least
        1 TON coin should remain in single-nominator balance at all time for
        storage fee costs on masterchain.
      </Stepper.StepSubtitle>
      <Addresses />
      <SubmitButton onClick={onSubmit} isLoading={isLoading}>
        Deploy
      </SubmitButton>
    </Stepper.Step>
  );
};

const VerifyDataStep = () => {
  const store = useStore();
  const { nextStep, snAddress } = store;
  const { mutate, isLoading } = useValidateRoles();

  const error = useCallback(() => {
    Modal.error({
      title: "Data verification failed",
      content: <ModalErrorContent />,
      okText: "Close",
    });
  }, []);

  const onSubmit = () => {
    mutate({
      snAddress,
      onwerAddress: store.ownerAddress,
      validatorAddress: store.validatorAddress,
      onError: error,
      onSuccess: () => {
        nextStep();
        showSuccessToast("Data verified successfully");
      },
    });
  };

  return (
    <Stepper.Step>
      <Stepper.StepTitle>Verify data</Stepper.StepTitle>
      <Stepper.StepSubtitle>
        After deployment is complete, this step will read the data from
        single-nominator contract that was just deployed and compare it to the
        data that was submitted.
      </Stepper.StepSubtitle>

      <Addresses />
      <SubmitButton onClick={onSubmit} isLoading={isLoading}>
        Verify data
      </SubmitButton>
    </Stepper.Step>
  );
};

const VerifyCodeHashStep = () => {
  const { mutate, isLoading } = useVerifySNAddress();
  const { nextStep, snAddress } = useStore();

  const { data: roles, isLoading: rolesLoading } = useRoles(snAddress);

  const error = useCallback(() => {
    Modal.error({
      title: "Code hash verification failed",
      content: <ModalErrorContent />,
      okText: "Close",
    });
  }, []);

  const onSubmit = () => {
    mutate({
      snAddress,
      onSuccess: () => {
        nextStep();
        showSuccessToast("Code hash verified successfully");
      },
      onError: error,
    });
  };

  return (
    <Stepper.Step>
      <Stepper.StepTitle>Verify Codehash</Stepper.StepTitle>
      <Stepper.StepSubtitle>
        After deployment is complete, this step will read the code hash from
        single-nominator contract that was just deployed and compare it to the
        code hash of the audited version.
      </Stepper.StepSubtitle>
      <StyledAddresses $gap={20}>
        <AddressDisplay title="Single nominator" address={snAddress} />
        <AddressDisplay
          isLoading={rolesLoading}
          title="Owner"
          address={roles?.owner}
        />
        <AddressDisplay
          isLoading={rolesLoading}
          title="Validator"
          address={roles?.validatorAddress}
        />
      </StyledAddresses>
      <SubmitButton onClick={onSubmit} isLoading={isLoading}>
        Verify Codehash
      </SubmitButton>
    </Stepper.Step>
  );
};

const DownloadCSV = () => {
  const navigate = useNavigate();
  const { snAddress, ownerAddress, validatorAddress, reset } = useStore();
  const [downloaded, setDownloaded] = useState(false);
  const data = useMemo(() => {
    return [
      ["single nominator address", "owner address", "validator address"],
      [snAddress, ownerAddress, validatorAddress],
    ];
  }, [ownerAddress, snAddress, validatorAddress]);

  if (downloaded) {
    return (
      <Button
        style={{ width:'auto' }}
        onClick={() => {
          navigate("/");
          reset();
        }}
      >
        Home
      </Button>
    );
  }
  return (
    <CSVLink
      data={data}
      filename="single-nominator-info.csv"
      onClick={() => setDownloaded(true)}
    >
      <Button>Download CSV</Button>
    </CSVLink>
  );
};

const SuccessStep = () => {
  return (
    <Stepper.Step>
      <Stepper.StepTitle>Success</Stepper.StepTitle>
      <TxSuccess
        text="Successfully deployed single nominator"
        button={<DownloadCSV />}
      />
    </Stepper.Step>
  );
};

const useValidateSingleNominatorBalance = () => {
  const { snAddress, nextStep } = useStore();
  return useMutation(
    async () => {
      const balance = fromNano(await getBalance(snAddress!));
      if (!withdrawValidation(balance)) {
        throw new Error(
          `Single nominator balance is ${Number(balance).toFixed(
            2
          )} TON, you must withdraw at least ${(
            Number(balance) - 2
          ).toFixed(0)} TON to complete this step`
        );
      }
      return true;
    },
    {
      onSuccess: nextStep,
      onError: (error: Error) => {
        Modal.error({
          title: error?.message,
          content: <ModalErrorContent />,
          okText: "Close",
        });
      },
    }
  );
};

const StyledValidateWithdrawBtn = styled(SubmitButton)({
  marginTop: 40,
});
const ValidateWithdrawBtn = () => {
  const { mutate, isLoading } = useValidateSingleNominatorBalance();

  return (
    <ColumnFlex $gap={20}>
      <StyledValidateWithdrawBtn isLoading={isLoading} onClick={mutate}>
        Check balance
      </StyledValidateWithdrawBtn>
      <Typography style={{ fontSize: 13, lineHeight: "normal" }}>
        In order to successfully complete this step, single nominator balance
        must be less than 2 TON{" "}
      </Typography>
    </ColumnFlex>
  );
};

const withdrawValidation = (amount?: string | number) => {
  return !amount ? false : Number(amount) <= 2;
};

const useCheckIfWithrawedManually = () => {
  const { snAddress, nextStep } = useStore();
  const { data: balance } = useSingleNominatorBalance(snAddress!);
  const isOwner = useIsOwner();

  useEffect(() => {
    if (withdrawValidation(balance) && !isOwner) {
      nextStep();
    }
  }, [balance, nextStep, isOwner]);
};

const useIsOwner = () => {
  const { snAddress } = useStore();

  const owner = useRoles(snAddress).data?.owner;
  const tonAddress = useTonAddress();

  return useMemo(
    () => isEqualAddresses(tonAddress, owner),
    [tonAddress, owner]
  );
};

const WITHDRAW_STEP_AMOUNT = 3;
export const SanityTestStep = () => {
  const { mutate: withdraw, isLoading: withdrawLoading } = useWithdrawTx();
  const { nextStep, snAddress } = useStore();
  const tonAddress = useTonAddress();

  const isOwner = useIsOwner();

  useCheckIfWithrawedManually();

  const error = useCallback((message: string) => {
    const showError = message.indexOf("Single nominator balance") > -1;

    Modal.error({
      title: "Withdraw failed",
      content: <ModalErrorContent message={showError ? message : ""} />,
      okText: "Close",
    });
  }, []);

  const onWithdraw = () =>
    withdraw({
      address: snAddress,
      amount: WITHDRAW_STEP_AMOUNT,
      onError: error,
      onSuccess: () => {
        showSuccessToast("Funds withdrawn");
        nextStep();
      },
    });

  return (
    <Stepper.Step>
      <Stepper.StepTitle>Sanity test withdrawal</Stepper.StepTitle>
      <Stepper.StepSubtitle>
        To make sure the Owner / admin was set correctly and can withdraw funds
        from single-nominator, we recommend doing a withdrawal test with a small
        amount of {WITHDRAW_STEP_AMOUNT} TON.
      </Stepper.StepSubtitle>
      {isOwner && (
        <StyledWithdrawActions>
          <Button isLoading={withdrawLoading} onClick={onWithdraw}>
            Withdraw {WITHDRAW_STEP_AMOUNT} TON
          </Button>
        </StyledWithdrawActions>
      )}
      {!isOwner && (
        <StyledAlert
          message={`The connected wallet (${makeElipsisAddress(
            tonAddress
          )}) is not the owner of the single nominator contract. In order to complete the deployment proccess, it is crucial to test withdraw funds in order to prove access to the funds. You can connect with the onwer address and complete the sanity test, or withdraw funds using the owner wallet`}
          type="error"
        />
      )}
      {!isOwner && <ValidateWithdrawBtn />}
    </Stepper.Step>
  );
};

const StyledAlert = styled(Alert)<{ $darkMode: boolean }>({
  marginTop: 20,
});

const steps = [
  {
    title: "Set owner and validator addresses",
    component: <FirstStep />,
  },
  {
    title: "Deploy",
    component: <SecondStep />,
  },
  {
    title: "Verify Data",
    component: <VerifyDataStep />,
  },
  {
    title: "Verify Codehash",
    component: <VerifyCodeHashStep />,
  },
  {
    title: "Sanity test",
    component: <SanityTestStep />,
  },
  {
    title: "",
    component: <SuccessStep />,
  },
];

function DeploySingleNominatorPage() {
  const { step, setStep } = useStore();
  return (
    <Page title="Deploy single nominator">
      <Stepper setStep={setStep} currentStep={step} steps={steps} />
    </Page>
  );
}

export default DeploySingleNominatorPage;
