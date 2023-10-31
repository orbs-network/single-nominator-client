import { create } from "zustand";

enum Steps {
  SINGLE_NOMINATOR_ADDRESS,
  DISPLAY_ROLES,
  NEW_VALIDATOR_ADDRESS,
  SUCCESS
}

interface FormValues {
  snAddress: string;
  newValidatorAddress: string;
}
interface Store extends FormValues {
  step: Steps;
  nextStep: () => void;
  setFromValues: (value: Partial<FormValues>) => void;
  reset: () => void;
  setStep: (step: Steps) => void;
prevStep: () => void;
}

export const useStore = create<Store>((set) => ({
  step: Steps.SINGLE_NOMINATOR_ADDRESS,
  snAddress: "",
  newValidatorAddress: "",
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setFromValues: (value) => set({ ...value }),
  reset: () =>
    set({
      step: Steps.SINGLE_NOMINATOR_ADDRESS,
      snAddress: "",
      newValidatorAddress: "",
    }),
  setStep: (step) => set({ step }),
}));
