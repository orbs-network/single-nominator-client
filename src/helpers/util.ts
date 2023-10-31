import { Address, Cell, TonClient } from "ton";
import { getClientV2 } from "./client";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function waitForConditionChange<T>(
  func: () => Promise<T>,
  startVal: any,
  propertyNameInRes: undefined | string = undefined,
  sleepIntervalMilli: number = 3000,
  maxNumIntervals: number = 5
): Promise<boolean> {
  let res: any;
  let count = 0;

  do {
    await sleep(sleepIntervalMilli);
    res = await func();
    if (propertyNameInRes) res = res[propertyNameInRes];
    count++;
  } while (startVal == res && count < maxNumIntervals);

  if (startVal == res) {
    return false;
  }

  return true;
}

export async function getSeqno(
  client: TonClient,
  address: string
): Promise<bigint | null> {
  const seqno = await client.runMethod(Address.parse(address), "seqno");
  const stack = seqno.stack.pop();
  if (typeof stack === "object" && stack.type == "int") {
    return stack.value;
  }

  return null;
}

export function sleep(time: number) {
  return new Promise((resolve) => {
    console.log(`💤 ${time / 1000}s ...`);

    setTimeout(resolve, time);
  });
}

export async function getCodeAndDataHash(
  client: TonClient,
  contractAddress: Address
) {
  const { code, data } = await client.getContractState(contractAddress);
  const codeCell = Cell.fromBoc(code!)[0];
  const dataCell = Cell.fromBoc(data!)[0];

  const codeCellHash = codeCell.hash();
  const dataCellHash = dataCell.hash();

  return {
    codeCellHash: {
      base64: codeCellHash.toString("base64"),
      hex: codeCellHash.toString("hex"),
    },
    dataCellHash: {
      base64: dataCellHash.toString("base64"),
      hex: dataCellHash.toString("hex"),
    },
  };
}

export async function isMatchSingleNominatorCodeHash(
  singleNominatorAddress: string
) {
  const client = await getClientV2();
  return (
    (await getCodeAndDataHash(client, Address.parse(singleNominatorAddress)))
      .codeCellHash?.base64 == SINGLE_NOMINATOR_CODE_HASH
  );
}

const SINGLE_NOMINATOR_CODE_HASH =
  "xjonZrValtVP2IwnJ87mP+3f08QvX+Vpg+PkNmB+suU=";

export async function waitForContractToBeDeployed(
  client: TonClient,
  deployedContract: Address
) {
  const seqnoStepInterval = 2500;
  let retval = false;
  console.log(
    `⏳ waiting for contract to be deployed at [${deployedContract.toString()}]`
  );
  for (let attempt = 0; attempt < 10; attempt++) {
    await sleep(seqnoStepInterval);
    if (await client.isContractDeployed(deployedContract)) {
      retval = true;
      break;
    }
  }
  // console.log(`⌛️ waited for contract deployment ${((attempt + 1) * seqnoStepInterval) / 1000}s`);
  return retval;
}
