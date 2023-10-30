import { Address, Sender, toNano, beginCell } from "ton-core";
import { TonClient, fromNano } from "ton";
import { getClientV2 } from "./client";
import { sleep } from "./deploy";

const WITHDRAW = 0x1000;
const MSG_VALUE = toNano(0.1);

export async function withdraw(
  sender: Sender,
  singleNominatorAddr: string,
  amount?: number
) {
  const client = await getClientV2();
  let _amount;
  if (!amount) {
    _amount = parseFloat(
      fromNano(await client.getBalance(Address.parse(singleNominatorAddr)))
    );
  } else {
    _amount = amount;
  }

  const payload = beginCell()
    .storeUint(WITHDRAW, 32)
    .storeUint(0, 64)
    .storeCoins(toNano(_amount.toFixed(2)))
    .endCell();

  const oldBalance = (
    await client.getBalance(Address.parse(singleNominatorAddr))
  ).toString();

  await sender.send({
    to: Address.parse(singleNominatorAddr),
    value: MSG_VALUE,
    sendMode: 1 + 2,
    body: payload,
  });
  
  return await waitForConditionChange(client.getBalance, [sender.address!.toString()], BigInt(oldBalance));
}


export async function waitForConditionChange<T>(func: (...args: any[]) => Promise<T>, args: any[], startVal: any, propertyNameInRes: undefined | string = undefined, sleepIntervalMilli: number = 3000, maxNumIntervals: number = 5): Promise<boolean> {

  let res: any;
  let count = 0;

  do {            
    await sleep(sleepIntervalMilli);
    res = await func(...args);
    if (propertyNameInRes) res = res[propertyNameInRes];
    count++;

  } while ((startVal  == res) && count < maxNumIntervals);

  if (startVal  == res) {
    return false;
  }

  return true;

}

export async function getSeqno(client: TonClient, address: string): Promise<bigint | null> {

  let seqno = await client.runMethod(Address.parse(address), 'seqno');
  const stack = seqno.stack.pop();
  if (typeof stack === 'object' && stack.type == 'int') {
      return stack.value;
  }
  
  return null
}