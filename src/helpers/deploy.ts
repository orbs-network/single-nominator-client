/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Address,
  Cell,
  beginCell,
  contractAddress,
  Sender,
  toNano,
} from "ton-core";
import { compileFunc } from "@ton-community/func-js";
import { Buffer } from "buffer";
import { getClientV2 } from "helpers/client";
import { waitForContractToBeDeployed } from "./util";

const MSG_VALUE = toNano(0.1);

async function getDeployCodeAndData(owner: Address, validator: Address) {
  const stdlibFileResponse = await fetch("src/contracts/stdlib.fc");
  const singleNominatorFileResponse = await fetch(
    "src/contracts/single-nominator.fc"
  );

  if (!stdlibFileResponse.ok || !singleNominatorFileResponse.ok) {
    console.error("Failed to fetch one or more files.");
    return;
  }

  const stdlibContent = await stdlibFileResponse.text();
  const singleNominatorContent = await singleNominatorFileResponse.text();

  const result = await compileFunc({
    optLevel: 2,
    targets: ["stdlib.fc", "single-nominator.fc"],
    sources: {
      "stdlib.fc": stdlibContent,
      "single-nominator.fc": singleNominatorContent,
    },
  });

  if (result.status === "error") {
    console.error(result.message);
    return;
  }

  const initialCode = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];
  const initialData = beginCell()
    .storeAddress(owner)
    .storeAddress(validator)
    .endCell();

  return { code: initialCode, data: initialData };
}

export async function deploy(sender: Sender, owner: string, validator: string) {
  const client = await getClientV2();
  const singleNominatorCodeAndData = await getDeployCodeAndData(
    Address.parse(owner),
    Address.parse(validator)
  );
  const singleNominatorAddress = contractAddress(-1, {
    code: singleNominatorCodeAndData?.code,
    data: singleNominatorCodeAndData?.data,
  });
  const isDeployed = await client.isContractDeployed(singleNominatorAddress);
  if (isDeployed) {
    return {
      success: true,
      singleNominatorAddress: singleNominatorAddress.toString(),
    };
  }
  await sender.send({
    to: singleNominatorAddress,
    value: MSG_VALUE,
    sendMode: 1 + 2,
    init: singleNominatorCodeAndData,
  });

  const success = await waitForContractToBeDeployed(
    client,
    singleNominatorAddress
  );
  return {
    success,
    singleNominatorAddress: singleNominatorAddress.toString(),
  };
}
