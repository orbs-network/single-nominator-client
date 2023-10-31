import { transferFunds } from "helpers/transfer-funds";
import { withdraw } from "helpers/withdraw";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useGetSender } from "./common";
import { changeValidator, roles } from "helpers/change-validator";
import { deploy } from "helpers/deploy";
import { isTonAddress } from "utils";
import { isMatchSingleNominatorCodeHash } from "helpers/util";

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
      onError?: (value: string) => void;
    }) => {
      return withdraw(getSender(), address, amount);
    },
    {
      onSuccess: (data, args) => {
        args.onSuccess?.();
      },
      onError: (error, args) => {
        if (error instanceof Error) {
          args.onError?.(error.message);
        }
      },
    }
  );
};

export const useTransferFundsTx = () => {
  const getSender = useGetSender();
  return useMutation(
    (data: {
      address: string;
      amount: string;
      onSuccess?: () => void;
      onError?: (value: string) => void;
    }) => {
      return transferFunds(getSender(), data.address, Number(data.amount));
    },
    {
      onSuccess: (data, args) => {
        args.onSuccess?.();
      },
      onError: (error, args) => {
        if (error instanceof Error) {
          args.onError?.(error.message);
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
      oldValidatorAddress,
    }: {
      address: string;
      newAddress: string;
      oldValidatorAddress: string;
      onSuccess?: () => void;
      onError?: (value: string) => void;
    }) => {
      return changeValidator(
        getSender(),
        address,
        newAddress,
        oldValidatorAddress
      );
    },
    {
      onSuccess: (data, args) => {
        args.onSuccess?.();
      },
      onError: (error, args) => {
        if (error instanceof Error) {
          args.onError?.(error.message);
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
      onError?: (value: string) => void;
    }) => {
      const result = await deploy(getSender(), owner, validator);
      if (!result.success) {
        throw new Error("Deploy failed");
      }
      return result.singleNominatorAddress;
    },
    {
      onError: (error, args) => {
        if (error instanceof Error) {
          args.onError?.(error.message);
        }
      },
      onSuccess: (singleNominatorAddress, args) => {
        args.onSuccess(singleNominatorAddress);
      },
    }
  );
};

export const useVerifySNAddress = () => {
  return useMutation(
    async ({
      snAddress,
    }: {
      snAddress: string;
      onSuccess: () => void;
      onError?: (value: string) => void;
    }) => {
      const result = await isMatchSingleNominatorCodeHash(snAddress);
      if (!result) {
        throw new Error("Not match");
      }
      return result;
    },
    {
      onSuccess: (result, args) => {
        args.onSuccess();
      },
      onError: (error, args) => {
        if (error instanceof Error) {
          args.onError?.(error.message);
        }
      },
    }
  );
};

export const useRoles = (address?: string) => {
  return useQuery({
    queryKey: ["useRoles", address],
    queryFn: async () => {
      return roles(address!);
    },
    enabled: !!address && isTonAddress(address),
  });
};
