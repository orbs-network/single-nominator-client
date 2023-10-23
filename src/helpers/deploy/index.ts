import { Address, Cell, beginCell, contractAddress, Sender, toNano } from "ton-core";
import {compileFunc} from '@ton-community/func-js';
import {TonClient} from "ton";
import {Buffer} from "buffer";
import { getClientV2 } from "helpers/client";

const MSG_VALUE = toNano(1.1);

async function getDeployCodeAndData(owner: Address, validator: Address) {

      const result = await compileFunc({
        // Sources
        sources: [
            {
                filename: "contracts/stdlib.fc",
                content: "<stdlibCode>",
            },
            {
                filename: "contracts/single-nominator.fc",
                content: "<singleNominatorCode>",
            },
        ]
    });


    if (result.status === 'error') {
      console.error(result.message)
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