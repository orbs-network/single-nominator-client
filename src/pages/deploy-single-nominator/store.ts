import { isTonAddress } from "utils";
import {create} from "zustand";


export const inputs = [
  {
    label: "Single nominator address",
    name: "snAddress",
    validate: isTonAddress,
    error: "Invalid address",
    required: true,
  },
  {
    label: "Owner address",
    name: "ownerAddress",
    validate: isTonAddress,
    error: "Invalid address",
    required: true,
  },
  {
    label: "Validator address",
    name: "validatorAddress",
    validate: isTonAddress,
    error: "Invalid address",
    required: true,
  },
];


export enum Steps {
  First,
  Second,
  Third,
}

export interface FormValues {
  snAddress: string;
  ownerAddress: string;
  validatorAddress: string;
  nextStep: () => void;
  setFromValues: (value: FormValues) => void;
}

interface Store extends FormValues {
  step: Steps;
}

export const useStore = create<Store>((set) => ({
  step: Steps.First,
  snAddress: "",
  ownerAddress: "",
  validatorAddress: "",
    nextStep: () => set((state) => ({ step: state.step + 1 })),
    setFromValues: (value: FormValues) => set({...value, step: Steps.Second}),
}));
