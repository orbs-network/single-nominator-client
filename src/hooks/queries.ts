import { transferFunds } from "helpers/transfer-funds";
import { withdraw } from "helpers/withdraw";
import { useMutation } from "@tanstack/react-query";
import { useGetSender } from "./common";
import { changeValidator } from "helpers/change-validator";
import { showSuccessToast } from "toasts";
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
    }
  );
};

export const useTransferFundsTx = () => {
  const getSender = useGetSender();
  return useMutation(
    (data: { address: string; amount: string; comment?: string }) => {
      console.log(data.amount);
      
      return transferFunds(
        getSender(),
        data.address,
        Number(data.amount),
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
        console.error(error);
      },
      onSuccess: (singleNominatorAddress, args) => {
        args.onSuccess(singleNominatorAddress);
      },
    }
  );
};

export const useVerifySNAddress = () => {
  return useMutation(
    async ({ snAddress }: { snAddress: string; onSuccess:() => void }) => {
      const result = await isMatchSingleNominatorCodeHash(snAddress);
      if(!result) {
        throw new Error("Not match");
      }
      return result;
    },
    {
      onSuccess: (result, args) => args.onSuccess(),
    }
  );
};
