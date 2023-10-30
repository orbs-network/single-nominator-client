import { transferFunds } from "helpers/transfer-funds";
import { withdraw } from "helpers/withdraw";
import { useMutation } from "@tanstack/react-query";
import { useGetSender } from "./common";
import { changeValidator } from "helpers/change-validator";
import { showErrorToast, showSuccessToast } from "toasts";
import { deploy, isMatchSingleNominatorCodeHash } from "helpers/deploy";

export const useWithdrawTx = () => {
  const getSender = useGetSender();
  return useMutation(
    ({
      address,
      amount,
    }: {
      address: string;
      amount?: number;
      onSuccess?: () => void;
    }) => {
      return withdraw(getSender(), address, amount);
    },
    {
      onSuccess: (data, args) => {
        args.onSuccess?.();
        showSuccessToast("Withdraw success");
      },
      onError: (error) => {
        if (error instanceof Error) {
          showErrorToast(error.message);
        }
      },
    }
  );
};

export const useTransferFundsTx = () => {
  const getSender = useGetSender();
  return useMutation(
    (data: { address: string; amount: string, onSuccess?: () => void}) => {
      return transferFunds(
        getSender(),
        data.address,
        Number(data.amount),
      );
    },
    {
      onSuccess: (data, args) => {
        args.onSuccess?.();
        showSuccessToast("Transfer success");
      },
      onError: (error) => {
        if (error instanceof Error) {
          showErrorToast(error.message);
        }
      },
    }
  );
};

export const useChangeValidatorTx = () => {
  const getSender = useGetSender();
  return useMutation(
    ({
      address,
      newAddress,
    }: {
      address: string;
      newAddress: string;
      onSuccess?: () => void;
    }) => {
      return changeValidator(getSender(), address, newAddress);
    },
    {
      onSuccess: (data, args) => {
        args.onSuccess?.();
        showSuccessToast("Validator changed");
      },
      onError: (error) => {
        if (error instanceof Error) {
          showErrorToast(error.message);
        }
      },
    }
  );
};

export const useDeploySingleNominatorTx = () => {
  const getSender = useGetSender();
  return useMutation(
    async ({
      owner,
      validator,
    }: {
      owner: string;
      validator: string;
      onSuccess: (value: string) => void;
    }) => {
      const result = await deploy(getSender(), owner, validator);
      if (!result.success) {
        throw new Error("Deploy failed");
      }
      return result.singleNominatorAddress;
    },
    {
      onError: (error) => {
        if (error instanceof Error) {
          showErrorToast(error.message);
        }
      },
      onSuccess: (singleNominatorAddress, args) => {
        args.onSuccess(singleNominatorAddress);
        showSuccessToast("Deployed successfully");
      },
    }
  );
};

export const useVerifySNAddress = () => {
  return useMutation(
    async ({ snAddress }: { snAddress: string; onSuccess: () => void }) => {
      const result = await isMatchSingleNominatorCodeHash(snAddress);
      if (!result) {
        throw new Error("Not match");
      }
      return result;
    },
    {
      onSuccess: (result, args) => {
        args.onSuccess();
        showSuccessToast("Verified successfully");
      },
      onError: (error) => {
        if (error instanceof Error) {
          showErrorToast(error.message);
        }
      },
    }
  );
};
