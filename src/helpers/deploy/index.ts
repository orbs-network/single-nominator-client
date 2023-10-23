import { Address, Cell, beginCell, contractAddress, Sender, toNano } from "ton-core";
import {compileFunc} from '@ton-community/func-js';
import {TonClient} from "ton";
import {Buffer} from "buffer";
import { getClientV2 } from "helpers/client";
import { fromCode } from "tvm-disassembler";

const MSG_VALUE = toNano(0.1);
const SINGLE_NOMINATOR_CODE_HASH = 'xjonZrValtVP2IwnJ87mP+3f08QvX+Vpg+PkNmB+suU=';


async function getDeployCodeAndData(owner: Address, validator: Address) {
  const stdlibFileResponse = await fetch('src/contracts/stdlib.fc');
  const singleNominatorFileResponse = await fetch('src/contracts/single-nominator.fc');

  if (!stdlibFileResponse.ok || !singleNominatorFileResponse.ok) {
    console.error('Failed to fetch one or more files.');
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

  if (result.status === 'error') {
    console.error(result.message);
    return;
  }

  const initialCode = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];
  const initialData = beginCell().storeAddress(owner).storeAddress(validator).endCell();

  return {code: initialCode, data: initialData};
}

export async function deploy(
  sender: Sender,
  owner: string, 
  validator: string
) {

   const client = await getClientV2();

  const singleNominatorCodeAndData = await getDeployCodeAndData(Address.parse(owner), Address.parse(validator));
  const singleNominatorAddress = contractAddress(-1, {code: singleNominatorCodeAndData?.code, data: singleNominatorCodeAndData?.data});
  
  await sender.send({
    to: singleNominatorAddress,
    value: MSG_VALUE,
    sendMode: 1 + 2,
    init: singleNominatorCodeAndData
  });

  return await waitForContractToBeDeployed(client, singleNominatorAddress);
}

export async function waitForContractToBeDeployed(client: TonClient, deployedContract: Address) {
  const seqnoStepInterval = 2500;
  let retval = false;
  console.log(`⏳ waiting for contract to be deployed at [${deployedContract.toString()}]`);
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

export function sleep(time: number) {
  return new Promise((resolve) => {
    console.log(`💤 ${time / 1000}s ...`);

    setTimeout(resolve, time);
  });
}

export async function getCodeAndDataHash(client: TonClient, contractAddress: Address) {

  let { code, data } = await client.getContractState(contractAddress);
  let codeCell = Cell.fromBoc(code!)[0];
  let dataCell = Cell.fromBoc(data!)[0];

  let decompiled;
  try {
    //@ts-ignore
    decompiled = fromCode(codeCell);
  } catch (e) {
    return {error: e?.toString()};
  }

  const codeCellHash = codeCell.hash();
  const dataCellHash = dataCell.hash();

  return {
    codeCellHash: {
      base64: codeCellHash.toString("base64"),
      hex: codeCellHash.toString("hex"),
    } ,
    dataCellHash: {
      base64: dataCellHash.toString("base64"),
      hex: dataCellHash.toString("hex"),
    } 
  };
  
}

export async function isMatchSingleNominatorCodeHash(client: TonClient, singleNominatorAddress: string) {
  return (await getCodeAndDataHash(client, Address.parse(singleNominatorAddress))).codeCellHash?.base64 == SINGLE_NOMINATOR_CODE_HASH;
}