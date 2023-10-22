import { transferFunds } from "helpers/transfer-funds";
import { withdraw } from "helpers/withdraw";
import { useMutation } from "@tanstack/react-query";
import { useGetSender } from "./common";
import { changeValidator } from "helpers/change-validator";
import { showSuccessToast } from "toasts";
import { deploy } from "helpers/deploy";

export const useWithdrawTx = () => {
  const getSender = useGetSender();
  return useMutation(
    ({ address, amount }: { address: string; amount?: number }) => {
      return withdraw(getSender(), address, amount);
    },
    {
      onSuccess: () => {
        showSuccessToast("Withdraw success");
      },
    }
  );
};

export const useTransferFundsTx = () => {
  const getSender = useGetSender();
  return useMutation(
    (data: { address: string; amount: number; comment?: string }) => {
      return transferFunds(
        getSender(),
        data.address,
        data.amount,
        data.comment
      );
    },
    {
      onSuccess: () => {
        showSuccessToast("Transfer success");
      },
    }
  );
};

export const useChangeValidatorTx = () => {
  const getSender = useGetSender();
  return useMutation(
    ({ address, newAddress }: { address: string; newAddress: string }) => {
      return changeValidator(getSender(), address, newAddress);
    },
    {
      onSuccess: () => {
        showSuccessToast("Change validator success");
      },
    }
  );
};

export const useDeploySingleNominatorTx = () => {
  const getSender = useGetSender();
  return useMutation(
    ({ owner, validator }: { owner: string; validator: string }) => {
      return deploy(getSender(), owner, validator);
    }
  );
};
