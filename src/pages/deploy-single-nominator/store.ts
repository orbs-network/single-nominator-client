import { isTonAddress } from "utils";
import {create} from "zustand";


export const inputs = [
  // {
  //   label: "Single nominator address",
  //   name: "snAddress",
  //   validate: isTonAddress,
  //   error: "Invalid address",
  //   required: true,
  // },
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
  Fourth
}



export interface FormValues {
  snAddress: string;
  ownerAddress: string;
  validatorAddress: string;
 
}

interface Store extends FormValues {
  step: Steps;
  nextStep: () => void;
  setFromValues: (value: FormValues) => void;
  reset: () => void;
}

export const useStore = create<Store>((set) => ({
  step: Steps.First,
  snAddress: "",
  ownerAddress: "",
  validatorAddress: "",
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  setFromValues: (value: FormValues) => set({ ...value, step: Steps.Second }),
  reset: () => set({ step: Steps.First, snAddress: "", ownerAddress: "", validatorAddress: "" }),

}));
