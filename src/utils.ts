/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address } from "ton";

export const isTonAddress = (value?: string) => {
  if (!value) {
    return true;
  }
  try {
    return Address.isAddress(Address.parse(value));
  } catch (error) {
    return false;
  }
};

export const parseFormInputError = (type?: any, error?: string) => {
  return !type ? '' :  type === "required" ? "Required" : error;
};


export const makeElipsisAddress = (address?: string, padding = 6): string => {
  if (!address) return "";
  return `${address.substring(0, padding)}...${address.substring(
    address.length - padding
  )}`;
};


export const goToTONScanContractUrl = (address?: string) => {
  if (!address) return "";
  return `https://tonscan.org/address/${address}`;
};
